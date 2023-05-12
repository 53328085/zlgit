import React, { useEffect, useMemo, useState,useRef } from 'react'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message } from 'antd'
import { useSelector } from 'react-redux'
import Table from '@com/useTable'
import {operationDesigin} from '@api/api'
import {SetLine} from './addcomp'
import commonstyle from './commonstyle.module.less'
import {SetPosition} from './position'
import Modal from '@com/useModal'
import WarningPng from '@imgs/warning.png'
import {publishState} from '@redux/systemconfig'
import CustContext from '@com/content.js'
import { useLatest } from 'ahooks';
const ContainerDiv = styled.div`
border: 1px solid #d7d7d7;
background-color: #fff;
height: 100%;
padding: 16px;
position: relative;
overflow: hidden;
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
  const [tableParams,setTableParams]=useState({
    current:1,
    pageSize:10
  }) 
  const publish =useSelector(publishState)
  const onelevel = useSelector(state => state.system.onelevel);
  const projectId = useSelector(state => state.system.menus.projectId)
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName+'(全部)', id: 0 }, ...onelevel]), [onelevel]) : []
  const [alike,setAlike] =useState()
  const [areaId,setAreaId] = useState(onelevel.length>0?0:null)
  const [tableData,setTableData] = useState()
  const setlineRef =useRef()
  const editRef = useRef()
  const delModalRef=useRef()
  let editRowData;
  let delId;
  let inpval =useRef();
  inpval.current=alike
  const lng = useLatest('0,0')
  const columns = [
    {title:onelevel[0]?.levelName,dataIndex:'area'},
    {title:'设备名称',dataIndex:'name'},
    {title:'安装地址',dataIndex:'address'},
    {title:'设备编号',dataIndex:'sn'},
    {title:'设备型号',dataIndex:'category'},
    {title:'所属网关',dataIndex:'gateway',render(text){return text?text:'/'}},
    // {title:'用能类型',dataIndex:'customerType',render(text){return text===1?'客户':text===2?'公共':'/'}},
    {title:'备注',dataIndex:'remark',render(text){return text?text:'/'}},
    {title:'操作',dataIndex:'',width:180,render:(text)=>{
    return(
      <div style={{display:'flex',justifyContent:'space-around'}}>
       <span style={{textDecoration:'underline',color:'#237ae4',cursor:'pointer'}} onClick={()=>{editPosition(text)}}>编辑坐标</span>
       <span style={{textDecoration:'underline',color:'#ff0000',cursor:'pointer'}} onClick={()=>{delId=text.sn;delModalRef.current.onOpen()}}>删除</span>
      </div>
   )  
    }}
  ]
  columns.forEach(it=>{it.align="center"})
  if(publish){
    columns.pop()
  }
  //获取设备
  const getQueryPageDevice=async (pageNum=0)=>{
    console.log(inpval.current)
    let params={
      projectId,
      pageNum:pageNum?pageNum:tableParams.current,
      pageSize:tableParams.pageSize,
      areaId,
      alike:inpval.current
    } 
  const res =   await operationDesigin.QueryPageDevice(params)
  if(res.success){
    setTableParams({
      current:res.pageNum,
      pageSize:res.pageSize,
      total:res.total
    })
   if(res.data){
    setTableData([...res.data])
 
   }else{
    setTableData([])
   }
   
  }else{
    message.error(res.errMsg)
  }
  }
 
   //打开新增
  const addDevice=()=>{
    setlineRef.current.setOpen(true)
    setlineRef.current.getQueryDeviceList()
  }
  //打开编辑
  const editPosition=(text)=>{
    editRowData=text
    lng.current = text?.lngLat
    console.log(text)
    editRef.current.onOpen()
  }
  //保存编辑
  const saveEditPosition =async (local)=>{
    let param={
      projectId,
      sn:editRowData.sn,
      lngLat:local.local
    }
    const res = await operationDesigin.ConfigureOneDevice(param)
    if(res.success){
      message.success('编辑成功')
      getQueryPageDevice()
      editRef.current.onCancel()
    }else{
      message.error(res.errMsg)
    }
  }
  //input
  const changInp=(e)=>{
    console.log(e.target.value)
    inpval.current=e.target.value

  }
  //搜索
  const search = () => {
    setAlike( inpval.current)
    getQueryPageDevice(1)
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
        getQueryPageDevice(1)

       }else{
        message.error(res.errMsg)
       }
      
   }
   
  useEffect(()=>{ 
    getQueryPageDevice(1)
  },[areaId])
  return (
    <ContainerDiv>
      <BlueColumn name="设备管理" />
      <Select
        options={options}
        fieldNames={{ label: 'name', value: 'id' }}
        style={{ width: 264 }}
        className="pdtop8 pdbottom12"
        defaultValue={onelevel.length > 0 ? 0 : null}
        onChange={(v)=>{setAreaId(v);console.log(inpval.current); setAlike( inpval.current)}}
        value={areaId}
      ></Select>
      <Divider style={{ margin: 0, borderColor: '#d7d7d7' }} dashed></Divider>
      <div className='flexcss'>
        <div>
          <span style={{ paddingRight: 16, }} >设备查询</span>
          <Input
            style={{
              width: 290,
              margin: '16px 0'
            }}
            placeholder="输入设备编号/安装地址"
            onChange={changInp}
            // onBlur={(v)=>{setAlike(v.target.value)}}
            defaultValue={alike}
          />
          <Button style={{ width: 80, borderLeft: 'none', background: '#f5f7fa' }} className='searchbtn' onClick={search}>查询</Button>
        </div>
        {publish?null:<div className='btncss' onClick={addDevice}>
          新增
        </div>}
        
      </div>
      <div style={{height:673,display:'flex'}}> 
      <Table columns={columns} dataSource={tableData} pagination={tableParams} onChange={(page)=>{getQueryPageDevice(page.current)}}></Table>
      </div>
      
      <SetLine addDevice={addDevice} ref={setlineRef} areaId={areaId} getQueryPageDevice={getQueryPageDevice}/>
      <CustContext.Provider value={{lngLat:lng}}>
      <SetPosition positionRef={editRef} savePosition={saveEditPosition} />
      </CustContext.Provider>
      
      <DeleteModal delModalRef={delModalRef} name="删除提示" content="是否确认删除设备?" onOk={delOk}/>
    </ContainerDiv>
  )
}

//删除组件
let DeleteModal = ({ delModalRef, name = '', content = '', ...other }) => {
  return (
      <Modal mold='cust' ref={delModalRef} {...other} className={commonstyle.DelModal}>
      <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn>
      <div>
        <img src={WarningPng} style={{ margin: '0 32px', width: 48, height: 48 }}></img>
        <span>{content}</span>
      </div>
    </Modal>

    
  )
}