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
import {Serach} from "@com/comstyled"
import {AreaSelect} from "@com/useSerach/comhead"
import {usePage,useAdd,useUpdate,useDelete } from "./api"
import {cols,rules, w224,options} from "./data"
import {Mainbox, Frombox,Title} from './style'
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
   let title = isadd ? "新增园区路灯" : "编辑园区路灯"
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
  const onOk= async()=> {
    try {
      let values = await newform.validateFields()
      
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
      render: (_, row)=> <Space><Link onClick={()=> onEdit(row)}>编辑</Link><Link type="danger" onClick={()=> onDel(row)}>删除</Link></Space>
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
           
            <ExportExcel tb={tbref}></ExportExcel>
          </Space>
 </Title>
  return (
    <Pagecount pd="0" bgcolor="none">
        <Mainbox>
        <div className="search">
          <Form form={form} layout="inline"  >
            <Form.Item name="areaId" initialValue={0}>
            <AreaSelect style={{width: "264px"}} isall={{name: "全部", id:0}} onChange={submit} />
            </Form.Item>
            <Form.Item label="设备查询" name="alike" style={{marginLeft: "16px"}} >
         <Serach onSearch={submit} />
            </Form.Item>
          </Form>
         
         </div>
      <Titlelayout layout="flex" title={title}>
      
       
        <UserTable columns={columns} {...tableProps} onExport={onExport} ref={tbref}  sheetName="路灯档案"></UserTable>
        
       
      </Titlelayout>
      </Mainbox>
       <CModal title={Ctitle}   onOk={onOk}   width={832} mold="cust" custft={isadd}  ref={editRef}>
        <Form form={newform} labelAlign="right" labelCol={{flex: "7em"}} preserve={false}>
          <Frombox>
            <div>
          <Form.Item label="所属园区" rules={rules} name="areaId">
            <AreaSelect style={w224} />
          </Form.Item>
          <Form.Item label="安装地址" rules={rules} name="address">
            <Input style={w224} />
          </Form.Item>
          <Form.Item label="备注"   name="remark"  >
            <Input.TextArea  rows={2} style={w224} />
          </Form.Item>
          </div>
          <div>
          <Form.Item label="路灯名称" rules={rules}   name="name">
            <Input style={w224} />
          </Form.Item>
          <Form.Item label="路灯型号" rules={rules}  name="model">
            <Input></Input>
          </Form.Item>
          <Form.Item label="路灯编号" rules={rules}  name="no">
            <Input></Input>
          </Form.Item>
          <Form.Item label="所属计量设备" rules={rules}  name="mSn">
            <Input placeholder='请输入电表sn'></Input>
          </Form.Item>
          <Form.Item label="所属控制器编号"   name="cSn">
            <Input placeholder="请输入路灯控制器"></Input>
          </Form.Item>
          <Form.Item label="路灯类型"   name="type">
            <Select options={options}></Select>
          </Form.Item>
          <Form.Item name="id" noStyle initialValue={0}>
            <Input hidden></Input>
          </Form.Item>
          <Form.Item name="projectId" noStyle>
            <Input hidden></Input>
          </Form.Item>
          </div>
          </Frombox>
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

