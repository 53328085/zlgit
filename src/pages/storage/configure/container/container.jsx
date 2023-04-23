import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, message, InputNumber, Select, Switch, Alert} from 'antd'
import {CheckCircleFilled } from '@ant-design/icons'
import {useAntdTable} from 'ahooks'
import {StorageContainerDesigner} from '@api/api'
import {custMsg}  from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
import {CustButton} from '@com/useButton'
import UseTabel from '@com/useTable'
const {Text, Link, Title} = Typography
const {Item} = Form
const Mainbox = styled.div`
    && {
       flex: 1;
       color:#515151;
       padding-top: 16px;
        
      
       }
`

const Pinfo = styled.p`
display: flex;
align-items: center;
font-size: 16px;
justify-content: center;
`
export default function Index({projectId, siteId, areaId, CModal}) {
 

const columns = [

]

 const getData = ({current, pageSize}) => { // areaId, sisteId 参数暂时设置为0 ，后续需求改变后再加
    let params = {projectId, areaId: 2, siteId:0, pageNum: current, pageSize }
    return StorageContainerDesigner.GetContainers(params).then(res => {
      let {success, data} = res


    })
 }

  
 const {loading, run} = useAntdTable(getData, {
    defaultPageSize: 14,
    refreshDeps: [projectId],
    onSuccess: (data) => {
        console.log(data)
    },
    onError: (e) => {
        console.log(e)
    }
 })

 const rref = useRef()
 const onClose = () => {
  rref.current.onCancel();
  //run() 
}
  /* const [form] = Form.useForm()
  const rref = useRef()
 
  const onClose = () => {
    rref.current.onCancel();
    run() 
  } 
  const [sLoading, setSloading] = useState(false)
  const  Updatedata =  async () => {
    setSloading(true)
    let values
    try {
       values = await form.validateFields().then(res => res).catch(e => {
            console.log(e)
        })
       
   
    console.log(values)
    if(!values) return setSloading(false)
    let {antiReflux, demandControl, ...rest} = values   
    let params = {
        antiReflux: Number(antiReflux), 
        demandControl: Number(demandControl),
        ...rest,
        id: pid.current, 
        areaId,
    }
    let {success, errMsg} = await StorageParameterSetupDesigner.Setup({projectId, params}) 
     if (success) {
        setSloading(false)
        rref.current.onOpen()
     }else {
        setSloading(false)
        custMsg({success: false, content: errMsg || '数据出错'})
     }

    }catch(e){
        setSloading(false)
        custMsg({success: false, content: '请求出错'})
        console.log(e)
    } */
  
  /*  if (success) {
    rref.current.onOpen()
    
      
      
   }else {
    custMsg({content: '设置失败', success: false})
   }
   } catch (error) {
    console.log(error)
   }
     
  } */
 
 
  return (
    <Titlelayout title='储能柜管理'>
          <Mainbox>
             <UseTabel columns={columns}></UseTabel>
          
            </Mainbox>
       
       
       
         
          <CModal width={592} title="操作提示" ref={rref}   mold='cust' footer={<Button type='primary' onClick={onClose}>关闭</Button>}>
          <Pinfo style={{lineHeight: '48px', fontSize: '16px'}}><CheckCircleFilled style={{color: '#237ae4', marginRight: '12px', fontSize: '48px'}}/> 运行功率设置成功！</Pinfo>
         
     </CModal>  
    </Titlelayout>
  )
}
