import React, {useEffect, useRef, useState} from 'react'
import {Button, Collapse, Form, Switch, Input, Select, Space, InputNumber, } from 'antd'
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
const {TextArea} = Input
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
  const [nodeForm] = Form.useForm();
  const [lineForm] =Form.useForm();
  const [TopologyData, setTopologyData] = useState({
    grid: false, // 背景网格
    locked: false, // 画布锁定
    gridColor: 'rgba(242, 242, 242, 1)',
    bkColor: 'rgba(255, 255, 255, 1)'
  })

 const [props, setProps] = useState({
  node: null, // 节点
  line: null, // 连线
  nodes: null,
  multi: false, // 多个对象
  expand: false,
  locked: false
})
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
     switch(e) {
        case 'node':
        case 'addNode': {
          nodeForm.resetFields();
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
          console.log('node, addNode')
          break
        }

     }
      

  }

  useEffect(() => {
   registerHandler()
    config.on = onMessage
    canvas.current = new Topology('canvas', config)
    canvas.current.render() 
    
  }, [])
 const render = () => canvas.current.render() 
 const onUpdateProps = node => {
   
  canvas.current.updateProps(node)
}
 
 const onValuesChange = (a) => {
  for(let [key, value] of Object.entries(a)) {
     if(key == 'locked') {
        canvas.current.lock(value ? 1 : 0)
     }else {
      canvas.current.data[key] = value
     }
     render()
  }
  setTopologyData({
    ...TopologyData,
    ...a,
  })

 }
 const nodeChange = (a) => {
    for(let [key, value] of Object.entries(a)) {
       if(Object.prototype.toString.call(value) === '[object Object]') {
          props.node[key] = {...value}
       }else if(Array.isArray(value)) {
         props.node[key] = [...value]
       }else {
         props.node[key] = value
       }
        
    }
    onUpdateProps(props.node)
 }
const linechange =(a) => {


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
             {(TopologyData.locked || (!props.node && !props.line && !props.multi)) ? 
               (<Form form={form} labelCol={{flex: "100px"}} 
                  onValuesChange={onValuesChange}
                  initialValues={{
                    locked: false
                  }}
               >
                   <Item>
                     <span>图文设置</span>
                   </Item>
                   <Item label="背景网格" name='grid' valuePropName="checked">
                         <Switch></Switch>
                   </Item>
                   <Item label="画布锁定" name='locked' valuePropName="checked">
                         <Switch></Switch>
                   </Item>
                   <Item label="背景颜色" name='bkColor'>
                         <Input type="color" style={{width: '32px', padding: "2px"}}></Input>
                   </Item>
                   <Item label="网格颜色" name='gridColor'>
                         <Input type="color" style={{width: '32px', padding: "2px"}}></Input>
                   </Item>
                   <Item label='默认连线颜色' name='lineColor'>
                      <Input type='color' style={{ width: 32, height: 32, padding: 0 }}></Input>
                  </Item>
                   <Item label="默认连线类型">
                      <Select>
                        {lineNames.map((item, index) => {
                          return <Select.Option key={item} value={item}><i className={`iconfont icon-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                        })}
                      </Select>
                   </Item>
                   <Item label='默认起点箭头' name='fromArrow'>
                    <Select>
                      {arrowTypes.map((item, index) => {
                        return <Select.Option key={item} value={item}><i className={`iconfont icon-from-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                      })}
                    </Select>
                </Item>

                <Item label='默认终点箭头' name='toArrow'>
                  <Select>
                    {arrowTypes.map((item, index) => {
                      return <Select.Option key={item} value={item}><i className={`iconfont icon-to-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                    })}
                  </Select>
                </Item>
               </Form>)
              : null   }


               {/* 选中节点 */}
          {(props.node && !TopologyData.locked) ? <div>
           
            
              <Form form={nodeForm} name='nodeForm' requiredMark={false} labelAlign='left' layout={'vertical'} onValuesChange={nodeChange} >
                 <Item>
                   <span>节点样式</span>
                 </Item>
               
                <Space>
                  <Item label='线条样式' name='dash'>
                    <Select style={{ width: 222 }}>
                      <Select.Option value={0}>实线</Select.Option>
                      <Select.Option value={1}>虚线</Select.Option>
                      <Select.Option value={2}>大虚线</Select.Option>
                      <Select.Option value={3}>断点虚线</Select.Option>
                    </Select>
                  </Item>

                </Space>
              
                <Space>
                  <Item label='旋转角度' name='rotate' initialValue={0}>
                    <InputNumber min={0} max={360} style={{ width: 106, height: 32, padding: 0 }} ></InputNumber>
                  </Item>
                  <Item label='圆角' name='borderRadius' initialValue={0}>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} ></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='线条颜色' name='strokeStyle' initialValue={'#222222'}>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} ></Input>
                  </Item>
                  <Item label='线条宽度(px)' name='lineWidth'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} ></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='背景颜色' name='fillStyle' initialValue={'#fff'}>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} ></Input>
                  </Item>
                  <Item label='透明度' name='globalAlpha'>
                    <InputNumber min={0} max={1} step={0.1} style={{ width: 106, height: 32, padding: 0 }} ></InputNumber>
                  </Item>
                </Space>
                <div style={{ width: 260, marginLeft: -15 }}>文字样式</div>
                <Space>
                  <Item label='大小' name='fontSize'>
                    <InputNumber style={{ width: 106, height: 32, padding: 0 }} ></InputNumber>
                  </Item>
                  <Item label='加粗' name='fontWeight'>
                    <Select style={{ width: 106, height: 32 }} >
                      <Select.Option value='normal'>正常</Select.Option>
                      <Select.Option value='bold'>加粗</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='颜色' name='fontColor' initialValue={'#222222'}>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} ></Input>
                  </Item>
                  <Item label='倾斜' name='fontStyle'>
                    <Select style={{ width: 106, height: 32 }} >
                      <Select.Option value='normal'>正常</Select.Option>
                      <Select.Option value='italic'>倾斜</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='水平对齐' name='textAlign'>
                    <Select style={{ width: 106, height: 32 }} >
                      <Select.Option value='left'>左对齐</Select.Option>
                      <Select.Option value='center'>居中</Select.Option>
                      <Select.Option value='right'>右对齐</Select.Option>
                    </Select>
                  </Item>
                  <Item label='垂直对齐' name='textBaseline'>
                    <Select style={{ width: 106, height: 32 }} >
                      <Select.Option value='top'>顶部对齐</Select.Option>
                      <Select.Option value='middle'>居中</Select.Option>
                      <Select.Option value='bottom'>底部对齐</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Item label='文本内容' name='text'>
                  <TextArea autoSize={{ minRows: 4, maxRows: 10 }} style={{ width: 229 }}></TextArea>
                </Item>
              </Form>
            </div>
           : null}
             {/* 选中连接线 */}
          {(props.line && !TopologyData.locked) ? <div>
            
              <Form form={lineForm} name='lineForm' requiredMark={false} labelAlign='left' layout={'vertical'} onValuesChange={linechange}>
                 <Item>
                   <span>线条样式</span>
                 </Item>
                <Space>
                  <Item label='线条样式' name='dash'>
                    <Select style={{ width: 106 }} >
                      <Select.Option value={0}>实线</Select.Option>
                      <Select.Option value={1}>虚线</Select.Option>
                      <Select.Option value={2}>大虚线</Select.Option>
                      <Select.Option value={3}>断点虚线</Select.Option>
                    </Select>
                  </Item>
                  <Item label='连线类型' name='name'>
                    <Select style={{ width: 106 }} >
                      <Select.Option value='curve'>贝塞尔曲线</Select.Option>
                      <Select.Option value='polyline'>折线</Select.Option>
                      <Select.Option value='line'>直线</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='线条颜色' name='strokeStyle'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} ></Input>
                  </Item>
                  <Item label='线条宽度(px)' name='lineWidth'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }} ></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='连线边框' name='borderColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }} ></Input>
                  </Item>
                  <Item label='边框宽度(px)' name='borderWidth'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }}></InputNumber>
                  </Item>
                </Space>
                <Item label='透明度' name='globalAlpha'>
                  <InputNumber min={0} max={1} step={0.1} style={{ width: 106, height: 32, padding: 0 }} ></InputNumber>
                </Item>
                <Item>箭头样式</Item>
                <Space>
                  <Item label='起点箭头' name='fromArrow'>
                    <Select style={{ width: 106 }}>
                      {arrowTypes.map((item, index) => {
                        return <Select.Option key={index} value={item}><i className={`iconfont icon-from-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                      })}
                    </Select>
                  </Item>
                  <Item label='终点箭头' name='toArrow'>
                    <Select style={{ width: 106 }}>
                      {arrowTypes.map((item, index) => {
                        return <Select.Option key={index} value={item}><i className={`iconfont icon-to-${item}`} style={{ fontSize: 30 }}></i></Select.Option>
                      })}
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='起点箭头颜色' name='fromArrowColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }}></Input>
                  </Item>
                  <Item label='起点箭头大小(px)' name='fromArrowSize'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }}></InputNumber>
                  </Item>
                </Space>
                <Space>
                  <Item label='终点箭头颜色' name='toArrowColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }}></Input>
                  </Item>
                  <Item label='终点箭头大小(px)' name='toArrowSize'>
                    <InputNumber min={0} style={{ width: 106, height: 32, padding: 0 }}></InputNumber>
                  </Item>
                </Space>
                <div className={style.title} style={{ width: 260, marginLeft: -15 }}>文字样式</div>
                <Space>
                  <Item label='大小' name='fontSize'>
                    <InputNumber style={{ width: 106, height: 32, padding: 0 }}></InputNumber>
                  </Item>
                  <Item label='加粗' name='fontWeight'>
                    <Select style={{ width: 106, height: 32 }}>
                      <Select.Option value='normal'>正常</Select.Option>
                      <Select.Option value='bold'>加粗</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='颜色' name='fontColor'>
                    <Input type='color' style={{ width: 106, height: 32, padding: 0 }}></Input>
                  </Item>
                  <Item label='倾斜' name='fontStyle'>
                    <Select style={{ width: 106, height: 32 }}>
                      <Select.Option value='normal'>正常</Select.Option>
                      <Select.Option value='italic'>倾斜</Select.Option>
                    </Select>
                  </Item>
                </Space>
                <Space>
                  <Item label='水平对齐' name='textAlign'>
                    <Select style={{ width: 106, height: 32 }}>
                      <Select.Option value='left'>左对齐</Select.Option>
                      <Select.Option value='center'>居中</Select.Option>
                      <Select.Option value='right'>右对齐</Select.Option>
                    </Select>
                  </Item>
                  <Item label='垂直对齐' name='textBaseline'>
                    <Select style={{ width: 106, height: 32 }}>
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
            : null}    


            </div>
       </div>
       </Mainbox>
    </div>
  )
}
