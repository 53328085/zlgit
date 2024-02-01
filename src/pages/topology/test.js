import React, {useEffect, useRef} from 'react'
import {Button, Collapse, Form, Switch, Input, Select} from 'antd'
import styled from 'styled-components'
import {Topology, Options, registerNode} from '@topology/core'
import {register as registerFlow} from "@topology/flow-diagram" //流程图
import {register as registerActivity} from '@topology/activity-diagram' // 活动图
import {register as registerClass} from '@topology/class-diagram' // 类图
import {register as registerSequence} from "@topology/sequence-diagram" // 时序图
import {register as registerChart} from "@topology/chart-diagram"

import { basic, flows, sgcc, ltdx, normal } from "../../assets/js/Menu";
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
import '../../assets/css/font_g4v09lxfde/iconfont.css'
import '../../assets/css/font_bz4csze2alg/iconfont.css'

const {Panel} = Collapse
const {Item} = Form
const CPanel = styled(Panel)`
   && {
   .ant-collapse-content{
    .ant-collapse-content-box{
      padding: 8px;
    .icons {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .aicon {
        display: inline-flex;
        width: 40px;
        height: 40px;
        color: #314659; 
        align-items: center;
        justify-content: center;
        .iconfont {
          font-size: 24px;
        }
      }
      }
   }
  }
  }

`
const Mainbox =  styled.div`
&& {
  display: grid;
   grid-template-rows: 62px 1fr;
   flex: 1;
   .tool {
      padding: 0 64px;
      background-color: #f8f8f8;
      border-bottom: 1px solid #d9d9d9;
   }
   .main {
      display: grid;
      grid-template-columns: 210px 1fr 260px;
      .drawicon {
        overflow-y: auto;
        background-color: #f8f8f8;
        border-right: 1px solid #d9d9d9;
      }
      .set {
        padding: 8px;
        overflow-y: auto;
        background-color: #f8f8f8;
        border-left: 1px solid #d9d9d9;
      }
   }
}
  

`

const Tools = [
  {
    group: '常用元器件',
    children: normal,
    id: 'normal'
  },
  {
    group: '基本形状',
    children: basic,
    id: 'basic',
  },
  {
    group: '流程图',
    children: flows,
    id: 'flows',
  },
  {
    group: '国家电网图元规范',
    children: sgcc,
    id: 'sgcc'
  },
  {
    group: '电气工程常用字母和符号',
    children: ltdx,
    id: 'ltdx'
  }
]
const lineNames = ['curve', 'polyline', 'line']
const arrowTypes = ['', 'triangleSolid', 'triangle', 'diamondSolid', 'diamond', 'circleSolid', 'circle', 'line', 'lineUp', 'lineDown']
export default function Index() {
  const [form] = Form.useForm()
  const registerHandler = () => {
    registerFlow();
    registerActivity();
    registerClass();
    registerSequence();
    registerChart()
  }
  
  let canvas = useRef()
  let config = useRef({})
  const save = () => {
   
    try {
      canvas.current.saveAsImage('n.png')
    } catch (error) {
      console.log(error)
    }
   
  }
  const onDrag = (event, node) => {
    // 解决浏览器手势插件命名冲突
    event.dataTransfer.setData('Topology', JSON.stringify(node.data))
  }
  const onMessage = (e, data) => {
    console.log(e);
    console.log(data)
      

  }

  useEffect(() => {
   registerHandler()
    config.on = onMessage
    canvas.current = new Topology('canvas', config)
    canvas.current.render() 
    
  }, [])
 const render = () => canvas.current.render() 
 
 const gridchange =(e) => {
    canvas.current.data.grid= e;
    render()
 }
 const lockchange = (e) => {
   canvas.current.data.locked = e ? 'Readonly' : 'None';
   render()
 }
 const bgchange = (e) => {
   canvas.current.data.bkColor=e.target.value;
   render();
 }
 const gridcolorchange = (e) => {
  canvas.current.data.gridColor = e.target.value;
  render()
 }
 const linetypechange = (v) => {
   
   canvas.current.data.lineName = v;
   render()
 }
 const fromarrowchange = (v) => {
     canvas.current.data.fromArrow = v;
     render()
 }
 const toarrowchange = (v) => {
   console.log(v)
   canvas.current.data.toArrow = v
 }
  return (
    <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
       <Mainbox>
          <div className='tool'>
              
          </div>
          <div className='main'>
             <div className='drawicon'>
               <Collapse bordered={false}>
                   {
                    Tools.map(item => {
                     return (
                       <CPanel header={item.group} key={item.id}>
                           <div className='icons'>
                                {item.children.map((value, val) => {
                                return <a title={value.name} draggable={true} onDragStart={e => onDrag(e, value)} key={val} className='aicon'>
                                  {(value.icon.indexOf('sgcc') != - 1 || value.icon.indexOf('ltdx') != -1) ? <i className={value.icon}></i> : <i className={`iconfont ${value.icon}`}></i>}
                                </a>
                              })}
                           </div>
                       </CPanel>
                     )
                    })
                   }
               </Collapse>
             </div>
            <div id="canvas" style={{flex: 1}}>
              
            </div>
            <div className='set'>
               <Form form={form} labelCol={{flex: "100px"}}>
                   <Item label="背景网格">
                         <Switch onChange={gridchange}></Switch>
                   </Item>
                   <Item label="画布锁定">
                         <Switch onChange={lockchange}></Switch>
                   </Item>
                   <Item label="背景颜色">
                         <Input type="color" style={{width: '32px', padding: "2px"}} onChange={bgchange}></Input>
                   </Item>
                   <Item label="网格颜色">
                         <Input type="color" style={{width: '32px', padding: "2px"}} onChange={gridcolorchange}></Input>
                   </Item>
                   <Item label="默认连线类型">
                      <Select onChange={linetypechange}>
                        {lineNames.map((item, index) => {
                          return <Select.Option key={item} value={item}><i className={`iconfont icon-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                        })}
                      </Select>
                   </Item>
                   <Item label='默认起点箭头' name='fromArrow'>
                    <Select onChange={fromarrowchange}>
                      {arrowTypes.map((item, index) => {
                        return <Select.Option key={item} value={item}><i className={`iconfont icon-from-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                      })}
                    </Select>
                </Item>

                <Item label='默认终点箭头' name='toArrow'>
                  <Select onChange={toarrowchange} >
                    {arrowTypes.map((item, index) => {
                      return <Select.Option key={item} value={item}><i className={`iconfont icon-to-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                    })}
                  </Select>
                </Item>
               </Form>
            </div>
       </div>
       </Mainbox>
    </div>
  )
}
