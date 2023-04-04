import React, { useEffect, useState } from "react";
import style from './style.module.less'
import { Topology } from '@topology/core'
import { register as registerFlow } from '@topology/flow-diagram'
import { Collapse, Switch, Form, Input, Select } from "antd";
import { basic, flows, sgcc, ltdx } from "./Menu";
import { SketchPicker } from "react-color";

import logo from './topologyLogo.png'
// 左侧工具栏图标
import '../../assets/css/fonts/font/iconfont.css'
import '../../assets/css/font_2073009_u56zfo0voi/iconfont.css'
import '../../assets/css/font_2395018_pl6jy69tbjr/iconfont.css'
// 右侧图形库图标
import '../../assets/css/fonts/font/libs/iconfont.css'

export default function index() {
  const [form] = Form.useForm()
  const [nodeForm] = Form.useForm()
  const Item = Form.Item
  let canvas
  const [newCanvas, setNewCanvas] = useState()
  const canvasOptions = {}
  const lineNames = ['curve', 'polyline', 'line']
  const arrowTypes = ['', 'triangleSolid', 'triangle', 'diamondSolid', 'diamond', 'circleSolid', 'circle', 'line', 'lineUp', 'lineDown']
  useEffect(() => {
    registerFlow()
    canvasOptions.on = onMessage
    canvas = new Topology('topology-canvas', canvasOptions)
    // canvas.data.grid = true
    canvas.render()
    setNewCanvas(canvas)
  }, [])
  const { Panel } = Collapse;
  const Tools = [
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
  let contextmenu = {
    left: null,
    top: null,
    bottom: null
  }
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
    if (event.clientY + 360 < document.body.clientHeight) {
      contextmenu = {
        left: event.clientX + 'px',
        top: event.clientY + 'px'
      }
    } else {
      contextmenu = {
        left: event.clientX + 'px',
        bottom: document.body.clientHeight - event.clientY + 'px'
      }
    }
  }

  const onMessage = (event, data) => {
    // console.log(event)
    console.log(data)
    // 右侧输入框编辑状态时点击编辑区域其他元素，onMessage执行后才执行onUpdateProps方法，通过setTimeout让onUpdateProps先执行
    setTimeout(() => {
      switch (event) {
        case 'node':
        case 'addNode':
          setProps({
            node: data,
            line: null,
            multi: false,
            expand: props.expand,
            nodes: null,
            locked: TopologyData.locked
          })
          nodeForm.setFieldsValue(data)
          // newCanvas.setValue({ id: data.id, text: 'new text' });//赋值
          break
        case 'line':
        case 'addLine':
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
    console.log(node)
    newCanvas.updateProps(node)
  }
  const onChangeDash = val => {
    let obj = {... props}
    obj.node = nodeForm.getFieldsValue(true)
    setProps({...obj})
    // setProps({
    //   node: nodeForm.getFieldsValue(true),
    //   line: null,
    //   multi: false,
    //   expand: props.expand,
    //   nodes: null,
    //   locked: TopologyData.locked
    // })
    setTimeout(()=>{
      onUpdateProps(obj.node)
    },0)
  }

  return (
    <>
      <div className={style.header}>
        <img className={style.logo} src={logo}></img>
        <span className={style.headerTitle}>智慧能源服务平台</span>
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
        <div id="topology-canvas" className={`full ${TopologyData.grid ? 'canvas-container' : ''}`} onContextMenu={e => onContextMenu(e)}></div>
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
                  <Select style={{width: 120}} onChange={onChangeLineType}>
                    { lineNames.map((item, index) => {
                      return <Select.Option key={index} value={item}><i className={`iconfont icon-${item}`} style={{fontSize: 30}}></i></Select.Option>
                    }) }
                  </Select>
                </Item>
                <Item label='默认起点箭头' name='fromArrow' initialValue={""}>
                  <Select style={{width: 120}} onChange={onChangeFromArrow}>
                    { arrowTypes.map((item, index) => {
                      return <Select.Option key={index} value={item}><i className={`iconfont icon-from-${item}`} style={{fontSize: 30}}></i></Select.Option>
                    }) }
                  </Select>
                </Item>
                <Item label='默认终点箭头' name='toArrow' initialValue={"triangleSolid"}>
                  <Select style={{width: 120}} onChange={onChangeToArrow}>
                    { arrowTypes.map((item, index) => {
                      return <Select.Option key={index} value={item}><i className={`iconfont icon-from-${item}`} style={{fontSize: 30, transform:"rotate(180deg)"}}></i></Select.Option>
                    }) }
                  </Select>
                </Item>
              </Form>
            </div>
          </div> : null}
          {/* 选中节点 */}
          {(props.node && !TopologyData.locked ) ? <div>
            <div className={style.title}>节点样式</div>
            <div className={style.settings}>
              <Form form={nodeForm} name='nodeForm' requiredMark={false} labelAlign='left' labelCol={{ span: 10 }}>
                <Item label='线条样式' name='dash'>
                  <Select style={{width: 120}} onChange={onChangeDash}>
                    <Select.Option value={0}>直线</Select.Option>
                    <Select.Option value={1}>虚线</Select.Option>
                    <Select.Option value={2}>大虚线</Select.Option>
                    <Select.Option value={3}>断点虚线</Select.Option>
                  </Select>
                </Item> 
              </Form>
            </div>
          </div> : null}
        </div>
      </div>
    </>
  )
}