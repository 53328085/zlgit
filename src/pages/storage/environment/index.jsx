import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Button, DatePicker, message, Form, Typography } from 'antd'
import moment from 'moment'
import { SearchOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import CustModal from '@com/useModal'
import { useOutletContext } from 'react-router-dom'
import * as echarts from 'echarts'
import { BMSRuntime } from '@api/api'

import { useReactive } from 'ahooks'
import Pagecount from "@com/pagecontent";
import style from './style.module.less'
import deviceImg from '../../../assets/image/energyStorageEquipment.png'

const { Paragraph, Text } = Typography
const { Item } = Form

// ==================== 样式定义 ====================

// 主容器 - 储能柜卡片
const ContainerCard = styled.div`
  width: 280px;
  min-height: 680px;
  margin-right: 24px;
  background: linear-gradient(180deg, #1a2a3f 0%, #0d1624 100%);
  border: 1px solid #1890ff;
  border-radius: 8px;
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`

// 卡片顶部名称标签
const CardHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
`

const NameTag = styled.div`
  background: #1890ff;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
`

// 设备图片区
const DeviceImage = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(24, 144, 255, 0.2);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

// 子系统模块容器
const ModuleSection = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &:last-child {
    border-bottom: none;
  }
`

// 子系统标题（横向蓝色横条）
const ModuleTitle = styled.div`
  background: #1890ff;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  padding: 10px 16px;
  text-align: center;
`

// 数据网格容器 - 液冷系统（2列）
const DataGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 16px 12px;
  gap: 16px;
`

// 数据网格容器 - 除湿机（3列）
const DataGrid3 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 16px 12px;
  gap: 12px;
`

// 单个数据项（列布局）
const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }

  .value {
    font-size: 20px;
    color: ${props => props.$color || '#fff'};
    font-weight: 600;
    text-align: center;
  }

  .unit {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
`

// 消防系统容器
const FireSystemContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 12px;
  gap: 12px;

  .icon-wrapper {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(82, 196, 26, 0.1);
    border-radius: 50%;
  }

  .fire-icon {
    font-size: 36px;
    color: #52c41a;
  }

  .status-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }
`

// 拓扑连接线容器
const TopologyLines = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 0 0 20px 0; */
  position: relative;
`

// SVG 连接线组件
const ConnectionSVG = styled.svg`
  width: 100%;
  height: 100%;

  .main-line {
    stroke: #1890ff;
    stroke-width: 2;
    fill: none;
  }

  .branch-line {
    stroke: #1890ff;
    stroke-width: 2;
    fill: none;
  }

  .node-dot {
    fill: #1890ff;
  }

  .end-dot {
    fill: #52c41a;
  }
`

// ==================== Mock 数据 ====================

// 临时 Mock 数据函数
const getMockData = () => {
  return {
    success: true,
    errMsg: "",
    data: {
      id: 1,
      name: "储能站点_示例",
      containers: [
        {
          id: 1,
          name: "环境监控",
          types: [
            {
              id: 0,
              name: "液冷系统",
              index: 0,
              items: [
                {
                  name: "工作模式",
                  value: "制冷",
                  unit: "",
                  index: 1,
                  time: "2026/01/26 14:30:15",
                  style: "UD"
                },
                {
                  name: "环境温度",
                  value: "23.5",
                  unit: "℃",
                  index: 2,
                  time: "2026/01/26 14:30:15",
                  style: "UD"
                }
              ]
            },
            {
              id: 1,
              name: "除湿机",
              index: 1,
              items: [
                {
                  name: "当前湿度",
                  value: "12",
                  unit: "%",
                  index: 1,
                  time: "2026/01/26 14:30:15",
                  style: "UD"
                },
                {
                  name: "当前温度",
                  value: "23.5",
                  unit: "℃",
                  index: 2,
                  time: "2026/01/26 14:30:15",
                  style: "UD"
                },
                {
                  name: "工作状态",
                  value: "运行",
                  unit: "",
                  index: 3,
                  time: "2026/01/26 14:30:15",
                  style: "UD"
                }
              ]
            },
            {
              id: 2,
              name: "消防系统",
              index: 2,
              items: [
                {
                  name: "系统状态",
                  value: "正常",
                  unit: "",
                  index: 1,
                  time: "2026/01/26 14:30:15",
                  style: "LR"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "环境监控",
          types: [
            {
              id: 0,
              name: "液冷系统",
              index: 0,
              items: [
                {
                  name: "工作模式",
                  value: "制冷",
                  unit: "",
                  index: 1,
                  time: "2026/01/26 14:30:18",
                  style: "UD"
                },
                {
                  name: "环境温度",
                  value: "23.5",
                  unit: "℃",
                  index: 2,
                  time: "2026/01/26 14:30:18",
                  style: "UD"
                }
              ]
            },
            {
              id: 1,
              name: "除湿机",
              index: 1,
              items: [
                {
                  name: "当前湿度",
                  value: "12",
                  unit: "%",
                  index: 1,
                  time: "2026/01/26 14:30:18",
                  style: "UD"
                },
                {
                  name: "当前温度",
                  value: "23.5",
                  unit: "℃",
                  index: 2,
                  time: "2026/01/26 14:30:18",
                  style: "UD"
                },
                {
                  name: "工作状态",
                  value: "运行",
                  unit: "",
                  index: 3,
                  time: "2026/01/26 14:30:18",
                  style: "UD"
                }
              ]
            },
            {
              id: 2,
              name: "消防系统",
              index: 2,
              items: []
            }
          ]
        }
      ]
    }
  }
}

// ==================== 辅助函数 ====================

// ==================== 子组件 ====================

// 拓扑连接线组件
const TopologyConnection = ({ containerCount }) => {
  if (containerCount === 0) return null

  const svgWidth = 1200
  const svgHeight = 80
  const centerX = svgWidth / 2
  const mainLineLength = 30
  const branchY = mainLineLength + 20

  // 计算每个分支的 X 位置
  const containerWidth = 280
  const containerGap = 24
  const totalWidth = containerCount * containerWidth + (containerCount - 1) * containerGap
  const startX = (svgWidth - totalWidth) / 2

  // 生成分支位置数组
  const branches = []
  for (let i = 0; i < containerCount; i++) {
    const branchX = startX + i * (containerWidth + containerGap) + containerWidth / 2
    branches.push(branchX)
  }

  return (
    <TopologyLines>
      <ConnectionSVG viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {/* 主干线 */}
        <line
          x1={centerX}
          y1={0}
          x2={centerX}
          y2={mainLineLength}
          className="main-line"
        />

        {/* 主干节点 */}
        <circle cx={centerX} cy={0} r={4} className="node-dot" />
        <circle cx={centerX} cy={mainLineLength} r={4} className="node-dot" />

        {/* 横向分支线 */}
        {containerCount > 1 && (
          <line
            x1={branches[0]}
            y1={mainLineLength}
            x2={branches[branches.length - 1]}
            y2={mainLineLength}
            className="branch-line"
          />
        )}

        {/* 各个分支到储能柜的垂直线 */}
        {branches.map((branchX, index) => (
          <g key={index}>
            <line
              x1={branchX}
              y1={mainLineLength}
              x2={branchX}
              y2={branchY + 30}
              className="branch-line"
            />
            <circle cx={branchX} cy={mainLineLength} r={3} className="node-dot" />
            <circle cx={branchX} cy={branchY + 30} r={4} className="end-dot" />
          </g>
        ))}
      </ConnectionSVG>
    </TopologyLines>
  )
}

// 渲染单个数据项
const RenderDataItem = ({ item }) => {
  // UD 上下布局
  if (item.style === 'UD') {
    let color = '#fff'
    if (item.name === '工作状态' && item.value === '运行') {
      color = '#52c41a'
    }

    return (
      <DataItem $color={color}>
        <span className="label">{item.name}</span>
        <div className="value">
          {item.value}
          {item.unit && <span className="unit">{item.unit}</span>}
        </div>
      </DataItem>
    )
  }

  // LR 左右布局（暂不实现，根据需要可扩展）
  return null
}

// 渲染子系统模块
const RenderModule = ({ module }) => {
  const moduleName = module.name

  // 消防系统特殊处理
  if (moduleName === '消防系统') {
    if (!module.items || module.items.length === 0) {
      return (
        <ModuleSection>
          <ModuleTitle>{moduleName}</ModuleTitle>
          <FireSystemContent>
            <div className="icon-wrapper">
              <CheckCircleOutlined className="fire-icon" />
            </div>
            <div className="status-text">暂无告警</div>
          </FireSystemContent>
        </ModuleSection>
      )
    }

    const hasWarning = module.items.some(item =>
      String(item.value).toLowerCase().includes('异常') ||
      String(item.value).toLowerCase().includes('故障') ||
      String(item.value).toLowerCase().includes('报警')
    )

    return (
      <ModuleSection>
        <ModuleTitle>{moduleName}</ModuleTitle>
        <FireSystemContent>
          <div className="icon-wrapper">
            {hasWarning ? (
              <ExclamationCircleOutlined className="fire-icon" style={{ color: '#ff4d4f' }} />
            ) : (
              <CheckCircleOutlined className="fire-icon" />
            )}
          </div>
          <div className="status-text">
            {hasWarning ? '系统告警' : '暂无告警'}
          </div>
        </FireSystemContent>
      </ModuleSection>
    )
  }

  // 液冷系统：2列布局
  if (moduleName === '液冷系统') {
    return (
      <ModuleSection>
        <ModuleTitle>{moduleName}</ModuleTitle>
        <DataGrid2>
          {module.items?.map((item, idx) => (
            <RenderDataItem key={idx} item={item} />
          ))}
        </DataGrid2>
      </ModuleSection>
    )
  }

  // 除湿机：3列布局
  if (moduleName === '除湿机') {
    return (
      <ModuleSection>
        <ModuleTitle>{moduleName}</ModuleTitle>
        <DataGrid3>
          {module.items?.map((item, idx) => (
            <RenderDataItem key={idx} item={item} />
          ))}
        </DataGrid3>
      </ModuleSection>
    )
  }

  // 默认布局（如果有其他子系统）
  return null
}

// 渲染单个储能柜卡片
const ContainerCardView = ({ container }) => {
  return (
    <ContainerCard>
      <CardHeader>
        <NameTag>{container.name}</NameTag>
      </CardHeader>
      <DeviceImage>
        <img src={deviceImg} alt={container.name} />
      </DeviceImage>

      {/* 渲染所有子系统模块 */}
      {container.types?.map((module, idx) => (
        <RenderModule key={idx} module={module} />
      ))}
    </ContainerCard>
  )
}

// ==================== 主组件 ====================
export default function Index() {
  let { exparams } = useOutletContext()
  let { areaId, projectId, stationName } = exparams
  const lineRef = useRef()
  const { queryENVStatusInfo, queryTrends } = BMSRuntime

  const today = moment().format('YYYY-MM-DD')
  const [form] = Form.useForm()

  // Mock 数据开关：true=使用Mock，false=使用真实接口
  const USE_MOCK_DATA = true

  // 数据状态
  const [storageData, setStorageData] = useState([])

  // 加载数据
  useEffect(() => {
    if (USE_MOCK_DATA) {
      // 使用 Mock 数据
      const mockData = getMockData()
      setStorageData(mockData.data.containers)
      console.log('当前使用 Mock 数据')
    } else {
      // 使用真实接口数据
      queryENVStatusInfo(1, 1).then(res => {
        if (res.success && res.data?.containers && res.data.containers.length > 0) {
          setStorageData(res.data.containers)
        } else {
          // 接口无数据时使用 Mock 数据
          const mockData = getMockData()
          setStorageData(mockData.data.containers)
          console.log('接口无数据，使用 Mock 数据')
        }
      }).catch(err => {
        // 接口异常时也使用 Mock 数据
        const mockData = getMockData()
        setStorageData(mockData.data.containers)
        console.error('接口异常，使用 Mock 数据:', err)
      })
    }
  }, [])

  // 温湿度趋势相关（保留原有逻辑）
  const [roomId, setRoomId] = useState(0)
  const TempRef = useRef()

  const getTrends = (projectId, roomId, date) => {
    queryTrends(projectId, roomId, date).then(res => {
      let { success, data } = res
      if (success && data) {
        drawLine({
          time: data.x || [],
          tempTrends: data.y || [],
          humidityTrends: data.y1 || [],
        })
      } else {
        drawLine({ time: [], tempTrends: [], humidityTrends: [] })
      }
    })
  }

  const showChart = (id) => {
    setRoomId(id)
    form.setFieldValue('date', moment(today, 'YYYY-MM-DD'))
    getTrends(projectId, id, today)
    TempRef.current?.onOpen()
  }

  const drawLine = (lineData) => {
    if (!lineRef.current) return
    const lineChart = echarts.init(lineRef.current)
    lineChart.clear()
    lineChart.setOption({
      color: ['#237ae4', '#093'],
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { top: '0', left: 'center' },
      grid: { left: '32px', right: '20px', bottom: '48px', top: '32px', containLabel: true },
      xAxis: { type: 'category', boundaryGap: true, data: lineData.time },
      yAxis: { type: 'value', scale: true },
      dataZoom: { type: 'slider', height: 24 },
      series: [
        { name: '温度(℃)', data: lineData.tempTrends, type: 'line', symbol: 'circle' },
        { name: '湿度(%)', data: lineData.humidityTrends, type: 'line', symbol: 'circle' }
      ]
    }, true)
  }

  const onSearch = () => {
    const date = form.getFieldValue('date')?.format('YYYY-MM-DD')
    if (date) getTrends(projectId, roomId, date)
  }

  return (
    <Pagecount pd="0">
      <div className={style.mainContent}>
        {/* 标题 */}
        <div className={style.title}>
          <Paragraph style={{ marginBottom: '0', color: "#fff" }} ellipsis={{ tooltip: stationName?.value }}>
            {stationName?.label || '环境监控'}
          </Paragraph>
        </div>

        {/* 拓扑连接线 */}
        <TopologyConnection containerCount={storageData.length} />

        {/* 储能柜卡片列表 */}
        <div className={style.cardList}>
          <div className={style.cardContainer}>
            {storageData.map((container) => (
              <ContainerCardView key={container.id} container={container} />
            ))}
          </div>
        </div>
      </div>

      {/* 温湿度趋势弹窗 */}
      <CustModal title='温湿度趋势' ref={TempRef} mold="cust" width={1680} onOk={() => TempRef.current?.onCancel()}>
        <div style={{ position: 'absolute', right: 32, top: 32, display: 'flex', alignItems: 'center' }}>
          <span>日期</span>
          <Form name='addForm' form={form}>
            <Item name='date' label=''>
              <DatePicker style={{ width: 182, margin: '0 16px' }} defaultValue={moment(today, 'YYYY-MM-DD')} />
            </Item>
          </Form>
          <Button type='primary' icon={<SearchOutlined />} style={{ width: 96 }} onClick={onSearch}>查询</Button>
        </div>
        <div className={style.lineChart} ref={lineRef}></div>
      </CustModal>
    </Pagecount>
  )
}
