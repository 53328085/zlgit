import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle,useContext, useMemo } from 'react'
import DeviceContent from './devicecomp'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Upload, Select, Switch, message, Divider } from 'antd';
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import {DeleteModal,AddModal,EditModal} from './modalCom.js'
import cusContext from '@com/content'
import {publishState} from '@redux/systemconfig'
import lodash from 'lodash';
const { DeviceTypeManager: { UpdateDeviceCategory, DeviceQueryNotUsed, DeviceQueryCategoryFull,DeviceCategory, AddDeviceCategory,DeleteDeviceCategory} } = Monitoring;
export default function Electric() {
  const publish = useSelector(publishState)
  const {value, tabs} =useContext(cusContext) 
  
  const deviceStyle = parseInt(value)
  
  const Label = tabs.find(item =>{
    if(item&&item.key){
     return item.key == value?.label || '' ;
    }
    return ''
  })

  const [dataSource, setDataSource] = useState([])//modal框表格数据
  const [tableDataSource,setTableDataSource]=useState([])//主页表格数据
  const [defaultTableData, setDefaultTableData] = useState([])//新增时表格默认数据
  const [editDefaultTableData, setEditDefaultTableData] = useState()//编辑时表格默认数据
  const [isOpenModal,setIsOpenModal] = useState(true)
  const [isAdd,setIsAdd]=useState(false)
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 10,
    hideOnSinglePage: false
  });
  const ModalRef = useRef(null)
  const EditModalRef = useRef(null)
  const foRef = useRef(null)
  const editFromRef = useRef(null)
  const DelModalRef =useRef()
  const tableLoadRef =useRef()
  const updateTableRef =useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const optionStyle={
    color: '#1890ff',
    cursor: 'pointer',
  }
  let categoryId;
 
  //获取设备列表
  const getTableData = async () => {
    setLoading(true)
    let params = {
      projectId,
      pageNum: tableParams.current,
      pageSize: tableParams.pageSize,
      deviceStyle,
    }
    const result = await DeviceCategory(params)
    const { data, errMsg, success,pageNum,pageSize,total } = result;
    setLoading(false)
    if (success && Array.isArray(data)) {
    
      setTableDataSource(data)
      setTableParams({
        ...tableParams,
        current: pageNum,
        pageSize: pageSize,
        total: total
      })
    } else{
      setTableDataSource([])
    }
  }

   //确认删除
   const delOK=async ()=>{
    console.log(111)
    const resp=await DeleteDeviceCategory({
      projectId,
      category:categoryId,
      deviceStyle,
    })
    if(resp.success){
      DelModalRef.current.onCancel()
      message.success("删除成功")
      if(tableParams.total%(tableParams.pageSize*(tableParams.current-1 ))===1){
        setTableParams({
          ...tableParams,
          current:tableParams.current-1
        })
      }else{
        getTableData()
      } 
      getDeviceQueryNotUsed()
    }else{
      message.error(resp.errMsg)
    }
  }
  //打开删除窗口
  const openDel=(record)=>{
    DelModalRef.current.onOpen();
    categoryId=record.category;

  } 
  
//获取打开编辑窗口数据
const editOption=(record)=>{
  EditModalRef.current.onOpen()
  const editModalData = tableDataSource.filter(it=>it.category===record.category)
  console.log(editModalData,editForm)
  editForm.setFieldsValue({
    DeviceType:editModalData[0]?.category,
    Control: editModalData[0]?.control,
    IsCount: editModalData[0]?.calculate,
    IsRead: editModalData[0]?.realTimeReading,
    DefaulImg:editModalData[0]?.imageBase64,
    ImageUpload: '',
  })
  const arr = editModalData[0]?.points.map((item, index) => ({
    index: index + 1,
    dataMark: item.name,
    dataName: item.description,
    dataUnit: item.unit,
    isSave: item.isSave,
    watchPoint: item.isRuningPoint,
    dataOrder: item.secquence
  }))
  setEditDefaultTableData(arr)
  // const watchPointArr = arr.filter(it=>it.watchPoint)
  // console.log(watchPointArr)
  // editFromRef.current.setSwitched(watchPointArr)
}
let columns =  [
    {
        title:'设备型号',
        dataIndex: 'category'
    },
    {
        title:'设备厂家',
        dataIndex: 'manufacturer'
    },
    {
        title:'设备缩略图',
        dataIndex: 'imageBase64',
        render:(text)=>{
          return( <img src={text} width={64} height={53}></img>)
         
        }
    },
    {
        title:'当前设备数量',
        dataIndex: 'cnt'
    },
    {
        title:'操作',
        dataIndex: 'options',
        export:false,
        render:(text,record)=>{
          return(
            <div>
              <span style={optionStyle} onClick={()=>{editOption(record)}}>编辑</span>
              <span style={{...optionStyle,marginLeft:32,color:`rgb(244,67,54)`}} onClick={()=>{openDel(record)}}>删除</span>
            </div>
          )
        }
    }
]
if(publish){
  columns.pop()
}

//保存编辑
  const onOkEditModal=async ()=>{
  console.log(editFromRef.current.pointSource,editForm.getFieldsValue())
  const tableforvalues= editFromRef.current.pointSource

  let count =0;
  tableforvalues.forEach(it=>{
    it.watchPoint&& count++
  })
  if(count===0){
    message.warning('请至少选择一项标记检测运行点！')
    return
  }


  const formvalues = editForm.getFieldsValue()
  const tableData =  tableforvalues.map(it=>({
    name:it.dataMark,
    isSave:it.isSave,
    isRuningPoint:it.watchPoint,
    secquence:it.dataOrder
  }))
  let params ={
    projectId,
    category:formvalues.DeviceType,
    control:formvalues.Control,
    calculate:formvalues.IsCount,
    realTimeReading:formvalues.IsRead,
    imageBase64:formvalues.ImageUpload?formvalues.ImageUpload:formvalues.DefaulImg,
    points:tableData
  }
  const resp = await UpdateDeviceCategory(params)
  if(resp.success){
    EditModalRef.current.onCancel()
    message.success("编辑成功")
    getTableData()
  }else{
    message.error(resp.errMsg)
  }
}
//确认编辑应用
const onSureEditModal=async()=>{
  const tableforvalues= editFromRef.current.pointSource

  let count =0;
  tableforvalues.forEach(it=>{
    it.watchPoint&& count++
  })
  if(count===0){
    message.warning('请至少选择一项标记检测运行点！')
    return
  }
  const formvalues = editForm.getFieldsValue()
  const tableData =  tableforvalues.map(it=>({
    name:it.dataMark,
    isSave:it.isSave,
    isRuningPoint:it.watchPoint,
    secquence:it.dataOrder
  }))
  let params ={
    projectId,
    category:formvalues.DeviceType,
    control:formvalues.Control,
    calculate:formvalues.IsCount,
    realTimeReading:formvalues.IsRead,
    imageBase64:formvalues.ImageUpload?formvalues.ImageUpload:formvalues.DefaulImg,
    points:tableData
  }
  const resp = await UpdateDeviceCategory(params)
  if(resp.success){
    message.success("应用成功")
    getTableData()
  }else{
    message.error(resp.errMsg)
  }
}
  
  //新增时获取未使用的储能表名
  const getDeviceQueryNotUsed = async () => {
    let params = {
      projectId,
      deviceStyle,
    }
    const r = await DeviceQueryNotUsed(params)
    if (r.success && Array.isArray(r.data)) {
      if(r.data.length > 0){
        
        const arr = r.data.map((item, index) => ({ label: item, value: item }))
        setDataSource(arr)
        getDeviceQueryCategoryFull(r.data[0])
        setIsOpenModal(true)
      }else{
        setIsOpenModal(false)
        setIsAdd(true)
        ModalRef.current.onCancel()
      }
      
    }
  }

  //获取默认储能的详细信息
  const getDeviceQueryCategoryFull = async (category) => {
    let params = {
      projectId,
      category,
    }
    const r = await DeviceQueryCategoryFull(params)
    if (r.success) {
      const data = r.data
      const arr = data.points?.map((item, index) => ({
        index: index + 1,
        dataMark: item.name,
        dataName: item.description,
        dataUnit: item.unit,
        isSave: item.isSave,
        watchPoint: item.isRuningPoint,
        dataOrder: item.secquence
      }))
      
      updateTableRef.current = lodash.cloneDeep(arr)
      if (foRef.current) {
        const watchPointArr = arr.filter(it=>it.watchPoint)
        console.log(watchPointArr)
        foRef.current.setSwitched(watchPointArr)
        foRef.current.setPointSource(lodash.cloneDeep(arr))
      } else {
        setDefaultTableData(arr)
      }
      addForm.setFieldsValue({
        DeviceType: data.category,
        Cycle: data.rateType,
        Control: data.control,
        IsCount: data.calculate,
        IsRead: data.realTimeReading,
        DefaulImg: `data:image/jpeg;base64,${data.imageBase64}`,
        ImageUpload: '',
        // Point:arr,
      })
      setIsAdd(true)
    }

  }
  //打开新增modal
  const open = async() => {
    if(!isAdd)return message.warning('无可用类型!')
    if(isOpenModal){
      ModalRef.current.onOpen()
    }else{
      message.warning('无可用新增设备!')
    }
    
    
  }
  //关闭新增modal
  const onCancel=()=>{
    getDeviceQueryNotUsed()
    ModalRef.current.onCancel()
  }
  //保存新增设备
  const onOk = async () => {
    const result= foRef.current?.choosemes()
   if(!result){
    message.warning('请至少选择一项标记检测运行点！')
     return
   }
    const formValue = addForm.getFieldsValue()
    const tableData =  result.map(it=>({
      name:it.dataMark,
      isSave:it.isSave,
      isRuningPoint:it.watchPoint,
      secquence:it.dataOrder
    }))
    console.log(addForm.getFieldsValue(), foRef.current.pointSource)
    let params ={
      projectId,
      category:formValue.DeviceType,
      control:formValue.Control,
      calculate:formValue.IsCount,
      realTimeReading:formValue.IsRead,
      imageBase64:formValue.ImageUpload?formValue.ImageUpload:formValue.DefaulImg,
      points:tableData
    }
    const resp = await AddDeviceCategory(params)
    console.log(resp)
    if(resp.success){
      ModalRef.current.onCancel()
      message.success("新增成功")
      getTableData()
      getDeviceQueryNotUsed()
    }else{
      message.error(resp.errMsg)
    }
  }
  //新增应用确认
  const onSure=async ()=>{
    const result= foRef.current?.choosemes()
   if(!result){
    message.warning('请至少选择一项标记检测运行点！')
     return false
   }
    const formValue = addForm.getFieldsValue()
    const tableData =  result.map(it=>({
      name:it.dataMark,
      isSave:it.isSave,
      isRuningPoint:it.watchPoint,
      secquence:it.dataOrder
    }))
    console.log(addForm.getFieldsValue(), foRef.current.pointSource)
    let params ={
      projectId,
      category:formValue.DeviceType,
      control:formValue.Control,
      calculate:formValue.IsCount,
      realTimeReading:formValue.IsRead,
      imageBase64:formValue.ImageUpload?formValue.ImageUpload:formValue.DefaulImg,
      points:tableData
    }
    const resp = await AddDeviceCategory(params)
    console.log(resp)
    if(resp.success){
      message.success("应用成功")
      getTableData()
      getDeviceQueryNotUsed()
    }else{
      message.error(resp.errMsg)
    }
  }
  //导出表格
  const exportExecel=()=>{
    tableLoadRef.current.download()
  }
  const onExport = () => {
    return new Promise(async (resolve, reject) => {
      let params = {
        projectId,
        pageNum: 1,
        pageSize: tableParams.total,
        deviceStyle,
      }
      const result = await DeviceCategory(params)
      const { data, errMsg, success,total} = result;
      if(success){
        resolve({list:data?data:[],total})
      }else{
        reject(errMsg)
      }
    })
  }
  //分页
  const onChangePage = (page, pageSize) => {
    setTableParams({
      ...page
    })
  }
  useEffect(() => {
    getTableData()
    getDeviceQueryNotUsed()
  }, [tableParams.current])
  let addModalProp = {
    addForm,
    dataSource,
    getDeviceQueryCategoryFull,
    defaultTableData,
    isShow:false
  }
  let deviceProps = {
    value: 0,
    name: `新增${Label}`,
    AddModal: <AddModal ref={foRef} {...addModalProp} />,
    cancelText: '取消',
    okText: '确认',
    onOk,
    width: 1032,
    open,
    onSure,
    ModalRef,
    onCancel,
    exportExecel,
    title:`配置${Label}`,
    tb:tableLoadRef
  };
  let editFormProps={
    editForm,
    ref:editFromRef,
    editDefaultTableData,
    isShow:false
  }
  let editModalProps={
   ref:EditModalRef,
   width: 1032,
   onOk:onOkEditModal
  }
  let delModalProps={
    DelModalRef,
    cancelText: '取消',
    okText: '确认',
    content:`是否确认删除${Label}?`,
    name:`删除${Label}`,
    onOk:delOK
  }
  const EditModalComp=useMemo(()=>{
    return (<Modal  mold='cust' title={`编辑${Label}`} {...editModalProps} footer={[
      <Button onClick={EditModalRef?.current?.onCancel}>取消</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={onOkEditModal}>保存</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} 
      onClick={ onSureEditModal}>应用</Button>,
  ]}>
    {/* <BlueColumn name={`编辑${Label}`}  styled={{ padding: '24px 0px' }}></BlueColumn> */}
    <EditModal {...editFormProps}></EditModal>
    </Modal>)
  },[editDefaultTableData])
  return (
    <div>
      <cusContext.Provider value={{updateTableRef:updateTableRef.current}}>
      <DeviceContent {...deviceProps} >
        <Table 
        columns={columns} 
        dataSource={tableDataSource} 
        bordered={false} 
        ref={tableLoadRef}
        loading={ loading}
        pagination={tableParams}
        onChange={onChangePage}
        onExport={onExport}
        ></Table>
      </DeviceContent>
      {EditModalComp}
      <DeleteModal {...delModalProps}></DeleteModal>
      </cusContext.Provider>
    </div>
  )
}
