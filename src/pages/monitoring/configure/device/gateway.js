import React, { useEffect, useRef, useState } from 'react'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import { MultImport, DeleteModal } from './modalCom'
import restart from './imgs/restart.png'
import { Form, Row, Col, Select, Input, Divider, Upload, message } from 'antd'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
const { DeviceManager: { AeraQueryAll, QueryUsedGateway,GatewayAdd,QueryByPageGateWay,GatewayUpdate,GatewayDelete,StartReboot } } = Monitoring
export default function gateway() {
  const [selectopts, setSelectopts] = useState()
  const [addopts, setAddOpts] = useState()
  const [usecategory, setUsecategory] = useState()
  const [dataSource,setDataSource] = useState()
  const [delId,setDelId] = useState()
  const [gatewaySn,setGatewaySn] = useState('')
  const [loading, setLoading] = useState(false);
  const [page,setPage]=useState({
    current:1,
    pageSize:10,
    hideOnSinglePage: false
  })
  const pageRef= useRef(page)
  pageRef.current=page
  const compRef = useRef()
  const modalFormRef = useRef() //新增Ref
  const modalEditRef = useRef() //编辑Ref
  const modalImportRef = useRef() //导入Ref
  const modalReStartRef = useRef() //重启Ref
  const keyParamRef = useRef() //参数下发Ref
  const modalDelRef = useRef() //删除Ref
  const [editform] =Form.useForm()
  const [addForm] = Form.useForm()
  const projectId = useSelector(state => state.system.menus.projectId)
  const optcss = {
    color: '#237ae4',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
  let startsn;
  const columns = [
    {
      title: '园区名称',
      dataIndex: 'areaName'
    },
    {
      title: '安装地址',
      dataIndex: 'address'
    },
    {
      title: '网关编号',
      dataIndex: 'sn'
    },
    {
      title: '网关型号',
      dataIndex: 'category'
    },
    {
      title: '网关名称',
      dataIndex: 'name'
    },
    {
      title: 'IMEI',
      dataIndex: 'imei'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      dataIndex: '8',
      width: 304,
      render: (text,record,index) => {
        return (
          <p style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span style={optcss} onClick={()=>{onRestart(record)}}>重启</span>
            <span style={optcss} onClick={()=>{onKeyParam(record)}}>参数下发</span>
            <span style={optcss} onClick={()=>{onEdit(record)}}>编辑</span>
            <span style={{ ...optcss, color: '#FF0000' }} onClick={()=>{onDelete(record)}}>删除</span>
          </p>
        )
      }
    },
  ]
  columns.forEach(it => it.align = 'center')
  //打开参数下发弹窗
  const onKeyParam = (record) => {
    setGatewaySn(record.sn)
    keyParamRef?.current?.onOpen()
  }
  //打开重启网关弹窗
  const onRestart = (record) => {
    console.log(record)
    modalReStartRef?.current?.onOpen()
    startsn=record.sn
  }
  //打开编辑网关窗口
  const onEdit=(record)=>{
    modalEditRef?.current?.onOpen()
    console.log(record)
    editform.setFieldsValue({
      ...record,
      area:record.areaName
    })
  }
  //打开新增网关窗口
  const addopen = () => {
    modalFormRef?.current?.onOpen()
    addForm.setFieldsValue({
      area:'',
      address:'',
      remark:'',
      category:'',
      sn:'',
      pwd:'',
      name:'',
      heartInterval:''
    })
  }
  //打开批量导入窗口
  const multExport = () => {
    modalImportRef?.current?.onOpen()
  }
  //打开删除窗口
  const onDelete = (record) => {
    setDelId(record.id)
    modalDelRef?.current?.onOpen()
  }
 
  //获取园区
  const getAeraQueryAll = async () => {
    try {
      const resp = await AeraQueryAll(projectId)
      if (resp.success && Array.isArray(resp.data)) {
        const data = [{ name: '全部园区', id: 0 }, ...resp.data]
        setSelectopts(() => [...data])
        setAddOpts(() => [...resp.data])
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取网关列表
  const getQueryByPageGateWay =async(curpage=0,pageSize=0,id=0,like='')=>{
    setLoading(true)
    let params={
      projectId,
      // pageNum:page.current,
      // pageSize:page.pageSize,
      pageNum: curpage?curpage:pageRef.current.current,
      pageSize: pageSize?pageSize:pageRef.current.pageSize,
      areaId: id?id:0,
      alike:like?like:'',
    }
    
    const resp = await QueryByPageGateWay(params)
    setLoading(false)
    setPage({
      ...page,
      current:resp.pageNum,
      pageSize: resp.pageSize,
      total: resp.total
    })
    if(resp.success&&Array.isArray(resp.data)){
      setDataSource(()=>resp.data.reverse())
    }else{
      console.log('setdata[]')
      setDataSource([])
    }
  }
  //获取已使用网关型号
  const getQueryUsedGateway = async () => {
    try {
      const { data, success, errMsg } = await QueryUsedGateway(projectId)
      if (success) {
        const mapdata = data.map((it) => {
          return {
            label: it,
            value: it
          }
        })
        setUsecategory([...mapdata])
      }
    } catch (e) {
      console.log(e)
    }

  }
  //确认新增
  const addOk = async () => {
    const {area,category,address,sn,pwd,name,heartInterval,remark} = addForm.getFieldsValue()
    let params = {
      id:0,
      projectId,
      areaId: area,
      address,
      category,
      sn,
      pwd,
      name,
      heartInterval,
      remark
    }

   const {data,success,errMsg} = await GatewayAdd(params)

   if(success){
    message.success('新增成功')
    modalFormRef.current.onCancel()
    getQueryByPageGateWay(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,)
   }else{
    message.error(errMsg)
   }
  }
  //确认编辑
  const editOk=async()=>{
    const {areaId,category,address,sn,pwd,name,heartInterval,remark,id} = editform.getFieldValue()
    let params ={
      id:id,
      projectId,
      areaId,
      address,
      category,
      sn,
      pwd,
      name,
      heartInterval:Number(heartInterval),
      remark
    }
    console.log(params)
    const {data,success,errMsg} = await GatewayUpdate(params)
    if(success){
      message.success('更新成功')
      modalEditRef.current.onCancel(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,)
      getQueryByPageGateWay()
    }else{
      message.error(errMsg)
     }
  }
  //确认删除
  const delOk=async()=>{
    let params ={
      projectId,
      id:delId
    }
    const resp = await GatewayDelete(params)
    if(resp.success){
      modalDelRef?.current?.onCancel()
      message.success('删除成功!')
      if(page.pageSize*page.current>=page.total){
        setPage({
          ...page,
          current:page.current-1
        })
      }
      setTimeout(()=>{
        getQueryByPageGateWay(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,)
      },0)
      
      
    }else{
      message.error(resp.errMsg)
    }
  }
  //确认重启
  const startOk=async()=>{
  //  const res = await StartReboot(startsn) 
  //  if(res.success){
  //   message.success('重启成功')
  //  }else{
  //   message.error(res.errMsg)
  //  }
  }
  const cancelOk=()=>{
    modalFormRef.current.onCancel()
  }
  const ComProps = {
    addopen,
    multExport,
    ref: compRef,
    selectopts,
    page,
    setPage,
    getList: getQueryByPageGateWay,
  }
  let ModalFormProps = {
    modalFormRef,
    width: 746,
    addopts,
    selectopts,
    addForm,
    usecategory,
    onOk: addOk,
    onCancel:cancelOk
  }
  const ImportProps = {
    modalImportRef,
    width: 560
  }
  const EditProps={
    modalEditRef,
    editform,
    width:772,
    onOk:editOk
  }
  useEffect(() => {
    getQueryByPageGateWay()
    getAeraQueryAll()
    getQueryUsedGateway()
  }, [])
  
  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} dataSource={dataSource} pagination={page} loading={loading} onChange={(page, pageSize) => {
          setPage(() => ({
            ...page
          }))
          getQueryByPageGateWay(page.current, page.pageSize, compRef.current.selvalue, compRef.current.inpvalue)
        }}></Table>
      </Comp>
      <AddModalForm {...ModalFormProps}></AddModalForm>
      <MultImport {...ImportProps}></MultImport>
      <ReStart modalReStartRef={modalReStartRef} startOk={startOk}></ReStart>
      <KeyParam keyParamRef={keyParamRef} gatewaySn={gatewaySn}></KeyParam>
      <DeleteModal DelModalRef={modalDelRef} name="删除网关" content="是否确认删除网关？" onOk={delOk}></DeleteModal>
      <EditModalForm {...EditProps}></EditModalForm>
    </div>
  )
}

//新增网关组件
let AddModalForm = ({ modalFormRef, addopts, addForm, usecategory, ...other }) => {
  return (
    <Modal mold='cust' ref={modalFormRef} {...other}>
      <BlueColumn name="新增网关" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Form
        form={addForm}
       
      >
        <Row>
          <Col flex={1}>
            <Form.Item label="所属园区" name="area">
              <Select
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
                options={addopts}
                
              ></Select>
            </Form.Item>
            <Form.Item label="安装地址" name="address"
            rules={[
              {
                required: true,
                message: 'Please input your name',
              },
            ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="备注信息" name="remark">
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
          </Col>
          <Col flex={1}>
            <Form.Item label="网关型号" name="category">
              <Select
                options={usecategory}
              ></Select>
            </Form.Item>
            <Form.Item label="网关编号" name="sn">
              <Input />
            </Form.Item>
            <Form.Item label="网关密码" name="pwd">
              <Input />
            </Form.Item>
            <Form.Item label="网关名称" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="心跳周期" name="heartInterval">
              <Count></Count>
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  )

}

//计数器组件
let Count = ({ value, onChange }) => {
  console.log(value)
  const [number, setNumber] = useState(value?value:0)
  const reduce = () => {
    number > 0 && number > 0 && setNumber(number - 1)
    onChange(number - 1)
  }

  const add = () => {
    setNumber(number + 1)
    onChange(number + 1)
  }
  const inpBlur = (e) => {


  }
  return (
    <div className={style.countNum}>
      <div onClick={reduce} className={style.opts} style={{ borderRight: 'none' }}>-</div>
      <Input className={style.numbers} defaultValue={number} onBlur={inpBlur} value={number} onChange={(e) => { setNumber(e.target.value); onChange(e.target.value) }} />
      <div onClick={add} className={style.opts} style={{ borderLeft: 'none' }}>+</div>
      <span style={{ paddingLeft: 16 }}>(秒)</span>
    </div>
  )
}
//重启网关组件
let ReStart = ({ modalReStartRef,startOk }) => {
  return (
    <Modal mold='cust' ref={modalReStartRef} onOk={startOk}>
      <BlueColumn name="重启提示" styled={{ padding: '24px 0px' ,color:'#237ae4'}}></BlueColumn>
      <div style={{ margin: '16px 32px 0' }}>
        <img src={restart}></img>
        <span style={{ paddingLeft: 32, fontSize: 16 }}>确认要重启网关？</span>
      </div>

    </Modal>
  )
}
//参数下发组件
const KeyParam = ({ keyParamRef ,gatewaySn}) => {
  return (
    <Modal mold='cust' ref={keyParamRef}>
      <BlueColumn name="网关参数下发" styled={{ padding: '24px 0px',color:'#237ae4' }}></BlueColumn>
      <div style={{ margin: '16px 32px 0', display: 'flex', alignItems: 'center' }}>
        <div><img src={restart}></img></div>
        <div style={{ paddingLeft: 32, fontSize: 16 }}>
          <p>网关编号:{gatewaySn}</p>
          <p>是否对本网关参数下发?</p>
        </div>
      </div>
    </Modal>
  )
}
//编辑网关
const EditModalForm=({modalEditRef,editform ,...other})=>{
  return (
    <Modal mold='cust' ref={modalEditRef} {...other}>
      <BlueColumn name="编辑网关" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Form
        form={editform}
       
      >
        <Row>
          <Col flex={1}>
            <Form.Item label="所属园区" name="area">
              <Select
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
                disabled 
              ></Select>
            </Form.Item>
            <Form.Item label="安装地址" name="address"
            rules={[
              {
                required: true,
                message: 'Please input your name',
              },
            ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="备注信息" name="remark">
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
          </Col>
          <Col flex={1}>
            <Form.Item label="网关型号" name="category">
              <Select
               disabled 
              ></Select>
            </Form.Item>
            <Form.Item label="网关编号" name="sn">
              <Input />
            </Form.Item>
            <Form.Item label="网关密码" name="pwd">
              <Input />
            </Form.Item>
            <Form.Item label="网关名称" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="心跳周期" name="heartInterval">
              <Count></Count>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
