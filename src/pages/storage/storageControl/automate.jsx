import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker,  Calendar, Descriptions, Divider, Checkbox } from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import moment from 'moment'
import {nanoid} from "@reduxjs/toolkit"
import imgurl from './icon'
import Titlelayout from '@com/titlelayout'
import {StorageControlRuntime} from '@api/api'
import {custMsg} from '@com/usehandler'
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
        grid-template-rows: 544px;
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
                padding: 32px 32px 16px 32px;
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
        .datechoose {
            grid-row: 3;
            grid-column: 1/ 3;
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
    grid-template-columns: 516px 1fr ;
    grid-template-rows: 405px;
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
        background-color: #f0f9ff;
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

const  enumerateDaysBetweenDates = (startDate, endDate) => {  
    let daysList = [];
    let SDate=moment(startDate);
    let EDate=moment(endDate);
    let xt;
    daysList.push(SDate.format('YYYY-MM-DD'));
    while( SDate.add(1,"days").isBefore( EDate) ){   
        daysList.push( SDate.format('YYYY-MM-DD'));
    } 
    daysList.push( EDate.format('YYYY-MM-DD'));
    return daysList;
  }


  let week =  [
    {label: '周一', value: 1},
    {label: '周二', value: 2},
    {label: '周三', value: 3},
    {label: '周四', value: 4},
    {label: '周五', value: 5},
    {label: '周六', value: 6},
    {label: '周日', value: 7},
  ]
  let days = Array.from({length: 31},(v, i) => ({label: i < 9 ? '0'+ (i+1) : (i+1).toString(), value: i+1 }))
 
 
 function Automate({projectId, areaId, startTime, Strategy, CModal}) {
  console.log(moment().date())
  const [form] = Form.useForm()
  const [nameform] = Form.useForm()
  const [plans, setPlan] = useState([])  
  const [strategy, setStrategy] = useState([])
  const [pcs, setPcs] = useState([])
  const [curplan, setCurplan] = useState()
  const [isView, setIsview] = useState(false)
  const pref = useRef()
  const planName = useRef('')
  const showarrow = plans?.length > 4
  const onPlan = (p) => {
     setCurplan({
       ...p
     })
  }
  const addplan = () => {
    console.log(pref.current)
     pref.current.onOpen()

  }

   // 新增计划

  const AddRuntimePlan = async () => {
    try {
      let values = await form.validateFields().then(res => {
         
        return  Promise.resolve(res)
       }).catch(e => {
        console.log(e)
       })
       if (!values) return
       
       console.log(values)
       let {date,   ...params} = values; 
       /*  let type = params.executionCycle  // 此部分逻辑暂时不需要， 后端判断
      const datalist = enumerateDaysBetweenDates(date[0], date[1])   
      
       let week = datalist.filter(d => {     
         return dateType.includes(moment(d, 'YYYY-MM-DD').day())
       })
       let day = datalist.filter(d => {   
        
        return dateType.includes(moment(d, 'YYYY-MM-DD').date())
       })
      
        let dateChoose = {
            2: week,
            3: day
        }[type] */
       
       params.dateChoose = params.dateChoose || []
       let startDate = date[0]?.format('YYYY-MM-DD');
       let endDate = date[1]?.format('YYYY-MM-DD'); 
       try {
          let {success, errMsg} = await StorageControlRuntime.AddRuntimePlan(projectId, {...params, startDate, endDate, areaId, id: 0})
          success && custMsg({content: '保存成功', onClose: () => {
            getPlans()
          }})
       } catch (error) {
         console.log(error)
       }
      
    } catch (error) {
        console.log(error)
    }
  }

  // 删除计划
   
 const DeleteRuntimePlan = async () => {
    let {id} = curplan
    let {success, errMsg} = await  StorageControlRuntime.DeleteRuntimePlan(projectId, id)
    success && custMsg({content: '删除成功', onClose: () => {
        getPlans()
    }})
    !success && custMsg({success, content: errMsg})
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
            setCurplan(data[0])
            setPlan([...data])
        }else {
            success && setPlan([]) 
            setCurplan({})
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
                    {plans.map(p => <div key={nanoid()} className={curplan.id == p.id ? 'plan active' : 'plan'} onClick={() => onPlan(p)}>
                        {p.name}  {curplan.id == p.id && <CaretRightOutlined style={{position: "absolute", right: '16px'}}  />}
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
                { isView ?  <Planview data={curplan}></Planview> : <Strategy data={strategy} pcs={pcs} form={form} /> }
                </div>
                <div className='toprightdown'>
                    <Space size={16}>
                        <Normalbt type="primary" onClick={changeview} ghost={isView}>策略设置</Normalbt>
                        <Normalbt type="primary" ghost={!isView} onClick={changeview}>策略预览</Normalbt>
                    </Space>
                    <Space size={16}>
                        <Normalbt  danger onClick={DeleteRuntimePlan}>删除</Normalbt>
                        <Normalbt type="primary" ghost onClick={AddRuntimePlan}>保存</Normalbt>
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
        <Form   labelCol={{flex: '96px'}}  style={{maxWidth: 600}} form={nameform} preserve={false}>
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

const Planview = ({data}) => {
    let {name, strategyName, priority, pcsName, startDate, endDate } = data
   /*  const dateCellRender =(value) => {
        let date = value.date()
        console.log(date)
        return (
            <Datebox>
            <span >{date}日</span>
            <span className='el'>{name}</span>
            </Datebox>
        )
    } */
    const dateCellRender = useCallback((value) => {
        let date = value.date()
        console.log(date)
        return (
            <Datebox>
            <span >{date}日</span>
            <span className='el'>{name}</span>
            </Datebox>
        )
    }, [name])
    const items = Array.from({length: 94}, (v, i) => ({index: i, type: i > 20 && i<40 ? 'warn' : i>=40 ? 'info' : ''}))    
    return (
        <Titlelayout pv="0px" title={<Space size={32}><span>运行计划预览</span><span style={{color: '#999'}}>查看运行计划及具体内容</span></Space>} bordered={'n'} style={{flex: 1}}>
            <Viewbox>               
                <div className='detl'>
                   <div className='title'>策略详细</div>
                   <div className='content'>
                      <Descriptions  bordered column={3} size="small">
                        <Descriptions.Item label="计划名称">{name}</Descriptions.Item>
                        <Descriptions.Item label="策略模板">{strategyName}</Descriptions.Item>
                        <Descriptions.Item label="优先级">{priority}</Descriptions.Item>
                        <Descriptions.Item label="储能子系统" span={3}>{pcsName?.join(' ')}</Descriptions.Item>
                       </Descriptions>
                       <Divider/>
                       <div className='list'>
                         {items.map(i => <Itembox type={i.type} />)}
                       </div>
                   </div>
                  
                </div>
                <div style={{height: '386px'}}>
                    <CustCalendar fullscreen={false} dateFullCellRender={dateCellRender} /> 
                </div>
            </Viewbox>
        </Titlelayout>
    )
}
const Strategy = ({data, pcs, form}) => {
   let checkpcs = pcs?.map(p => ({label: p.name, value: p.id})) || [];
   const [show, setShow] = useState(1)
  const [options, setOptions] = useState(week)   
 
   const onChange = (e) => {
      let opt = ['', '', week, days][e]
      setShow(e)
      setOptions(opt)
   }
  
   return (
      <Titlelayout title='运行计划设置' bordered={'n'}>
         <Formbox   labelCol={{flex: '96px'}} labelAlign="left" form={form}  validateMessages={
       { required: "缺少'${label}' 数据"}
      }>
          
            <Item  label="模板名称" tooltip="最长8个字符" name="name" rules={[
                {required: true},
                {max: 8, type: 'string', message: '名称不能超过8个字符'}
            ]}>
                 <Input  />
            </Item>
            <Item  label="执行周期" name="executionCycle" rules={[
                  {required: true},
            ]}>
                <Select
                 
                  onChange={onChange}
                  options={[
                    {
                        label: '每日',
                        value: 1
                    },
                    {
                        label: '每周',
                        value: 2
                    },
                    {
                        label: '每月',
                        value: 3
                    }
                  ]}
                ></Select>               
            </Item>
            
            { show!== 1 && <Item label="选择重复" name="dateChoose"  className='datechoose' rules={[
                  {required: true},
            ]}>
                <Checkbox.Group options={options}    /> 
              </Item>
            }
             
            <Item  label="策略模板" name="strategyId" rules={[
                  {required: true},
            ]}>
                <Select
                  fieldNames={{label: 'name', value: 'id'}}
                 
                  options={data}
                ></Select>               
            </Item>
            <Item  label="储能子系统" name="pcsIds" rules={[
                  {required: true},
            ]}>
                 <Checkbox.Group options={checkpcs}    />        
            </Item>
            <Item  label="优先级" className='priority' name="priority" rules={[
                  {required: true},
            ]}>
                <Select
                 style={{width: '80px'}}
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
            <Item label="生效日期" className='date' name="date" rules={[
                  {required: true},
            ]}>
                   <RangePicker style={{width: '100%'}} />
            </Item>
           
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