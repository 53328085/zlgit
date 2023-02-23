import React, { useRef,useState } from 'react'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import { Form, Row, Col,Select,Input,Divider } from 'antd'
export default function gateway() {
  const modalFormRef = useRef()
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
      title: '传感器型号',
      dataIndex: ''
    },
    {
      title: '传感器编号',
      dataIndex: ''
    },
    {
      title: '传感器名称',
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
    modalFormRef.current.onOpen()
  }
  const ComProps = {
    addopen,
    isenergy:false
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746
  }
  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns}></Table>
      </Comp>
      <AddModalForm {...ModalFormProps}></AddModalForm>
    </div>
  )
}

//新增网关
let AddModalForm = ({ modalFormRef, ...other }) => {
  return (
    <Modal mold='cust' ref={modalFormRef} {...other}>
      <BlueColumn name="新增传感器" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Form 
       labelAlign="left"
       colon={false}
       labelCol={{
         span:6
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
              <Input/>
            </Form.Item>
          </Col>
          <Col>
          <Divider type='vertical' style={{height:'100%',margin:'0 32px',borderColor:'#bcbcbc'}} dashed/>
          </Col>
          <Col flex={1}>
            <Form.Item label="所属网关">
              <Select></Select>
            </Form.Item>
            <Form.Item label="传感器型号">
              <Select></Select>
            </Form.Item>
            <Form.Item label="传感器编号">
              <Input/>
            </Form.Item>
            <Form.Item label="传感器名称">
              <Input/>
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