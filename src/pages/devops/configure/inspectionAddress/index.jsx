import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useReactive } from 'ahooks';
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message, Form } from 'antd'
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
`
const { TextArea } = Input
export default function Index() {
  const publish = useSelector(publishState)
  const projectId = useSelector(state => state.system.menus.projectId)
  const onelevel = useSelector(state => state.system.onelevel);
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName + '(全部)', id: 0 }, ...onelevel]), [onelevel]) : []
  const addoptiosn = onelevel.length > 0 ? useMemo(() => ([...onelevel]), [onelevel]) : []

  let delid;
  const columns = [
    { title: '园区名称', dataIndex: 'name', align: "center", },
    { title: '巡检点编号', dataIndex: 'remark', align: "center", },
    { title: '巡检点名称', dataIndex: 'type', align: "center" },
    { title: '具体位置', dataIndex: 'type', align: "center" },
    { title: '备注', dataIndex: 'type', align: "center" },
    {
      title: '操作', dataIndex: 'options', align: "center", width: 180, render: (v, text) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span style={{ textDecoration: 'underline', color: '#237ae4', cursor: 'pointer' }} onClick={() => { editform.setFieldsValue(text); editRef.current.onOpen() }}>编辑</span>
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
  }
  const pageinfo = useReactive({
    pageNum: 1,
    pageSize: 2,
    total: 0
  })
  let tabledata = useReactive({
    tablesource: []
  })
  //新增检查项
  const addItems = async () => {
    const add = addform.getFieldsValue()
    let params = {
      projectId,
      type: add.type,
      name: add.name,
      remark: add.remark
    }
    const res = await operationDesigin.AddInspectionContent(params)
    if (res.success) {
      message.success('新增成功!')
      pageinfo.pageNum = 1
      getPage()
      addRef.current.onCancel()
    } else {
      message.error(res.errMsg)
    }
    console.log(add, params)

  }
  //更新检查项
  const updateItems = async () => {
    const edit = editform.getFieldValue()
    let params = {
      projectId,
      id: edit.id,
      type: edit.type,
      name: edit.name,
      remark: edit.remark
    }
    const res = await operationDesigin.UpdateInspectionContent(params)
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
    const res = await operationDesigin.DeleteInspectionContent({
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
  //获取检查项数据
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
      <BlueColumn name="检查项管理" />
      <Form
        layout="inline"
        form={form}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        initialValues={{
          areaId: 0,
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
                placeholder="巡检点编号/具体位置"
              />
            </Form.Item>
            <Button style={{ width: 80, borderLeft: 'none', background: '#f5f7fa' }} className='searchbtn' onClick={search}>查询</Button>
          </div>
        </Form.Item>
        <Form.Item>
          {publish ? null : (
            <div style={{ display: 'flex' }}>
              <div className='btncss' >
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
      <Table columns={columns} dataSource={tabledata.tablesource}
        pagination={{ current: pageinfo.pageNum, pageSize: pageinfo.pageSize, total: pageinfo.total }}
        onChange={changePage}
      ></Table>
      <AddItem addRef={addRef} addform={addform} addItems={addItems} addoptiosn={addoptiosn}/>
      <EditItem editRef={editRef} editform={editform} updateItems={updateItems} />
      <DeleteModal delRef={delRef} name='删除检查项' content="是否确认删除检查项" onOk={delItems} />
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
      deviceStyle: 0,
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
    <Modal mold='cust' ref={addRef} onOk={addItems}>
      <BlueColumn name="新增巡检点" styled={{ padding: '24px 0px', color: '#237ae4' }} ></BlueColumn>
      {/* <Form
        form={addform}
        labelCol={{ span: 5 }}
        colon={false}
        labelAlign="left"
        initialValues={{ type: 1 }}
      > */}
        <AddDiv
        form={addform}
        labelCol={{ span: 5 }}
        colon={false}
        labelAlign="left"
        initialValues={{  }}
        >
        <Form.Item label="园区选择" name="type" rules={[{ required: true }]}>
          <Select
            options={addoptiosn}
            fieldNames={{ label: 'name', value: 'id' }}
          ></Select>
        </Form.Item>
        <Form.Item label="巡检点名称" name="name" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="巡检点地址" name="name" >
          <div className='btncss' onClick={()=>{positionRef.current.onOpen();}}>点击获取</div>
        </Form.Item>
        <Form.Item label=" " name="address" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="具体位置" name="name" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="巡检设备"  rules={[{ required: true }]}>
          <div className='btncss' onClick={()=>{devicelistref.current.setOpen(true);getDevicelist()}}>点击选择</div>
        </Form.Item>
        <Form.Item label=" " name="deviceGroup" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="巡检检查项"  rules={[{ required: true }]}>
          <div className='btncss' onClick={()=>{checklistref.current.setOpen(true);getChecklist()}}>点击选择</div>
        </Form.Item>
        <Form.Item label=" " name="contentGroup" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item>
        </AddDiv>
      {/* </Form> */}
      <SetPosition positionRef={positionRef} savePosition={savePosition}/>
      <SetLine ref={devicelistref} addform={addform}/>
      <TransLine ref={checklistref} addform={addform}/>
    </Modal>
  )

}
//编辑
const EditItem = ({ editRef, editform, updateItems }) => {
  return (
    <Modal mold='cust' ref={editRef} onOk={updateItems}>
     
        <BlueColumn name="编辑检查项" styled={{ padding: '24px 0px', color: '#237ae4' }} ></BlueColumn>
        <Form
          form={editform}
          labelCol={{ span: 5 }}
          colon={false}
          labelAlign="left"
        >
          <Form.Item label="检查项类别" name="type" rules={[{ required: true }]}>
            <Select style={{ width: 160 }} ></Select>
          </Form.Item>
          <Form.Item label="检查项名称" name="name" rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="详细内容" name="remark" rules={[{ required: true }]}>
            <TextArea allowClear />
          </Form.Item>
        </Form>
   

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



