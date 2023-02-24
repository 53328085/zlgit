import React, { useEffect, useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Row, Col,Select,Input,Divider } from 'antd'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import {MultImport} from './modalCom'
import { Monitoring } from '@api/api.js'

const { DeviceManager: { QueryByPageElectric,QueryListGateWay } } = Monitoring
export default function gateway() {
  const [page,setPage]=useState({
    current:1,
    pageSize:10
  })
  const [dataSource,setDataSource]=useState([])
  const projectId = useSelector(state=>state.system.menus.projectId)
  const compRef =useRef()
  const modalFormRef = useRef()
  const modalImportRef =useRef()
  const columns = [
    {
      title: '园区名称',
      dataIndex: ''
    },
    {
      title: '安装地址',
      dataIndex: ''
    },
    {
      title: '电表编号',
      dataIndex: ''
    },
    {
      title: '电表型号',
      dataIndex: ''
    },
    {
      title: '电表名称',
      dataIndex: ''
    },
    {
      title: '所属网关',
      dataIndex: ''
    },
    {
      title: '用能类型',
      dataIndex: ''
    },
    {
      title: '备注',
      dataIndex: ''
    },
    {
      title: '操作',
      dataIndex: ''
    },
  ]
  //打开新增网关窗口
  const addopen = () => {
    modalFormRef?.current?.onOpen()
  }
  //打开批量导入窗口
  const multExport=()=>{
    modalImportRef?.current?.onOpen()
  }
  //获取电表列表
  const getQueryByPageElectric = async ()=>{
    let params={
      projectId,
      pageNum:page.current,
      pageSize:page.pageSize,
      areaId: compRef?.current?.selvalue,
      alike:compRef?.current?.inpvalue,
    }
    const resp = await QueryByPageElectric(params)
    console.log(resp)
    if(resp.success&&Array.isArray(resp.data)){
      setDataSource([...setDataSource])
    }else{
      setDataSource([])
    }
  }
  const a=async()=>{
  const r=  await QueryListGateWay(projectId)
  console.log(r)
  }
  useEffect(()=>{
    getQueryByPageElectric()
    a()
  },[])
  //传入props对象
  const ComProps = {
    addopen,
    isenergy:true,
    multExport,
    ref:compRef
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746,
   
  }
  const ImportProps={
    modalImportRef,
    width: 560,
    name:'/deviceExcel/electric.xlsx'
  }
  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} pagination={page} dataSource={dataSource}></Table>
      </Comp>
      <AddModalForm {...ModalFormProps}></AddModalForm>
      <MultImport {...ImportProps}></MultImport>
    </div>
  )
}

//新增网关
let AddModalForm = ({ modalFormRef, ...other }) => {
  const {TextArea} = Input
  return (
    <Modal mold='cust' ref={modalFormRef} {...other}>
      <BlueColumn name="新增电表" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Form 
        labelAlign="left"
        colon={false}
        labelCol={{
          span:5
        }}
      >
        <Row>
          <Col flex={1}>
            <Form.Item label="所属园区">
              <Select></Select>
            </Form.Item>
            <Form.Item label="安装地址">
              <Input/>
            </Form.Item>
            <Form.Item label="告警方案">
              <Select></Select>
            </Form.Item>
            <Form.Item label="备注">
              <TextArea/>
            </Form.Item>
          </Col>
          <Col>
          <Divider type='vertical' style={{height:'100%',margin:'0 32px',borderColor:'#bcbcbc'}} dashed/>
          </Col>
          <Col flex={1}>
            <Form.Item label="所属网关">
              <Select></Select>
            </Form.Item>
            <Form.Item label="设备型号">
            <Select></Select>
            </Form.Item>
            <Form.Item label="设备编号">
              <Input/>
            </Form.Item>
            <Form.Item label="设备名称">
              <Input/>
            </Form.Item>
            <Form.Item label="用能类型">
              <Select></Select>
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  )

}
let Count = ({ value, onChange }) => {
  console.log(value)
  const [number,setNumber] =useState(0)
  const reduce = () => {
    number>0&&number>0&&setNumber(number-1)
    onChange(number-1)
  }

  const add = () => {
    setNumber(number+1)
    onChange(number+1)
  }
  const inpBlur=(e)=>{
   
 
  }
  return (
    <div className={style.countNum}>
      <div onClick={reduce} className={style.opts} style={{borderRight:'none'}}>-</div>
      <Input  className={style.numbers} defaultValue={number}  onBlur={inpBlur} value={number} onChange={(e)=>{setNumber(e.target.value);onChange(e.target.value)}}/>
      <div onClick={add} className={style.opts} style={{borderLeft:'none'}}>+</div>
      <span style={{paddingLeft:16}}>(秒)</span>
    </div>
  )
}