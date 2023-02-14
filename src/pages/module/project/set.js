import React, { useState, useEffect, useMemo } from "react";

import {
  Form,
  Input,
  DatePicker,
  Button,
  Switch, 
  Cascader,
  Row,
  Col,
  Checkbox
} from "antd";
import provinces from "china-division/dist/provinces.json";
import cities from "china-division/dist/cities.json";
import areas from "china-division/dist/areas.json";
import styled from "styled-components";
import moment from 'moment';
import {ProjectSetting} from '@api/api.js'
import Mapcom from "@com/useMap";
import Cupload from "@com/useUpload.js"
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
  const {QueryProjectInfo} = ProjectSetting
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
 const moduleValue = new Set()
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
const energyValue = new Set()
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
    lng: "",
    lat: "",
    appEnabled: false,
    dataCockpitEnabled: false,
    bigScreenUrl: "",
    remark: "", //备注
    imgLogo: '',
    imgProject: '',
    shiftEnabled: false
  };  
  const [initialValues ] = useState(params);
  const [defaultAdress, setDefaultAddress]=useState([])
  const [addressVal, setAddressVal] = useState(['', '', ''])
  areas.forEach((area) => {
    const matchCity = cities.filter((city) => city.code === area.cityCode)[0];
    if (matchCity) {
      matchCity.children = matchCity.children || [];
      matchCity.children.push({
        label: area.name,
        value: area.code,
      });
    }
  });
  cities.forEach((city) => {
    const matchProvince = provinces.filter(
      (province) => province.code === city.provinceCode
    )[0];
    if (matchProvince) {
      matchProvince.children = matchProvince.children || [];
      matchProvince.children.push({
        label: city.name,
        value: city.code,
        children: city.children,
      });
    }
  });
  const options = provinces.map((p) => ({
    label: p.name,
    value: p.code,
    children: p.children,
  })); 
  const setAaddress = ({lng='', lat='', address='', province='', city='', district=''}={}) => {
    
   form.setFieldsValue({
    lng,
    lat,
    address
   })
   
   const p = options.find(i => i.label == province);
  
   let c, a;
   if (Array.isArray(p?.children)) {
      c = p.children.find(i => i.label == city);
      if (Array.isArray(c?.children)) {
         a = c.children.find(i => i.label == district)?.value
      }
   }
   setAddressVal([p.value, c.value, a]) 
   console.log(defaultAdress)
}
const changeaddress = (value) => {
   setAddressVal(value)
}
const onUpdate = (file) => {
   console.log(file)
   return false
}
const checkChange = (values) => {
  console.log(values)
}
const queryProjectInfo = async () => {
   let {data, success, errMsg} = await QueryProjectInfo(projectId)
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
      if (data[m] > 0) {
        moduleValue.add(m)
      }
   }
   for(let e of energy) {
     if(data[e] > 0) {
      moduleValue.add(e)
     }
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
   console.log('value'+value);
   if (!!value) {
     return Promise.resolve();
   }
   return Promise.reject(new Error('项目Logo必须上传'));
  
}
const onFinish = (values) => {
  console.log(values);
  console.log(params)
}
useEffect(() => {
  queryProjectInfo();
}, [projectId])
  return (
    <Formbox
      form={form}      
      initialValues={initialValues}
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
          <Ccheckbox options={defaultProject} defaultValue={['1', '2']} onChange={checkChange} disabled />
      </Item>
      <Item label="可选模块" className='optional' valuePropName="checked" initialValue={selectModule}> 
         <Ccheckbox options={optionalProject} defaultValue={[]} onChange={checkChange} />
      </Item>
      <Item label="能源种类" className="type" valuePropName="checked" initialValue={selectEnergy}>
         <Ccheckbox options={energyType} defaultValue={[]} onChange={checkChange} />
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
            <Item noStyle name="imgLogo">
              <Cupload wpx={212} hpx={32} swpx={220} shpx={114} style={{padding: '16px'}}   /> 
            </Item>
           </div>
           <Info>（图片大小为: 212*32 png 格式)</Info>
         </Item>
         <Item label="项目图片" required>
           <div className="img">
            <Item noStyle name="imgProject" rules={[
              {
                validator: checkLog,
              },
            ]}>
            <Cupload wpx={248} hpx={168} swpx={220} shpx={114}  /> 
            </Item>
           </div>
           <Info>（图片大小为: 248*168像素 png 格式)</Info>
         </Item>
      </div>
      <Item label="项目地址" className='address'>
        <Item noStyle>
          <Cascader
            options={options}
            defaultValue={defaultAdress}
            value={addressVal}
            onChange={changeaddress}
            showSearch
            placeholder="请选择或输入省/市/区"
            style={{
              marginBottom: "16px",
            }}
          />
        </Item>
        <Item name="address">
          <Input placeholder="请输入项目的详细地址" /> 
        </Item>
      </Item>
      <Item label="经纬度" className="lat" required>
        <Row gutter={16}>
          <Col span={12}>
            <Item name="lng">
              <Input placeholder="经度" /> 
            </Item>
          </Col>
          <Col span={12}>
            <Item name="lat">
              <Input placeholder="纬度" /> 
            </Item>
          </Col>
        </Row>
      </Item>
      <div className='map'>
        <Mapcom setAaddress={setAaddress} initialValues={params} />
      </div>
      <div className="save">
         <Button type="primary" htmlType="submit">保存</Button>
      </div>
    </Formbox>
  );
}
