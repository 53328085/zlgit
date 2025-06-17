import React,{useMemo, useRef, useState, useCallback} from 'react'
import {Space, Form, message, Typography, Select, Input} from 'antd'
import {useAntdTable} from "ahooks"
import {useOutletContext} from "react-router-dom"
import Pagecount from '@com/pagecontent'
import styled from 'styled-components';
import UserTable from "@com/useTable";
import Titlelayout from '@com/titlelayout';
import {CustButtonT,CustButton, ExportExcel} from "@com/useButton"
import CModal from '@com/useModal'
 
import {usePage,useAdd,useUpdate,useDelete } from "./api"
import {cols, items} from "./data"
import {Mainbox, Title} from './style'
 const {Link} = Typography


export default function Index() {
  const delref= useRef()
  const exprotref = useRef()
  const [form] = Form.useForm()
  const [newform] = Form.useForm()
  const {projectId} =useOutletContext()
  const [isadd, setIsadd] =useState(false)
  const [total, setTotal] = useState(0)
  const editRef = useRef()
  const tbref = useRef()
  const [Ctitle,msg] = useMemo(()=> {
   let title = isadd ? "新建方案" : "编辑方案"
   let msg = isadd ? "新增成功" : "编辑成功"
   return [title, msg]
  },[isadd])
  const downParams = useRef()
  const getData= async ({current, pageSize }, formData)=> { 
    try {
      if(!Number.isInteger(parseInt(projectId))) return
      const {alike="", areaId} = formData
      let params ={
        projectId,
        areaId,
        alike,
       pageNum: current,
       pageSize,
    }
    downParams.current = params
    let {data, success, total, errMsg} =await usePage({},params)

    if(success && Array.isArray(data)) {
      setTotal(total)
      return {
        list: data,
        total,
      }
    }else {
      if(!success) message.warning(errMsg || "接口出错" )
      return {
        list: [],
        total:0
      }
    }
    } catch (error) {
      console.log(error)
    }

  }
  const {tableProps, search, refresh} = useAntdTable(getData, {
    form,
    defaultPageSize: 14,
    refreshDeps: [projectId]
  })
  const {submit} = search
  const onAdd=()=> {
     setIsadd(true)
     newform.setFieldValue("projectId", projectId)
     editRef.current.onOpen()
  }
  const onBind=()=>{}
  const delparams = useRef()
  const onDel=({id})=> {
     delparams.current={
      id,
      projectId
     }
     delref.current.onOpen()
  }
  const onEdit=(row)=> {
    setIsadd(false)
    const {projectId:id, ...params} = row

    newform.setFieldsValue({...params, projectId},)
    editRef.current.onOpen()
  }
  const onClone=()=>{

  }
  const onOk= async()=> {
    try {
      let values = await newform.validateFields()
      console.log(values)
      let hander = isadd ? useAdd : useUpdate;
      let {success, errMsg} =await hander({}, values)
      if(success) {
        message.success(msg)
        if(!isadd) {
          editRef.current.onCancel()
        }
        refresh()
      }else {
        message.warning(errMsg || "数据出错")
      }

    } catch (error) {
      return Promise.reject("")
    }

  }
  const onOkDel=async()=> {
     try {
      let {success, errMsg} = await useDelete(delparams.current)
      if(success) {
        message.success("删除成功")
        delref.current.onCancel()
        refresh()
      }else {
        message.warning(errMsg || "数据出错")
      }
     } catch (error) {
      
     }
  }
  
  const showexport = ()=> {
    exprotref.current.onOpen()
  }
  const columns = [
    ...cols,
    {
      title: '操作', 
      key:'option',
      render: (_, row)=> <Space><Link onClick={()=> onEdit(row)}>编辑</Link><Link onClick={()=> onClone(row)}>克隆</Link><Link type="danger" onClick={()=> onDel(row)}>删除</Link></Space>
    },
  ]
  const onExport =useCallback(() => {  
    downParams.current.pageSize=1;
    downParams.current.pageSize=total
    return   usePage({}, downParams.current).then(res => {
      let {success, data, total} =res
      if(success && Array.isArray(data)) { 
        return {
          list: data,
          total,
        }
      }else {
        if(!success) message.warning(errMsg || "接口出错" )
        return {
          list: [],
          total:0
        }
      }

    })
 }, [total])
 const title=<Title>
  <span>路灯控制方案列表</span>
  <Space size={16}>
            <CustButton   onClick={()=> onAdd()}>新建方案</CustButton>
            <CustButton   onClick={()=> onBind()}>绑定方案</CustButton>
            <ExportExcel tb={tbref}></ExportExcel>
          </Space>
 </Title>
  return (
    <Pagecount pd="0" bgcolor="none">
        <Mainbox>
        <div className="search">
          <Form form={form} layout="inline"   colon={false} >
            <Space>
            <Form.Item name="areaId" label="方案名称">
              <Input placeholder='请输入'></Input>
            </Form.Item>
            <Form.Item label="创建人" name="alike"   >
               <Input placeholder='请输入'></Input>
            </Form.Item>
            <Form.Item>
              <CustButton>查询</CustButton>
            </Form.Item>
            </Space>
          </Form>
         
         </div>
      <Titlelayout layout="flex" title={title}>
      
       
        <UserTable columns={columns} {...tableProps} onExport={onExport} ref={tbref}  sheetName="路灯档案"></UserTable>
        
       
      </Titlelayout>
      </Mainbox>
       <CModal title={Ctitle}   onOk={onOk}   width={1380} mold="cust" custft={isadd}  ref={editRef}>
        <Form form={newform} labelAlign="right" labelCol={{flex: "7em"}} preserve={false} size="small" colon={false}>
         {items}
        </Form>
       </CModal>
        <CModal title="删除"  ref={delref} width={512} mold="cust" type="warn" onOk={onOkDel} >
                 是否确认删除备件？
               </CModal>
               <CModal title="批量导入"  ref={exprotref} width={512}   type="drag" onOk={onOkDel} > 
               </CModal>
    </Pagecount>
  )
}

