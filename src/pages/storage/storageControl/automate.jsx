import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker,  Calendar, Descriptions, Divider, Checkbox } from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import {nanoid} from "@reduxjs/toolkit"
import imgurl from './icon'
import Titlelayout from '@com/titlelayout'
import {StorageControlRuntime} from '@api/api'
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-rows: 576px 104px;
       row-gap: 16px; 
       flex: 1;
       color:#515151;
       .top {
        display: grid;
        grid-template-columns: 180px 1fr;
        column-gap: 16px;
        background-color: #fff;
        padding: 16px;
      
        .topleft {
            display: grid;
            grid-template-rows: 36px 1fr 54px;
            .title {
               background-color: #000033;
               display: flex;
               align-items: center;
               justify-content: center;
               color:#fff;
            }
            .content {
            grid-auto-rows: 48px;
            row-gap: 16px;
            display: grid;
            border: 1px solid #d7d7d7; 
            padding: 16px;
            .plan {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center; 
                 border: 1px solid rgba(215, 215, 215, 1); 
                 border-radius: 2px; 
                 box-shadow: none;
                 transition: all 100ms;
                 &:hover {
                    cursor: pointer;
                 }
                }
            .plan.active {
                background-color: #237ae4;
                color: #fff;
                position: relative;
               /*  &:after {
                   position: absolute;
                   content: "▶";
                  right: 16px;
                  color:#fff;
                  top: 0;
                 display: flex;
                 height: 64px;
                 align-items: center
                } */
             }
            }
            .footer {
                background-color: #e4e4e4;
                display: flex;
                align-items: center;
                justify-content: space-evenly;
            }
          }
          .topright {
             border: 1px solid rgba(215, 215, 215, 1); 
            
             border-radius: 0px;
             box-shadow: none;
             display: grid;
             grid-template-rows: 1fr 58px;
             .toprightup {
                padding: 32px;
                display: flex;

             }
             .toprightdown {
                background-color: rgba(242, 242, 242, 1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 16px 0 32px;
             }
          }
        }
        .foot {
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            padding: 0 16px 0 32px;
            align-items: center;
            .start {
                width: 368px;
                height: 48px; 
                background-color: rgba(242, 242, 242, 1);
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(215, 215, 215, 1);
                display: flex;
                align-items: center;
                font-size: 16px;
                color: #515151;
                padding: 16px;
                span {
                    color:#666;
                }
            }
        }
       }
`
const Formbox = styled(Form)`
    && {
        display: grid;
        grid-template-rows: repeat(5, 36px);
        grid-template-columns: repeat(2, 496px);
      //  grid-template-columns: 646px;
        row-gap: 32px;
        column-gap: 64px;
        padding-top: 32px;
        padding-left: 16px;
        grid-auto-flow: column;
        .priority {
            grid-column: 2;
            grid-row: 1;
        }
        .date {
            grid-column: 2;
            grid-row: 2;
        }
      
       .ant-form-item {
        margin-bottom: 0px;
       }
    }
`
const Bigbutton = styled(Button)`
    width: 200px;
    height: 72px;
    font-size: 18px;
    border-radius: 4px;
`
const Normalbt = styled(Button)`
    width: 96px;
    height: 32px;
`
const Timeipt = styled(Input)`
    && {
        width: 52px;
    height: 40px; 
    background-color: rgba(242, 242, 242, 1); 
    border: 1px solid rgba(215, 215, 215, 1); 
    color: #333333;
    border-radius: 0px;
    box-shadow: none;
    }
`
const Viewbox = styled.div`
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 854px 510px;
    height: 484px;
    padding: 32px 0;
   column-gap: 32px;
    .detl {
        height: 365px;
        border: 1px solid rgba(215, 215, 215, 1); 
        margin-top: 40px;
       .title {
       
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #237ae4;
        color: #fff;
        font-size: 16px;
       } 
       .content {
        padding: 16px;
        display: grid;
        grid-auto-rows: auto 4px 1fr;
        row-gap: 16px;
       }
       .item {
        width: 4px;
        height: 36px;
        background-color: rgba(0, 153, 51, 1);
        border: none;
        border-radius: 0px;
       }
       .list {
       /*  display: flex;
        justify-content: space-between; */
        display: grid;
        grid-template-columns: repeat(94, 4px);
        column-gap: 1px;
       }

    }
`
const Itembox = styled.div`
      width: 4px;
      height: 36px;
      background-color: ${props => props.type == 'warn' ? '#ff9933' : props.type=='info' ? '#00ccff' : '#009933' };
      border: none;
      border-radius: 0px;
`
const CustCalendar = styled(Calendar)`
  && {
    .ant-picker-calendar-header {
        justify-content: flex-start;
    }
    .ant-picker-cell {
        border: 1px solid #d7d7d7;
        color:#ccc;
        background-color: #f2f2f2;
        cursor: not-allowed

    }
    .ant-picker-cell.ant-picker-cell-in-view {
        background-color: #fff;
        color:#515151;
        span.el {
            color: #237ae4;
        }
    }
  }

`
const Datebox = styled.div`
 width: 122px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  padding: 0 8px;
  align-items: flex-end;
`
 function Automate({projectId, areaId, startTime, Strategy, CModal}) {
  const [nameform] = Form.useForm()
  const [plans, setPlan] = useState([])  
  const [strategy, setStrategy] = useState([])
  const [pcs, setPcs] = useState([])
  const [curplan, setCurplan] = useState()
  const [isView, setIsview] = useState(false)
  const pref = useRef()
  const planName = useRef('')
  const showarrow = plans?.length > 4
  const onPlan = ({name, id}) => {
     console.log(id)
     setCurplan(id)
  }
  const addplan = () => {
    console.log(pref.current)
     pref.current.onOpen()

  }
  const QueryStrategyList = async () => {
     try {
        let {success, data} = await  StorageControlRuntime.QueryStrategyList(projectId, areaId)
        success && setStrategy([...data])
        !success && setStrategy([])
     } catch (error) {
        console.log(error)
     }
    
 } 
 const QueryPcsList = async () => {
    try {
       let {success, data} = await  StorageControlRuntime.QueryPcsList(projectId, areaId)
       success && setPcs([...data])
       !success && setPcs([])
    } catch (error) {
       console.log(error)
    }
   
} 
  const getPlans = async () => {
    try {
        let {success, data} = await StorageControlRuntime.QueryRuntimePlan(projectId, areaId)

        if(success && Array.isArray(data) && data.length > 0) {
            setCurplan(data[0].id)
            setPlan([...data])
        }else {
            success && setPlan([]) 
            setCurplan(null)
        }
        
        
    } catch (error) {
        console.log(error)
    }
     

  }
  const planOk = () => {
    let {planName} = nameform.getFieldsValue(); 
    setPlan([...plans, {name: planName, id: nanoid()}])
    pref.current.onCancel()
  }
  const changeview = () => {
     setIsview(f => !f)
  }
  const updatestate = () => {}
  useEffect(() => {
    getPlans()
    QueryStrategyList()
    QueryPcsList()
  }, [areaId])
  return (
    <Mainbox>
        <div className='top'>
            <div className='topleft'> 
                <div className='title'>
                    运行计划
                </div>
                <div className='content'>
                    {plans.map(p => <div key={nanoid()} className={curplan == p.id ? 'plan active' : 'plan'} onClick={() => onPlan(p)}>
                        {p.name}  {curplan == p.id && <CaretRightOutlined style={{position: "absolute", right: '16px'}}  />}
                        </div>)
                        } 
                   
                    <div className='plan' onClick={addplan}>+</div>
                
                 </div>
                 <div className='footer'> 
                   <CaretUpFilled style={{fontSize: '34px'}} /> <CaretDownFilled style={{fontSize: '34px'}} /> 
                 </div>
            </div>
            <div className='topright'>
                <div className='toprightup'>
                { isView ?  <Planview></Planview> : <Strategy data={strategy} pcs={pcs} /> }
                </div>
                <div className='toprightdown'>
                    <Space size={16}>
                        <Normalbt type="primary" onClick={changeview} ghost={isView}>策略设置</Normalbt>
                        <Normalbt type="primary" ghost={!isView} onClick={changeview}>策略预览</Normalbt>
                    </Space>
                    <Space size={16}>
                        <Normalbt  danger>删除</Normalbt>
                        <Normalbt type="primary" ghost>保存</Normalbt>
                    </Space>
                </div>
                
            </div>
       
       
        </div>
        <div className='foot'>
             <div className='start'>
                <strong>本次启用时间：</strong>  <span>{startTime}</span>
             </div>
          
            <Bigbutton type='primary'  onClick={updatestate}>确认</Bigbutton>
               
        </div>
        <CModal
        width={592}
        title='新增策略'
        ref={pref}
        onOk={planOk}
        mold="cust"
      >
        <Form   labelCol={{flex: '96px'}} style={{maxWidth: 600}} form={nameform} preserve={false}>
            <Item label="策略名称">
                <Space>
              <Item name="planName" noStyle rules={[
                {
                    required: true,
                    message: '名称必填'
                },
                {
                    max: 8,
                    type: 'string',
                    message: '名称最多8个字符'
                }
              ]}>
                <Input style={{width: '224px'}} showCount />
              </Item>
              <Text>最多8个字符</Text>
              </Space>
            </Item>
        </Form>
      </CModal>
    </Mainbox>
  )
}

const Planview = () => {
    const dateCellRender =(value) => {
        let date = value.date()
        console.log(date)
        return (
            <Datebox>
            <span >{date}日</span>
            <span className='el'>充电</span>
            </Datebox>
        )
    }
    const items = Array.from({length: 94}, (v, i) => ({index: i, type: i > 20 && i<40 ? 'warn' : i>=40 ? 'info' : ''}))
    console.log(items)
    return (
        <Titlelayout title={<Space size={32}><span>策略预览</span><span style={{color: '#999'}}>查看策略执行计划及内容</span></Space>} bordered={'n'} style={{flex: 1}}>
            <Viewbox>
                <div style={{height: '386px'}}>
                    <CustCalendar fullscreen={false} dateFullCellRender={dateCellRender} /> 
                </div>
                <div className='detl'>
                   <div className='title'>策略详细</div>
                   <div className='content'>
                      <Descriptions  bordered column={1} size="small">
                        <Descriptions.Item label="策略名称">充电</Descriptions.Item>
                        <Descriptions.Item label="策略模板">削峰平谷</Descriptions.Item>
                        <Descriptions.Item label="优先级">2</Descriptions.Item>
                       </Descriptions>
                       <Divider/>
                       <div className='list'>
                         {items.map(i => <Itembox type={i.type} />)}
                       </div>
                   </div>
                  
                </div>
            </Viewbox>
        </Titlelayout>
    )
}
const Strategy = ({data, pcs}) => {
   let checkpcs = pcs?.map(p => ({label: p.name, value: p.id})) || [];
   const [options, setOptions] = useState(
    [
      {label: '周一', value: 1},
      {label: '周二', value: 2},
      {label: '周三', value: 3},
      {label: '周四', value: 4},
      {label: '周五', value: 5},
      {label: '周六', value: 6},
      {label: '周日', value: 7},
    ]
   )
   return (
      <Titlelayout title='运行计划设置' bordered={'n'}>
         <Formbox   labelCol={{flex: '96px'}} labelAlign="left">
          
            <Item  label="模板名称" tooltip="最长8个字符" name="name">
                 <Input style={{width: '200px'}} />
            </Item>
            <Item  label="执行周期" name="executionCycle">
                <Select
                  style={{width: '200px'}}
                  options={[
                    {
                        label: '每天重复',
                        value: 1
                    },
                    {
                        label: '长期',
                        value: 2
                    },
                    {
                        label: '每周重复',
                        value: 3
                    }
                  ]}
                ></Select>               
            </Item>
            
            <Item label="选择重复" name="dateChoose"  className='datechoose' >
                <Checkbox.Group options={options}    />  
            </Item>
             
            <Item  label="策略模板" name="strategyId">
                <Select
                  fieldNames={{label: 'name', value: 'id'}}
                  style={{width: '100%'}}
                  options={data}
                ></Select>               
            </Item>
            <Item  label="储能子系统" name="pcsIds">
                 <Checkbox.Group options={checkpcs}    />        
            </Item>
            <Item  label="优先级" className='priority' name="priority">
                <Select
                  style={{width: '200px'}}
                  options={[
                    {
                        label: '1',
                        value: 1
                    },
                    {
                        label: '2',
                        value: 2
                    },
                    {
                        label: '3',
                        value: 3
                    }
                  ]}
                ></Select>               
            </Item>
            <Item label="生效日期" className='date'>
                   <RangePicker style={{width: '100%'}} />
            </Item>
          {/*   <Item label='' > 
                   <Checkbox.Group options={options} defaultValue={[1,2,3,4,5,6]}    /> 
            </Item> */}
           
         </Formbox>
         
      </Titlelayout>
   )

}
const Comfoot = () => {
    return (
        <>
           <Space size={16}>
               <Title level={4}>手动模式运行时长：</Title>
               <Timeipt /><Text>天</Text>
               <Timeipt /><Text>时</Text>
               <Timeipt /><Text>分</Text>
            </Space>
            <Space>
            <Title level={4}>本次启用时间：</Title>
               <Timeipt /><Text>天</Text>
               <Timeipt /><Text>时</Text>
               <Timeipt /><Text>分</Text>
            </Space>
            <Space size={32}>
                <Bigbutton type='primary'  >启用手动模式</Bigbutton>
                <Bigbutton type='primary'   disabled>停止手动模式</Bigbutton>
            </Space>
        </>
    )
}
export default function Index(props) {
    return (
        <Automate {...props} Foot={Comfoot} Strategy={Strategy}   />
    )
}