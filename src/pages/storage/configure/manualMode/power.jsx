import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, message, InputNumber, Select, Switch} from 'antd'
import {CheckCircleFilled } from '@ant-design/icons'
import {StorageParameterSetupDesigner} from '@api/api'
import {custMsg}  from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
import {CustButton} from '@com/useButton'
const {Text, Link, Title} = Typography
const {Item} = Form
const Mainbox = styled.div`
    && {
       flex: 1;
       color:#515151;
       margin-top: 16px;
       border-top: 1px dotted #d7d7d7;
       padding: 16px 0 16px 0;
       display: grid;
       grid-template-rows: 122px 36px;
       row-gap: 16px;
       grid-template-columns: 800px;
       }
`
const Formbox = styled(Form)`
    && {
        display: grid;
        grid-template-columns: repeat(2, 432px) ;
        grid-template-rows: 404px;
        column-gap: 32px;
        .items {
            display: grid;
            padding: 32px; 
            grid-template-rows: repeat(7, 36px);
            row-gap: 16px;
            border: 1px solid #ccc;
        }
         .ant-form-item {
            margin-right: 0;
            .ant-form-item-control {
                align-items: flex-end;
            }
            .ant-form-item-control-input-content {
                width: 168px;
            }
        }
    }
`
const Pinfo = styled.p`
display: flex;
align-items: center;
font-size: 16px;
justify-content: center;
`
export default function Manual({projectId,  areaId, CModal}) {
 
  // UpdateSiteOnOffGrid
 
  const pid = useRef()
  const  QueryRuntimeSetting= async () => {
       try {
        let {success, data} = await StorageParameterSetupDesigner.QuerySetup(projectId, areaId)
       if (success) {
        let {id, ...init} = data
        pid.current = id
        
        form.setFieldsValue({
             ...init
         })  
       }
       
       } catch (error) {
        console.log(error)
       }
       
  }    
  const [form] = Form.useForm()
  const rref = useRef()
 
  const onClose = () => {
    rref.current.onCancel();
    QueryRuntimeSetting() 
  } 
  const  Updatedata = async () => {
   try {
    let values = await form.validateFields().then(res => res).catch(e => {
        console.log(e)
    })
    if(!values) return
    let {p, q} = values   
    let params = {
        p, 
        q,
        id: pid.current,
        projectId
    }
   let {success}  = await StorageParameterSetupDesigner.Setup(params)
   if (success) {
    rref.current.onOpen()
    
      
      
   }else {
    custMsg({content: '设置失败', success: false})
   }
   } catch (error) {
    console.log(error)
   }
 
     
  }
  useEffect(() => {
   // QueryRuntimeSetting()

  }, [projectId, areaId])
  return (
    <Titlelayout title={<div style={{display: 'flex', justifyContent: 'space-between'}}><span>参数设置</span><Space size={16}><CustButton type='primary' onClick={QueryRuntimeSetting}>读取</CustButton><CustButton type='primary'>设置</CustButton></Space></div>}>
        <Mainbox>
             
            <Formbox layout="inline" form={form}  >
                    <div className='items'>
                        <Item label="储能容量" name="capacity">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="温度上限" name="tempUpperLimit"   rules={[
                            {
                                required: true, 
                            }
                        ]}>
                          <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="℃" style={{width: '168px'}}  /> 
                        </Item> 
                        <Item label="SOC上限" name="socUpperLimit">
                            <Input addonAfter="%" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="SOC下限" name="socLowerLimit"   rules={[
                            {
                                required: true, 
                            }
                        ]}>
                        <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="%" style={{width: '168px'}}  /> 
                        </Item>
                        <Item name='chargeMode' label="充电模式">
                            <Select options={[
                                {
                                  label: '固定模式',
                                  value: 1,
                                },
                                {
                                    label: '计划模式',
                                    value: 2,
                                  }
                            ]}></Select>
                        </Item>
                        <Item name='disChargeMode' label="放电模式">
                            <Select  options={[
                                {
                                  label: '固定模式',
                                  value: 1,
                                },
                                {
                                    label: '计划模式',
                                    value: 2,
                                  },
                                  {
                                    label: '负荷跟踪',
                                    value: 3,
                                  }
                            ]}></Select>
                        </Item>
                        <Item name='antiReflux' label="防逆流">
                        <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            style={{
                                width: "64px",
                            }} />
                        </Item>
                    </div>   
                    <div className='items'>
                    <Item label="变压器最大需量" name="transformMaxDemand">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="需量上限系数" name="demandLimitCoefficient"   rules={[
                            {
                                required: true, 
                            }
                        ]}>
                          <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="%" style={{width: '168px'}}  /> 
                        </Item> 
                        <Item label="电网供电功率下限" name="demandLimitCoefficient">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="电网供电功率下限误差" name="demandLimitCoefficient"   rules={[
                            {
                                required: true, 
                            }
                        ]}>
                        <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item>
                        <Item name='maxVSingleThreshold' label="最高电压单体门限">
                        <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="v" style={{width: '168px'}}  /> 
                        </Item>
                        <Item name='minVSingleThreshold' label="最低电压单体门限">
                         <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="v" style={{width: '168px'}}  /> 
                        </Item>
                        <Item name='demandControl' label="需量控制">
                        <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            style={{
                                width: "64px",
                            }} />
                        </Item>

                    </div>
                </Formbox> 
            </Mainbox>
       
       
       
         
          <CModal width={592} title="操作提示" ref={rref}   mold='cust' footer={<Button type='primary' onClick={onClose}>关闭</Button>}>
          <Pinfo style={{lineHeight: '48px', fontSize: '16px'}}><CheckCircleFilled style={{color: '#237ae4', marginRight: '12px', fontSize: '48px'}}/> 运行功率设置成功！</Pinfo>
         
     </CModal>  
    </Titlelayout>
  )
}
