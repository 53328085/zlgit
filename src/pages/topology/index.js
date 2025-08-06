import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import style from './style.module.less'
import { Topology } from "@topology/core/src/core";
import { register as registerFlow } from '@topology/flow-diagram'
import { Collapse, Switch, Form, Input, Select, Space, InputNumber, Card, Dropdown, message, Spin, Typography } from "antd";
import { basic, flows, sgcc, ltdx, normal } from "../../assets/js/Menu";
import CustModal from '@com/useModal'
import { selectProjectId, mixtitle ,currProject} from '@redux/systemconfig.js'
import { useSelector } from 'react-redux'
import {useSearchParams, useLocation} from 'react-router-dom'
import logo from './topologyLogo.png'

 
// 左侧工具栏图标
import '../../assets/css/fonts/font/iconfont.css'
import '../../assets/css/font_2073009_u56zfo0voi/iconfont.css'
import '../../assets/css/font_2395018_pl6jy69tbjr/iconfont.css'
import '../../assets/css/font_4xgdsyqu0mh/iconfont.css'
import '../../assets/css/font_99x1os11gqi/iconfont.css'
import '../../assets/css/font_c44gejdj174/iconfont.css'
import '../../assets/css/font_ehfbe2lg8tb/iconfont.css'
import '../../assets/css/font_ugr1luq01xe/iconfont.css'
import '../../assets/css/font_nilhyhwpjm9/iconfont.css'
import '../../assets/css/font_4zc0wpi01ae/iconfont.css'
import '../../assets/css/font_11h2uuxmplr/iconfont.css'
// 右侧图形库图标
import '../../assets/css/fonts/font/libs/iconfont.css'
import '../../assets/css/font_g4v09lxfde/iconfont.css'
import '../../assets/css/font_bz4csze2alg/iconfont.css'

import FileSaver from 'file-saver'

import { distributionRoom, DistributionRoomRuntime } from '@api/api.js'
import { useReactive } from "ahooks";
const {Text} = Typography

const Custoptionbg = styled.div`
  display: grid;
  //width: 480px;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 16px; 
  padding: 0 4px;
  background-color: ${props => props.theme.primaryColor};
  color: #fff;

`
export default function index() {
  let location = useLocation()
  const {projectName,  logoImage  } = useSelector(currProject)
  const { TextArea } = Input;
  const [form] = Form.useForm()
  const [nodeForm] = Form.useForm()
  const [lineForm] = Form.useForm()
  const [nameForm] = Form.useForm()
  const [bindForm] = Form.useForm()
  const Item = Form.Item
  const projectId = useSelector(selectProjectId);
  const cnmixtitle = useSelector(mixtitle)
  const { addChart, queryChart, updateChart, getEquipmentList } = distributionRoom
  const { ChartDetails } = DistributionRoomRuntime

  const nameRef = useRef()
  const bindRef = useRef()
  let canvas
  const [newCanvas, setNewCanvas] = useState()
  const canvasOptions = {}
  const lineNames = ['curve', 'polyline', 'line']
  const arrowTypes = ['', 'triangleSolid', 'triangle', 'diamondSolid', 'diamond', 'circleSolid', 'circle', 'line', 'lineUp', 'lineDown']

  const getUrlParams = url => {
    let urlStr = url.split('?')[1]
    // 创建空对象存储参数
    let obj = {};
    // 再通过 & 将每一个参数单独分割出来
    let paramsArr = urlStr.split('&')
    for (let i = 0, len = paramsArr.length; i < len; i++) {
      // 再通过 = 将每一个参数分割为 key:value 的形式
      let arr = paramsArr[i].split('=')
      obj[arr[0]] = arr[1];
    }
    return obj
  }

  const getData = getUrlParams(window.location.href)
  
  let [searchParams] = useSearchParams()
  const type = searchParams.get('type')  

  const state = useReactive({
    title: '',
    chartData: {},
    deviceList:[],
    pointList:[],
    spining:false,
  })
  const changeDevice = val => {
    bindForm.setFieldValue('pointId', null)
    state.deviceList.map(item => {
      if(item.sn == val){
        state.pointList = item.points
      }
    })
  }
  const getDeviceList = (projectId, areaId) => {
    
    if(!projectId) return message.warning("缺少项目ID")
    if(!areaId && areaId !='0') return message.warning("缺少园区Id")
    getEquipmentList(projectId, areaId).then(res => {
      if(res.success && res.data){
        state.deviceList = res.data
      }else{
        state.deviceList = []
       // message.error(res.errMsg)
      }
    }).catch()
  }
  useEffect(() => {
    document.title = cnmixtitle+ ' ' + (location.state?.title || '')
    return () => document.title = cnmixtitle
  },[location])
  useEffect(() => {
    registerFlow()
    canvasOptions.on = onMessage
    canvas = new Topology('topology-canvas', canvasOptions)
    canvas.render()
    setNewCanvas(canvas)
    getDeviceList(getData.projectId, getData.areaId)
    if (getData.type == 'edit') {
      state.spining = true
      ChartDetails(projectId, getData.id).then(res => {
        if (res.success) {
          let data = {
            id: res.data.id,
            name: res.data.name,
            roomId: res.data.roomId,
            remark: res.data.remark
          }
          state.chartData = data
          console.log(state.chartData)
          let dateGroup = JSON.parse(res.data.dataGroup)

          console.log(dateGroup)
          canvas.data.grid = dateGroup.grid
          canvas.data.gridColor = dateGroup.gridColor ? dateGroup.gridColor : null
          canvas.data.bkColor = dateGroup.bkColor ? dateGroup.bkColor : null
          canvas.data.locked = dateGroup.locked == 1 ? true : false
          console.log(canvas.data)
          form.setFieldsValue(canvas.data)
          setTimeout(()=> {
            state.spining = false
            canvas.open(dateGroup)
            canvas.render()
            canvas.fitView(16);
          }, 1000)
        } else {
          message.error(res.errMsg)
        }
      })
    }
  }, [])

  const { Panel } = Collapse;
  const Tools = [
    {
      group: '常用元器件',
      children: normal
    },
    {
      group: '基本形状',
      children: basic
    },
    {
      group: '流程图',
      children: flows
    },
    {
      group: '国家电网图元规范',
      children: sgcc
    },
    {
      group: '电气工程常用字母和符号',
      children: ltdx
    }
  ]
  const [props, setProps] = useState({
    node: null, // 节点
    line: null, // 连线
    nodes: null,
    multi: false, // 多个对象
    expand: false,
    locked: false
  })
  const [contextmenu, setContextMenu] = useState({
    left: null,
    top: null,
    bottom: null
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
  const onDrag = (event, node) => {
    // 解决浏览器手势插件命名冲突
    event.dataTransfer.setData('Topology', JSON.stringify(node.data))
  }
  const onContextMenu = (event) => {
    event.preventDefault()
    event.stopPropagation()
    console.log(event)
    // if (event.clientY + 360 < document.body.clientHeight) {
    //   setContextMenu({
    //     left: event.clientX - 210 + 'px',
    //     top: event.clientY - 62 + 'px'
    //   })
    // } else {
    //   setContextMenu({
    //     left: event.clientX -210 + 'px',
    //     bottom: document.body.clientHeight - event.clientY + 'px'
    //   })
    // }
  }
  const [nodeTag, setNodeTag] = useState(false)
  const [nodeType, setNodeType] = useState('设备绑定')
  const [selectedNode, setSelectedNode] = useState()
  const onMessage = (event, data) => {
    console.log(event, data)
    //  console.log(Tools)
    if (event == 'nodeRightClick') {
      console.log(data)
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
    if (event == 'line' || event == 'space' || event == 'multi') {
      setNodeTag(false)
    }
    // 右侧输入框编辑状态时点击编辑区域其他元素，onMessage执行后才执行onUpdateProps方法，通过setTimeout让onUpdateProps先执行
    setTimeout(() => {
      switch (event) {
        case 'node':
          // if(data.icon == ''){
          //   data.icon = ""
          // }else if(data.icon == ""){
          //   data.icon = ''
          // }
          // break
        case 'addNode':
          nodeForm.resetFields()
          // console.log(data)
          setProps({
            node: data,
            line: null,
            multi: false,
            expand: props.expand,
            nodes: null,
            locked: TopologyData.locked
          })
          nodeForm.setFieldsValue(data)
          if(data.fontColor && data.fontColor.length > 0){
            nodeForm.setFieldValue('fontColor', data.fontColor.slice(0, 7))
          }
          // newCanvas.setValue({ id: data.id, text: 'new text' });//赋值
          break
        case 'line':
          // lineForm.resetFields()
          data.fromArrowColor = data.fromArrowColor ? data.fromArrowColor : form.getFieldValue('lineColor')
          data.toArrowColor = data.toArrowColor ? data.toArrowColor : form.getFieldValue('lineColor')
          data.strokeStyle = data.strokeStyle ? data.strokeStyle : form.getFieldValue('lineColor')
          setProps({
            node: null,
            line: data,
            multi: false,
            nodes: null,
            locked: TopologyData.locked
          })
          lineForm.setFieldsValue(data)
          break
        case 'addLine':
          // lineForm.resetFields()
          data.fromArrowColor = form.getFieldValue('lineColor')
          data.toArrowColor = form.getFieldValue('lineColor')
          data.strokeStyle = form.getFieldValue('lineColor')
          setProps({
            node: null,
            line: data,
            multi: false,
            nodes: null,
            locked: TopologyData.locked
          })
          lineForm.setFieldsValue(data)
          break
        case 'multi':
          setProps({
            node: null,
            line: null,
            multi: true,
            nodes: data.length > 1 ? data : null,
            locked: getLocked({ nodes: data })
          })
          break
        case 'space':
          setProps({
            node: null,
            line: null,
            multi: false,
            nodes: null,
            locked: TopologyData.locked
          })
          break
        case 'moveOut':
          break
        case 'moveNodes':
        case 'resizeNodes':
          if (data.length > 1) {
            setProps({
              node: null,
              line: null,
              multi: true,
              nodes: data,
              locked: getLocked({ nodes: data })
            })
          } else {
            setProps({
              node: data[0],
              line: null,
              multi: false,
              nodes: null,
              locked: TopologyData.locked
            })
          }
          break
        case 'resize':
        case 'scale':
        case 'locked':
          if (canvas && canvas.data) {
            setCanvasData({
              scale: canvas.data.scale || 1, // 当前图文缩放比例： 0 - 1
              lineName: canvas.data.lineName, // 当前图文默认连线类型
              fromArrowType: canvas.data.fromArrowType, // 默认连线起点箭头
              toArrowType: canvas.data.toArrowType, // 连线终点默认箭头
              fromArrowlockedType: canvas.data.locked // 0-未锁定，可任意编辑，1-只读模式，允许选中，2-禁止鼠标交互，无法做任何操作。纯静态画面模式
            })
          }
          break
      }
    }, 0)
  }

  const getLocked = (data) => {
    let locked = true
    if (data.nodes && data.nodes.length) {
      for (const item of data.nodes) {
        if (!item.locked) {
          locked = false
          break
        }
      }
    }
    if (locked && data.lines) {
      for (const item of data.lines) {
        if (!item.locked) {
          locked = false
          break
        }
      }
    }
    return locked
  }

  const onSwitchChange = val => {
    setTopologyData(form.getFieldsValue(true))
    newCanvas.data.grid = val
    newCanvas.render()
  }

  const onLockChange = (e) => {
    setTopologyData(form.getFieldsValue(true))
    newCanvas.lock(e ? 1 : 0)
    newCanvas.render()
  }

  const onChangebkColor = colorObj => {
    setTopologyData(form.getFieldsValue(true))
    newCanvas.data.bkColor = form.getFieldValue('bkColor')
    newCanvas.render()
  }

  const onChangeGridColor = colorObj => {
    setTopologyData(form.getFieldsValue(true))
    newCanvas.data.gridColor = form.getFieldValue('gridColor')
    newCanvas.render()
  }
  const onChangeLineColor = colorObj => {
    setTopologyData(form.getFieldsValue(true))
    newCanvas.data.lineColor = form.getFieldValue('lineColor')
    newCanvas.render()
  }

  const onChangeLineType = val => {
    newCanvas.data.lineName = val
    newCanvas.render()
  }

  const onChangeFromArrow = val => {
    newCanvas.data.fromArrow = val
    newCanvas.render()
  }

  const onChangeToArrow = val => {
    newCanvas.data.toArrow = val
    newCanvas.render()
  }
  const onUpdateProps = node => {
    // console.log(node)
    newCanvas.updateProps(node)
  }
  const onChangeDash = val => {
    // props.node.dash = nodeForm.getFieldValue('dash')
    let obj = nodeForm.getFieldsValue(true)
    console.log(obj)
    console.log(props.node)
    for (const key in obj) {
      if (Array.isArray(obj[key])) { } else if (typeof obj[key] === 'object') {
        for (const k in obj[key]) {
          props.node[key][k] = obj[key][k]
        }
      } else {
        props.node[key] = obj[key]
      }
    }
    onUpdateProps(props.node)
  }

  const onChangeLine = val => {
    let obj = lineForm.getFieldsValue(true)
    for (const key in obj) {
      if (Array.isArray(obj[key])) { } else if (typeof obj[key] === 'object') {
        for (const k in obj[key]) {
          props.line[key][k] = obj[key][k]
        }
      } else {
        props.line[key] = obj[key]
      }
    }
    onUpdateProps(props.line)
  }

  const menuItems = [
    {
      key: '1',
      label: (
        <div onClick={() => importJson()}>导入json文件</div>
      )
    }, {
      key: '2',
      label: (
        <div onClick={() => exportJson()}>导出json文件</div>
      )
    }, {
      key: '3',
      label: (
        <div onClick={() => handleMenuClick()}>导出png图片</div>
      )
    }
  ]

  const handleMenuClick = () => {
    let fileName = (newCanvas.data.name || '未命名配电图') + '.png'
    newCanvas.saveAsImage(fileName)
  }

  const importJson = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = event => {
      const elem = event.srcElement || event.target;
      if (elem.files && elem.files[0]) {
        const reader = new FileReader()
        reader.readAsText(elem.files[0])
        reader.onload = e => {
          const text = e.target.result + ''
          try {
            const data = JSON.parse(text)
            newCanvas.data.grid = data.grid
            newCanvas.data.gridColor = data.gridColor
            newCanvas.data.bkColor = data.bkColor
            newCanvas.data.locked = data.locked == 1 ? true : false
            form.setFieldsValue(newCanvas.data)
            newCanvas.open(data)
            setTimeout(() => { newCanvas.render() }, 0)
          } catch (e) { }
        }
      }
    }
    input.click();
  }

  const exportJson = () => {
    let fileName = (newCanvas.data.name || '未命名配电图') + '.json'
    FileSaver.saveAs(
      new Blob([JSON.stringify(newCanvas.data)], { type: 'text/plain;charset=utf-8' }),
      fileName
    )
  }


  const saveCanvas = e => {
    e.preventDefault()
    if (getData.type == 'add') {
      state.title = '新增配电图'
      nameForm.resetFields()
    } else {
      state.title = '编辑配电图'
      nameForm.setFieldValue('name', state.chartData.name)
      nameForm.setFieldValue('remark', state.chartData.remark)
    }
    nameRef.current.onOpen()
  }

  const onOk = async () => { 
    const values = await nameForm.validateFields()  
    newCanvas.data.name = nameForm.getFieldValue('name')
    newCanvas.data.grid = form.getFieldValue('grid')
    newCanvas.data.gridColor = form.getFieldValue('gridColor')
    newCanvas.data.bkColor = form.getFieldValue('bkColor')
    newCanvas.data.locked = form.getFieldValue('locked')  == true ? 1 : 0
   
    if(!projectId) return message.warning("缺少项目Id")
    if (getData.type == 'add') {
      if(!getData.roomId) return message.warning("缺少配电房Id")
      let param = {
        projectId,
        roomId: getData.roomId,
        name: values.name,
        remark: values.remark,
        dataGroup: JSON.stringify(newCanvas.data)
      }
      addChart(param).then(res => {
        if (res.success) {
          nameRef.current.onCancel()
          message.success('配电图保存成功!')
          getData.type = 'edit'
        } else {
          message.error(res.errMsg)
        }
      }).catch()
    } else {
      if(!state?.chartData?.roomId) return message.warning("缺少配电房Id")
      let param = {
        id: state.chartData.id,
        projectId,
        roomId: state.chartData.roomId,
        name: values.name,
        remark: values.remark,
        dataGroup: JSON.stringify(newCanvas.data)
      }
      updateChart(param).then(res => {
        if (res.success) {
            nameRef.current.onCancel()
            message.success('配电图编辑成功!')
        } else {
          message.error(res.errMsg)
        }
      }).catch()
    }

  }
  let issuccess = useRef(false)
  const autosave = () => {
    let name = state.chartData.name
    let remark = state.chartData.remark
    newCanvas.data.name = name
    newCanvas.data.grid = form.getFieldValue('grid')
    newCanvas.data.gridColor = form.getFieldValue('gridColor')
    newCanvas.data.bkColor = form.getFieldValue('bkColor')
    newCanvas.data.locked = form.getFieldValue('locked')  == true ? 1 : 0
    let param = {
      id: state.chartData.id,
      projectId,
      roomId: state.chartData.roomId,
      name,
      remark,
      dataGroup: JSON.stringify(newCanvas.data)
    }
    updateChart(param).then(res => {
       let {success, errMsg} = res || {}
      if (!success) {
          message.warning(errMsg || '数据保存出错')
      }else {
        issuccess.current = true
      }  
    }).catch()

  }
  const step = 5*60*1000; // 每隔五分钟保存一次
  useEffect(() => {
    if(!newCanvas) return
     let timeid;
        if(type === 'edit') {
          timeid = setInterval(() => {
           autosave();
          }, step)
        }
    
     return () => {
       clearInterval(timeid)
     }
  }, [type, newCanvas])
  const bindData = () => {
    setNodeTag(false)
    bindForm.resetFields()
    // let penArr = newCanvas.data.pens
    // for (let i = 0; i < penArr.length; i++) {
    //   if (penArr[i].tags.length > 1) {
    //     newCanvas.data.pens[i].tags.length = 0
    //   }
    // }
    if(selectedNode.tags.length > 1){
      bindForm.setFieldValue('deviceId', selectedNode.tags[0])
      bindForm.setFieldValue('pointId', selectedNode.tags[1])
    }else {
      bindForm.setFieldValue('deviceId', null)
      bindForm.setFieldValue('pointId', null)
    }
    bindRef.current.onOpen()
  }
  const unBindData = () => {
    selectedNode.tags.length = 0
    message.success('测点解绑成功！')
    setNodeTag(false)
  }
  const changeCoverage = val => {
    switch (val){
      case "top":
        newCanvas.top(selectedNode)
        break
      case "bottom":
        newCanvas.bottom(selectedNode)
        break
      case "up":
        newCanvas.up(selectedNode)
        break
      case "down":
        newCanvas.down(selectedNode)
        break
    }
    newCanvas.render()
    setNodeTag(false)
  }


  const onbindOk = async () => {
    const values = await bindForm.validateFields()
    selectedNode.tags[0] = values.deviceId
    selectedNode.tags[1] = values.pointId
    selectedNode.tags[2] = values.deviceId + '_' + values.pointId
    message.success('测点绑定成功！')
    bindRef.current.onCancel()
  }
  const onSearch = (value) => {
    console.log(value)
  }
 
  return (
    <Spin spinning={state.spining} tip="Loading...">
      <div className={style.header}>
       {logoImage ? <img className={style.logo} src={logoImage}></img> : null}  
        <span className={style.headerTitle}>{cnmixtitle}</span>
      </div>
      <div className={style.titleMenu}>
        <Dropdown menu={{ items: menuItems }} overlayStyle={{ width: 120 }}>
          <a onClick={e => e.preventDefault()} className={style.menu}>
            <div className={style.icon}>
              <i className="icon-wenjian iconfont"></i>
              <i className="icon-xiajiantou iconfont" style={{ position: 'absolute' }}></i>
            </div>
            <div>文件</div>
          </a>
        </Dropdown>
        <a onClick={e => saveCanvas(e)} className={style.menu}>
          <div className={style.icon}>
            <i className="icon-baocun iconfont"></i>
          </div>
          <div>保存</div>
        </a>
      </div>
      <div className={style.topology}>
        <div className={style.tools}>
          <Collapse defaultActiveKey={[1]} expandIconPosition={'end'}>
            {Tools.map((item, index) => {
              return <Panel header={item.group} key={index + 1}>
                <div className={style.buttons}>
                  {item.children.map((value, val) => {
                    return <a title={value.name} draggable={true} onDragStart={e => onDrag(e, value)} key={val}>
                      {(value.icon.indexOf('sgcc') != - 1 || value.icon.indexOf('ltdx') != -1) ? <i className={value.icon}></i> : <i className={`iconfont ${value.icon}`}></i>}
                    </a>
                  })}
                </div>
              </Panel>
            })}
          </Collapse>
        </div>
        <div id="topology-canvas" className={`full ${TopologyData.grid ? 'canvas-container' : ''}`} onContextMenu={e => onContextMenu(e)} style={{ position: 'relative' }}>
          {(nodeTag) ? <Card style={{ width: 120, height: 236, position: 'absolute', ...contextmenu }} >
            <div className="bindMenu" onClick={() => bindData()}>{nodeType}</div>
            <div className="bindMenu" onClick={() => unBindData()}>解除绑定</div>
            <div className="bindMenu" onClick={()=> changeCoverage('top')}>置顶</div>
            <div className="bindMenu" onClick={()=> changeCoverage('bottom')}>置底</div>
            <div className="bindMenu" onClick={()=> changeCoverage('up')}>上一图层</div>
            <div className="bindMenu" onClick={()=> changeCoverage('down')}>下一图层</div>
          </Card> : null}
        </div>
        <div className={style.props}>
          {/* 选中画布 */}
          {(TopologyData.locked || (!props.node && !props.line && !props.multi)) ? <div>
            <div className={style.title}>图文设置</div>
            <div className={style.settings}>
              <Form form={form} name='form' requiredMark={false} labelAlign='left' labelCol={{ span: 10 }}>
                <Item label='背景网格' name='grid' valuePropName="checked" initialValue={false}>
                  <Switch size="small" onChange={onSwitchChange}></Switch>
                </Item>
                <Item label='画布锁定' name='locked' valuePropName="checked" initialValue={false}>
                  <Switch size="small" onChange={onLockChange}></Switch>
                </Item>
                <Item label='背景颜色' name='bkColor' initialValue={'#ffffff'}>
                  <Input type='color' style={{ width: 32, height: 32, padding: 0 }} onChange={onChangebkColor}></Input>
                </Item>
                <Item label='网格颜色' name='gridColor' initialValue={'#f2f2f2'}>
                  <Input type='color' style={{ width: 32, height: 32, padding: 0 }} onChange={onChangeGridColor}></Input>
                </Item>
                <Item label='默认连线颜色' name='lineColor' initialValue={'#222222'}>
                  <Input type='color' style={{ width: 32, height: 32, padding: 0 }} onChange={onChangeLineColor}></Input>
                </Item>
                <Item label='默认连线类型' name='lineName' initialValue={'curve'}>
                  <Select style={{ width: 120 }} onChange={onChangeLineType}>
                    {lineNames.map((item, index) => {
                      return <Select.Option key={index} value={item}><i className={`iconfont icon-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                    })}
                  </Select>
                </Item>
                <Item label='默认起点箭头' name='fromArrow' initialValue={""}>
                  <Select style={{ width: 120 }} onChange={onChangeFromArrow}>
                    {arrowTypes.map((item, index) => {
                      return <Select.Option key={index} value={item}><i className={`iconfont icon-from-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                    })}
                  </Select>
                </Item>
                <Item label='默认终点箭头' name='toArrow' initialValue={"triangleSolid"}>
                  <Select style={{ width: 120 }} onChange={onChangeToArrow}>
                    {arrowTypes.map((item, index) => {
                      return <Select.Option key={index} value={item}><i className={`iconfont icon-to-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                    })}
                  </Select>
                </Item>
              </Form>
            </div>
          </div> : null}
          {/* 选中节点 */}
          {(props.node && !TopologyData.locked) ? <div>
            <div className={style.title}>节点样式</div>
            <div className={style.settings}>
              <Form form={nodeForm} name='nodeForm' requiredMark={false} labelAlign='left' layout={'vertical'}>
                <Space>
                  <Item label='线条样式' name='dash'>
                    <Select style={{ width: 222 }} onChange={onChangeDash}>
                      <Select.Option value={0}>实线</Select.Option>
                      <Select.Option value={1}>虚线</Select.Option>
                      <Select.Option value={2}>大虚线</Select.Option>
                      <Select.Option value={3}>断点虚线</Select.Option>
                    </Select>
                  </Item>

                </Space>
                {/* <Space>
                  <Item label='宽' name='width' >
                    <InputNumber style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
                  </Item>
                  <Item label='高' name='height'>
                    <InputNumber style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
                  </Item>
                </Space> */}
                <Space>
                  <Item label='旋转角度' name='rotate' initialValue={0}>
                    <InputNumber min={0} max={360} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
                  </Item>
                  <Item label='圆角' name='borderRadius' initialValue={0}>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='线条颜色' name='strokeStyle' initialValue={'#222222'}>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></Input>
                  </Item>
                  <Item label='线条宽度(px)' name='lineWidth'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='背景颜色' name='fillStyle' initialValue={'#fff'}>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></Input>
                  </Item>
                  <Item label='透明度' name='globalAlpha'>
                    <InputNumber min={0} max={1} step={0.1} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
                  </Item>
                </Space>
                <div className={style.title} style={{ width: 260, marginLeft: -15 }}>文字样式</div>
                <Space>
                  <Item label='大小' name='fontSize'>
                    <InputNumber style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
                  </Item>
                  <Item label='加粗' name='fontWeight'>
                    <Select style={{ width: 106, height: 32 }} onChange={onChangeDash}>
                      <Select.Option value='normal'>正常</Select.Option>
                      <Select.Option value='bold'>加粗</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='颜色' name='fontColor' initialValue={'#222222'}>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></Input>
                  </Item>
                  <Item label='倾斜' name='fontStyle'>
                    <Select style={{ width: 106, height: 32 }} onChange={onChangeDash}>
                      <Select.Option value='normal'>正常</Select.Option>
                      <Select.Option value='italic'>倾斜</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='水平对齐' name='textAlign'>
                    <Select style={{ width: 106, height: 32 }} onChange={onChangeDash}>
                      <Select.Option value='left'>左对齐</Select.Option>
                      <Select.Option value='center'>居中</Select.Option>
                      <Select.Option value='right'>右对齐</Select.Option>
                    </Select>
                  </Item>
                  <Item label='垂直对齐' name='textBaseline'>
                    <Select style={{ width: 106, height: 32 }} onChange={onChangeDash}>
                      <Select.Option value='top'>顶部对齐</Select.Option>
                      <Select.Option value='middle'>居中</Select.Option>
                      <Select.Option value='bottom'>底部对齐</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Item label='文本内容' name='text'>
                  <TextArea autoSize={{ minRows: 4, maxRows: 10 }} style={{ width: 229 }} onChange={onChangeDash}></TextArea>
                </Item>
              </Form>
            </div>
          </div> : null}
          {/* 选中连接线 */}
          {(props.line && !TopologyData.locked) ? <div>
            <div className={style.title}>线条样式</div>
            <div className={style.settings}>
              <Form form={lineForm} name='lineForm' requiredMark={false} labelAlign='left' layout={'vertical'}>
                <Space>
                  <Item label='线条样式' name='dash'>
                    <Select style={{ width: 106 }} onChange={onChangeLine}>
                      <Select.Option value={0}>实线</Select.Option>
                      <Select.Option value={1}>虚线</Select.Option>
                      <Select.Option value={2}>大虚线</Select.Option>
                      <Select.Option value={3}>断点虚线</Select.Option>
                    </Select>
                  </Item>
                  <Item label='连线类型' name='name'>
                    <Select style={{ width: 106 }} onChange={onChangeLine}>
                      <Select.Option value='curve'>贝塞尔曲线</Select.Option>
                      <Select.Option value='polyline'>折线</Select.Option>
                      <Select.Option value='line'>直线</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='线条颜色' name='strokeStyle'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></Input>
                  </Item>
                  <Item label='线条宽度(px)' name='lineWidth'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='连线边框' name='borderColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></Input>
                  </Item>
                  <Item label='边框宽度(px)' name='borderWidth'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
                  </Item>
                </Space>
                <Item label='透明度' name='globalAlpha'>
                  <InputNumber min={0} max={1} step={0.1} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
                </Item>
                <div className={style.title} style={{ width: 260, marginLeft: -15 }}>箭头样式</div>
                <Space>
                  <Item label='起点箭头' name='fromArrow'>
                    <Select style={{ width: 106 }} onChange={onChangeLine}>
                      {arrowTypes.map((item, index) => {
                        return <Select.Option key={index} value={item}><i className={`iconfont icon-from-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                      })}
                    </Select>
                  </Item>
                  <Item label='终点箭头' name='toArrow'>
                    <Select style={{ width: 106 }} onChange={onChangeLine}>
                      {arrowTypes.map((item, index) => {
                        return <Select.Option key={index} value={item}><i className={`iconfont icon-to-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                      })}
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='起点箭头颜色' name='fromArrowColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></Input>
                  </Item>
                  <Item label='起点箭头大小(px)' name='fromArrowSize'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='终点箭头颜色' name='toArrowColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></Input>
                  </Item>
                  <Item label='终点箭头大小(px)' name='toArrowSize'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
                  </Item>
                </Space>
                <div className={style.title} style={{ width: 260, marginLeft: -15 }}>文字样式</div>
                <Space>
                  <Item label='大小' name='fontSize'>
                    <InputNumber style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
                  </Item>
                  <Item label='加粗' name='fontWeight'>
                    <Select style={{ width: 106, height: 32 }} onChange={onChangeLine}>
                      <Select.Option value='normal'>正常</Select.Option>
                      <Select.Option value='bold'>加粗</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='颜色' name='fontColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></Input>
                  </Item>
                  <Item label='倾斜' name='fontStyle'>
                    <Select style={{ width: 106, height: 32 }} onChange={onChangeLine}>
                      <Select.Option value='normal'>正常</Select.Option>
                      <Select.Option value='italic'>倾斜</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='水平对齐' name='textAlign'>
                    <Select style={{ width: 106, height: 32 }} onChange={onChangeLine}>
                      <Select.Option value='left'>左对齐</Select.Option>
                      <Select.Option value='center'>居中</Select.Option>
                      <Select.Option value='right'>右对齐</Select.Option>
                    </Select>
                  </Item>
                  <Item label='垂直对齐' name='textBaseline'>
                    <Select style={{ width: 106, height: 32 }} onChange={onChangeLine}>
                      <Select.Option value='top'>顶部对齐</Select.Option>
                      <Select.Option value='middle'>居中</Select.Option>
                      <Select.Option value='bottom'>底部对齐</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Item label='文本内容' name='text'>
                  <TextArea autoSize={{ minRows: 4, maxRows: 10 }} style={{ width: 229 }} onChange={onChangeLine} placeholder="文本内容"></TextArea>
                </Item>
              </Form>
            </div>
          </div> : null}
        </div>
      </div>
      <CustModal title={state.title} ref={nameRef} mold="cust" width={520} onOk={() => onOk()}>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 32 }}>
          <Form name='nameForm' form={nameForm}>
            <Item name='name' label='配电图名称' requiredMark={false} labelAlign='left' labelCol={{ span: 8 }} rules={[{ required: true, message: '请输入配电图文件名' }]}>
              <Input style={{ width: 240 }}></Input>
            </Item>
            <Item name='remark' label='备注' requiredMark={false} labelAlign='left' labelCol={{ span: 8 }}>
              <Input style={{ width: 240 }}></Input>
            </Item>
          </Form>
        </div>
      </CustModal>
      <CustModal title={nodeType} ref={bindRef} mold="cust" width={580} onOk={() => onbindOk()}>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 32 }}>
          <Form name='bindForm' form={bindForm} requiredMark={false}>
            <Item name='deviceId' label='设备名称'  labelAlign='left' rules={[{ required: true, message: '请选择绑定设备' }]}>
             {/*  <Select
                placeholder="请选择"
                size="middle"
                style={{ marginLeft: 16, width: '280px' }}
                onChange={changeDevice}
              >
                {state.deviceList.map(item => {
                  return <Select.Option key={item.sn} value={item.sn}>{item.name}</Select.Option>
                })}
              </Select> */}
               <Select
                showSearch
                onSearch={onSearch}
                placeholder="请选择"
                size="middle"
                style={{ marginLeft: 16, width: '380px' }}
                onChange={changeDevice}
                dropdownMatchSelectWidth={380}              
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) || (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                //  }
                }               
              >
                {

                  state.deviceList?.length > 0 ?
                    <>
                    <Select.Option disabled>
                    <Custoptionbg >
                        <span>设备名称</span>
                        <span>设备编号</span>
                    </Custoptionbg>
                    </Select.Option>
                    { state.deviceList.map((option) => {
                     return (                      
                      <Select.Option key={option.sn} label={option.name} value={option.sn}>
                         <div className={style.custoption} >
                           <Text ellipsis={{tooltip: option.name}}>{option.name}</Text>
                           <Text ellipsis={{tooltip: option.sn}}>{option.sn}</Text>
                         </div>

                      </Select.Option>
                     
                     )



                  })   
                  } 
                   </>
                    : null

                }
              {/*   {state.deviceList.map(item => {
                  return <Select.Option key={item.sn} value={item.sn}>{item.name}</Select.Option>
                })} */}
              </Select>
            </Item>
            {nodeType == '设备绑定' && (selectedNode?.icon != '' && selectedNode?.icon != '' && selectedNode?.icon != "" && selectedNode?.icon != "" ) ? null :
              <Item name='pointId' label='测点名称' labelAlign='left' rules={[{ required: true, message: '请选择绑定测点' }]}>
                <Select
                  placeholder="请选择"
                  size="middle"
                  style={{ marginLeft: 16, width: '380px' }}
                  disabled={!bindForm.getFieldValue('deviceId') ? true : false}
                >
                  {state.pointList.map(item => {
                    return <Select.Option key={item} value={item}>{item}</Select.Option>
                  })}
                </Select>
              </Item>}
          </Form>
        </div>
      </CustModal>
    </Spin>
  )
}