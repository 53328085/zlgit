import React, { useEffect, useMemo, useState, useRef,useCallback, } from 'react'
import { useReactive, useAntdTable } from 'ahooks';
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message, Form ,Space, Typography} from 'antd'
import Table from '@com/useTable'
import { useSelector } from 'react-redux'
import { publishState } from '@redux/systemconfig'
import Modal from '@com/useModal'
import style from './style.module.less'
 
import { operationDesigin } from '@api/api'
import {SetPosition} from './position.jsx'
import {SetLine} from './devicecomp'
import TransLine from './contentcomp'
import CustContext from '@com/content.js'
import Print from './print.jsx'
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import {Serach} from '@com/comstyled'
import { CustButton } from '@com/useButton'
 const {Link} = Typography
// import UseMap from '@com/useMap/custom.js'
const ContainerDiv = styled.div`
      display: flex;
      flex: 1;
      padding-top: 16px;
      flex-direction: column;
      overflow: hidden;     
  `
const AddDiv = styled(Form)`
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
    { title: onelevel[0]?.levelName ?onelevel[0]?.levelName :'园区名称', dataIndex: 'areaName', align: "center", },
    { title: '巡检点编号', dataIndex: 'id', align: "center", },
    { title: '巡检点名称', dataIndex: 'name', align: "center" },
    { title: '具体位置', dataIndex: 'position', align: "center" },
    { title: '备注', dataIndex: 'remark', align: "center" },
    {
      title: '操作', dataIndex: 'options', align: "center", width: 240, render: (v, text) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Link underline onClick={async () => {printid = text.id;await getcode(text) }}>打印二维码</Link>
            <Link underline onClick={() => {console.log(text);setShow(!show); editform.setFieldsValue(text); editRef.current.onOpen() }}>编辑</Link>
            <Link type="danger" underline onClick={() => { delid = text.id; delRef.current.onOpen() }}>删除</Link>
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
  const totalItem = useRef();
  const curPage = useRef();
  const PageSize = 14
  const addDevice = () => {
    if(onelevel.length == 0){
      message.warning('请新增园区!')
      return 
    }
    addRef.current.onOpen()
    addform.setFieldsValue({
      address:'',
      areaId:undefined,
      name:'',
      position:'',
      remark:'',
      addressSpan:""
    })
  }
 
 
 
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
      refresh()
    //  addform.resetFields()
    
    } else {
      message.error(res.errMsg)
    }
    })
    
  }
  //更新检查项
  const updateItems = async (position, devicelistref, checklistref) => {
    editform.validateFields().then(async () => {
      const edit = editform.getFieldValue()
      console.log(edit, position, devicelistref, checklistref)
      const deviceGroup = devicelistref.current.subMeter.map(it => it.sn)
      const contentGroup = checklistref.current.subMeter.map(it => it.id)
      let params = {
        projectId,
        areaId: edit.areaId,
        id: edit.id,
        name: edit.name,
        lngLat: position.local ? position.local : edit.lngLat,
        address: edit.address,
        position: edit.position,
        remark: edit.remark,
        deviceGroup: deviceGroup.length > 0 ? deviceGroup : edit.deviceGroup,
        contentGroup: contentGroup.length > 0 ? contentGroup : edit.contentGroup
      }

      const res = await operationDesigin.UpdateInspectionAddress(params)
      if (res.success) {
        message.success('编辑成功!')
        editRef.current.onCancel()
        refresh()
      } else {
        message.error(res.errMsg)
      }
    }).catch(err => {
      console.log(err)
    })

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
      try {
        let current = Math.ceil((totalItem.current - 1)  / PageSize) < curPage.current
        
        if(current) {
          let values = form.getFieldsValue()
          run({current: curPage.current - 1, pageSize: PageSize}, values)
        }else {
          refresh()
        }
      
        delRef.current.onCancel()
      } catch (error) {
        
      }
    
    } else {
      message.error(res.errMsg)
    }
  }
  //获取巡检项数据


  const getPage = ({current, pageSize}, formData) => {
     
    curPage.current = current
    const {alike, areaId} =formData
    if(!Number.isInteger(areaId)) return new Promise((resolve) => {
      resolve({
        list: [],
        total: 0
      })
    })
    let params = {
      projectId,
      pageNum: current,
      pageSize,
      alike,
      areaId,
    }
   return operationDesigin.QueryInspectionAddressPage(params).then(res => {
      let {success, data, total} = res
      totalItem.current =Number.isInteger(total) ? total : 0
    
      if(success) {
         return {
          list: Array.isArray(data) ? data : [],
          total
         }

      }else {
        return {
          list: [],
          total: 0
        }
      }
    }).catch(() => {
      return {
        list: [],
        total: 0
      }
    })
    
  }
  const {tableProps, refresh, search,  run} = useAntdTable(getPage, {
    form,
    defaultPageSize: PageSize,
  })
  const {submit} = search
 
  return (
    <Pagecont showserach={false}   pd="0px" > 
     <Titlelayout title="巡检点管理" layout="flex" dr="column" style={{overflow: "hidden"}}>
    <ContainerDiv>
    
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
         <Space  size={64} split={<Divider type="vertical" style={{ margin: 0,borderColor: '#d7d7d7', height: '32px' }} dashed />}>
        <Form.Item name="areaId"  style={{marginRight: 0}}>
          <Select
            options={options}
            style={{ width: 264 }}
            fieldNames={{ label: 'name', value: 'id' }}
           
            onChange={submit}
          ></Select>
        </Form.Item>
     
        <Form.Item name="alike">
        <Serach
              placeholder="巡检点名称/具体位置"
              allowClear
              enterButton="查询"
              onSearch = {submit}
            />
        </Form.Item>
        </Space>
        <Form.Item>
          {publish ? null : (
            <Space size={16}>
              <CustButton onClick={printAll} style={{width: "122px"}}>
                批量打印二维码
              </CustButton>
              <CustButton onClick={addDevice}>
                新增
              </CustButton>
            </Space>
          )}
        </Form.Item>

      </Form>
      <Divider style={{ margin: '32px 0', borderColor: '#d7d7d7' }} dashed ></Divider>
    
      <Table   columns={columns} {...tableProps}></Table>
      
      <AddItem addRef={addRef} addform={addform} addItems={addItems} addoptiosn={addoptiosn}/>

      <EditItem editRef={editRef} editform={editform} updateItems={updateItems} addoptiosn={addoptiosn}/>
      <DeleteModal delRef={delRef} name='删除巡检点' content="是否确认删除巡检点" onOk={delItems} />
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
            {tableProps.dataSource?.map((it,index)=><Print print={it} index={index}></Print>)}
      </PrintAll>
        
    </ContainerDiv>
    </Titlelayout >
    </Pagecont>

  )
}
//新增
const AddItem = ({ addRef, addItems, addform,addoptiosn }) => {
  const projectId = useSelector(state => state.system.menus.projectId)
  const onelevel = useSelector(state => state.system.onelevel);
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
  console.log(222)
  },[ positionRef])
  return (
    <>
    <Modal mold='cust' custft={true} width={587} ref={addRef} onOk={ async ()=>{addItems(position,devicelistref,checklistref)}} title="新增巡检点">
      {/* <BlueColumn name="新增巡检点" styled={{ padding: '24px 0px', color: '#237ae4' }} ></BlueColumn> */}
        <AddDiv
        form={addform}
        labelCol={{ span: 5 }}
        colon={false}
        labelAlign="left"
        // initialValues={{ 
        //   areaId:undefined
        //  }}
        >
        <Form.Item label={onelevel[0]?.levelName?onelevel[0]?.levelName :'园区选择' } name="areaId" rules={[{ required: true }]}>
          <Select
            placeholder="请选择园区"
            options={addoptiosn}
            fieldNames={{ label: 'name', value: 'id' }}
          ></Select>
        </Form.Item>
        <Form.Item label="巡检点名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入巡检点名称"></Input>
        </Form.Item>
        <Form.Item label="巡检点地址"  >
          <CustButton onClick={()=>{positionRef.current.onOpen();}}>点击获取</CustButton>
        </Form.Item>
        <Form.Item label=" " name="address" rules={[{ required: true,message:'请点击获取巡检点地址' }]}>
          <Input disabled placeholder="请点击获取"></Input>
        </Form.Item>
        <Form.Item label="定位误差">
          <Space>
          <Form.Item rules={[{required: true,pattern:/^(0|[1-9]\d{0,2}|1000)$/,message:'数值在0-1000之间'}]} name="addressSpan">
            <Input style={{width:96}} placeholder="请输入定位误差"></Input>
          </Form.Item>
          <span>米</span>
          </Space>
        </Form.Item>
        <Form.Item label="具体位置" name="position" rules={[{ required: true }]} placeholder="请输入具体位置">
          <Input placeholder="请输入具体位置"></Input>
        </Form.Item>
        <Form.Item label="巡检设备"  rules={[{ required: true }]}>
          <CustButton onClick={()=>{devicelistref.current.setOpen(true);getDevicelist()}}>点击选择</CustButton>
        </Form.Item>
        {/* <Form.Item label=" " name="deviceGroup" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="巡检检查项"  rules={[{ required: true }]}>
          <CustButton onClick={()=>{checklistref.current.setOpen(true);getChecklist()}}>点击选择</CustButton>
        </Form.Item>
        {/* <Form.Item label=" " name="contentGroup" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="详细内容" name="remark" >
        <TextArea  allowClear  placeholder="请输入详细内容" />
      </Form.Item>
        </AddDiv>
      <SetPosition positionRef={positionRef} savePosition={savePosition}/>  
      <SetLine ref={devicelistref} addform={addform}/>
      <TransLine ref={checklistref} addform={addform}/>
    </Modal>
   
    </>
  )

}
//编辑
const EditItem = ({ editRef, editform, updateItems,addoptiosn }) => {
  const projectId = useSelector(state => state.system.menus.projectId)
  const onelevel = useSelector(state => state.system.onelevel);
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
    <Modal mold='cust' width={587} ref={editRef} onOk={()=>{updateItems(position,devicelistref,checklistref)}} title="编辑巡检点">
     
        {/* <BlueColumn name="编辑巡检点" styled={{ padding: '24px 0px', color: '#237ae4' }} ></BlueColumn> */}
        <AddDiv
        form={editform}
        labelCol={{ span: 5 }}
        colon={false}
        labelAlign="left"
        // initialValues={{  }}
        >
        <Form.Item label={onelevel[0]?.levelName?onelevel[0]?.levelName :'园区选择' } name="areaId" rules={[{ required: true }]}>
          <Select
            placeholder="请选择园区"
            options={addoptiosn}
            fieldNames={{ label: 'name', value: 'id' }}
          ></Select>
        </Form.Item>
        <Form.Item label="巡检点名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="巡检点名称"></Input>
        </Form.Item>
        <Form.Item label="巡检点地址"  >
          <CustButton onClick={()=>{positionRef.current.onOpen();}}>点击获取</CustButton>
        </Form.Item>
        <Form.Item label=" " name="address" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item>
        <Form.Item label="具体位置" name="position" rules={[{ required: true }]}>
          <Input placeholder="请输入具体位置"></Input>
        </Form.Item>
        <Form.Item label="巡检设备"  rules={[{ required: true }]}>
          <CustButton onClick={()=>{devicelistref.current.setOpen(true);getDevicelist()}}>点击选择</CustButton>
        </Form.Item>
        {/* <Form.Item label=" " name="deviceGroup" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="巡检检查项"  rules={[{ required: true }]}>
          <CustButton onClick={()=>{checklistref.current.setOpen(true);getChecklist()}}>点击选择</CustButton>
        </Form.Item>
        {/* <Form.Item label=" " name="contentGroup" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="详细内容" name="remark" >
        <TextArea  allowClear   placeholder='请输入详细内容'/>
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
    <Modal mold='cust' ref={delRef} {...other} className={style.DelModal} type="warn" title={name}>
       {content}
    </Modal>
  )
}





