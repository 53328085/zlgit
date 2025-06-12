import React,{useMemo, useRef, useState} from 'react'
import {Space, Form, message, Typography, Select} from 'antd'
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
import {usePage} from "./api"
import {cols,rules, w224} from "./data"
 const {Link} = Typography
 const Mainbox = styled.div`
   display: flex;
   flex:1;
   flex-direction: column;
   row-gap: 16px;
   .search {
     display: flex;
     justify-content: space-between;
     align-items: center;
   }
 `
 

export default function Index() {
  const delref= useRef()
  const [form] = Form.useForm()
  const [newform] = Form.useForm()
  const {projectId} =useOutletContext()
  const [isadd, setIsadd] =useState(false)
  const [Ctitle] = useMemo(()=> {
   let title = isadd ? "新增园区路灯" : "编辑园区路灯"
   return [title]
  },[isadd])

  const getData= async ({current, pageSize }, formData)=> { 
    try {
      if(!Number.isInteger(parseInt(projectId))) return
      const {alike, areaId} = formData
      let params ={
        projectId,
        areaId,
        alike,
       pageNum: current,
       pageSize,
    }
    let {data, success, total, errMsg} =await usePage({},params)
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
    } catch (error) {
      console.log(error)
    }

  }
  const {tableProps} = useAntdTable(getData, {
    form,
    defaultPageSize: 14,
    refreshDeps: [projectId]
  })
  const onAdd=()=> {
     setIsadd(true)
  }
  const onDel=()=> {

  }
  const onEdit=()=> {
    setIsadd(false)
  }
  const onOk=()=> {}
  const onOkDel=()=> {}

  const columns = [
    ...cols,
    {
      title: '操作', 
      key:'option',
      render: (_, row)=> <Space><Link onClick={()=> onEdit(row)}>编辑</Link><Link type="danger" onClick={()=> onDel(row)}>删除</Link></Space>
    },
  ]

  return (
    <Pagecount pd="0">
      <Titlelayout layout="flex" title="路灯档案">
        <Mainbox>
         <div className="search">
          <Form form={form} layout="inline" >
            <Form.Item name="areaId" initialValue={0}>
            <AreaSelect style={{width: "264px"}} isall={{name: "全部", id:0}} />
            </Form.Item>
            <Form.Item label="设备查询" name="alike" style={{marginLeft: "16px"}} >
         <Serach/>
            </Form.Item>
          </Form>
          <Space size={16}>
            <CustButtonT text="new" onClick={()=> onAdd()}></CustButtonT>
            <CustButton>批量导入</CustButton>
            <ExportExcel></ExportExcel>
          </Space>
         </div>
        <UserTable columns={columns} {...tableProps}></UserTable>
        </Mainbox>
       
      </Titlelayout>
       <CModal title={Ctitle}   onOk={onOk}   width={832} mold="cust" >
        <Form form={newform} labelAlign="right" labelCol={{flex: "7em"}}>

          <Form.Item label="所属园区" rules={rules} name="areaId">
            <AreaSelect style={w224} />
          </Form.Item>
          <Form.Item label="安装地址" rules={rules} name="address">
            <Input style={w224} />
          </Form.Item>
          <Form.Item label="备注"   name="remark">
            <Input.TextArea  rows={2} style={w224} />
          </Form.Item>
          <Form.Item label="路灯名称"   name="name">
            <Input style={w224} />
          </Form.Item>
          <Form.Item label="路灯型号"   name="model">
            <Input></Input>
          </Form.Item>
          <Form.Item label="路灯编号"   name="no">
            <Input></Input>
          </Form.Item>
          <Form.Item label="所属计量设备"   name="mSn">
            <Input ></Input>
          </Form.Item>
          <Form.Item label="所属控制器编号"   name="cSn">
            <Input ></Input>
          </Form.Item>
        </Form>
       </CModal>
        <CModal title="删除"  ref={delref} width={512} mold="cust" type="warn" onOk={onOkDel} >
                 是否确认删除备件？
               </CModal>
    </Pagecount>
  )
}

