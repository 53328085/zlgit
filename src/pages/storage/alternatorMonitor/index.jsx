import React, { useEffect, useState} from 'react'
import style from './style.module.less'
import { message, DatePicker } from 'antd';
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel,themeColor } from '@redux/systemconfig.js'
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
      background-color: ${props => props.theme.imgbgcolor ||'rgb(0, 0, 51)'};
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
  let {value: pcs_id, label} = pcsId || {}

  // 优先使用 exparams 的 projectId，否则使用 redux 中的
  const reduxProjectId = useSelector(selectProjectId)
  const projectId = exparamsProjectId || reduxProjectId

  console.log('exparams:', exparams)
  console.log('pcsId:', pcsId, 'pcs_id:', pcs_id)
  console.log('exparamsProjectId:', exparamsProjectId, 'reduxProjectId:', reduxProjectId, 'projectId:', projectId)

  const {successColor, warningColor} = useSelector(themeColor)
  const {
    queryPCSInfo,
    queryPCSWarningInfo,
    queryPowerTrends,
    querySocTrends,
    queryAcTable} = PCSMonitorRuntime

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
  //页面参数 - 初始静态数据
  const [leftValues, setLeftValues] = useState([
    { name: '运行状态', value: '运行' },
    { name: '热备状态', value: '热备' },
    { name: '充放电状态', value: '充电' },
    { name: '直流电流', unit: 'A', value: '19.9' },
    { name: '总母线电压', unit: 'V', value: '568.5' },
    { name: '直流功率', unit: 'kW', value: '0.99' },
    { name: '电网频率', unit: 'Hz', value: '50.0' },
    { name: 'IGBT温度', unit: '°C', value: '43' },
  ])
  const [pcsName, setPcsName] = useState('')
  const [powerData, setPowerData] = useState({
    x: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    y: [120, 150, 180, 200, 170, 140]
  })
  const [socData, setSocData] = useState({
    x: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    y: [85, 80, 75, 70, 65, 60]
  })
  const state = useReactive({
    warningInfo:[],
    ACData:[]
  })

  const getContent = () => {
    if (!projectId) return
    const pcsId = -1 // 先写死
    console.log('Calling API with:', { projectId, pcsId })
    StorageMonitorRuntime.queryPCSStatusInfo(projectId, pcsId).then(res => {
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

  useEffect(() => {
    console.log('useEffect triggered:', { pcs_id, projectId })
    getContent()
  }, [pcs_id, projectId])
  const socOption = {
    type:2,
    color:[warningColor],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '0',
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick:{
        alignWithLabel:true
      },
      data: Array.isArray(socData.x) ? socData.x : []
    },
    yAxis: {
      type: 'value',
      // min: 24
      scale: true, //自适应
    },
    series: [
      {
        name: "SOC(%)",
        data:  Array.isArray(socData.y) ? socData.y : [],
        type: 'line',
        symbol:'none',
        smooth: true,
        areaStyle: {}
      }
    ]
  }
  const poweroption = {
    type:2,
    color:[successColor],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '0',
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data:   Array.isArray(powerData.x) ? powerData.x : [],
      boundaryGap: true,
      axisTick:{
        alignWithLabel:true
      },
    },
    yAxis: {
      type: 'value',
      scale: true, //自适应
      // min: function(value){
      //   return (value / 1000) * 1000
      // }
    },
    series: [
      {
        name: "实时总功率(kwh)",
        data: Array.isArray(powerData.y) ? powerData.y : [],
        type: 'line',
        symbol:'none',
        smooth: true,
        areaStyle: {}
      }
    ]
  }
  const AcClomns = [
    {
      title:'AC',
      dataIndex:'name',
      key:'name',
      align:'center'
    },{
      title:'电压 (V)',
      dataIndex:'v',
      key:'v',
      align:'center'
    },{
      title:'电流 (A)',
      dataIndex:'i',
      key:'i',
      align:'center'
    },{
      title:'有功功率(kW)',
      dataIndex:'p',
      key:'p',
      align:'center'
    },{
      title:'视在功率 (kVA)',
      dataIndex:'ps',
      key:'ps',
      align:'center'
    },{
      title:'无功功率 (kVar)',
      dataIndex:'q',
      key:'q',
      align:'center'
    },{
      title:'功率因数',
      dataIndex:'pf',
      key:'pf',
      align:'center'
    },
  ]




  // 静态数据演示
  const runtimeData = {
    uab: 2300,
    ubc: 2300,
    uca: 2300,
    ia: 2300,
    ib: 2300,
    ic: 2300,
    pwr: 2300,
    q: 2300,
    s: 2300,
    pf: 0.98
  }

  const chartData = {
    series1: [100, 150, 120, 180, 200, 170, 140, 160, 190, 220, 200, 180],
    series2: [90, 140, 130, 170, 190, 160, 150, 170, 180, 210, 190, 170]
  }


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
              <DatePicker />
              <span style={{ color: '#333', fontSize: 12 }}>对比</span>
              <DatePicker />
            </div>
          }>
            <PowerCompareChart chartData={chartData} />
          </Titlelayout>
        </div>
      </Mainbox>
    </Pagecount>
  )
}
