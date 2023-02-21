import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button, Form, Input, Row, Col, Upload, Select, Switch, message, Divider } from 'antd';
import { useSelector } from 'react-redux'
import DeviceContent from './deviceContent'
import AllColumns from './columns'
import Table from '@com/useTable'
import { Monitoring } from '@api/api.js'
import Camera from '@imgs/camera1.png'
import UploadImg from './upload.jsx'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import WarningPng from '@imgs/warning.png'

const { DeviceTypeManager: { DeviceCategory, DeviceQueryNotUsed, DeviceQueryCategoryFull, AddDeviceCategory,UpdateDeviceCategory,DeleteDeviceCategory } } = Monitoring;
export default function video() {
  const [selectOption, setSelectOption] = useState(null)
  const [dataSource,setDataSource] = useState(null)
  const [AddModalForm] = Form.useForm()
  const [EditForm] =Form.useForm()
  const ModalRef = useRef(null)//新增设备Ref
  const EditModalRef=useRef(null)//编辑设备Ref
  const DelModalRef=useRef(null)//删除设备Ref
  const projectId = useSelector(state => state.system.menus.projectId)
  let categoryId;
  const optionStyle={
    color: '#1890ff',
    cursor: 'pointer',
  }

   //获取视频监控设备列表
   const getDeviceQueryCategory=async ()=>{
    let params={
      projectId,
      deviceStyle:6,
      pageNum:1,
      pageSize:10
    }
    const resp = await DeviceCategory(params)
    if(resp.success&&Array.isArray(resp.data)){
      setDataSource([...resp.data])
    }
    console.log(resp)
}
  //打开新增
  const open = () => {
    if(selectOption.length<=0){
      message.warning('无可用新增监控设备!')
    }else{
      ModalRef.current.onOpen()
    }
   
  }
  //保存新增
  const onOk = async () => {
    const formvalues=AddModalForm.getFieldValue()
    const upimg = AddModalForm.getFieldsValue()
    let parmas ={
      projectId,
      category: formvalues.category,
      imageBase64: upimg.ImageUpload?upimg.ImageUpload:formvalues.imageBase64,
      control:formvalues.control,
      calculate:formvalues.calculate,
      realTimeReading:formvalues.realTimeReading
    }
    console.log('ok',AddModalForm.getFieldValue(),parmas)
    const resp = await AddDeviceCategory(parmas)
    if(resp.success){
      ModalRef.current.onCancel()
      message.success('新增监控设备成功')
      getDeviceQueryCategory()
      getDeviceQueryNotUsed()
    }
    console.log(resp)
  }
  //打开编辑
  const editOption=(record)=>{
      console.log(record)
      console.log(EditForm.getFieldValue())
      EditForm.setFieldsValue({
        category:record.category,
        manufacturer:record.manufacturer,
        imageBase64:record.imageBase64,
      })
      EditModalRef.current.onOpen()
    }
  //保存编辑
  const onOkEdit =async ()=>{
    //UpdateCategory()
  }
    const columns= [
    {
        title:'监控设备厂家',
        dataIndex: 'manufacturer'
    },
    {
        title:'监控设备型号',
        dataIndex: 'category'
    },
    {
        title:'视频监控缩略图',
        dataIndex: 'imageBase64',
        render:(text)=>{
          return (<div >
            <img src={`data:image/jpeg;base64,${text}`} style={{width:64,height:53}}></img>
          </div>)
        }
    },
    {
        title:'已用传感器数量',
        dataIndex: 'cnt'
    },
    {
      title:'操作',
      dataIndex: 'options',
      render:(text,record)=>{
        console.log(text,record)
        return(
          <div>
            <span style={optionStyle} onClick={()=>{editOption(record)}}>编辑</span>
            <span style={{...optionStyle,paddingLeft:32,color:`rgb(244,67,54)`}} onClick={()=>{DelModalRef.current.onOpen(),categoryId=record.category}}>删除</span>
          </div>
        )
      }
  },
]
 //保存删除
 const onOkDel=async ()=>{
   let params={
    projectId,
    category:categoryId
   }
   const resp = await DeleteDeviceCategory(params)
   if(resp.success){
    DelModalRef.current.onCancel()
    message.success('删除成功!')
    getDeviceQueryCategory()
    getDeviceQueryNotUsed()
   }
 }
  //获取未使用的监控设备
  const getDeviceQueryNotUsed = async () => {
    const result = await DeviceQueryNotUsed({
      projectId,
      deviceStyle: 6
    })
    const { data, success } = result;
    if (success) {
      const arr = data.map(it => ({ label: it, value: it }))
      setSelectOption(arr)
      if(arr.length>0){
        getDeviceQueryCategoryFull(arr[0].value)
      }
     
    }
  }
  //获取设备详细信息
  const getDeviceQueryCategoryFull = async (category) => {
    let params = {
      projectId,
      category
    }
    const resp = await DeviceQueryCategoryFull(params)
    if (resp.success) {
      AddModalForm.setFieldsValue({
        ...resp.data
      })
    }
  }
  useEffect(() => {
    getDeviceQueryNotUsed()
    getDeviceQueryCategory()
  }, [])
  let addModalProps = {
    selectOption,
    getDeviceQueryCategoryFull,
    AddModalForm
  }
  let deviceProps = {
    value: 6,
    name: '新增视频监控类型',
    // AddModal: <AddModal ref={foRef} {...addModalProp} />,
    cancelText: '取消',
    okText: '确认',
    onOk,
    width: 512,
    open,
    ModalRef,
    AddModal: <AddModal {...addModalProps}></AddModal>
  };
  let editFormProps={
    EditForm
  }
  let editModalProps = {
    ref:EditModalRef
  }
  let delModal={
    cancelText: '取消',
    okText: '确认',
    value:2,
    onOk:onOkDel,
    DelModalRef
  }
  return (
    <div>
      <DeviceContent {...deviceProps} >
        <Table columns={columns} dataSource={dataSource}></Table>
      </DeviceContent>
      <Modal mold='cust' {...editModalProps} >
      <BlueColumn name='编辑视频监控类型'  styled={{ padding: '24px 0px' }}></BlueColumn>
      <EditModal {...editFormProps}></EditModal>
      </Modal>
      <DeleteModal {...delModal}></DeleteModal>
    </div>
  )
}



let ImageUpload = ({ value = '', onChange }) => {
  return (
    <img src={value?`data:image/jpeg;base64,${value}`:Camera } style={{ width: 120, height: 96, marginRight: 16 }}></img>
  )
}
//新增监控modal组件
let AddModal = (props) => {
  const { selectOption, AddModalForm, getDeviceQueryCategoryFull } = props
  const handleChange = (value) => {
    getDeviceQueryCategoryFull(value)
  }

  return (
    <Form
      layout="vertical"
      form={AddModalForm}
    >
        <Row >
     
        <Form.Item label="监控设备型号" name="category">
            <Select
              onChange={handleChange}
              options={selectOption}
              style={{width:240}}
            ></Select>
          </Form.Item>
          <Form.Item label="监控设备厂家" name="manufacturer">
            <Input   style={{width:240}}/>
          </Form.Item>
       
            <Row align="bottom">
              <Form.Item label="监控设备缩略图" name="imageBase64" style={{margin:0} }>
               <ImageUpload></ImageUpload>
              </Form.Item>
              <Form.Item name='ImageUpload' >
                <UploadImg></UploadImg>
              </Form.Item>
              
            </Row>
        </Row>
    </Form>
  )
}

let EditModal =(props)=>{
  
  const {EditForm}=props
  
  return(
    <Form
      layout="vertical"
      form={EditForm}
    >
        <Row >
        <Form.Item label="监控设备型号" name="category">
          <Input   style={{width:240}} disabled/>
          </Form.Item>
          <Form.Item label="监控设备厂家" name="manufacturer">
            <Input   style={{width:240}} disabled/>
          </Form.Item>
            <Row align="bottom">
              <Form.Item label="监控设备缩略图" name="imageBase64" style={{margin:0} }>
               <ImageUpload></ImageUpload>
              </Form.Item>
              <Form.Item name='ImageUpload' >
                <UploadImg></UploadImg>
              </Form.Item>
              
            </Row>
        </Row>
    </Form>
  )
  
}

let DeleteModal=({DelModalRef,...other})=>{
  return(
    <Modal mold='cust' ref={DelModalRef} {...other} className={style.DelModal}>
        <BlueColumn name='删除网关类型'  styled={{ padding: '24px 0px',color:'#ff4d4f' }} bg={{backgroundColor: '#ff4d4f'}}></BlueColumn>
        <div>
          <img src={WarningPng} style={{margin:'0 32px',width:48,height:48}}></img>
          <span>是否确认删除监控设备类型?</span>
        </div>
    </Modal>
  )
}