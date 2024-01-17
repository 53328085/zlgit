import React, { useEffect, useMemo, useState,useRef } from 'react'
import styled from 'styled-components'
 
import { Select, Divider, Input, Button, message, Form, Space, Typography} from 'antd'
import { useSelector } from 'react-redux'
import Table from '@com/useTable'
import {operationDesigin} from '@api/api'
import {SetLine} from './addcomp'
import commonstyle from './commonstyle.module.less'
import {SetPosition} from './position'
import Modal from '@com/useModal' 
import {publishState} from '@redux/systemconfig'
import CustContext from '@com/content.js'
import { useLatest, useAntdTable } from 'ahooks';
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import {Serach} from '@com/comstyled'
import Mask from "@com/mask"
const {Item} = Form
const {Link} = Typography
const ContainerDiv = styled.div`
 display: grid;
 grid-template-rows: 32px 1px 1fr;
 row-gap: 32px;
 padding-top: 16px;
 flex: 1;
.pdtop8{
  padding-top: 8px;
}
.pdbottom12{
  padding-bottom: 12px;
}
.searchbtn:hover,.searchbtn:focus{
  border-color: #d9d9d9 !important;
  color: #000;
}
.flexcss{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btncss{
   width: 96px;
   height: 32px;
   background-color: #237ae4;
   border-radius: 2px;
   color: #fff;
   text-align: center;
   line-height: 32px;
   cursor: pointer;
   &:hover{
    opacity: .7;
   }
}
`
export default function Index() {
  const [form] = Form.useForm() 
  const publish =useSelector(publishState)
  const onelevel = useSelector(state => state.system.onelevel);
  const projectId = useSelector(state => state.system.menus.projectId)
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName+'(全部)', id: 0 }, ...onelevel]), [onelevel]) : []  
  const setlineRef =useRef()
  const editRef = useRef()
  const delModalRef=useRef()
  let editRowData;
  let delId;
 
 
  const lng = useLatest('0,0')
  let columns = [
    
    {title:'设备名称',dataIndex:'name'},
    {title:'安装地址',dataIndex:'address'},
    {title:'设备编号',dataIndex:'sn'},
    {title:'设备型号',dataIndex:'category'},
    {title:'所属网关',dataIndex:'gateway',render(text){return text?text:'/'}},
    // {title:'用能类型',dataIndex:'customerType',render(text){return text===1?'客户':text===2?'公共':'/'}},
    {title:'备注',dataIndex:'remark',render(text){return text?text:'/'}},
    {title:'操作',dataIndex:'',width:180,render:(text)=>{
    return(
      <Space size={32}>
       <Link underline onClick={()=>{editPosition(text)}}>编辑坐标</Link>
       <Link type="danger" underline onClick={()=>{delId=text.sn;delModalRef.current.onOpen()}}>删除</Link>
      </Space>
   )  
    }}
  ]
  onelevel[0]&&(columns=[{title:onelevel[0]?.levelName,dataIndex:'area'},...columns])
  columns.forEach(it=>{it.align="center"})
  if(publish){
    columns.pop()
  }
  const [areaId, setAreaid] =useState(0)
  const [targ, setTarg] = useState(false)
  //获取设备
  const getQueryPageDevice=({current, pageSize}, formData)=>{
    let {areaId: id, alike} = formData
    setAreaid(id)
    let params={
      projectId,
      pageNum: current,
      pageSize,
      areaId: id,
      alike,
    } 
  return operationDesigin.QueryPageDevice(params).then(res => {
    let {success, total, data} = res
  if(success){
     return {
       list: Array.isArray(data) ? data : [],
       total
     }
   
   }else{
    return {
      list:   [],
      total: 0
    }
    }
  })
}
const {tableProps, refresh, search} = useAntdTable(getQueryPageDevice, {
  form,
  defaultPageSize: 14,
})
const {submit} = search
   //打开新增
  const addDevice=()=>{
    if(onelevel.length == 0){
      message.warning('请新增园区!')
      return 
    }
  //  setlineRef.current.setOpen(true)
    setTarg(true)
    setlineRef.current.getQueryDeviceList()
  }
  //打开编辑
  const editPosition=(text)=>{
    editRowData=text
    lng.current = {
      lngLat:text?.lngLat,
      lngLatAddress:text?.lngLatAddress
    }
    console.log(text)
    editRef.current.onOpen()
  }
  //保存编辑
  const saveEditPosition =async (local)=>{
    console.log(local)
    let param={
      projectId,
      sn:editRowData.sn,
      lngLat:local.local,
      lngLatAddress:local.inpvalue
    }
    const res = await operationDesigin.ConfigureOneDevice(param)
    if(res.success){
      message.success('编辑成功')
      refresh()
      editRef.current.onCancel()
    }else{
      message.error(res.errMsg)
    }
  }
  
  
   //确认删除
   const delOk =async ()=>{
       const res =  await operationDesigin.RemoveOne({
        projectId,
        sn:delId
       })
       if(res.success){
        delModalRef.current.onCancel()
        message.success('删除成功')
        refresh()

       }else{
        message.error(res.errMsg)
       }
      
   }
   
  
  return (
    <Pagecont showserach={false}   pd="0px" >      
      <Titlelayout title="设备管理" layout="flex" dr="column">
       <ContainerDiv>
        <Form form={form} layout='line' 
        initialValues={{
          areaId: 0,
          alike: ''
        }}
        style={{display: 'flex', justifyContent: "space-between"}}
        >
          <Space  size={64} split={<Divider type="vertical" style={{ margin: 0,borderColor: '#d7d7d7', height: '32px' }} dashed />}>
          <Item name="areaId" style={{marginBottom: 0}} >
          <Select
            options={options}
            fieldNames={{ label: 'name', value: 'id' }}
            style={{ width: 264 }}
            className="pdtop8 pdbottom12"
            onChange={submit}
           
          ></Select>
          </Item>
       
            <Item label="设备查询" name="alike" style={{marginBottom: 0}}>
            
            <Serach
              placeholder="输入设备编号/安装地址"
              allowClear
              enterButton="查询"
              onSearch = {submit}
            />
            </Item>
           
            </Space>
            {publish ? null : <div className='btncss' onClick={addDevice}>
              新增
            </div>}
        </Form>

       
     
      <Divider style={{ margin: 0,borderColor: '#d7d7d7' }} dashed></Divider>
    
      <Table columns={columns}  {...tableProps}></Table>
     
      
     {targ && <Mask task={targ}><SetLine addDevice={addDevice} ref={setlineRef} areaId={areaId} getQueryPageDevice={refresh} setTarg={setTarg}/></Mask>}
      <CustContext.Provider value={{lngLat:lng}}>
      <SetPosition positionRef={editRef} savePosition={saveEditPosition} />
      </CustContext.Provider>
      
      <DeleteModal delModalRef={delModalRef} name="删除提示" content="是否确认删除设备?" onOk={delOk}/>
      </ContainerDiv>
      </Titlelayout>
    </Pagecont>
  )
}

//删除组件
let DeleteModal = ({ delModalRef, name = '', content = '', ...other }) => {
  return (
      <Modal mold='cust' ref={delModalRef} {...other} className={commonstyle.DelModal} type="warn" title={name}>
      {content}
   
    </Modal>

    
  )
}