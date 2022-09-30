import React, {useState, useEffect} from 'react'
import {Form, Input, DatePicker, Space, Button, Switch, Upload, Cascader,Row, Col } from 'antd'
import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'
import styled from 'styled-components'
import  Mapcom from '@com/useMap'

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
 .remark {
    grid-row: 11 / 13
 }
 .upload {
    grid-column: 2;
    grid-row: 1 / 3
 }
 .address {
    grid-column: 2;
    grid-row: 3/5
 }
 .map {
    grid-column: 2;
    grid-row: 6 / -1;
 }
 .ant-btn-default, .ant-btn-primary {
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
  const {TextArea} = Input
  const params ={
    ProjectType: "预付费项目",
  ProjectValidStageTime: '', //项目有效期
  Name: "",
  Address: "",
  LineAnalysisEnabled:0,
  Lng: '',
  Lat: '',
  
  BigScreenUrl: "",
  Remark: "", //备注
  }
  const [initialValues, setAaddress] = useState(params)
  areas.forEach(area => {
    const matchCity = cities.filter(city => city.code === area.cityCode)[0];
    if (matchCity) {
      matchCity.children = matchCity.children || [];
      matchCity.children.push({
        label: area.name,
        value: area.code
      });
    }
  });
  cities.forEach(city => {
    const matchProvince = provinces.filter(
      province => province.code === city.provinceCode
    )[0];
    if (matchProvince) {
      matchProvince.children = matchProvince.children || [];
      matchProvince.children.push({
        label: city.name,
        value: city.code,
        children: city.children
      });
    }
  });
  const options = provinces.map(p => ({
    label: p.name,
    value: p.code,
    children: p.children
  }))
  useEffect(() => {
    console.log(initialValues)
  },[initialValues])
  return (
    <Formbox ref={form} initialValues={initialValues} labelAlign="left" size="middle"> 
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
       <Item label="数据大屏url">
          <Input placeholder='请输入数据大屏地址' />
       </Item>
       <Item label="数据驾驶舱启用">
          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked style={{width: '64px'}} />
       </Item>
       <Item label="项目备注" name="Remark" className='remark'>
           <TextArea rows={2} placeholder="请输入备注0-99字" maxLength={99} />
       </Item>
       <Item label="项目图片" className='upload'>
           <Input/>
       </Item>
      
       <Item label="项目地址" className='address' >
        <Item noStyle>
            <Cascader
            options={options}
            showSearch
            placeholder="请选择或输入省/市/区"
            style={{marginBottom: '16px'}}
            />
         </Item>
         <Item name="Address">
            <Input placeholder='请输入项目的详细地址'></Input>
         </Item>
       </Item>
       <Item label="经纬度" required>
          <Row gutter={16}>
            <Col span={12}>
            <Item name='Lng'>
                <Input placeholder='经度'></Input>
            </Item>
            </Col>
            <Col span={12}>
            <Item name='Lat'>
              <Input placeholder='纬度'></Input>
            </Item>
            </Col>
          </Row>
       </Item>
       <div className='map'>
          
          <Mapcom setAaddress={setAaddress} initialValues={initialValues}/>
          
          
       </div>
    </Formbox>
  )
}
