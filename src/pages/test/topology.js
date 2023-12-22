import React, { useEffect, useRef, useState } from 'react'
 
import {Button, Space} from 'antd'
import mqtt from 'mqtt'
import { useSelector, useDispatch } from 'react-redux'
import { selectcurlRommid, selectProjectId } from "@redux/systemconfig";
 
import { Topology } from "@topology/core/src/core";
import { register as registerFlow } from '@topology/flow-diagram'
import { DistributionRoomRuntime, distributionRoom, RuntimeHMI } from '@api/api.js'
import { useReactive } from "ahooks"; 
 
export default function Index() {
  const projectId = useSelector(selectProjectId)
  const roomId = useSelector(selectcurlRommid)
  const [newCanvas, setNewCanvas] = useState()
  const state = useReactive({
    spining: false,
    chartList: [],
    activeChart: 0,
    getGuid: '',
    client: {},
    timer:null,
  })
  const canvasOptions = {
    width: 800,
    height: 800,
    color: "#ff0000",
    fontSize: 16,
  };
  const {hostServer} = useSelector(state => state.user)

  const option = {
    clientId:   "HMI_" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
    username: '',
    password: ''
  }
  const client = mqtt.connect(hostServer, option) // 创建客户端实例
 
  const getMqtt = () => {
    client.on("connect", e => { // 创建连接
     
      client.subscribe("HMI", {qos: 1}, (error, granted) => { 
        console.log(granted)
        console.log(error)
        if(error) {
          console.log("订阅失败")



        }else {
          console.log("订阅成功")
        }
      })
    })
    client.on("error", e => {
      console.log(e)
    })
    client.on('message', (topic, message) => {
      console.log("接受数据")
      console.log(message.toString())
    })
    client.on("reconnect", (error) => {
      console.log(error)
    })
    setTimeout(() => {
      getMqtt()
    }, 5000)
  }
  const onMessage = (event, data) => {

      /*   if(event == 'node') {
           console.log(data)
        }else if(event == "dblclick") {
          console.log(data)
        } */
     //  console.log(event)
   //    console.log(data)
    /* if (event == 'nodeRightClick') {
       
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
    } */
  }
  const getChartList = async () => {
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
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  const guid = () => {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }
  let canvas
  const getChartDetail = async (id) => {
    clearTimeout(state.timer)
    state.spining = true
    state.getGuid = guid()
    registerFlow()
    canvasOptions.on = onMessage
    canvas = new Topology('topology-canvas', canvasOptions) // 创建画布
    canvas.render() // 重绘
    setNewCanvas(canvas)
    const res = await DistributionRoomRuntime.ChartDetails(projectId, id)
    if (res.success) {
      let dateGroup = JSON.parse(res.data.dataGroup)
      console.log(dateGroup)
      dateGroup.locked = 0//锁定
      dateGroup.fontColor = "#fff"
      dateGroup.bkImage =  `url(${bg})`
    //  dateGroup.bkColor='rgba(0,0,0,0.6)' 背景颜色
    //  dateGroup.grid = true   网格
    //  dateGroup.gridColor = "#fff" 网格颜色
    //  dateGroup.gridSize = 32 网格大小
      dateGroup.rule = true;
      dateGroup.ruleColor = "#fff"
      setTimeout(() => {
        state.spining = false
        canvas.open(dateGroup) //渲染图形
        canvas.render()
        canvas.fitView(16);
      //  getMqtt()
      }, 1000)
    } else {
      setTimeout(() => {
        state.spining = false
        canvas.open({})
        canvas.render()
      }, 1000)
    // message.error(res.errMsg)
    }
  }
 

 useEffect(() => {
  getChartList();

 }, [roomId])

  const save =() => {
    let filename = (newCanvas.data.name || '未命名配电图') + ".png"
    newCanvas.saveAsImage(filename)
  }

  useEffect(() => {
    const subcribe = (e) => {
      console.log(e);
    }
    window.topology?.on("scale", subcribe)
    window.topology?.on("click", subcribe)
    window.topology?.on("mqtt", subcribe)
    return () => {
      
    }
   /*  canvas.ondrop(e) {
      console.log(e);
    } */
    // getMqtt();
   // newCanvas.saveAsImage(filename)
  }, [newCanvas, canvas])
   const callbk =(e) => {
     console.log(e)
   }
  const getValue = () => {
    let text = newCanvas.getValue("e5f8b8f", "text");
    console.log(text);
  }
  const setValue = () => {
    newCanvas.setValue("e5f8b8f", "正泰物联技术有限公司");
  }
  const showInput = () => {
    newCanvas.fitView(16)
    let center = newCanvas.getViewCenter();
    newCanvas.setIconColor("#ff7313");
   // newCanvas.showInput("e5f8b8f")
    let data = newCanvas.pureData()
    console.log(data)
  }
  return (
    <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
         <div style={{height: "100px"}}>
            <Space>
               <Button onClick={() => newCanvas.toImage(10, callbk)}>保存图片</Button>
               <Button onClick={() => newCanvas.undo()}>撤销</Button>
               <Button onClick={() => newCanvas.redo()}>重做</Button>
               <Button onClick={() => newCanvas.delete()}>删除</Button>
               <Button onClick={() => newCanvas.cut()}>剪切</Button>
               <Button onClick={() => newCanvas.copy()}>复制</Button>
               <Button onClick={() => newCanvas.paste()}>粘贴</Button>
               <Button onClick={() => newCanvas.scale(1.2)}>放大</Button>
               <Button onClick={() => newCanvas.scale(0.8)}>缩小</Button>
               <Button onClick={getValue}>获取值</Button>
               <Button onClick={setValue}>设置值</Button>
               <Button onClick={showInput}>自适应大小</Button>
            </Space>
         </div>
        <div id="topology-canvas" style={{flex: 1}}></div>
    </div>
  )
}
