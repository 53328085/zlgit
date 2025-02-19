import React, { useEffect, useMemo, useState, useRef, useCallback, } from 'react'
import { useReactive, useAntdTable } from 'ahooks';
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message, Form, Space, Typography } from 'antd'
import Table from '@com/useTable'
import { useSelector } from 'react-redux'
import { publishState,adaptation } from '@redux/systemconfig'
import Modal from '@com/useModal'
import style from './style.module.less'

import { operationDesigin } from '@api/api'
import { SetPosition } from './position.jsx'
import { SetLine } from './devicecomp'
import TransLine from './contentcomp'
import CustContext from '@com/content.js'
import Print from './print.jsx'
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import { Serach } from '@com/comstyled'
import { CustButtonT, CustLink } from '@com/useButton'
const { Link } = Typography
// import UseMap from '@com/useMap/custom.js'
const ContainerDiv = styled.div`
      display: flex;
      flex: 1;
   //   padding-top: 16px;
      flex-direction: column;
      row-gap: 32px;
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
  const [isAdd, setIsAdd] = useState(false)
  const publish = useSelector(publishState)
  const projectId = useSelector(state => state.system.menus.projectId)
  const {laptop} = useSelector(adaptation)
  const onelevel = useSelector(state => state.system.onelevel);
  const options = onelevel.length > 0 ? useMemo(() => {
    let isall = onelevel.find(o => o.id == 0)
    return isall ? onelevel : ([{ name: onelevel[0]?.levelName + '(全部)', id: 0 }, ...onelevel])
  }, [onelevel]) : []
  const addoptiosn = onelevel.length > 0 ? useMemo(() => ([...onelevel]), [onelevel]) : []
  let delid;
  let printid;
  const [show, setShow] = useState(false)
  const [printmess, setPrintmess] = useState('')
  const [printshow, setPrintshow] = useState(false)
  const [printshowall, setPrintshowall] = useState(false)
  const [editdata, setEditdata] = useState({})
  const columns = [
    { title: onelevel[0]?.levelName ? onelevel[0]?.levelName : '园区名称', dataIndex: 'areaName', align: "center", },
    { title: '巡检点编号', dataIndex: 'id', align: "center", },
    { title: '巡检点名称', dataIndex: 'name', align: "center" },
    { title: '具体位置', dataIndex: 'position', align: "center" },
    { title: '备注', dataIndex: 'remark', align: "center" },
    {
      title: '操作', dataIndex: 'options', align: "center", width: 240, render: (v, text) => {
        return (
          <Space>
            <CustLink onClick={async () => { printid = text.id; await getcode(text) }} text="printqrcode" />
            <CustLink onClick={() => {
              setEditdata(text); setShow(!show); editform.setFieldsValue(text); editRef.current.onOpen();
            }} text="edit" />
            <CustLink type="danger" underline onClick={() => { delid = text.id; delRef.current.onOpen() }} text="delete" />
          </Space>
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
    setIsAdd(true)
    if (onelevel.length == 0) {
      message.warning('请新增园区!')
      return
    }
    addRef.current.onOpen()
    addform.setFieldsValue({
      address: '',
      areaId: undefined,
      name: '',
      position: '',
      remark: '',
      addressSpan: ""
    })
  }



  //获取二维码
  const getcode = async (text) => {
    console.log(text)
    const resp = await operationDesigin.InspectionAddressDetail({
      projectId,
      id: printid
    })
    if (resp.success) {
      setPrintmess({ areaName: text.areaName, ...resp.data })
      setPrintshow(true)


    } else {
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
  const printAll = async () => {
    console.log(printallref)
    handlePrint()
    setPrintshowall(true)
  }
  const checklistref = useRef()
  const showchecklist = async (id)=> {
      try {
        let params = id ? {
          projectId,
          type: 0,
          alike: "",
          inspectionAddressId:id
        } : {
          projectId,
          type: 0,
          alike: ""
        }
        const res = await operationDesigin.QueryContentList(params)
        if (res.success) {
          checklistref.current?.setDataSource(res.data.unused)
          checklistref.current?.setSubMeter(res.data.used)
          checklistref.current?.setCopydataSource(res.data.unused)
          checklistref.current?.setOpen(true)
        } else {
          message.error(res.errMsg)
        }
      } catch (error) {
        
      }
  }
  const devicelistref = useRef()
  const showdevice = async (id)=> {  // 新增时
    try {
      let params = id ? {
        projectId,
        deviceStyle: 0,
        alike: "",
        inspectionAddressId:id
      } : {
        projectId,
        deviceStyle: 0,
        alike: ""
      }
      const res = await operationDesigin.InspectionQueryDeviceList(params)
      if (res.success) {
        devicelistref.current.setOpen(true)
        devicelistref.current?.setDataSource(res.data.unused)
        devicelistref.current?.setSubMeter(res.data.used)
        devicelistref.current?.setCopydataSource(res.data.unused)
       
      } else {
        message.error(res.errMsg)
      }
    } catch (error) {
      console.log(error)
    }
  }
  //新增检查项
  const addItems = async (position, device, content) => {

    try {
      console.log("保存",position.local)
      return addform.validateFields().then(async () => {
        if (!position.local) {
          message.error('请添加坐标点')
          return
        }
        const add = addform.getFieldsValue()
        const deviceGroup = devicelistref.current.subMeter.map(it => it.sn)
        const contentGroup = checklistref.current.subMeter.map(it => it.id)

        let params = {
          projectId,
          areaId: add.areaId,
          name: add.name,
          lngLat: position.local,
          address: add.address,
          addressSpan: add.addressSpan,
          position: add.position,
          deviceGroup,
          contentGroup,
          remark: add.remark
        }
        const res = await operationDesigin.AddInspectionAddress(params)
        if (res.success) {
          message.success('新增成功!')
          refresh()
          //  addform.resetFields()

        }
        else {
          message.error(res.errMsg)
        }

      })
    } catch (error) {
      console.log(error)
      return Promise.reject(error)

    }
  }
  //更新检查项
  const updateItems = async (position) => {
    editform.validateFields().then(async () => {
      const edit = editform.getFieldValue()
     
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
        let current = Math.ceil((totalItem.current - 1) / PageSize) < curPage.current

        if (current) {
          let values = form.getFieldsValue()
          run({ current: curPage.current - 1, pageSize: PageSize }, values)
        } else {
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


  const getPage = ({ current, pageSize }, formData) => {

    curPage.current = current
    const { alike, areaId } = formData
    if (!Number.isInteger(areaId)) return new Promise((resolve) => {
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
      let { success, data, total } = res
      totalItem.current = Number.isInteger(total) ? total : 0

      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total
        }

      } else {
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
  const { tableProps, refresh, search, run } = useAntdTable(getPage, {
    form,
    defaultPageSize: PageSize,
  })
  const { submit } = search

  return (
    <Pagecont showserach={false} pd="0px" >
      <Titlelayout title="巡检点管理" layout="flex" dr="column" style={{ overflow: "hidden" }}>
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
              areaId: onelevel.length > 0 ? 0 : null,
              alike: ''
            }}
          >
            <Space size={16} >
              <Form.Item name="areaId" style={{ marginRight: 0 }}>
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
                  onSearch={submit}
                />
              </Form.Item>
            </Space>
            <Form.Item>
              {publish ? null : (
                <Space size={16}>
                  <CustButtonT onClick={printAll} wh="auto" text="bBatchprtQRcode" />

                  <CustButtonT text="new" onClick={addDevice} />


                </Space>
              )}
            </Form.Item>

          </Form>
          <Table columns={columns} {...tableProps}></Table>

          <AddItem addRef={addRef} addform={addform} addItems={addItems} laptop={laptop} addoptiosn={addoptiosn} showchecklist={() =>showchecklist()} showdevice={()=>showdevice()} />
          <TransLine ref={checklistref} addform={addform} laptop={laptop} />
          <SetLine ref={devicelistref} addform={addform} laptop={laptop} />     {/* 巡检设备 */}
          <EditItem editRef={editRef} editform={editform} updateItems={updateItems} addoptiosn={addoptiosn} showchecklist={()=>showchecklist(editdata?.id)} showdevice={()=>showdevice(editdata?.id)}   />
          <DeleteModal delRef={delRef} name='删除巡检点' content="是否确认删除巡检点" onOk={delItems} />
          {
            printshow ? <Print print={printmess} ></Print> : null
          }
          {/* {
        printshowall?
          <PrintAll ref={printallref}>
            {tabledata.tablesource.map((it,index)=><Print print={it} index={index}></Print>)}
          </PrintAll>
          
        :null
      } */}
          <PrintAll ref={printallref}>
            {tableProps.dataSource?.map((it, index) => <Print print={it} index={index}></Print>)}
          </PrintAll>

        </ContainerDiv>
      </Titlelayout >
    </Pagecont>

  )
}
//新增
const AddItem = ({ addRef, addItems, addform, addoptiosn, laptop, showchecklist,showdevice }) => {
  const projectId = useSelector(state => state.system.menus.projectId)
  const onelevel = useSelector(state => state.system.onelevel);
  let position = useReactive({})
  const positionRef = useRef()
  const savePosition = (local) => {
    position = { ...local }
    addform.setFieldValue('address', local.inpvalue)
    positionRef.current.onCancel()
    console.log(position)
  }
  //设备穿梭框
  const devicelistref = useRef()
  //获取巡检设备
  const getDevicelist = async () => {
    const res = await operationDesigin.InspectionQueryDeviceList({
      projectId,
      deviceStyle: 0,
      alike: ""
    })
    if (res.success) {
      devicelistref.current?.setDataSource(res.data.unused)
      devicelistref.current?.setSubMeter(res.data.used)
      devicelistref.current?.setCopydataSource(res.data.unused)
    } else {
      message.error(res.errMsg)
    }
  }
  //巡检穿梭
  const checklistref = useRef()

  const getChecklist = async () => {
    const res = await operationDesigin.QueryContentList({
      projectId,
      type: 0,
      alike: ""
    })
    if (res.success) {
      checklistref.current?.setDataSource(res.data.unused)
      checklistref.current?.setSubMeter(res.data.used)
      checklistref.current?.setCopydataSource(res.data.unused)
    } else {
      message.error(res.errMsg)
    }
  }
  useEffect(() => {
    console.log(222)
  }, [positionRef])
  return (
    <>
      <Modal mold='cust' custft={true} width={587} ref={addRef} onOk={async () => {await addItems(position) }} title="新增巡检点">
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
          <Form.Item label={onelevel[0]?.levelName ? onelevel[0]?.levelName : '园区选择'} name="areaId" rules={[{ required: true }]}>
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
            <CustButtonT onClick={() => { positionRef.current.onOpen(); }} text="clicktoget" />
          </Form.Item>
          <Form.Item label=" " name="address" rules={[{ required: true, message: '请点击获取巡检点地址' }]}>
            <Input disabled placeholder="请点击获取"></Input>
          </Form.Item>
          <Form.Item label="定位误差">
            <Space>
              <Form.Item rules={[{ required: true, pattern: /^(0|[1-9]\d{0,2}|1000)$/, message: '数值在0-1000之间' }]} name="addressSpan">
                <Input style={{ width: 96 }} placeholder="请输入定位误差"></Input>
              </Form.Item>
              <span>米</span>
            </Space>
          </Form.Item>
          <Form.Item label="具体位置" name="position" rules={[{ required: true }]} placeholder="请输入具体位置">
            <Input placeholder="请输入具体位置"></Input>
          </Form.Item>
          <Form.Item label="巡检设备" rules={[{ required: true }]}>
       {/*      <CustButtonT onClick={() => { devicelistref.current.setOpen(true); getDevicelist() }} text="clickts" /> */}
            <CustButtonT onClick={showdevice} text="clickts" />
          </Form.Item>
          {/* <Form.Item label=" " name="deviceGroup" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item> */}
        {laptop ? null : <Divider dashed></Divider>}  
          <Form.Item label="巡检检查项" rules={[{ required: true }]}>
          <CustButtonT onClick={showchecklist} text="clickts" />
           {/*  <CustButtonT onClick={() => { checklistref.current.setOpen(true); getChecklist() }} text="clickts" /> */}
          </Form.Item>
          {/* <Form.Item label=" " name="contentGroup" rules={[{ required: true }]}>
          <Input ></Input>
        </Form.Item> */}
           {laptop ? null : <Divider dashed></Divider>}  
          <Form.Item label="详细内容" name="remark" >
            <TextArea allowClear placeholder="请输入详细内容" />
          </Form.Item>
        </AddDiv>
        <SetPosition positionRef={positionRef} savePosition={savePosition} />
      {/*   <SetLine ref={devicelistref} addform={addform} laptop={laptop} /> */}
       {/*  <TransLine ref={checklistref} addform={addform} laptop={laptop} /> */}
      </Modal>
      
    </>
  )

}
//编辑
const EditItem = ({ editRef, editform, updateItems, addoptiosn,showchecklist,showdevice }) => {
  const projectId = useSelector(state => state.system.menus.projectId)
  const onelevel = useSelector(state => state.system.onelevel);
  const positionRef = useRef()
  const devicelistref = useRef()
  let position = useReactive({})
  const savePosition = (local) => {
    console.log(local)
    position = { ...local }
    editform.setFieldValue('address', local.inpvalue)
    positionRef.current.onCancel()
  }
  const getDevicelist = async () => {
    const formdata = editform.getFieldValue()
    const res = await operationDesigin.InspectionQueryDeviceList({
      projectId,
      deviceStyle: 0,
      inspectionAddressId: formdata.id,
      alike: ""
    })
    if (res.success) {
      devicelistref.current?.setDataSource(res.data.unused)
      devicelistref.current?.setSubMeter(res.data.used)
      devicelistref.current?.setCopydataSource(res.data.unused)
    } else {
      message.error(res.errMsg)
    }
  }
  const checklistref = useRef()
  const getChecklist = async () => {
    const formdata = editform.getFieldValue()
    console.log(formdata)
    const res = await operationDesigin.QueryContentList({
      projectId,
      type: 0,
      inspectionAddressId: formdata.id,
      alike: ""
    })
    if (res.success) {
      checklistref.current?.setDataSource(res.data.unused)
      checklistref.current?.setSubMeter(res.data.used)
      checklistref.current?.setCopydataSource(res.data.unused)
    } else {
      message.error(res.errMsg)
    }
  }
  useEffect(() => {

  }, [editform.getFieldValue()])
  return (
    <Modal mold='cust' width={587} ref={editRef} onOk={() => { updateItems(position) }} title="编辑巡检点">

      {/* <BlueColumn name="编辑巡检点" styled={{ padding: '24px 0px', color: '#237ae4' }} ></BlueColumn> */}
      <AddDiv
        form={editform}
        labelCol={{ span: 5 }}
        colon={false}
        labelAlign="left"
      // initialValues={{  }}
      >
        <Form.Item label={onelevel[0]?.levelName ? onelevel[0]?.levelName : '园区选择'} name="areaId" rules={[{ required: true }]}>
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
          <CustButtonT onClick={() => { positionRef.current.onOpen(); }} text="clicktoget" />
        </Form.Item>
        <Form.Item label=" " name="address" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item>
        <Form.Item label="具体位置" name="position" rules={[{ required: true }]}>
          <Input placeholder="请输入具体位置"></Input>
        </Form.Item>
        <Form.Item label="巡检设备" rules={[{ required: true }]}>
          <CustButtonT onClick={showdevice} text="clicktoget" />
        </Form.Item>
        {/* <Form.Item label=" " name="deviceGroup" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="巡检检查项" rules={[{ required: true }]}>
          <CustButtonT onClick={showchecklist} text="clicktoget" />
        </Form.Item>
        {/* <Form.Item label=" " name="contentGroup" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item> */}
        <Divider dashed></Divider>
        <Form.Item label="详细内容" name="remark" >
          <TextArea allowClear placeholder='请输入详细内容' />
        </Form.Item>
      </AddDiv>
      <CustContext.Provider value={{ lngLat: editform.getFieldValue().lngLat, address: editform.getFieldValue().address }}>
        <SetPosition positionRef={positionRef} savePosition={savePosition} />
      </CustContext.Provider>
      <SetLine ref={devicelistref} addform={editform} />
      <TransLine ref={checklistref} addform={editform} />

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





