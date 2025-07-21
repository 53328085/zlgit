import React,{useEffect, useMemo, useRef, useState} from 'react'
import {Space, Form, Typography, message, Select} from 'antd'
import Pagecount from '@com/pagecontent'
 
import UserTable from "@com/useTable";
import Titlelayout from '@com/titlelayout';
import {CustButtonT,ExportExcel} from "@com/useButton"
import {useOutletContext} from "react-router-dom"
import CModal from '@com/useModal'
import {useQueryACModels,useInsertOrUpdateACModel, useDeleteACModel } from "./api"
import {cols,items} from './data'
import {TitleBox} from './style'
 
 
const {Link} = Typography
export default function Index() {
  const {projectId} = useOutletContext()
 
  const delref= useRef()
  const aref=useRef()
  const [form]=Form.useForm()
  const [lists, setLists] = useState([])
  const [isAdd, setIsAdd] = useState(true)
  const [title, msg,operate] = useMemo(()=> {
    let t = isAdd ? "新增空调类型" : "编辑空调类型"
    let msg = isAdd ? "新增成功": "编辑成功"
    let operate = isAdd ?1 : 2
    return [t, msg,operate]
  },[isAdd])
  const getList = async()=> {
     try {
       let {success, data, errMsg} = await useQueryACModels({projectId})
       if(success && Array.isArray(data)) {
         setLists(data)
       }else  {
        setLists([])
        if(!success) message.warning(errMsg)
       }
     } catch (error) {
       
     }
  }
  const onAdd =()=> {
    setIsAdd(true)
    form.setFieldValue("id",0)
    aref.current.onOpen()
  }
  const onOK =async()=> {
    try {
      let values =   await form.validateFields()     
      let {success, errMsg} =   await useInsertOrUpdateACModel({operate}, {...values, projectId})
    
      if(success) {
        message.success(msg)
        getList()
        if(!isAdd) {
          aref.current.onCancel()
        }
      }else {
        message.warning(errMsg)
      }
    } catch (error) {
       return Promise.reject(error)
    }
  }
  const idRef = useRef()
  const onDel=(row)=> {
    idRef.current = row.id
    delref.current.onOpen()
  }
  const onEdit=(row)=> {
     setIsAdd(false)
     form.setFieldsValue(row)
     aref.current.onOpen()     
  }
  console.log(cols)
  const columns = [
    ...cols,
    {
      title: "操作",
      dataIndex: "opt",
      render: (_, row)=> <Space size={32}><Link onClick={()=> onEdit(row)}>编辑</Link><Link type="danger" onClick={()=> onDel(row)}>删除</Link></Space>
    }
  ]
  const onOkDel=async()=> {
     try {
      let {success, errMsg} = await useDelete({projectId, id:idRef.current})
      if(success) {
        message.success("删除成功")
        delref.current.onCancel()
        getList()
      }else {
        message.warning(errMsg || "数据错误")
      }
     } catch (error) {
      
     }
  }

  useEffect(()=> {
   if(Number.isInteger(projectId)) {
    getList()
   }
  },[projectId])
  const ctitle=(<TitleBox>
<span>配置空调类型</span>
<Space><CustButtonT text="new" onClick={onAdd}></CustButtonT><ExportExcel></ExportExcel></Space>
  </TitleBox>)
  return (
    <Pagecount pd="0">
      <Titlelayout layout="flex" title={ctitle}>
        <UserTable columns={columns} dataSource={lists}></UserTable>
      </Titlelayout>
      <CModal title={title}  ref={aref} width={560} mold="cust"   onOk={onOK} custft={isAdd} >
        <Form form={form} layout="vertical" preserve={false}>
         {items}
        </Form>
        </CModal>
        <CModal title="删除路灯类型"  ref={delref} width={512} mold="cust" type="warn" onOk={onOkDel} >
        是否确认删除路灯类型？
               </CModal>
    </Pagecount>
  )
}

