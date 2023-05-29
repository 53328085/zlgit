import React, { useEffect, useMemo, useState, useRef,useCallback, } from 'react'
import { useReactive } from 'ahooks';
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message, Form ,Space} from 'antd'
import Table from '@com/useTable'
import { useSelector } from 'react-redux'
import { publishState } from '@redux/systemconfig'
import Modal from '@com/useModal'
import style from './style.module.less'
import WarningPng from '@imgs/warning.png'
import { operationDesigin } from '@api/api'
import {SetPosition} from './position.jsx'
import {SetLine} from './devicecomp'
import TransLine from './contentcomp'
import CustContext from '@com/content.js'
import Print from './print.jsx'
import ReactToPrint,{useReactToPrint} from 'react-to-print';
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
         min-width: 96px;
         padding: 0 12px;
         height: 32px;
         background-color: #237ae4;
         border-radius: 2px;
         color: #fff;
         text-align: center;
         line-height: 32px;
         margin-left: 16px;
         cursor: pointer;
         &:hover{
          opacity: .7;
         }
      }
  `
const AddDiv = styled(Form)`
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
      .ant-form-item{
        margin-bottom: 14px;
      }
      .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before{
        display: none;
      }
      .ant-divider-horizontal{
        margin:12px 0;
        border-color: #d7d7d7;
      }
`
const PrintAll = styled.div`
  /* position: relative; */
`
const { TextArea } = Input
export default function Index() {
  const publish = useSelector(publishState)
  const projectId = useSelector(state => state.system.menus.projectId)
  const onelevel = useSelector(state => state.system.onelevel);
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName + '(全部)', id: 0 }, ...onelevel]), [onelevel]) : []
  const addoptiosn = onelevel.length > 0 ? useMemo(() => ([...onelevel]), [onelevel]) : []
  let delid;
  let printid;
  const [show,setShow] =useState(false)
  const [printmess,setPrintmess]=useState('')
  const [printshow,setPrintshow]=useState(false)
  const [printshowall,setPrintshowall]=useState(false)
  const columns = [
    { title: '园区名称', dataIndex: 'areaName', align: "center", },
    { title: '巡检点编号', dataIndex: 'id', align: "center", },
    { title: '巡检点名称', dataIndex: 'name', align: "center" },
    { title: '具体位置', dataIndex: 'position', align: "center" },
    { title: '备注', dataIndex: 'remark', align: "center" },
    {
      title: '操作', dataIndex: 'options', align: "center", width: 240, render: (v, text) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span style={{ textDecoration: 'underline', color: '#237ae4', cursor: 'pointer' }} onClick={async () => {printid = text.id;await getcode(text) }}>打印二维码</span>
            <span style={{ textDecoration: 'underline', color: '#237ae4', cursor: 'pointer' }} onClick={() => {console.log(text);setShow(!show); editform.setFieldsValue(text); editRef.current.onOpen() }}>编辑</span>
            <span style={{ textDecoration: 'underline', color: '#ff0000', cursor: 'pointer' }} onClick={() => { delid = text.id; delRef.current.onOpen() }}>删除</span>
          </div>
        )
      }
    }]

  const addRef = useRef()
  const editRef = useRef()
  const delRef = useRef()

  const [form] = Form.useForm()
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
  //input查询
  const search = () => {
    pageinfo.pageNum = 1
    getPage()
  }
  const changeSelect = () => {
    pageinfo.pageNum = 1
    getPage()
  }
  const addDevice = () => {
    addRef.current.onOpen()
    addform.setFieldsValue({
      address:'',
      areaId:'',
      name:'',
      position:'',
      remark:'',
    })
  }
  const pageinfo = useReactive({
    pageNum: 1,
    pageSize: 10,
    total: 0
  })
  let tabledata = useReactive({
    tablesource: []
  })
 
  //获取二维码
  const getcode =async (text)=>{
    console.log(text)
    const resp=await operationDesigin.InspectionAddressDetail({
      projectId,
      id:printid
    })
    if(resp.success){
      setPrintmess({areaName:text.areaName,...resp.data})
      setPrintshow(true)
    }else{
      message.error(resp.errMsg)
    }
  }
  const printallref = useRef()
  const reactToPrintContent = useCallback(() => {
    return printallref.current;
  }, [printallref.current])
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  })
  //打印当前页
  const printAll=async ()=>{
    console.log(printallref)
    handlePrint()
    setPrintshowall(true)
  } 
  //新增检查项
  const addItems = async (position,device,content) => {
    if(!position.local){
      message.error('请添加坐标点')
      return
    }
    const add = addform.getFieldsValue()
    const deviceGroup =device.current.subMeter.map(it=>it.sn)
    const contentGroup = content.current.subMeter.map(it=>it.id)
    
    let params = {
      projectId,
      areaId: add.areaId,
      name: add.name,
      lngLat: position.local,
      address:add.address,
      addressSpan:add.addressSpan,
      position:add.position,
      deviceGroup,
      contentGroup,
      remark:add.remark
    }
    addform.validateFields().then(async (resp)=>{
      const res = await operationDesigin.AddInspectionAddress(params)
    if (res.success) {
      message.success('新增成功!')
      pageinfo.pageNum = 1
      getPage()
      addRef.current.onCancel()
    } else {
      message.error(res.errMsg)
    }
    })
    
  }
  //更新检查项
  const updateItems = async (position,devicelistref,checklistref) => {
    const edit = editform.getFieldValue()
    console.log(edit,position,devicelistref,checklistref)
    const deviceGroup =devicelistref.current.subMeter.map(it=>it.sn)
    const contentGroup = checklistref.current.subMeter.map(it=>it.id)
    let params = {
      projectId,
      areaId: edit.areaId,
      id: edit.id,
      name: edit.name,
      lngLat:position.local?position.local:edit.lngLat,
      address:edit.address,
      position:edit.position,
      remark: edit.remark,
      deviceGroup:deviceGroup.length>0?deviceGroup:edit.deviceGroup,
      contentGroup:contentGroup.length>0?contentGroup:edit.contentGroup
    }

    const res = await operationDesigin.UpdateInspectionAddress(params)
    if (res.success) {
      message.success('编辑成功!')
      editRef.current.onCancel()
      getPage()
    } else {
      message.error(res.errMsg)
    }

  }
  //删除检查项
  const delItems = async () => {
    console.log({
      projectId,
      id: delid
    })
    const res = await operationDesigin.DeleteInspectionAddress({
      projectId,
      id: delid
    })

    if (res.success) {
      message.success('删除成功!')
      pageinfo.pageNum = 1
      getPage()
      delRef.current.onCancel()
    } else {
      message.error(res.errMsg)
    }
  }
  //获取巡检项数据
  const getPage = async () => {
    const info = form.getFieldsValue()
    let params = {
      projectId,
      pageNum: pageinfo.pageNum,
      pageSize: pageinfo.pageSize,
      alike: info.alike,
      areaId: info.areaId
    }
    const res = await operationDesigin.QueryInspectionAddressPage(params)
    if (res.success) {
      tabledata.tablesource = res.data
      pageinfo.total = res.total
      console.log(res.data)
    } else {
      message.error(res.errMsg)
    }
  }
  //分页查询
  const changePage = (page) => {

    pageinfo.pageNum = page.current
    pageinfo.pageSize = page.pageSize
    getPage()
  }
  
  useEffect(() => { getPage() }, [])
  return (
    <ContainerDiv>
      <BlueColumn name="巡检点管理" />
      <Form
        layout="inline"
        form={form}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        initialValues={{
          areaId: onelevel.length>0?0:null,
          alike: ''
        }}
      >
        <Form.Item name="areaId" noStyle={true} labelAlign="left">
          <Select
            options={options}
            style={{ width: 264 }}
            fieldNames={{ label: 'name', value: 'id' }}
            className="pdtop8 pdbottom12"
            onChange={changeSelect}
          ></Select>
        </Form.Item>
        <Divider style={{ margin: '0 32px', borderColor: '#999999', height: 32 }} dashed type="vertical"></Divider>
        <Form.Item style={{ marginRight: 'auto' }} >
          <div >
            <Form.Item noStyle={true} name="alike">
              <Input
                style={{
                  width: 290,
                  margin: '16px 0'
                }}
                placeholder="巡检点名称/具体位置"
              />
            </Form.Item>
            <Button style={{ width: 80, borderLeft: 'none', background: '#f5f7fa' }} className='searchbtn' onClick={search}>查询</Button>
          </div>
        </Form.Item>
        <Form.Item>
          {publish ? null : (
            <div style={{ display: 'flex' }}>
              <div className='btncss' onClick={printAll}>
                批量打印二维码
              </div>
              <div className='btncss' onClick={addDevice}>
                新增
              </div>
            </div>
          )}
        </Form.Item>

      </Form>
      <Divider style={{ margin: '0 0 24px 0', borderColor: '#d7d7d7' }} dashed ></Divider>
      <div style={{ height: 710, display: 'flex' }}>
      <Table   columns={columns} dataSource={tabledata.tablesource}
        pagination={{ current: pageinfo.pageNum, pageSize: pageinfo.pageSize, total: pageinfo.total }}
        onChange={changePage}
      ></Table>
      </div>
      <AddItem addRef={addRef} addform={addform} addItems={addItems} addoptiosn={addoptiosn}/>
      
      <EditItem editRef={editRef} editform={editform} updateItems={updateItems} addoptiosn={addoptiosn}/>
      <DeleteModal delRef={delRef} name='删除检查项' content="是否确认删除检查项" onOk={delItems} />
      {
        printshow?<Print print={printmess} ></Print>:null
      }
      {/* {
        printshowall?
          <PrintAll ref={printallref}>
            {tabledata.tablesource.map((it,index)=><Print print={it} index={index}></Print>)}
          </PrintAll>
          
        :null
      } */}
      <PrintAll ref={printallref}>
            {tabledata.tablesource?.map((it,index)=><Print print={it} index={index}></Print>)}
          </PrintAll>
    </ContainerDiv>
  )
}
//新增
const AddItem = ({ addRef, addItems, addform,addoptiosn }) => {
  const projectId = useSelector(state => state.system.menus.projectId)
  let  position= useReactive({})
  const positionRef = useRef()
  const savePosition =(local)=>{
    position={...local}
    addform.setFieldValue('address',local.inpvalue)
    positionRef.current.onCancel()
    console.log(position)
  }
  //设备穿梭框
  const devicelistref=useRef()
  //获取巡检设备
  const getDevicelist=async ()=>{
    const res =await operationDesigin.InspectionQueryDeviceList({
      projectId,
      deviceStyle: 0,
      alike: ""
    })
    if(res.success){
      devicelistref.current?.setDataSource(res.data.unused)
      devicelistref.current?.setSubMeter(res.data.used)
      devicelistref.current?.setCopydataSource(res.data.unused)
    }else{
      message.error(res.errMsg)
    }
  }
  //巡检穿梭
  const checklistref=useRef()

  const getChecklist=async ()=>{
    const res =await operationDesigin.QueryContentList({
      projectId,
      type: 0,
      alike: ""
    })
    if(res.success){
      checklistref.current?.setDataSource(res.data.unused)
      checklistref.current?.setSubMeter(res.data.used)
      checklistref.current?.setCopydataSource(res.data.unused)
    }else{
      message.error(res.errMsg)
    }
  }
  useEffect(()=>{

  },[])
  return (
    <Modal mold='cust' width={587} ref={addRef} onOk={()=>{addItems(position,devicelistref,checklistref)}} >
      <BlueColumn name="新增巡检点" styled={{ padding: '24px 0px', color: '#237ae4' }} ></BlueColumn>
        <AddDiv
        form={addform}
        labelCol={{ span: 5 }}
        colon={false}
        labelAlign="left"
        initialValues={{  }}
        >
        <Form.Item label="园区选择" name="areaId" rules={[{ required: true }]}>
          <Select
            options={addoptiosn}
            fieldNames={{ label: 'name', value: 'id' }}
          ></Select>
        </Form.Item>
        <Form.Item label="巡检点名称" name="name" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="巡检点地址"  >
          <div className='btncss' onClick={()=>{positionRef.current.onOpen();}}>点击获取</div>
        </Form.Item>
        <Form.Item label=" " name="address" rules={[{ required: true,message:'请点击获取巡检点地址' }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="定位误差">
          <Space>
          <Form.Item rules={[{required: true,pattern:/^(0|[1-9]\d{0,2}|1000)$/,message:'数值在0-1000之间'}]} name="addressSpan">
            <Input style={{width:96}}></Input>
          </Form.Item>
          <span>米</span>
          </Space>
        </Form.Item>
        <Form.Item label="具体位置" name="position" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="巡检设备"  rules={[{ required: true }]}>
          <div className='btncss' onClick={()=>{devicelistref.current.setOpen(true);getDevicelist()}}>点击选择</div>
        </Form.Item>
        {/* <Form.Item label=" " name="deviceGroup" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="巡检检查项"  rules={[{ required: true }]}>
          <div className='btncss' onClick={()=>{checklistref.current.setOpen(true);getChecklist()}}>点击选择</div>
        </Form.Item>
        {/* <Form.Item label=" " name="contentGroup" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="详细内容" name="remark" rules={[{required:true}]}>
        <TextArea  allowClear   />
      </Form.Item>
        </AddDiv>
      <SetPosition positionRef={positionRef} savePosition={savePosition}/>
      <SetLine ref={devicelistref} addform={addform}/>
      <TransLine ref={checklistref} addform={addform}/>
    </Modal>
  )

}
//编辑
const EditItem = ({ editRef, editform, updateItems,addoptiosn }) => {
  const projectId = useSelector(state => state.system.menus.projectId)
  const positionRef = useRef()
  const devicelistref=useRef()
  let  position= useReactive({})
  const savePosition=(local)=>{
      console.log(local)
      position={...local}
      editform.setFieldValue('address',local.inpvalue)
      positionRef.current.onCancel()
  }
  const getDevicelist=async ()=>{
    const formdata = editform.getFieldValue()
    const res =await operationDesigin.InspectionQueryDeviceList({
      projectId,
      deviceStyle: 0,
      inspectionAddressId:formdata.id,
      alike: ""
    })
    if(res.success){
      devicelistref.current?.setDataSource(res.data.unused)
      devicelistref.current?.setSubMeter(res.data.used)
      devicelistref.current?.setCopydataSource(res.data.unused)
    }else{
      message.error(res.errMsg)
    }
  }
  const checklistref=useRef()
  const getChecklist=async ()=>{
    const formdata = editform.getFieldValue()
    console.log(formdata)
    const res =await operationDesigin.QueryContentList({
      projectId,
      type: 0,
      inspectionAddressId:formdata.id,
      alike: ""
    })
    if(res.success){
      checklistref.current?.setDataSource(res.data.unused)
      checklistref.current?.setSubMeter(res.data.used)
      checklistref.current?.setCopydataSource(res.data.unused)
    }else{
      message.error(res.errMsg)
    }
  }
  useEffect(()=>{
    
  },[editform.getFieldValue()])
  return (
    <Modal mold='cust' width={587} ref={editRef} onOk={()=>{updateItems(position,devicelistref,checklistref)}} >
     
        <BlueColumn name="编辑检查项" styled={{ padding: '24px 0px', color: '#237ae4' }} ></BlueColumn>
        <AddDiv
        form={editform}
        labelCol={{ span: 5 }}
        colon={false}
        labelAlign="left"
        // initialValues={{  }}
        >
        <Form.Item label="园区选择" name="areaId" rules={[{ required: true }]}>
          <Select
            options={addoptiosn}
            fieldNames={{ label: 'name', value: 'id' }}
          ></Select>
        </Form.Item>
        <Form.Item label="巡检点名称" name="name" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="巡检点地址"  >
          <div className='btncss' onClick={()=>{positionRef.current.onOpen();}}>点击获取</div>
        </Form.Item>
        <Form.Item label=" " name="address" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item>
        <Form.Item label="具体位置" name="position" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="巡检设备"  rules={[{ required: true }]}>
          <div className='btncss' onClick={()=>{devicelistref.current.setOpen(true);getDevicelist()}}>点击选择</div>
        </Form.Item>
        {/* <Form.Item label=" " name="deviceGroup" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="巡检检查项"  rules={[{ required: true }]}>
          <div className='btncss' onClick={()=>{checklistref.current.setOpen(true);getChecklist()}}>点击选择</div>
        </Form.Item>
        {/* <Form.Item label=" " name="contentGroup" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="详细内容" name="remark" rules={[{required:true}]}>
        <TextArea  allowClear   />
      </Form.Item>
        </AddDiv>
        <CustContext.Provider value={{lngLat:editform.getFieldValue().lngLat,address:editform.getFieldValue().address}}>
            <SetPosition positionRef={positionRef} savePosition={savePosition}/>
        </CustContext.Provider>
        <SetLine ref={devicelistref} addform={editform}/>
        <TransLine ref={checklistref} addform={editform}/>

    </Modal>
  )
}

//删除组件
let DeleteModal = ({ delRef, name = '', content = '', ...other }) => {
  return (
    <Modal mold='cust' ref={delRef} {...other} className={style.DelModal}>
      <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn>
      <div>
        <img src={WarningPng} style={{ margin: '0 32px', width: 48, height: 48 }}></img>
        <span>{content}</span>
      </div>
    </Modal>
  )
}





