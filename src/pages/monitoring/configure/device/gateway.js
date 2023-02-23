import React, { useRef,useState } from 'react'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import {MultImport,DeleteModal} from './modalCom'
import restart from './imgs/restart.png'
import { Form, Row, Col,Select,Input,Divider,Upload } from 'antd'


export default function gateway() {
  const modalFormRef = useRef() //新增Ref
  const modalImportRef=useRef() //导入Ref
  const modalReStartRef = useRef() //重启Ref
  const keyParamRef = useRef() //参数下发Ref
  const modalDelRef=useRef() //删除Ref
  const optcss={
    color: '#237ae4',
    textDecoration:'underline',
    cursor: 'pointer',
  }
  const columns = [
    {
      title: '园区名称',
      dataIndex: '1'
    },
    {
      title: '安装地址',
      dataIndex: '2'
    },
    {
      title: '网关编号',
      dataIndex: '3'
    },
    {
      title: '网关型号',
      dataIndex: '4'
    },
    {
      title: '网关名称',
      dataIndex: '5'
    },
    {
      title: 'IMEI',
      dataIndex: '6'
    },
    {
      title: '备注',
      dataIndex: '7'
    },
    {
      title: '操作',
      dataIndex: '8',
      width:304,
      render:()=>{
        return(
          <p style={{display:'flex',justifyContent:'space-around'}}>
          <span style={optcss} onClick={onRestart}>重启</span>
          <span style={optcss} onClick={onKeyParam}>参数下发</span>
          <span style={optcss}>编辑</span>
          <span style={{...optcss,color:'#FF0000'}} onClick={onDelete}>删除</span>
        </p>
        ) 
      }
    },
  ]
  columns.forEach(it=>it.align='center')
  //打开参数下发弹窗
  const onKeyParam=()=>{
    keyParamRef?.current?.onOpen()
  }
  //打开重启网关弹窗
  const onRestart=()=>{
    modalReStartRef?.current?.onOpen()
  }
  //打开新增网关窗口
  const addopen = () => {
    modalFormRef?.current?.onOpen()
  }
  //打开批量导入窗口
  const multExport=()=>{
    modalImportRef?.current?.onOpen()
  }
  //打开删除窗口
  const onDelete=()=>{
    modalDelRef?.current?.onOpen()
  }
  const dataSource=[{
    1:1,
    2:2
  }]
  const ComProps = {
    addopen,
    multExport
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746
  }
  const ImportProps={
    modalImportRef,
    width: 560
  }
  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} dataSource={dataSource}></Table>
      </Comp>
      <AddModalForm {...ModalFormProps}></AddModalForm>
      <MultImport {...ImportProps}></MultImport>
      <ReStart modalReStartRef={modalReStartRef}></ReStart>
      <KeyParam keyParamRef={keyParamRef}></KeyParam>
      <DeleteModal DelModalRef={modalDelRef} name="删除网关" content="是否确认删除网关？"></DeleteModal>
    </div>
  )
}

//新增网关组件
let AddModalForm = ({ modalFormRef, ...other }) => {
  return (
    <Modal mold='cust' ref={modalFormRef} {...other}>
      <BlueColumn name="新增网关" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Form >
        <Row>
          <Col flex={1}>
            <Form.Item label="所属园区">
              <Select></Select>
            </Form.Item>
            <Form.Item label="安装地址">
              <Input/>
            </Form.Item>
            <Form.Item label="备注信息">
              <Input/>
            </Form.Item>
          </Col>
          <Col>
          <Divider type='vertical' style={{height:'100%',margin:'0 32px',borderColor:'#bcbcbc'}} dashed/>
          </Col>
          <Col flex={1}>
            <Form.Item label="网关型号">
              <Select></Select>
            </Form.Item>
            <Form.Item label="网关编号">
              <Input/>
            </Form.Item>
            <Form.Item label="网关密码">
              <Input/>
            </Form.Item>
            <Form.Item label="网关名称">
              <Input/>
            </Form.Item>
            <Form.Item label="心跳周期" name="heartCycle">
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
//重启网关组件
let ReStart=({modalReStartRef})=>{
  return (
    <Modal mold='cust' ref={modalReStartRef}>
      <BlueColumn name="重启提示" styled={{ padding: '24px 0px' }}></BlueColumn>
      <div style={{margin:'16px 32px 0'}}>
        <img src={restart}></img>
        <span style={{paddingLeft:32,fontSize:16}}>确认要重启网关？</span>
      </div>
      
    </Modal>
  )
}
//参数下发组件
const KeyParam=({keyParamRef})=>{
  return (
    <Modal mold='cust' ref={keyParamRef}>
      <BlueColumn name="网关参数下发" styled={{ padding: '24px 0px' }}></BlueColumn>
      <div style={{margin:'16px 32px 0',display:'flex',alignItems:'center'}}>
          <div><img src={restart}></img></div>
          <div style={{paddingLeft:32,fontSize:16}}>
          <p>网关编号:</p>
          <p>是否对本网关参数下发?</p>
          </div>
      </div>
    </Modal>
  )
}
