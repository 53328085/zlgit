import React, { useEffect, useState, useRef } from 'react'
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
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 36px 36px;
        row-gap: 16px;
        
        width: 800px;
        padding: 16px;
        border: 1px solid #ccc;
         .ant-form-item {
            margin-right: 0;
        }
    }
`
 
export default function Manual({projectId,  areaId}) {
 
  // UpdateSiteOnOffGrid
 
  const pid = useRef()
  const  QueryRuntimeSetting= async () => {
       try {
        let {success, data} = await RuntimePowerSettingDesigner.QueryRuntimeSetting(projectId, areaId)
       if (success) {
        console.log(data)
        let {id, p, q} = data 
        pid.current = id
        form.setFieldsValue({
            cp:p,
            cq: q,
            p: '',
            q: ''
         })  
       }
       
       } catch (error) {
        console.log(error)
       }
       
  }    
  const [form] = Form.useForm()
 
  const  Updatedata = async () => {
   try {
    let values = await  form.validateFields().then(res => {
        return res
      }).catch(e => {
        console.log(e)
      })
    let {p, q} = values   
    let params = {
        p, 
        q,
        id: pid.current,
        projectId
    }
   let {success}  = await RuntimePowerSettingDesigner.UpdateP(params)
   if (success) {
    custMsg({content: '设置成功'})
       QueryRuntimeSetting() 
      
   }else {
    custMsg({content: '设置失败', success: false})
   }
   } catch (error) {
    console.log(error)
   }
 
     
  }
  useEffect(() => {
    QueryRuntimeSetting()

  }, [projectId, areaId])
  return (
    <Titlelayout title="系统运行功率设置">
        <Mainbox>
             
            <Formbox layout="inline" form={form}  >
                    
                        <Item label="当前有功功率" name="cp">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="设置有功功率" name="p" style={{justifySelf: 'end'}} rules={[
                            {
                                required: true,
                                message: '请输入有功功率数值'
                            }
                        ]}>
                          <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item> 
                        <Item label="当前无功功率" name="cq">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="设置无功功率" name="q" style={{justifySelf: 'end'}} rules={[
                            {
                                required: true,
                                message: '请输入无功功率数值'
                            }
                        ]}>
                        <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item>
                       
                    
                </Formbox>
                <Item nostyle style={{justifySelf: 'end'}}>
                            <Button type="primary" onClick={Updatedata}>确定</Button>
                 </Item>
           
               
            </Mainbox>
       
       
       
         
         {/* <CModal width={554} title="重置密码" ref={rref} onOk={restOk}  mold='cust' >
         <p>账号： <Link>{Record.name}</Link>， 密码将被重置为<Link>{newpwd.current}</Link></p>
         
     </CModal> */}
    </Titlelayout>
  )
}
