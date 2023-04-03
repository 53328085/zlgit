import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, message, InputNumber} from 'antd'
import {ExclamationCircleFilled} from '@ant-design/icons'
import {RuntimePowerSettingDesigner} from '@api/api'
import {custMsg}  from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
const {Text, Link, Title} = Typography
const {Item} = Form
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-rows: 576px 104px;
       row-gap: 16px;
       padding-bottom: 16px;
       flex: 1;
       color:#515151;
       .top {
        display: grid;
        grid-template-columns: 554px 1fr;
        background-color: #fff;
        padding: 32px;
        .topleft {
            grid-auto-rows: 144px;
            row-gap: 64px;
            display: grid;
        .topleftitem {
            display: grid;
            grid-template-rows: 32px 96px;
            row-gap: 16px; 
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                 .ant-typography{
                    font-size: 16px;
                 }
                .cotrl {   
                    width: 240px;
                    height: 96px;
                    border-radius: 4px; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 200ms;
                 }
                 .cotrl.on {
                    border: 1px solid #237ae4;
                    color: #237ae4;
                    .ant-typography {
                        color: #237ae4;
                        font-size: 18px;
                    }
                 }
                 .cotrl.on.active { 
                    background-color: #237ae4; 
                    .ant-typography {
                        color: #fff;
                        font-size: 18px;
                    }
                 }
                 .cotrl.off {
                    border: 1px solid #ff5757;
                   
                    .ant-typography {
                        color: #ff5757;
                        font-size: 18px;
                    }
                 }
                 .cotrl.off.active {
                    background-color:  #ff5757;
                    .ant-typography {
                        color: #fff;
                        font-size: 18px;
                    }
                 }
                }
            }
          }
          .topright {
            display: grid;
            grid-template-columns: 1fr;
            grid-auto-rows: 36px;
            row-gap: 16px;
            padding-right: 64px;
            justify-items: flex-end;
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
        display: flex;
        justify-content: flex-end;
    }
`
const Bigbutton = styled(Button)`
    width: 200px;
    height: 72px;
    font-size: 18px;
    border-radius: 4px;
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
export default function Manual({projectId,  areaId}) {
 
  // UpdateSiteOnOffGrid

  const  QueryRuntimeSetting= async () => {
       let {success, data} = await RuntimePowerSettingDesigner.QueryRuntimeSetting(projectId, areaId)
  }    
  const [form] = Form.useForm()
 
  const  Updatedata = async () => {
    
       try {
        
       } catch (error) {
        
       }
     
    
     
  }
  useEffect(() => {
    QueryRuntimeSetting()

  }, [projectId, areaId])
  return (
    <Titlelayout title="系统运行功率设置">
        <div className='top'>
            <div className='topleft'>
            <Formbox layout="inline" form={form} initialValues={{
                    cp: '',
                }}>
                    <Space size={16}>
                        <Item label="当前有功功率" name="cp">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="设置有功功率" name="p">
                          <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item>
                        <Item nostyle>
                            <Button type="primary" onClick={() => Updatedata(0)}>确定</Button>
                        </Item>
                    </Space> 
               
                    <Space size={16}>
                        <Item label="当前无功功率" name="cq">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="设置无功功率" name="q">
                        <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item>
                        <Item nostyle>
                            <Button type="primary" onClick={() => Updatedata(1)}>确定</Button>
                        </Item>
                    </Space>
                </Formbox>
            </div>
            <div className='topright'>
               
            </div>
       
       
        </div>
         
         {/* <CModal width={554} title="重置密码" ref={rref} onOk={restOk}  mold='cust' >
         <p>账号： <Link>{Record.name}</Link>， 密码将被重置为<Link>{newpwd.current}</Link></p>
         
     </CModal> */}
    </Titlelayout>
  )
}
