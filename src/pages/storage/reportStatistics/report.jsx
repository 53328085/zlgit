import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions } from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import {nanoid} from "@reduxjs/toolkit"
import imgurl from './icon'
import Titlelayout from '@com/titlelayout'

const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-rows: 110px 673px;
       row-gap: 16px; 
       flex: 1;
       color:#515151;
       .top {
        display: grid;
        padding: 16px;
        grid-template-columns: repeat(3, 528px);
       grid-template-rows: 78px;
        
          
        }
        .down {
            padding: 16px;
            display: grid;
            grid-template-rows: 1fr 1fr;
        }
       }
`
 
 
 
 function Main({projectId, Foot, Strategy, CModal}) {
 
  return (
    <Mainbox>
        <div className='top'>
          
       
       
        </div>
        <div className='down'>
            
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
                   </div>

                </div>
            </Viewbox>
        </Titlelayout>
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
         <Formbox style={{width: '640px'}} labelCol={{flex: '96px'}} labelAlign="left">
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
                   <RangePicker style={{width: '100%'}} />
            </Item>
            <Item label='' > 
                   <Checkbox.Group options={options} defaultValue={[1,2,3,4,5,6]}    /> 
            </Item>
            <Item  label="策略模板">
                <Select
                  style={{width: '100%'}}
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
        <Main {...props} Foot={Comfoot} Strategy={Strategy}   />
    )
}