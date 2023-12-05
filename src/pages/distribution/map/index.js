import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {selectcurlRommid} from "@redux/systemconfig";
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import { Divider, Form, Select, message } from 'antd'
import { useReactive } from "ahooks";
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import styled from 'styled-components';
import Comhead from '../usehead/com'
import { Topology } from "@topology/core/src/core";
import { register as registerFlow } from '@topology/flow-diagram'

// 左侧工具栏图标
import '../../../assets/css/fonts/font/iconfont.css'
import '../../../assets/css/font_2073009_u56zfo0voi/iconfont.css'
import '../../../assets/css/font_2395018_pl6jy69tbjr/iconfont.css'
import '../../../assets/css/font_4xgdsyqu0mh/iconfont.css'
import '../../../assets/css/font_99x1os11gqi/iconfont.css'
import '../../../assets/css/font_c44gejdj174/iconfont.css'
import '../../../assets/css/font_ehfbe2lg8tb/iconfont.css'
import '../../../assets/css/font_ugr1luq01xe/iconfont.css'
// 右侧图形库图标
import '../../../assets/css/fonts/font/libs/iconfont.css'
import '../../../assets/css/font_g4v09lxfde/iconfont.css'
import '../../../assets/css/font_bz4csze2alg/iconfont.css'

const { Option } = Select;
export default function Index() {
  const ChartItem = styled.div`
    position: absolute;
    left: 32px;
    top: 32px;
    display: flex;
    align-items: center;
    .chartitem{
      width: 112px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: #f2f2f2;
      font-size: 14px;
      border: 1px solid #f2f2f2;
      border-radius: 2px;
      margin-right: 16px;
      cursor: pointer;
    }
    .activeItem{
      background-color: #237ae4;
    }
  `

  let canvas
  const [newCanvas, setNewCanvas] = useState()
  const canvasOptions = {}
  const lineNames = ['curve', 'polyline', 'line']
  const arrowTypes = ['', 'triangleSolid', 'triangle', 'diamondSolid', 'diamond', 'circleSolid', 'circle', 'line', 'lineUp', 'lineDown']

 
  const dispatch = useDispatch()
  const projectId = useSelector(state => state.system.menus.projectId)
  const roomId = useSelector(selectcurlRommid)
  const state = useReactive({
    chartList: [],
    activeChart: 0,
  })
 

  const getChartList = async (roomId) => {
    const res = await DistributionRoomRuntime.ChartList(projectId, roomId)
    if (res.success) {
      if (Array.isArray(res.data) && res.data.length > 0) {
        state.chartList = res.data
        state.activeChart = res.data[0].id
        getChartDetail(res.data[0].id)
      } else {
        state.chartList = []
        state.activeChart = 0
        setTimeout(()=> {
          newCanvas.open({})
          newCanvas.render()
        }, 1000)
      }
    }
  }

  const getChartDetail = async (id) => {
    registerFlow()
    canvasOptions.on = onMessage
    canvas = new Topology('topology-canvas', canvasOptions)
    canvas.render()
    setNewCanvas(canvas)
    const res = await DistributionRoomRuntime.ChartDetails(projectId, id)
    if(res.success){
      let dateGroup = JSON.parse(res.data.dataGroup)
          dateGroup.locked = 1
          console.log(canvas)
          setTimeout(()=> {
            canvas.open(dateGroup)
            canvas.render()
            canvas.fitView(16);
          }, 1000)
    }else{
      setTimeout(()=> {
        canvas.open({})
        canvas.render()
      }, 1000)
      message.error(res.errMsg)
    }
  }

 

  const [contextmenu, setContextMenu] = useState({
    left: null,
    top: null,
    bottom: null
  })
  const [props, setProps] = useState({
    node: null, // 节点
    line: null, // 连线
    nodes: null,
    multi: false, // 多个对象
    expand: false,
    locked: false
  })
  const [canvasData, setCanvasData] = useState({
    lineName: 'polyline',
    fromArrow: '',
    toArrow: 'triangleSolid'
  }) // 画布数据
  const [TopologyData, setTopologyData] = useState({
    grid: false, // 背景网格
    locked: false, // 画布锁定
    gridColor: 'rgba(242, 242, 242, 1)',
    bkColor: 'rgba(255, 255, 255, 1)'
  })
  const [nodeTag, setNodeTag] = useState(false)
  const [nodeType, setNodeType] = useState('设备绑定')
  const [selectedNode, setSelectedNode] = useState()

  const onDrag = (event, node) => {
    // 解决浏览器手势插件命名冲突
    event.dataTransfer.setData('Topology', JSON.stringify(node.data))
  }
  const onContextMenu = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const onMessage = (event, data) => {
    // console.log(event)
    // console.log(data)
    if (event == 'nodeRightClick') {
      // console.log(data.evs)
      if (data.name == "text" || data.name == "rectangle") {
        setContextMenu({
          left: data.evs.x - 210 + 'px',
          top: data.evs.y - 110 + 'px'
        })
        setNodeTag(true)
        setSelectedNode(data)
        setNodeType('数据绑定')
      } else if (data.name == 'image') {
        setContextMenu({
          left: data.evs.x - 210 + 'px',
          top: data.evs.y - 110 + 'px'
        })
        setNodeTag(true)
        setSelectedNode(data)
        setNodeType('设备绑定')
      }
    }
  }

  const changeChart = id => {
    state.activeChart = id
    getChartDetail(id)
  }

  useEffect(() => {
   if(roomId) getChartList(roomId)
    
  }, [roomId])

  return (
   
      <Pagecount bgcolor="#eeeff3" pd="0px">  
        <div id="topology-canvas" style={{ position: 'relative', width: 1680, height: 800, backgroundColor: '#fff' }} onContextMenu={e => onContextMenu(e)}>
          <ChartItem>
            {state.chartList.map((item, index) => {
              return <div className={`chartitem ${state.activeChart == item.id ? 'activeItem' : ''}`} key={index} onClick={()=> changeChart(item.id)}>{item.name}</div>
            })}
          </ChartItem>
        </div>
      </Pagecount>
  )
}