import React, { useContext,useEffect,useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Comp from './comp'
import Table from '@com/useTable'
import {Addmodal,EditModal,DeleteModal,MultImport,ErrorMessage} from './modalcomp'
import { Form, message } from 'antd'
import {Monitoring} from '@api/api'
import { publishState } from '@redux/systemconfig'
const {PubliclightManager:{PublicLightAdd,PublicLightQueryByPage,PublicLightUpdate,PublicLightDelete,PublicLightImport}}=Monitoring
export default function parkstreet({areaList,levelname}) {
  const [tableParams,setTableParams]=useState({
    current:1,
    pageSize:10,
    hideOnSinglePage:false,
    total:1
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
  const ErrModalRef=useRef()
  const errlistRef =useRef()
  const projectId = useSelector(state=>state.system.menus.projectId)
  const oneLevel = useSelector(state=>state.system.onelevel)
  const publish = useSelector(publishState)
  let deleteId;
  let flies;
  let optcss = {
    color: '#237ae4',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
  let columns=[{
    title:oneLevel[0]?.levelName?oneLevel[0].levelName:'园区名称',
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
    export:false,
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
  if(publish){
    columns.pop()
  }
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
   const res = await PublicLightUpdate(params)
   if(res.success){
      message.success('更新成功')
      editModalRef.current.onCancel()
      getPublicLightQueryByPage({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
   }else{
    message.error(res.errMsg)
   }
  }
  //应用编辑
  const onSureEditModal=async ()=>{
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
   const res = await PublicLightUpdate(params)
   if(res.success){
      message.success('更新成功')
      getPublicLightQueryByPage({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
   }else{
    message.error(res.errMsg)
   }
  }
  //打开删除窗口
  const onDelete=(record)=>{
    DelModalRef.current.onOpen()
    deleteId = record.id
  }
  //确认删除
  const onDelOk=async()=>{
   
    const areaId =compRef.current.selRef.current
    const alike=compRef.current.inpRef.current
    const res = await PublicLightDelete({projectId,id:deleteId})
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
        getPublicLightQueryByPage({pageNum:tableParamsRef.current.current,pageSize:tableParams.pageSize,areaId,alike})
      }, 0);
      
      DelModalRef.current.onCancel()
    }else{
      message.error(res.errMsg)
    }
    
  }
  //打开新增窗口
  const addopen=()=>{
    if(!levelname.current){
      message.warning('请添加区域')
      return
    }
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
    const res = await PublicLightAdd(params)
    if(res.success) {
      message.success("新增成功")
      addModalRef.current.onCancel()
      getPublicLightQueryByPage({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
    }else{
      message.error(res.errMsg)
    }
  }
  //应用新增
  const onSure=async()=>{
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
    const res = await PublicLightAdd(params)
    if(res.success) {
      message.success("应用成功")
      getPublicLightQueryByPage({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
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
  const onExport=()=>{
    return new Promise(async(resolve, reject)=>{
      const areaId =compRef.current.selRef.current?compRef.current.selRef.current:0
      const alike=compRef.current.inpRef.current
      let params={
        projectId,
        pageNum:1,
        pageSize:tableParams.total,
        areaId,
        alike
      }
   
     const res = await PublicLightQueryByPage(params)
     if(res.success){
        resolve({
          list:res.data?res.data:[],
          total:res.total
        })
     }else{
        reject(res.errMsg)
     }
    })
  }
    //批量上传
    const onImportOk=async ()=>{
      const areaId =compRef.current.selRef.current
      const alike=compRef.current.inpRef.current
      const formData =new FormData()
      formData.append("file",flies[0])
      formData.append("projectId",projectId)
   
     const res = await PublicLightImport(formData)

     if(res.success) {
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        getPublicLightQueryByPage({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
      }else{
        errlistRef.current.setList([...res.data.data])
        ErrModalRef.current.onOpen()
      } 
    }else{
      message.error(res.errMsg)
    }

    //  if(res.success) {
    //   message.success("上传成功")
    //   modalImportRef.current.onCancel()
    //   getPublicLightQueryByPage({pageNum:tableParams.current,pageSize:tableParams.pageSize,areaId,alike})
    //  }else{
    //   message.error(res.errMsg)
    //  }
    }
  //分页
  const changePage = (page)=>{
 
    const areaId =compRef.current.selRef.current
    const alike=compRef.current.inpRef.current
    getPublicLightQueryByPage({pageNum:page.current,pageSize:page.pageSize,areaId,alike})
  }
  //查询园区路灯 
  const getPublicLightQueryByPage=async (obj={pageNum:0,pageSize:0,areaId:0,alike:""})=>{
    setLoading(true)
    let params={
      projectId,
      pageNum:obj.pageNum?obj.pageNum:tableParams.current,
      pageSize:obj.pageSize?obj.pageSize:tableParams.pageSize,
      areaId:obj.areaId,
      alike:obj.alike
    }
 
   const res = await PublicLightQueryByPage(params)
   setLoading(false)
   if(res.success){
    if(Array.isArray(res.data)){
      setDataSource([...res.data])
    }else{
      setDataSource([])
    }
     setTableParams({...tableParams, current:res.pageNum,pageSize:res.pageSize,total:res.total})
   }else{
    
     message.error(res.errMsg)
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
    getList:getPublicLightQueryByPage,
    tb:tableRef
  }
  const addModalProps = {
    addModalRef,
    width: 832,
    areaList,
    onOk:onAddOk,
    addform,
    name:'公共照明名称',
    title:"新增公共照明",
    levelname,
    onSure
  }
  const editModalProps={
    editModalRef,
    editform,
    areaList,
    width: 832,
    onOk:onEditOk,
    levelname,
    onSureEditModal
  }
  const delModalProps={
    DelModalRef,
    name:"删除提示",
    content:"是否确认删除该公共照明设备?",
    onOk:onDelOk
  }
  const uploadprops = {
    maxCount:1,
    beforeUpload(file,fileList){
      console.log(file,fileList)
      flies=[...fileList]
      return false
    }
  };
  const multModalProps={
    modalImportRef,
    link:'/deviceExcel/publicLight.xlsx',
    name:"批量导入",
    uploadprops,
    onOk:onImportOk
  }
  const ErrModalProps = {
    ErrModalRef,
    ref:errlistRef,
    onOk:()=>{ErrModalRef.current.onCancel()}
  }
  useEffect(()=>{
    getPublicLightQueryByPage()
   
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
      onExport={onExport}
      ></Table>
     </Comp>
     <Addmodal {...addModalProps}></Addmodal>
     <EditModal {...editModalProps}></EditModal>
     <DeleteModal {...delModalProps}></DeleteModal>
     <MultImport {...multModalProps}></MultImport>
     <ErrorMessage {...ErrModalProps}></ErrorMessage>
    </div>
  )
}

