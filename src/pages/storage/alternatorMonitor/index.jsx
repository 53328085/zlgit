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
import charge from './imgs/charge.png'
import busVoltage from './imgs/busVoltage.png'
import hotStandby from './imgs/hotStandby.png'
import dcPower from './imgs/dcPower.png'
import dcCurrent from './imgs/dcCurrent.png'
import running from './imgs/running.png'
import frequency from './imgs/frequency.png'
import igbtTemperature from './imgs/igbtTemperature.png'
import offline from './imgs/offline.png'
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
  const currentPcsId = pcsId?.value ?? pcsId

  // 优先使用 exparams 的 projectId，否则使用 redux 中的
  const reduxProjectId = useSelector(selectProjectId)
  const projectId = exparamsProjectId || reduxProjectId

  const {
    queryPowerTrends,
  } = PCSMonitorRuntime

  const CARD_ICON_RULES = [
    {
      test: ({value}) => /运行/.test(value),
      icon: running
    },
    {
      test: ({value}) => /停机|关机/.test(value),
      icon: offline
    },
    { test: ({name}) => /总母线电压|母线电压/.test(name), icon: busVoltage },
    { test: ({name}) => /直流总电流|直流电流/.test(name), icon: dcCurrent },
    { test: ({name}) => /直流功率/.test(name), icon: dcPower },
    { test: ({name}) => /频率/.test(name), icon: frequency },
    { test: ({name}) => /IGBT温度|IGBT/.test(name), icon: igbtTemperature },
    { test: ({name}) => /热备/.test(name), icon: hotStandby },
    { test: ({name, value}) => /充电|放电|充放电/.test(name) || /充电|放电/.test(value), icon: charge },
    {
      test: ({name, value}) => /停机|关机/.test(name) || /停机|关机/.test(value),
      icon: offline
    },
    {
      test: ({name, value}) => /运行/.test(name) || /运行/.test(value),
      icon: running
    },
  ]

  const getCardIcon = (name, value) => {
    const normalizedName = String(name ?? '').trim()
    const normalizedValue = String(value ?? '').trim()
    const matchedRule = CARD_ICON_RULES.find(rule =>
      rule.test({name: normalizedName, value: normalizedValue})
    )
    return matchedRule?.icon || ''
  }

  //页面组件
  // 数据卡片：显示名称、单位、数值
  const DataCard = props => {
    const { name, unit = '', value } = props
    const icon = getCardIcon(name, value)
    return (
      <div className={style.dataCard}>
        {icon ? (
          <div className={style.cardIconWrap}>
            <img className={style.cardIcon} src={icon} alt={name} />
          </div>
        ) : (
          <div className={style.cardIconPlaceholder} />
        )}
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
  const DEFAULT_RUNTIME_ITEMS = [
    { key: 'uab', iconText: 'Uab', name: 'Uab线电压AB', unit: 'V' },
    { key: 'ubc', iconText: 'Ubc', name: 'Ubc线电压BC', unit: 'V' },
    { key: 'uca', iconText: 'Uca', name: 'Uca线电压CA', unit: 'V' },
    { key: 'ia', iconText: 'Ia', name: 'Ia A相电流', unit: 'A' },
    { key: 'ib', iconText: 'Ib', name: 'Ib B相电流', unit: 'A' },
    { key: 'ic', iconText: 'Ic', name: 'Ic C相电流', unit: 'A' },
    { key: 'pwr', iconText: 'Pwr', name: '有功功率', unit: 'kW' },
    { key: 'q', iconText: 'Q', name: '无功功率', unit: 'kVar' },
    { key: 's', iconText: 'S', name: '视在功率', unit: 'kVA' },
    { key: 'pf', iconText: 'PF', name: '功率因数', unit: '' },
  ]

  const getRuntimeIconText = (unit, fallback) => {
    const text = String(unit ?? '').trim()
    const lower = text.toLowerCase()
    if (lower.includes('kvar')) return 'Q'
    if (lower.includes('kva')) return 'S'
    if (lower.includes('kw') || lower.includes('w')) return 'Pwr'
    if (lower.includes('a')) return 'A'
    if (lower.includes('v')) return 'V'
    return fallback || text || 'P'
  }

  const normalizeRuntimeData = data => {
    if (Array.isArray(data)) {
      return data
        .slice()
        .sort((a, b) => Number(a?.index ?? 0) - Number(b?.index ?? 0))
        .map((item, idx) => {
          const fallback = DEFAULT_RUNTIME_ITEMS[idx] || {}
          return {
            key: item?.key || item?.point || fallback.key || `item-${idx}`,
            name: item?.name || item?.title || fallback.name || `参数${idx + 1}`,
            value: item?.value ?? '--',
            unit: item?.unit ?? fallback.unit ?? '',
            iconText: item?.iconText || getRuntimeIconText(item?.unit, fallback.iconText),
          }
        })
    }

    if (data && typeof data === 'object') {
      return DEFAULT_RUNTIME_ITEMS.map(item => ({
        ...item,
        value: data[item.key] ?? '--',
        iconText: getRuntimeIconText(item.unit, item.iconText),
      }))
    }

    return DEFAULT_RUNTIME_ITEMS.map(item => ({
      ...item,
      value: '--',
    }))
  }

  // 实时运行参数数据
  const [runtimeData, setRuntimeData] = useState(() => normalizeRuntimeData())
  const normalizeTrendSeries = (list = []) => {
    if (!Array.isArray(list)) return { time: [], power: [] }

    return list.reduce((acc, item) => {
      const value = Number(item?.y)
      if (!Number.isFinite(value)) return acc
      acc.time.push(item?.x || '')
      acc.power.push(value)
      return acc
    }, { time: [], power: [] })
  }

  // 获取功率趋势数据
  const fetchPowerTrends = async (params) => {
    try {
      const res = await queryPowerTrends(params.projectId, params.pcsId, params.startTime, params.endTime)
      if (res.success && res.data && typeof res.data === 'object') {
        const series1 = normalizeTrendSeries(res.data?.data1st)
        const series2 = normalizeTrendSeries(res.data?.data2nd)
        return {
          series1,
          series2
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
          xAxis: res.series1?.time || [],
          series1Name: dateString,
          series2Name: endDate?.format('YYYY-MM-DD') || '',
          series1: res.series1?.power || [],
          series2: res.series2?.power || []
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
          xAxis: res.series1?.time || [],
          series1Name: startDate?.format('YYYY-MM-DD') || '',
          series2Name: dateString,
          series1: res.series1?.power || [],
          series2: res.series2?.power || []
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
    StorageMonitorRuntime.queryPCSStatusInfo(projectId, currentPcsId).then(res => {
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
    StorageMonitorRuntime.queryPCSDataInfo(projectId, currentPcsId)
      .then(res => {
        if (res.success) {
          setRuntimeData(normalizeRuntimeData(res.data))
        } else {
          console.warn('获取实时运行参数数据失败:', res.errMsg)
          setRuntimeData(normalizeRuntimeData())
        }
      })
      .catch(() => {
        setRuntimeData(normalizeRuntimeData())
      })
  }

  useEffect(() => {
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
          xAxis: res.series1?.time || [],
          series1Name: startDate.format('YYYY-MM-DD'),
          series2Name: endDate.format('YYYY-MM-DD'),
          series1: res.series1?.power || [],
          series2: res.series2?.power || []
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
