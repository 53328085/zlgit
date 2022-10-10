import React, {useState} from 'react'
import styled from 'styled-components'
import {Typography,Select, Row, Col, Button} from 'antd'
import {useRequest} from 'ahooks'
import {Project} from '@api/api.js'
const {Title} = Typography
const {getOperationManagerUsers} = Project
export default function Account() {
  const Mainbox = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  row-gap: 16px;
  >div {
    display: grid;
    grid-auto-rows: 32px;
    row-gap: 16px;
  }
`
const [operate, setOperate] = useState([])
 useRequest(getOperationManagerUsers, {
  onSuccess: (res) => {
    console.log(res)
    const {success, data} = res
    if (success) setOperate(data)
    console.log(operate)
  }
 })
 const changeOper = (value, options) => {
   
 //  setOperate(arr => )
 }
  return (
    <Mainbox>
       <div>
         <Title level={5}>运营管理员（支持添加多位运营管理员）</Title>
          <Row gutter={16}>
              <Col span={4}>
                 <Select 
                 onChange={changeOper}
                 fieldNames={{label: 'loginName', value: 'id', }}
                 options={operate} style={{width: '100%'}} placeholder="请选择运营管理员"></Select>
              </Col>
              <Col span={2}><Button>添加</Button></Col>
          </Row>
          <Row gutter="16px">
              <Col span={2}>用户名</Col> <Col span={2}>姓名</Col> <Col span={2}>手机号</Col>
          </Row>
       </div>
       <div>
         <Title level={5}>项目管理员（仅支持添加一位项目管理员）</Title>
       </div>
       <div>
         <Title level={5}>运维人员（支持添加多位运维人员）</Title>
       </div>
    </Mainbox>
  )
}
