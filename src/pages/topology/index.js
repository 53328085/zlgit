import React, { useEffect, useState } from "react";
import style from './style.module.less'
import { Topology } from '@topology/core'
import { register as registerFlow } from '@topology/flow-diagram'
import { Collapse, Switch } from "antd";
import { basic, flows, sgcc, ltdx } from "./Menu";

import logo from './topologyLogo.png'
// 左侧工具栏图标
import '../../assets/css/fonts/font/iconfont.css'
import '../../assets/css/font_2073009_u56zfo0voi/iconfont.css'
import '../../assets/css/font_2395018_pl6jy69tbjr/iconfont.css'
// 右侧图形库图标
import '../../assets/css/fonts/font/libs/iconfont.css'

export default function index() {
    let canvas
    const [newCanvas, setNewCanvas] = useState()
    const canvasOptions = {}
    const lineNames = ['curve', 'polyline', 'line']
    const arrowTypes = ['', 'triangleSolid', 'triangle', 'diamondSolid', 'diamond', 'circleSolid', 'circle', 'line', 'lineUp', 'lineDown']
    useEffect(()=>{
      registerFlow()
      canvasOptions.on = onMessage
        canvas = new Topology('topology-canvas', canvasOptions)
        // canvas.data.grid = true
        canvas.render()
        setNewCanvas(canvas)
    },[])
    const { Panel } = Collapse;
    const Tools = [
        {
            group:'基本形状',
            children: basic
        },
        {
            group:'流程图',
            children: flows
        },
        {
            group:'国家电网图元规范',
            children: sgcc
        },
        {
            group:'电气工程常用字母和符号',
            children: ltdx
        }
    ]
    let props = {
        node: null, // 节点
        line: null, // 连线
        nodes: null,
        multi: false, // 多个对象
        expand: false,
        locked: false
    }
    let contextmenu = {
        left: null,
        top: null,
        bottom: null
      }
    let canvasData = {
        lineName:'polyline',
        fromArrow:'',
        toArrow:'triangleSolid'
      } // 画布数据
    let lineColor = 'rgba(34, 34, 34, 1)'
    let [TopologyData, setTopologyData] = useState({
        grid: false, // 背景网格
        locked: false, // 画布锁定
        gridColor: 'rgba(242, 242, 242, 1)',
        bkColor:'rgba(255, 255, 255, 1)'
      })
    const onDrag = (event, node) => {
        // 解决浏览器手势插件命名冲突
        event.dataTransfer.setData('Topology', JSON.stringify(node.data))
      }
    const onContextMenu = (event) => {
        event.preventDefault()
        event.stopPropagation()
        // console.log(event, '===onContextMenu')
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
        // console.log('=====onMessage=====', event, data)
        // console.log(canvas, '******canvas')
        // 右侧输入框编辑状态时点击编辑区域其他元素，onMessage执行后才执行onUpdateProps方法，通过setTimeout让onUpdateProps先执行
        setTimeout(() => {
          switch (event) {
            case 'node':
            case 'addNode':
              props = {
                node: data,
                line: null,
                multi: false,
                expand: props.expand,
                nodes: null,
                locked: TopologyData.locked
              }
              // canvas.setValue({ id: data.id, text: 'new text' });//赋值
              break
            case 'line':
            case 'addLine':
              data.fromArrowColor = data.fromArrowColor ? data.fromArrowColor : lineColor
              data.toArrowColor = data.toArrowColor ? data.toArrowColor : lineColor
              data.strokeStyle = data.strokeStyle ? data.strokeStyle : lineColor
              props = {
                node: null,
                line: data,
                multi: false,
                nodes: null,
                locked: TopologyData.locked
              }
              break
            case 'multi':
              props = {
                node: null,
                line: null,
                multi: true,
                nodes: data.length > 1 ? data : null,
                locked: getLocked({ nodes: data })
              }
              break
            case 'space':
              props = {
                node: null,
                line: null,
                multi: false,
                nodes: null,
                locked: TopologyData.locked
              }
              break
            case 'moveOut':
              break
            case 'moveNodes':
            case 'resizeNodes':
              if (data.length > 1) {
                props = {
                  node: null,
                  line: null,
                  multi: true,
                  nodes: data,
                  locked: getLocked({ nodes: data })
                }
              } else {
                props = {
                  node: data[0],
                  line: null,
                  multi: false,
                  nodes: null,
                  locked: TopologyData.locked
                }
              }
              break
            case 'resize':
            case 'scale':
            case 'locked':
              if (canvas && canvas.data) {
                canvasData = {
                  scale: canvas.data.scale || 1, // 当前图文缩放比例： 0 - 1
                  lineName: canvas.data.lineName, // 当前图文默认连线类型
                  fromArrowType: canvas.data.fromArrowType, // 默认连线起点箭头
                  toArrowType: canvas.data.toArrowType, // 连线终点默认箭头
                  fromArrowlockedType: canvas.data.locked // 0-未锁定，可任意编辑，1-只读模式，允许选中，2-禁止鼠标交互，无法做任何操作。纯静态画面模式
                }
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
        TopologyData.grid = val
        newCanvas.data.grid = val
        canvas.render()
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
                        {Tools.map((item, index)=> {
                            return <Panel header={item.group} key={index + 1}>
                                <div className={style.buttons}>
                                    {item.children.map((value,val)=>{
                                        return <a title={value.name} draggable={true} onDragStart={ e => onDrag(e, value)} key={val}>
                                            { (value.icon.indexOf('sgcc') != - 1 || value.icon.indexOf('ltdx') != -1) ? <i className={value.icon}></i> : <i className={`iconfont ${value.icon}`}></i> }
                                        </a>
                                    })}
                                </div>
                            </Panel>
                        })}
                    </Collapse>
                </div>
                <div id="topology-canvas" className={`full ${TopologyData.grid ? 'canvas-container' :''}`} onContextMenu={e => onContextMenu(e)}></div>
                <div className={style.props}>
                    {/* 选中画布 */}
                    {(TopologyData.locked || (!props.node && !props.line && !props.multi)) ? <div>
                        <div className={style.title}>图文设置</div>
                        <div className={style.settings}>
                            <div className={style.item}>
                                <span className={style.label}>背景网格:</span>
                                <Switch size="small" defaultChecked={TopologyData.grid} onChange={()=>onSwitchChange}></Switch>
                            </div>
                        </div>
                    </div>:null}
                </div>
            </div>
        </>
    )
}