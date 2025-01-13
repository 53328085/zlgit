import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectcurlRommid, adaptation } from "@redux/systemconfig";
import Pagecount from '@com/pagecontent'
import { Select, message, Spin, Card, Button, DatePicker  } from 'antd'
import { useReactive } from "ahooks";
import { useNavigate } from 'react-router-dom'
import { DistributionRoomRuntime, Monitoring, RuntimeHMI } from '@api/api.js'
import styled, { css } from 'styled-components';
import { Topology } from "@topology/core/src/core";
import { register as registerFlow } from '@topology/flow-diagram'
import { Cspin } from '@com/comstyled'
import mqtt from 'mqtt'
import moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
import { drawEcharts } from "@com/useEcharts"
import style from './style.module.less'
import CustModal from '@com/useModal'

//子栏目
import DialogContent from './DialogContent'


// 左侧工具栏图标
import '../../../assets/css/fonts/font/iconfont.css'
import '../../../assets/css/font_2073009_u56zfo0voi/iconfont.css'
import '../../../assets/css/font_2395018_pl6jy69tbjr/iconfont.css'
import '../../../assets/css/font_4xgdsyqu0mh/iconfont.css'
import '../../../assets/css/font_99x1os11gqi/iconfont.css'
import '../../../assets/css/font_c44gejdj174/iconfont.css'
import '../../../assets/css/font_ehfbe2lg8tb/iconfont.css'
import '../../../assets/css/font_ugr1luq01xe/iconfont.css'
import '../../../assets/css/font_nilhyhwpjm9/iconfont.css'
// 右侧图形库图标
import '../../../assets/css/fonts/font/libs/iconfont.css'
import '../../../assets/css/font_g4v09lxfde/iconfont.css'
import '../../../assets/css/font_bz4csze2alg/iconfont.css'

const { Option } = Select;
import { CustButton } from '@com/useButton'
const sty = css`
 padding: 0 16px;
`
export default function Index() {
  const { RangePicker } = DatePicker;
  const ChartItem = styled.div`
    position: absolute;
    
    top: 32px;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 64px;
    gap: 16px;
    flex-wrap: wrap;
    align-content: flex-start;
    ${props => props.laptop ? sty : null}
  
  `

  const { hostServer } = useSelector((state) => state.user);
  const { laptop } = useSelector(adaptation)
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


  const now = new Date();
  const year = now.getFullYear();
  const month = ('0' + (now.getMonth() + 1)).slice(-2);
  const day = ('0' + now.getDate()).slice(-2);
  const hours = ('0' + now.getHours()).slice(-2);
  const minutes = ('0' + now.getMinutes()).slice(-2);
  const seconds = ('0' + now.getSeconds()).slice(-2);

  const defaultStartTime = `${year}-${month}-${day} 00:00:00`
  const defaultEndTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  const state = useReactive({
    spining: false,
    chartList: [],
    activeChart: 0,
    getGuid: '',
    client: {},
    timer: null,
    detailTitle: '',
    pointDetailTitle: '',
    activeTab: 'current',
    selectedSn: '',
    selectedPoint: '',
    startTime: '',
    endTime: '',
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
            getHeart(HMIDevices);
          } else {
            console.log("订阅失败");
          }
        }
      )
    })
    // 接收消息处理
    state.client.on("message", (topic, message) => {
      console.log('接所消息')
      let mqttData = JSON.parse(message.toString());

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

    /*  setTimeout(() => {
        getHeart(HMIDevices);
      }, 100); */
  }

  const getHeart = (devices) => {
    //  console.log(devices)
    let params = {
      projectId: projectId,
      channel: state.getGuid,
      devices
    }
    RuntimeHMI.onHerart(params).then(res => {
      if (res.success) {
        state.timer = setTimeout(() => {
          getHeart(devices)
        }, 120000)
      } else {
        message.error(res.errMsg)
      }
    }).catch(e => {
      console.log(e)
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
    if (event == 'line' || event == 'space' || event == 'multi') {
      setNodeTag(false)
    }
    if (event == 'nodeRightClick') {
      if (isf) {
        return;
      }
      if ((data.name == "text" || data.name == "rectangle") && data.tags.length == 3) {
        setContextMenu({
          left: isf ? (data.evs.x + 'px') : (data.evs.x - 210 + 'px'),
          top: isf ? (data.evs.y + 'px') : (data.evs.y - 126 + 'px')
        })
        setNodeTag(true)
        setSelectedNode(data)
        setNodeType('测点详情')
      } else if (data.name == 'image' && data.tags.length == 3) {
        setContextMenu({
          left: isf ? (data.evs.x + 'px') : (data.evs.x - 210 + 'px'),
          top: isf ? (data.evs.y + 'px') : (data.evs.y - 126 + 'px')
        })
        setNodeTag(true)
        setSelectedNode(data)
        setNodeType('设备详情')
      }
    } else if (event == 'dblclick') {
      let { tags } = data
      if (!Array.isArray(tags) || tags.length < 1) return
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
  const [isf, setIsf] = useState(false)
  const fullscreen = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isf) {
      setIsf(false)
      document.exitFullscreen();
      setTimeout(() => {
        newCanvas.fitView(16)
      }, 100)
    } else {
      setIsf(true)
      mapref.current.requestFullscreen()
      setTimeout(() => {
        newCanvas.fitView(16)
      }, 100)
    }
  }

  //详情dialog
  const detailRef = useRef()
  const pointDetailRef = useRef()
  const showDetails = () => {
    setNodeTag(false)
    if (selectedNode.tags[1]) {
      state.pointDetailTitle = nodeType + '--' + selectedNode.tags[0] + '--' + selectedNode.tags[1]
      state.selectedSn = selectedNode.tags[0]
      state.selectedPoint = selectedNode.tags[1]
      state.startTime = `${year}-${month}-${day} 00:00:00`
      state.endTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      pointDetailRef.current.onOpen()
      onSearch()
    } else {
      state.detailTitle = nodeType + '--' + selectedNode.tags[0]
      state.selectedSn = selectedNode.tags[0]
      state.selectedPoint = ''
      state.activeTab = 'current'
      detailRef.current.onOpen()
    }

  }

  const onPointCancel = () => {
    pointDetailRef.current.onCancel()
  }

  const onCancel = () => {

    detailRef.current.onCancel()
  }

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  const analysisRef = useRef()
  const changeDate = (date, dateString) => {
    state.startTime = dateString[0]
    state.endTime = dateString[1]
  }

  const onSearch = () => {
    if (state.startTime == '' || state.endTime == '') {
      message.error('请选择完整日期!');
      return;
    }
    if (state.selectedPoint == '') {
      message.error('请选择测点！')
      return;
    }
    let params = {
      ProjectId: projectId,
      SN: state.selectedSn,
      Point: state.selectedPoint,
      Start: state.startTime,
      End: state.endTime,
    }

    Monitoring.RuntimeDevice.HistoryPointTrend(params).then(res => {
      if (res.success) {
        if (res.data) {
          // state.chartTitle = res.data.description + '(' + res.data.unit + ')'
          if (res.data.data && Array.isArray(res.data.data)) {
            setTimeout(() => { drawEchartsData(res.data.data, res.data.sn) }, 100)
          }
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }

  const drawEchartsData = (data, point) => {
    let dimensions = ['time', point]
    let source = []
    data.map((item, index) => {
      let value = {}
      value['time'] = item.x
      value[point] = item.y
      source.push(value)
    })

    let dataset = {
      dimensions,
      source
    }
    drawEcharts(analysisRef.current, {
      dataset: dataset,
      series: [{
        type: "line", areaStyle: null, showSymbol: true, symbol: 'none'
      },],
      grid: {
        top: '30px',
        left: 0,
        right: 0,
        bottom: '30px',
        containLabel: true,
      },
      legend: {
        top: 0,
        right: 16,
        icon: 'rect', //rect
        itemHeight: 2,
        itemWidth: 24,
        itemGap: 30,
      }
    })
  }


  useEffect(() => {
    return () => {
      (typeof state?.client?.end == "function") && state?.client?.end();
    }
  }, [])

  return (
    <Cspin spinning={state.spining} tip="Loading...">
      <div className={style.topology} style={{ backgroundColor: "#eeeff3", flex: 1, display: 'flex' }}>
        <div id="topology-canvas" style={{ position: 'relative', flex: 1, backgroundColor: '#fff' }} onContextMenu={e => onContextMenu(e)} ref={mapref}>
          <ChartItem laptop={laptop}>

            {state.chartList.map((item, index) => {
              return <CustButton ghost={state.activeChart == item.id ? false : true} wh="112px" style={{ borderColor: "#fff" }} key={index} onClick={() => changeChart(item.id)}>{item.name}</CustButton>
            })}

            {(state.chartList?.length > 0) && <CustButton style={{ marginLeft: "auto" }} onClick={fullscreen}>{isf ? '退出全屏' : '全屏显示'}</CustButton>}
          </ChartItem>

          {(nodeTag) ? <Card style={{ width: 120, position: 'absolute', ...contextmenu }} >
            <div className="bindMenu" onClick={() => showDetails()}>{nodeType}</div>
          </Card> : null}

        </div>
      </div>

      <CustModal title={state.detailTitle} ref={detailRef} mold="cust" width={1100} footer={[<Button onClick={onCancel} key="cancel">关闭</Button>]}>
        <DialogContent projectId={projectId} sn={state.selectedSn}></DialogContent>

      </CustModal>
      <CustModal title={state.pointDetailTitle} ref={pointDetailRef} mold="cust" width={1200} footer={[<Button onClick={onPointCancel} key="cancel">关闭</Button>]}>
        <div className={style.dialogContent}>
          <div className={style.tabContent} style={{ borderTopLeftRadius: '4px' }}>
            <div className={style.warningContent}>
              <div className={style.warnHeader}>
                <RangePicker showTime defaultValue={[moment().startOf('day'), moment()]} format={dateFormat} onChange={changeDate}></RangePicker>

                <Button style={{ marginLeft: 16, width: 96, height: 32 }} type="primary" onClick={onSearch} icon={<SearchOutlined />}>查询</Button>
              </div>
              <div className={style.chartBox}>
                <div>{state.chartTitle}</div>
                <div style={{ width: "1100px", height: '500px' }} ref={analysisRef}></div>
              </div>
            </div>
          </div>
        </div>
      </CustModal>
    </Cspin>
  )
}