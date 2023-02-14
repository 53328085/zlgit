import React, { useState, useEffect, useMemo,memo } from "react";

import {
  Form,
  Input,
  DatePicker,
  Button,
  Switch, 
  Cascader,
  Row,
  Col,
  Checkbox,
  message
} from "antd";
import styled from "styled-components";
import moment from 'moment';
import {ProjectSetting} from '@api/api.js'
import Mapcom from "@com/useMap";
import Cupload from "@com/useUpload.js"
import Adrress from "@com/useAddress.js"
 const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: 600px 600px;
  grid-template-rows: repeat(16, 32px);
  gap: 16px 128px;
  grid-auto-flow: column;
  .ant-form-item {
    margin-bottom: 0px;
  }
  .ant-form-item-label {
    flex-basis: 8em;
    padding-right: 10px;
  }
  .optional {
    grid-row-start: 5;
    grid-row-end: 7;
  }
  .type {
    grid-row: 7 / 9;
  }
  .remark {
    grid-column: 2;
    grid-row: -2 / -4;
    textarea.ant-input {
      height: 80px;
    }
  }
  .upload {
    grid-column: 2;
    grid-row: 1 / 5;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    .ant-form-item-row {
       height: 140px;
      }
    .ant-form-item-control-input-content {
        display: grid;
        grid-template-rows: 116px 1fr;
        row-gap: 8px;
        width: 200px;
        height: 140px;
        .img {
          border: 1px dotted #dedede;
          display: flex;
        }
      }
    
    }
 
  .address {
    grid-column: 2;
    grid-row: 5 / 7;
  }
  .lat {
    grid-column: 2;
    grid-row: 7;
  }
  .upload, .address, .lat {
    .ant-form-item-label {
    flex-basis: 5em;
   
  }
  }
  .map {
    grid-column: 2;
    grid-row: 8 / -4;
  }
  .save {
    grid-column: 2;
    grid-row: -2;
    display: flex;
    justify-content: flex-end;
    
  }
  .ant-btn-default,
  .ant-btn-primary {
    width: 96px;
    height: 36px;
    line-height: 36px;
    padding: 0;
    font-size: 14px;
  }
`; 
const Info = styled.span`
  font-size: 12px;
  color: rgba(0,0,0,0.85);
`
const Ccheckbox = styled(Checkbox.Group)`

 && {
  display: grid;
  grid-template-columns: repeat(4, 96px);
  grid-auto-rows: auto;
  gap: 16px;
  .ant-checkbox-group-item {
    margin: 0px;
    color: #999;
    font-size: 14px;
    width: 96px;
    height: 32px;
    line-height: 32px;
    background-color: transparent;
    border: 1px solid #999;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
  }
  .ant-checkbox-disabled+span {
    color: #fff;
  }
  .ant-checkbox-wrapper-checked.ant-checkbox-group-item {
    color:#fff;
    background-color: #237ae4;
    border-color: #237ae4;
  }
   .ant-checkbox {
    opacity: 0;
   }
   .ant-checkbox+span {
    padding: 0 16px 0 0;
   }
 }
`
export default function ProjectSet({projectId}) {
  const {QueryProjectInfo, SaveProjectInfo} = ProjectSetting
  const [form] = Form.useForm();
  const defaultProject = [
    { label: '项目概述', value: '1' },
    { label: '运行监控', value: '2' },
  ]
  const module = [ // 可选模块
     'safeEnabled',
    'distributionEnabled',
    'prepayEnabled',
     'energyEnabled',
    'solarEnabled',
    'storageEnabled',
    'carbonEnabled',  
    'maintenanceEnabled',
  ]
 let moduleValue = []
  const  energy = [ // 能源种类
   'safeEnabled',
   'distributionEnabled',
   'prepayEnabled',
   'energyEnabled',
  'solarEnabled',
  'storageEnabled',
  'carbonEnabled',  
  'maintenanceEnabled',
  ]
let energyValue = []
const selectModule = useMemo(() => [...moduleValue], [moduleValue])
const selectEnergy = useMemo(() => [...energyValue], [energyValue])
  const optionalProject = [
    { label: '电气安全', value: 'safeEnabled' },
    { label: '配电管理', value: 'distributionEnabled' },
    { label: '结算收费', value: 'prepayEnabled' },
    { label: '能源管理', value: 'energyEnabled' },
    { label: '光伏发电', value: 'solarEnabled' },
    { label: '存储管理', value: 'storageEnabled' },
    { label: '碳排管理', value: 'carbonEnabled' },  
    { label: '运维管理', value: 'maintenanceEnabled' },
  ]
  const energyType = [
    { label: '电', value: 'electricEnabled' },
    { label: '冷水', value: 'waterColdEnabled' },
    { label: '热水', value: 'waterHotEnabled' },
    { label: '蒸汽', value: 'steamEnabled' },
    { label: '燃气', value: 'gasEnabled' },
    { label: '煤炭', value: 'coalEnabled' },
    { label: '燃油', value: 'oilEnabled' },
  ]
  const { Item } = Form;
  const { TextArea } = Input;

/* 
address: "滨江",
appEnabled: 0, //app是否启用
bigScreenUrl: ""， // 数据大屏
carbonEnabled: 0, 碳排管理
coalEnabled: 0, // 煤炭
createTime: "2023-02-06 19:24:34"
dataCockpitEnabled: 0, //数字驾驶创
distributionEnabled: 0, // 配电监控
electricEnabled: 0, // 电
energyEnabled: 0, //能源管理
gasEnabled:0, 燃气
id: 2，
imgLogo: ""， // 项目LOGO
imgProject: "", // 项目图片
lat: 0
lng: 0
maintenanceEnabled: 0, // 运维管理
name: "测试项目2"
oilEnabled: 0, // 燃油
prepayEnabled: 0, //结算收费
remark: "测试2"
safeEnabled: 0, // 电气安全
solarEnabled: 0, // 光伏发电
state: 0
steamEnabled: 0, // 蒸汽
storageEnabled: 0, // 储能管理
updateTime: "2023-02-06 19:24:34"
validStageTime: "2023-02-02 00:00:00"  // 有限期
waterColdEnabled: 0, // 冷水
waterHotEnabled: 0, // 热水

ShiftEnabled: 0, // 班次管理
 */



  const params = {   
    id: '',
    validStageTime: "", //项目有效期
    name: "",
    address: "",
    lngLat: '', // 经纬度
    appEnabled: false,
    dataCockpitEnabled: false,
    bigScreenUrl: "",
    remark: "", //备注
    imgLogo: '',
    imgProject: '',
    shiftEnabled: false
  };  

const GetAddress = useMemo(() => Adrress, [])
const checkChange = (values, type) => {
    if(type == 1) moduleValue = values 
    if(type == 2) energyValue =values
   }
   
 
const queryProjectInfo = async () => {
   try {
    let {data, success, errMsg} = await QueryProjectInfo(projectId)
    if(!success) return ;
    moduleValue = []
    energyValue = []
    for(let key of Object.keys(params)) {
      if (key == 'validStageTime' && data[key]) {
         params[key] = moment(data[key]);
      } else {
         params[key] = data[key];
      }
    }
    form.setFieldsValue(params)
   // setInitialValues(p => Object.assign({}, p, params))
    for(let m of module) {
       if (!isNaN(data[m]) && data[m] > 0) {
         moduleValue.push(m)
       }
    }
    for(let e of energy) {
      if(!isNaN(data[e]) && data[e] > 0) {
       energyValue.push(e)
      }
    }
    
   } catch (error) {
    
   }
  
}
const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: '请选择项目有效期',
    },
  ],
};
const checkLog = (_, value) => {   
   if (!!value) {
     return Promise.resolve();
   }
   return Promise.reject(new Error('项目Log必须上传'));
  
}
const checkProject = (_, value) => { 
  if (!!value) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('项目图片必须上传'));
 
}
const onFinish = (values) => {
   console.log(moduleValue);
   console.log(energyValue);
}
useEffect(() => {
  queryProjectInfo();
}, [projectId])

  return (
    <Formbox
      form={form}   
      labelAlign="left"
      size="middle"
      onFinish={onFinish}
    >
      <Item label="项目ID" name="id">
        <Input placeholder="系统自增项目ID" disabled />
      </Item>
      <Item label="项目名称" required name="name">
        <Input placeholder="请输入项目名称" />
      </Item>
      <Item label="项目有效期" required name="validStageTime" {...config}>
        <DatePicker />
      </Item>
      <Item label="默认模块">
          <Ccheckbox options={defaultProject} defaultValue={['1', '2']}  disabled />
      </Item>
      <Item label="可选模块" className='optional' valuePropName="checked" initialValue={selectModule}> 
         <Ccheckbox options={optionalProject} defaultValue={[]} onChange={(value) => checkChange(value, 1)} />
      </Item>
      <Item label="能源种类" className="type" valuePropName="checked" initialValue={selectEnergy}>
         <Ccheckbox options={energyType} defaultValue={[]} onChange={(value) => checkChange(value, 2)} />
      </Item>
      <Item label="数据大屏启用">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked={!!params.bigScreenUrl}
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Item label="数据大屏url" name="bigScreenUrl">
        <Input placeholder="请输入数据大屏地址" />
      </Item>
      <Item label="数据驾驶舱启用" valuePropName="checked" name="dataCockpitEnabled">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Item label="App 功能启用" valuePropName="checked" name="appEnabled">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Item label="班次管理启用" valuePropName="checked" name="shiftEnabled">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Item label="项目备注"  className='remark'>
         <Item noStyle name="remark">
        <TextArea rows={2} placeholder="请输入备注0-99字" maxLength={99} />
        </Item>
      </Item> 
      <div className='upload'>
         <Item label="项目logo" className="left" required>
           <div className="img">
            <Item noStyle name="imgLogo" rules={[
              {
                validator: checkLog,
              },
            ]}>
              <Cupload wpx={212} hpx={32} swpx={220} shpx={114} style={{padding: '16px'}}   /> 
            </Item>
           </div>
           <Info>（图片大小为: 212*32 png 格式)</Info>
         </Item>
         <Item label="项目图片" required>
           <div className="img">
            <Item noStyle name="imgProject" rules={[
              {
                validator: checkProject,
              },
            ]}>
            <Cupload wpx={248} hpx={168} swpx={220} shpx={114}  /> 
            </Item>
           </div>
           <Info>（图片大小为: 248*168像素 png 格式)</Info>
         </Item>
      </div>
      <Item label="项目地址" className='address' required>
        <Item noStyle name={['address', 'province']}
           rules={[
            {
              required: true,
              message: '请选择省市区',
            },
          ]}
        >
           <GetAddress  />
        </Item>
        <Item name={['address', 'street']}  rules={[
              {
                required: true,
                message: '请输入详细地址',
              },
            ]}>
          <Input placeholder="请输入项目的详细地址" /> 
        </Item>
      </Item>
      <Item label="经纬度" className="lat" name="lngLat" required>
       
              <Input placeholder="经纬度" /> 
          
        {/* <Row gutter={16}>
          <Col span={12}>
            <Item name="lng" required>
              <Input placeholder="经度" /> 
            </Item>
          </Col>
          <Col span={12}>
            <Item name="lat">
              <Input placeholder="纬度" /> 
            </Item>
          </Col>
        </Row> */}
      </Item>
      <div className='map'>
        <Mapcom setAaddress={() => {}} initialValues={params} />
      </div>
      <div className="save">
         <Button type="primary" htmlType="submit">保存</Button>
      </div>
    </Formbox>
  );
}
