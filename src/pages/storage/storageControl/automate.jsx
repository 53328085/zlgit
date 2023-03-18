import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox} from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import {nanoid} from "@reduxjs/toolkit"
import imgurl from './icon'
import Titlelayout from '@com/titlelayout'

const {Text, Link, Title} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-rows: 608px 104px;
       row-gap: 16px; 
       flex: 1;
       color:#515151;
       .top {
        display: grid;
        grid-template-columns: 174px 1460px;
        column-gap: 16px;
        .topleft {
            grid-auto-rows: 64px;
            row-gap: 16px;
            display: grid;
            .move {
                grid-column: -1 / -2;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
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
          .topright {
             border: 1px solid rgba(215, 215, 215, 1); 
            
             border-radius: 0px;
             box-shadow: none;
             display: grid;
             grid-template-rows: 1fr 56px;
             .toprightup {
                padding: 32px;
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
        }
       }
`
const Formbox = styled(Form)`
    && {
        display: grid;
        grid-auto-rows: 36px;
        grid-template-columns: 646px;
        row-gap: 32px;
        padding-top: 32px;
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
 function Automate({projectId, Foot, Strategy, CModal}) {
  const [nameform] = Form.useForm()
  const [plans, setPlan] = useState([
    {name: '充电计划', id: 1},
    {name: '放电计划', id: 2},
    {name: '维护计划', id: 3},
  ])  

  const [curplan, setCurplan] = useState(plans[0]?.id)
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
  const planOk = () => {
    let {planName} = nameform.getFieldsValue(); 
    setPlan([...plans, {name: planName, id: nanoid()}])
    pref.current.onCancel()
  }
 
  return (
    <Mainbox>
        <div className='top'>
            <div className='topleft'> 
                 {plans.map(p => <div key={nanoid()} className={curplan == p.id ? 'plan active' : 'plan'} onClick={() => onPlan(p)}>
                     {p.name}  {curplan == p.id && <CaretRightOutlined style={{position: "absolute", right: '16px'}}  />}
                    </div>)
                    } 
                   
                 <div className='plan' onClick={addplan}>+</div>
                 { showarrow && <div className='move'>
                   <CaretUpFilled style={{fontSize: '34px'}} /> <CaretDownFilled style={{fontSize: '34px'}} />
                 </div>
                 }
            </div>
            <div className='topright'>
                <div className='toprightup'>
                     <Strategy /> 
                </div>
                <div className='toprightdown'>
                    <Space size={16}>
                        <Normalbt type="primary">策略设置</Normalbt>
                        <Normalbt type="primary" ghost>策略预览</Normalbt>
                    </Space>
                    <Space size={16}>
                        <Normalbt  danger>删除</Normalbt>
                        <Normalbt type="primary" ghost>保存</Normalbt>
                    </Space>
                </div>
                
            </div>
       
       
        </div>
        <div className='foot'>
             <Foot />
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

const Strategy = ({name='自动策略'}) => {
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
      <Titlelayout title={name} bordered={'n'}>
         <Formbox>
            <Item  label="模板名称">
                <Space>
                <Item noStyle>
                    <Input style={{width: '200px'}} />
                </Item>
                <Text>最长8个字符</Text>
                </Space>
            </Item>
            <Item  label="执行周期">
                <Select
                  style={{width: '200px'}}
                  options={[
                    {
                        label: '每天重复',
                        value: 'day'
                    },
                    {
                        label: '长期',
                        value: 'longtime'
                    },
                    {
                        label: '每周重复',
                        value: 'week'
                    }
                  ]}
                ></Select>               
            </Item>
            <Item  label="优先级">
                <Select
                  style={{width: '200px'}}
                  options={[
                    {
                        label: '1',
                        value: '1'
                    },
                    {
                        label: '2',
                        value: '2'
                    },
                    {
                        label: '3',
                        value: '3'
                    }
                  ]}
                ></Select>               
            </Item>
            <Item label="生效日期" >
                   <RangePicker />
            </Item>
            <Item label='' > 
                   <Checkbox.Group options={options} defaultValue={[1,2,3,4,5,6]}   /> 
            </Item>
            <Item  label="策略模板">
                <Select
                  style={{width: '200px'}}
                  options={[
                    {
                        label: '充电策略1',
                        value: '1'
                    },
                    {
                        label: '充电策略2',
                        value: '2'
                    },
                    {
                        label: '充电策略3',
                        value: '3'
                    }
                  ]}
                ></Select>               
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