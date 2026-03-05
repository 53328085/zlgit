import React, { useEffect, useState} from 'react'
import style from './style.module.less'
import { message, DatePicker } from 'antd';
import moment from 'moment'
import { selectProjectId } from '@redux/systemconfig.js'
import {PCSMonitorRuntime, SiteManagerDesigner, StorageContainerDesigner, StorageMonitorRuntime } from '@api/api.js'
import { useReactive, useRequest } from 'ahooks'
import { useSelector } from 'react-redux'
import { useNavigate, useOutletContext} from 'react-router-dom'
import pcs from './imgs/pcs.png'
import Pagecount from "@com/pagecontent";
import styled from 'styled-components'

import RuntimeParamsPanel from './RuntimeParamsPanel'
import PowerCompareChart from './PowerCompareChart'
import Titlelayout from '@com/titlelayout'
const Mainbox = styled.div`
 && {
   .leftlayout {
      border-radius: 8px;
      background-color: #1C2C43;
      padding: 20px;
      .leftTitle {
        position: relative;
        border-left:none;
        padding-left: 11px;
        &::before {
          position: absolute;
          left:0px;
          content: "";
          width: 3px;
          height: 13px;
          background-color: ${({theme}) =>  theme.primaryColor };
        }
      }
   }
   .rightlayout {
     flex:1;
     display: grid;
     grid-template-columns: 1fr;
     grid-template-rows: 360px 1fr;
     row-gap: 16px;
   }
 }
`
export default function Index() {
  let {exparams} = useOutletContext()
  let {areaId, projectId: exparamsProjectId, pcsId} = exparams || {}
  const currentPcsId = pcsId?.value

  // 优先使用 exparams 的 projectId，否则使用 redux 中的
  const reduxProjectId = useSelector(selectProjectId)
  const projectId = exparamsProjectId || reduxProjectId

  console.log('exparams:', exparams)
  console.log('pcsId:', pcsId, 'currentPcsId:', currentPcsId)
  console.log('exparamsProjectId:', exparamsProjectId, 'reduxProjectId:', reduxProjectId, 'projectId:', projectId)

  const {
    queryPowerTrends,
  } = PCSMonitorRuntime

  //页面组件
  // 数据卡片：显示名称、单位、数值
  const DataCard = props => {
    const { name, unit = '', value } = props
    return (
      <div className={style.dataCard}>
        <div className={style.cardLabel}>{name}{unit ? `（${unit}）` : ''}</div>
        <div className={style.dataValue}>{value}</div>
      </div>
    )
  }
  const [leftValues, setLeftValues] = useState([])
  const [pcsName, setPcsName] = useState('')
  const [startDate, setStartDate] = useState(moment().subtract(1, 'day'))
  const [endDate, setEndDate] = useState(moment())
  const [compareData, setCompareData] = useState({
    xAxis: [],
    series1Name: '',
    series2Name: '',
    series1: [],
    series2: []
  })
  // 实时运行参数数据
  const [runtimeData, setRuntimeData] = useState({
    uab: 0,
    ubc: 0,
    uca: 0,
    ia: 0,
    ib: 0,
    ic: 0,
    pwr: 0,
    q: 0,
    s: 0,
    pf: 0
  })
  // 获取功率趋势数据
  const fetchPowerTrends = async (params) => {
    try {
      const res = await queryPowerTrends(params.projectId, params.pcsId, params.startTime, params.endTime)
      if (res.success && Array.isArray(res.data)) {
        const time = res.data.map(item => item?.x || '')
        const power = res.data.map(item => Number(item?.y) || 0)
        return {
          time,
          power
        }
      } else {
        console.warn('获取功率趋势数据失败:', res.errMsg)
        return null
      }
    } catch (error) {
      console.error('获取功率趋势数据异常:', error)
      return null
    }
  }

  const buildSeries1Name = (start, end) => `${start} ~ ${end}`
  // 开始日期变化时触发接口调用
  const handleStartDateChange = async (date, dateString) => {
    if (date && endDate && (date.isAfter?.(endDate, 'day') || date.isSame?.(endDate, 'day'))) {
      message.warning('开始日期必须早于结束日期')
      return
    }
    setStartDate(date)
    if (dateString && endDate && projectId && currentPcsId) {
      const res = await fetchPowerTrends({
        projectId,
        pcsId: currentPcsId,
        startTime: dateString,
        endTime: typeof endDate === 'string' ? endDate : endDate?.format('YYYY-MM-DD')
      })
      if (res) {
        setCompareData({
          xAxis: res.time || [],
          series1Name: buildSeries1Name(dateString, endDate?.format('YYYY-MM-DD')),
          series2Name: '',
          series1: res.power || [],
          series2: []
        })
      }
    }
  }

  // 结束日期变化时触发接口调用
  const handleEndDateChange = async (date, dateString) => {
    if (date && startDate && (date.isBefore?.(startDate, 'day') || date.isSame?.(startDate, 'day'))) {
      message.warning('结束日期必须晚于开始日期')
      return
    }
    setEndDate(date)
    if (startDate && dateString && projectId && currentPcsId) {
      const res = await fetchPowerTrends({
        projectId,
        pcsId: currentPcsId,
        startTime: typeof startDate === 'string' ? startDate : startDate?.format('YYYY-MM-DD'),
        endTime: dateString
      })
      if (res) {
        setCompareData({
          xAxis: res.time || [],
          series1Name: buildSeries1Name(startDate?.format('YYYY-MM-DD'), dateString),
          series2Name: '',
          series1: res.power || [],
          series2: []
        })
      }
    }
  }
  const state = useReactive({
    warningInfo:[],
    ACData:[]
  })

  const getContent = () => {
    if (!projectId || !currentPcsId) return
    console.log('Calling API with:', { projectId, pcsId: currentPcsId })
    StorageMonitorRuntime.queryPCSStatusInfo(projectId, currentPcsId).then(res => {
      console.log('API response:', res)
      if (res.success && res.data) {
        setPcsName(res.data.name || '')
        if (res.data.items && res.data.items.length > 0) {
          setLeftValues(res.data.items)
        }
      } else {
        console.warn('获取PCS状态数据失败:', res.errMsg)
      }
    })
  }

  // 获取实时运行参数数据
  const getRuntimeData = () => {
    if (!projectId || !currentPcsId) return
    console.log('Calling QueryPCSDataInfo API with:', { projectId, pcsId: currentPcsId })
    StorageMonitorRuntime.queryPCSDataInfo(projectId, currentPcsId).then(res => {
      console.log('QueryPCSDataInfo response:', res)
      if (res.success && res.data && Array.isArray(res.data)) {
        // 将数组格式转换为对象格式
        const dataMap = {}
        res.data.forEach(item => {
          dataMap[item.index] = item.value
        })
        setRuntimeData({
          uab: Number(dataMap[1]) || 0,  // 线电压AB
          ia: Number(dataMap[2]) || 0,   // A相电流
          pwr: Number(dataMap[3]) || 0,  // 有功功率
          ubc: Number(dataMap[4]) || 0,  // 线电压BC
          ib: Number(dataMap[5]) || 0,   // B相电流
          q: Number(dataMap[6]) || 0,    // 无功功率
          uca: Number(dataMap[7]) || 0,  // 线电压CA
          ic: Number(dataMap[8]) || 0,   // C相电流
          s: Number(dataMap[9]) || 0,    // 视在功率
          pf: Number(dataMap[10]) || 0   // 功率因数
        })
      } else {
        console.warn('获取实时运行参数数据失败:', res.errMsg)
      }
    })
  }

  useEffect(() => {
    console.log('useEffect triggered:', { currentPcsId, projectId })
    getContent()
    getRuntimeData()
  }, [currentPcsId, projectId])

  useEffect(() => {
    if (!projectId || !currentPcsId || !startDate || !endDate) return
    if (!startDate.isBefore?.(endDate, 'day')) return
    const run = async () => {
      const res = await fetchPowerTrends({
        projectId,
        pcsId: currentPcsId,
        startTime: startDate.format('YYYY-MM-DD'),
        endTime: endDate.format('YYYY-MM-DD')
      })
      if (res) {
        setCompareData({
          xAxis: res.time || [],
          series1Name: buildSeries1Name(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')),
          series2Name: '',
          series1: res.power || [],
          series2: []
        })
      }
    }
    run()
  }, [projectId, currentPcsId])

  return (
    <Pagecount bgcolor='transparent' pd="0">

      <Mainbox className={style.pcsContent}>
        <div className={style.left + " leftlayout"} key="left">
          <div className={style.title + " leftTitle"}>
            <span>PCS信息</span>
          </div>
          <div className={style.pcsImgs}>
            <span className={style.imgTitle}>{pcsName}</span>
            <img className={style.pcsImg} src={pcs}></img>
          </div>
          <div className={style.pcsGrid} key="leftdown">
            {leftValues.map((item, index) => (
              <DataCard key={index} name={item.name} unit={item.unit} value={item.value} />
            ))}
          </div>
        </div>
        <div className={`rightlayout ${style.rightlayout}`} key="right">
          <Titlelayout title="实时运行参数">
            <RuntimeParamsPanel data={runtimeData} />
          </Titlelayout>
          <Titlelayout title="总有功功率" extra={
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
                disabledDate={(current) =>
                  !!endDate && (current?.isAfter?.(endDate, 'day') || current?.isSame?.(endDate, 'day'))
                }
              />
              <span style={{ color: '#333', fontSize: 12 }}>对比</span>
              <DatePicker
                value={endDate}
                onChange={handleEndDateChange}
                disabledDate={(current) =>
                  !!startDate && (current?.isBefore?.(startDate, 'day') || current?.isSame?.(startDate, 'day'))
                }
              />
            </div>
          }>
            <PowerCompareChart chartData={compareData} />
          </Titlelayout>
        </div>
      </Mainbox>
    </Pagecount>
  )
}
