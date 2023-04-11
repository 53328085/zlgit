import React, { useEffect, useState } from "react";
import style from './style.module.less'
import { Topology } from "@topology/core/src/core";
import { register as registerFlow } from '@topology/flow-diagram'
import { Collapse, Switch, Form, Input, Select, Space, InputNumber, Card } from "antd";
import { basic, flows, sgcc, ltdx, normal } from "../../assets/js/Menu";

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
// 右侧图形库图标
import '../../assets/css/fonts/font/libs/iconfont.css'

export default function index() {
  const { TextArea } = Input;
  const [form] = Form.useForm()
  const [nodeForm] = Form.useForm()
  const [lineForm] = Form.useForm()
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
    canvas.render()
    setNewCanvas(canvas)
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
  let [contextmenu, setContextMenu] = useState({
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
    // if(event.button == 2){
    //   if (event.clientY + 360 < document.body.clientHeight) {
    //     setContextMenu({
    //       left: event.clientX - 210 + 'px',
    //       top: event.clientY- 62 + 'px'
    //     })
    //   } else {
    //     setContextMenu({
    //       left: event.clientX + 'px',
    //       bottom: document.body.clientHeight - event.clientY + 'px'
    //     })
    //   }
    // }  
  }
  const[nodeTag, setNodeTag] = useState(false)
  const onMessage = (event, data) => {
    console.log(event)
    // console.log(data)
    if(event == 'nodeRightClick'){
      // console.log(data.evs)
      if (data.name == "text" || data.name == "rectangle") {
        setContextMenu({
          left: data.evs.x  + 'px',
          top: data.evs.y + 'px'
        })
        setNodeTag(true)
      }else if(data.name == 'image'){
        setContextMenu({
          left: data.evs.x  + 'px',
          top: data.evs.y + 'px'
        })
        setNodeTag(true)
      }
    }
    if(event == 'line' || event == 'space' || event == 'multi'){
      setNodeTag(false)
    }
    // 右侧输入框编辑状态时点击编辑区域其他元素，onMessage执行后才执行onUpdateProps方法，通过setTimeout让onUpdateProps先执行
    setTimeout(() => {
      switch (event) {
        case 'node':
        case 'addNode':
          // nodeForm.resetFields()
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
        <div id="topology-canvas" className={`full ${TopologyData.grid ? 'canvas-container' : ''}`} onContextMenu={e => onContextMenu(e)} style={{position:'relative'}}>
        {( nodeTag )? <Card style={{width: 200, position:'absolute', ...contextmenu}} >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>: null}
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
                  {/* <Item label='旋转角度' name='rotate'>
                    <Input style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></Input>
                  </Item> */}
                </Space>
                <Space>
                  <Item label='线条颜色' name='strokeStyle' initialValue={'#222222'}>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></Input>
                  </Item>
                  <Item label='线条宽度(px)' name='lineWidth'>
                    <InputNumber min={1} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
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
                    <InputNumber min={12} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeDash}></InputNumber>
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
                    <InputNumber min={1} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
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
                    <InputNumber min={5} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='终点箭头颜色' name='toArrowColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></Input>
                  </Item>
                  <Item label='终点箭头大小(px)' name='toArrowSize'>
                    <InputNumber min={5} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
                  </Item>
                </Space>
                <div className={style.title} style={{ width: 260, marginLeft: -15 }}>文字样式</div>
                <Space>
                  <Item label='大小' name='fontSize'>
                    <InputNumber min={12} style={{ width: 106, height: 32, padding: 0 }} onChange={onChangeLine}></InputNumber>
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
    </>
  )
}