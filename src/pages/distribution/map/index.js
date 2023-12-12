import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectcurlRommid } from "@redux/systemconfig";
import Pagecount from '@com/pagecontent'
import {Button, Select, message, Spin } from 'antd'
import { useReactive } from "ahooks";
import {useNavigate} from 'react-router-dom'
import { DistributionRoomRuntime, distributionRoom, RuntimeHMI } from '@api/api.js'
import styled from 'styled-components';
import { Topology } from "@topology/core/src/core";
import { register as registerFlow } from '@topology/flow-diagram'
import mqtt from 'mqtt'

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
    width: 1616px;
    padding-right: 32px;
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

  const { hostServer } = useSelector((state) => state.user);
  // const hostServer = 'ws://10.5.25.182:4239/eiot/mqtt'

  let canvas
  const [newCanvas, setNewCanvas] = useState()
  const canvasOptions = {}
  const lineNames = ['curve', 'polyline', 'line']
  const arrowTypes = ['', 'triangleSolid', 'triangle', 'diamondSolid', 'diamond', 'circleSolid', 'circle', 'line', 'lineUp', 'lineDown']

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const projectId = useSelector(state => state.system.menus.projectId)
  const roomId = useSelector(selectcurlRommid)
  const state = useReactive({
    spining: false,
    chartList: [],
    activeChart: 0,
    getGuid: '',
    client: {},
    timer:null,
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
        setTimeout(() => {
          newCanvas.open({})
          newCanvas.render()
        }, 1000)
      }
    }
  }

  const getChartDetail = async (id) => {
    clearTimeout(state.timer)
    state.spining = true
    state.getGuid = guid()
    registerFlow()
    canvasOptions.on = onMessage
    canvas = new Topology('topology-canvas', canvasOptions)
    canvas.render()
    setNewCanvas(canvas)
    const res = await DistributionRoomRuntime.ChartDetails(projectId, id)
    if (res.success) {
      let dateGroup = JSON.parse(res.data.dataGroup)
      dateGroup.locked = 1
      
      setTimeout(() => {
        state.spining = false
        canvas.open(dateGroup)
        canvas.render()
        canvas.fitView(16);
        getMqtt()
      }, 1000)
    } else {
      setTimeout(() => {
        state.spining = false
        canvas.open({})
        canvas.render()
      }, 1000)
      message.error(res.errMsg)
    }
  }

  const getMqtt = () => {
    let options = {
      clientId:
        "HMI_" +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
      username: "",
      password: "",
    }
    state.client = mqtt.connect(hostServer, options)
    let penArr = window.topology.pureData().pens
    let devices = []
    for (let i = 0; i < penArr.length; i++) {
      if (penArr[i].tags.length > 1) {
        devices.push(penArr[i].tags[0]);
      }
    }
    devices = Array.from(new Set(devices));
    let HMIDevices = [];
    for (let i = 0; i < devices.length; i++) {
      HMIDevices.push({
        sn: devices[i],
        points: [],
      });
      for (let j = 0; j < penArr.length; j++) {
        if (penArr[j].tags.length > 1 && devices[i] == penArr[j].tags[0]) {
          HMIDevices[i].points.push(penArr[j].tags[1]);
        }
      }
    }

    state.client.on("connect", e => {
      state.client.subscribe(
        "HMI",
        { qos: 0 },
        (error) => {
          if (!error) {
            console.log("订阅成功");
          } else {
            console.log("订阅失败");
          }
        }
      )
    })
    // 接收消息处理
    state.client.on("message", (topic, message) => {
      let mqttData = JSON.parse(message.toString());
      console.log(mqttData);
      for (let key in mqttData.Points) {
        // console.log(mqttData.DeviceId + "_" +key)
        if (window.topology.find(mqttData.SN + "_" + key)) {
          if (Array.isArray(window.topology.find(mqttData.SN + "_" + key))) {
            let arrlist = window.topology.find(mqttData.SN + "_" + key)
            arrlist.map(item => {
              item.text = mqttData.Points[key].Value;
            })

          } else {
            window.topology.find(mqttData.SN + "_" + key).text =
              mqttData.Points[key].Value;
          }
        }
        let value = mqttData.Points[key].Value;
      }
      canvas.render();
    });
    // 断开发起重连
    state.client.on("reconnect", (error) => {
      console.log("正在重连:", error);
    });
    // 链接异常处理
    state.client.on("error", (error) => {
      console.log("连接失败:", error);
    });

    setTimeout(() => {
      getHeart(HMIDevices);
    }, 100);
  }

  const getHeart = (devices) => {
    console.log(devices)
    let params = {
      projectId: projectId,
      channel: state.getGuid,
      devices
    }
    RuntimeHMI.onHerart(params).then(res => {
      if(res.success){
        state.timer = setTimeout(()=> {
          getHeart(devices)
        }, 120000)
      }else{
        message.error(res.errMsg)
      }
    })
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
    } else if(event == 'dblclick') {
      console.log(data)
       let {tags} = data
       console.log(tags)
        if(!Array.isArray(tags) || tags.length < 1) return
       window.open(`/deviceDetail?sn=${tags[0]}`, "_blank")
    }
  }

  const changeChart = id => {
    state.activeChart = id
    state.client.end()
    getChartDetail(id)
  }

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  const guid = () => {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  useEffect(() => {
    if (roomId) getChartList(roomId)

  }, [roomId])
 const mapref = useRef();
 const fullref = useRef()
 const fullscreen = (e) => {
   e.preventDefault();
   e.stopPropagation();
   mapref.current.requestFullscreen()
 }
  return (
    <Spin spinning={state.spining} tip="Loading...">
      <Pagecount bgcolor="#eeeff3" pd="0px" custserach="true">
        <div id="topology-canvas" style={{ position: 'relative', width: 1680, height: 800, backgroundColor: '#fff' }} onContextMenu={e => onContextMenu(e)} ref={mapref}>
          <ChartItem>
            {state.chartList.map((item, index) => {
              return <div className={`chartitem ${state.activeChart == item.id ? 'activeItem' : ''}`} key={index} onClick={() => changeChart(item.id)}>{item.name}</div>
            })}
          
           {state.chartList?.length && <Button type="primary" style={{marginLeft: "auto"}} onClick={fullscreen}>全屏显示</Button>}
          </ChartItem>
         
        </div>
      </Pagecount>
    </Spin>
  )
}