import React, { useContext,useEffect,useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Comp from './comp'
import Table from '@com/useTable'
import {Addmodal,EditModal,DeleteModal,MultImport} from './modalcomp'
import { Form, message } from 'antd'
import {Monitoring} from '@api/api'

const {PubliclightManager:{StreetLightAdd,StreetLightQueryByPage,StreetLightUpdate,StreetLightDelete,StreetLightImport}}=Monitoring
export default function parkstreet({areaList}) {
  const [tableParams,setTableParams]=useState({
    current:1,
    pageSize:2,
    hideOnSinglePage:false,
    total:0
  })
  const tableParamsRef = useRef(tableParams)
  tableParamsRef.current = tableParams
  const [dataSource,setDataSource]=useState()
  const [loading,setLoading]=useState(false)
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
  const addModalRef = useRef()
  const editModalRef =useRef()
  const compRef=useRef()
  const DelModalRef=useRef()
  const modalImportRef=useRef()
  const tableRef =useRef()
  const projectId = useSelector(state=>state.system.menus.projectId)
  let flies;
  let deleteId;
  const optcss = {
    color: '#237ae4',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
  const columns=[{
    title:'园区名称',
    dataIndex:'areaName',
    key:'areaName',
  },
  {
    title:'安装地址',
    dataIndex:'address',
    key:'address',
  },
  {
    title:'公共照明名称',
    dataIndex:'name',
    key:'name',
  },
  {
    title:'所属控制箱',
    dataIndex:'boxName',
    key:'boxName'
  },
  {
    title:'控制器编号',
    dataIndex:'sn',
    key:'sn'
  },
  {
    title:'备注',
    dataIndex:'remark',
    key:'remark'
  },
  {
    title:'操作',
    dataIndex:'options',
    render:(text,record,index)=>{
      return (
        <p style={{ display: 'flex', justifyContent: 'space-around' }}>
        <span style={optcss} onClick={() => { onEdit(record) }}>编辑</span>
        <span style={{ ...optcss, color: '#FF0000' }} onClick={() => { onDelete(record) }}>删除</span>
      </p>
      )
    }
  }]
  columns.forEach(it=>{it.align='center'})
  //打开编辑窗口
  const onEdit=(record)=>{
    editModalRef.current.onOpen()
    console.log(editform)
    editform.setFieldsValue({...record})
  }
  //确认编辑
  const onEditOk=async()=>{
    const formvalues = editform.getFieldValue()
    const areaId =compRef.current.selRef.current
    const alike=compRef.current.inpRef.current
    let params={
      id:formvalues.id,
      projectId,
      areaId:formvalues.areaId,
      name:formvalues.name,
      boxName:formvalues.boxName,
      sn:formvalues.sn,
      controlLine:formvalues.controlLine,
      address:formvalues.address,
      remark:formvalues.remark
    }
   const res = await StreetLightUpdate(params)
   if(res.success){
      message.success('更新成功')
      editModalRef.current.onCancel()
      getStreetLightAdd({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
   }else{
    message.error(res.errMsg)
   }
  }
  //打开删除窗口
  const onDelete=(record)=>{
    DelModalRef.current.onOpen()
    deleteId = record.id
    console.log(record)
  }
  //确认删除
  const onDelOk=async()=>{ 
    const areaId =compRef.current.selRef.current
    const alike=compRef.current.inpRef.current
    const res = await StreetLightDelete({projectId,id:deleteId})
    if(res.success){
      message.success('删除成功')
      console.log(tableParamsRef)
      if(tableParams.total%(tableParams.pageSize*(tableParams.current-1 ))===1){
        setTableParams({
          ...tableParams,
          current:tableParams.current-1
        })
      }
      setTimeout(() => {
        getStreetLightAdd({pageNum:tableParamsRef.current.current,pageSize:tableParams.pageSize,areaId,alike})
      }, 0);
      
      DelModalRef.current.onCancel()
    }else{
      message.error(res.errMsg)
    }
    
  }
  //打开新增窗口
  const addopen=()=>{
    addform.resetFields()
    addModalRef.current.onOpen()
  }

  //确认新增
  const onAddOk=async ()=>{
    const formvalue=addform.getFieldValue()
    const areaId =compRef.current.selRef.current
    const alike=compRef.current.inpRef.current
    let params ={
      id:0,
      projectId,
      areaId:formvalue?.areaId,
      name:formvalue?.name,
      boxName:formvalue?.boxName,
      sn:formvalue?.sn,
      controlLine:formvalue?.controlLine,
      address:formvalue?.address,
      remark:formvalue?.remark
    }
    const res = await StreetLightAdd(params)
    if(res.success) {
      message.success("新增成功")
      addModalRef.current.onCancel()
      getStreetLightAdd({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
    }else{
      message.error(res.errMsg)
    }
  }
  //批量导入
  const modalImport=async ()=>{
    modalImportRef.current.onOpen()
  }
  //导出
  const exportTable=async()=>{
    console.log(tableRef)
    tableRef.current.download()
  }

  //批量上传
  const onImportOk=async ()=>{
    const areaId =compRef.current.selRef.current
    const alike=compRef.current.inpRef.current
    const formData =new FormData()
    formData.append("file",flies[0])
    formData.append("projectId",projectId)
 
   const res = await StreetLightImport(formData)
   if(res.success) {
    message.success("上传成功")
    modalImportRef.current.onCancel()
    getStreetLightAdd({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
   }else{
    message.error(res.errMsg)
   }
  }
  //分页
  const changePage = (page)=>{
 
    const areaId =compRef.current.selRef.current
    const alike=compRef.current.inpRef.current
    getStreetLightAdd({pageNum:page.current,pageSize:page.pageSize,areaId,alike})
  }
  //查询园区路灯 
  const getStreetLightAdd=async (obj={pageNum:0,pageSize:0,areaId:0,alike:""})=>{
    setLoading(true)
    let params={
      projectId,
      pageNum:obj.pageNum?obj.pageNum:tableParams.current,
      pageSize:obj.pageSize?obj.pageSize:tableParams.pageSize,
      areaId:obj.areaId,
      alike:obj.alike
    }
 
   const res = await StreetLightQueryByPage(params)
   setLoading(false)
   if(res.success&&Array.isArray(res.data)){
     setDataSource([...res.data])
     setTableParams({...tableParams, current:res.pageNum,pageSize:res.pageSize,total:res.total})
   }else{
     setDataSource([])
   }
  } 
  const comProps={
    addopen,
    areaList,
    ref:compRef,
    tableParams,
    setTableParams,
    modalImport,
    exportTable,
    getList:getStreetLightAdd
  }
  const addModalProps = {
    addModalRef,
    width: 832,
    areaList,
    onOk:onAddOk,
    addform,
    title:"新增园区路灯",
    name:"灯杆名称",
  }
  const editModalProps={
    editModalRef,
    editform,
    areaList,
    width: 832,
    onOk:onEditOk,
  }
  const delModalProps={
    DelModalRef,
    name:"删除提示",
    content:"是否确认删除该路灯设备?",
    onOk:onDelOk
  }

  const uploadprops = {
    beforeUpload(file,fileList){
      console.log(file,fileList)
      flies=[...fileList]
      return false
    }
  };
  const multModalProps={
    modalImportRef,
    link:'/deviceExcel/streetLight.xlsx',
    name:"批量导入",
    uploadprops,
    onOk:onImportOk
  }
 

  useEffect(()=>{
    getStreetLightAdd()
   
  },[])
  return (
    <div>
     <Comp {...comProps}>
      <Table 
      columns={columns} 
      pagination={tableParams} 
      dataSource={dataSource} 
      onChange={changePage}
      loading={loading}
      ref ={tableRef}
      ></Table>
     </Comp>
     <Addmodal {...addModalProps}></Addmodal>
     <EditModal {...editModalProps}></EditModal>
     <DeleteModal {...delModalProps}></DeleteModal>
     <MultImport {...multModalProps}></MultImport>
    </div>
  )
}
