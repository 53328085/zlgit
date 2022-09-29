import React, {useState} from 'react'
import {Form, Input, DatePicker, Space, Button, Switch} from 'antd'
import styled from 'styled-components'
const Formbox = styled(Form)`
 display: grid;
 grid-template-columns: 600px 600px;
 grid-template-rows: repeat(12, 36px);
 gap: 16px 128px;
 grid-auto-flow: column;
 .ant-form-item-label {
    flex-basis: 140px;
    padding-right: 10px;
 }
 .optional {
    grid-row-start: 5;
    grid-row-end: 7;
 }
 .ant-btn-lg {
    width: 96px;
    height: 36px;
    line-height: 36px;
    padding: 0;
    font-size: 14px;
 }
`
export default function Set() {
  const [form] = Form.useForm()
  const {Item} = Form
  const [initialValues] = useState({
    ProjectType: "预付费项目",
  ProjectValidStageTime: '', //项目有效期
  Name: "",
  Address: "",
  //Enabled: 1,
  LineAnalysisEnabled:0,
 // Rate: '', // 平台服务费
  Lng: "",
  Lat: "",
  //SupportPower: 1, // 电
 // SupportWater: 1, // 水
 // SupportGas: 1, // 煤气
 // SettlementDay_Electric: 1,
  //SettlementDay_Water: 1,
 // SettlementDay_Gas:1,
  //SupportPropertyFee: 0, // 物业费
 // ArrearForbidRecharge: 0, // 物业费欠费时停止能源账户充值
  BigScreenUrl: "",
  Remark: "", //备注
  })
  return (
    <Formbox ref={form} initialValues={initialValues} labelAlign="left"> 
       <Item label="项目ID">
          <Input placeholder='系统自增项目ID' disabled /> 
       </Item>
       <Item label="项目名称" required>
          <Input placeholder='请输入项目名称'  /> 
       </Item> 
       <Item label="项目有效期" required name="ProjectValidStageTime">
          <DatePicker  /> 
       </Item>
       <Item label="默认模块">
          <Space size={16}>
              <Button type="primary" >项目概述</Button>
              <Button type="primary" >运行监控</Button>
          </Space>
       </Item>
       <Item label="可选模块" className='optional'>
          <Space size={16} wrap>
            <Button type="primary" >电气安全</Button>
             <Button type="primary" >配电管理</Button>
            <Button>结算收费</Button>
             <Button>能源管理</Button>      
              <Button >光伏发电</Button>
               <Button>碳排管理</Button>
               <Button>数据报表</Button>
                <Button>运维管理</Button>
          </Space>
       </Item>
       <Item label="能源种类">
          <Space size={16} wrap>
            <Button type="primary" >水</Button>
             <Button type="primary" >电</Button>
            <Button>燃气</Button>
             <Button>煤炭</Button>  
          </Space>
       </Item>
       <Item label="数据大屏启用">
          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked style={{width: '64px'}} />
       </Item>
    </Formbox>
  )
}
