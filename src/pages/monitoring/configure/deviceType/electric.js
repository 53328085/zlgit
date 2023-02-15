import React, { useEffect, useState, useRef } from 'react'
import DeviceContent from './deviceContent'
import gateWayImg from '@imgs/gateway.png';
import style from './style.module.less'
import AllColumns from './columns'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Upload ,Select,Switch } from 'antd';
import Table from '@com/useTable'
import electricImg from '@imgs/diaobiao.png'


export default function Electric() {
  const [imgUrl, setImaUrl] = useState(gateWayImg) //默认网关图
  const { DeviceTypeManager: {  } } = Monitoring;
  const ModalRef = useRef(null)
  const projectId = useSelector(state => state.system.menus.projectId)
  const [addForm] = Form.useForm()
  let params = {
    projectId,
    pageNum: 1,
    pageSize: 10,
    alike: ''
  }

  const getTableData = async () => {
    // const result = await GatewayType(params)
    // const { data, errMsg, success } = result;
    // if (success && Array.isArray(data)) {

    // }
  }
  getTableData()
  const open = () => {
    ModalRef.current.onOpen()
  }
  const onOk = () => {

  }
  let addModalProp={
    addForm
  }
  let deviceProps = {
    value: 0,
    name: '新增电表类型',
    AddModal:<AddModal {...addModalProp}></AddModal>,
    cancelText: '取消',
    okText: '确认',
    onOk,
    width: 1032,
    open,
    ModalRef
  };
  return (
    <div>
      <DeviceContent {...deviceProps} >
        <Table columns={AllColumns[1]}></Table>
      </DeviceContent>
    </div>
  )
}

// let Count=(value,onChange)=>{
  // const [number,setNumber]= useState(300)
  // const triggerChange = (changedValue) => {
  //   onChange?.({
  //     number,
  //     currency,
  //     ...value,
  //     ...changedValue,
  //   });
  // };
  // const reduce=()=>{

  // }
  // const add=()=>{

  // }
  //  return (
  //   <div>
  //     <div onClick={reduce}>-</div>
  //     <div>{value}</div>
  //     <div onClick={add}>+</div>
  //   </div>
  //  )
// }

//新增电表类型
let AddModal = ({addForm}) => {
  return(
    <Form
    layout="vertical"
    form={addForm}
  >
    <Row>
      <Col span={16}>
        <Row>
          <Form.Item label="设备型号" name="DeviceType">
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              // onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Jack',
                },
                {
                  value: 'lucy',
                  label: 'Lucy',
                },
                {
                  value: 'disabled',
                  disabled: true,
                  label: 'Disabled',
                },
                {
                  value: 'Yiminghe',
                  label: 'yiminghe',
                },
              ]}
            />
          </Form.Item>
        </Row>
        <Row>
          <Col>
              <Form.Item label="心跳周期(秒)" name="Cycle">
                  {/* <Count></Count> */}
              </Form.Item>
          </Col>
          <Col>
              <Form.Item label="远程控制" name="Control" >
                  <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
              </Form.Item>
          </Col>
          <Col>
              <Form.Item label="是否计量" name="IsCount" >
                  <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
              </Form.Item>
          </Col>
          <Col>
              <Form.Item label="是否抄读" name="isRead" >
                  <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
              </Form.Item>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
            <Form.Item label="设备图片">
              <img src={electricImg}></img>
            </Form.Item>
      </Col>
    </Row>
  </Form>
  )
  

}