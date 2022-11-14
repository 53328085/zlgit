import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Space,
  Button,
  Switch, 
  Cascader,
  message,
  Row,
  Col,
  Checkbox
} from "antd";
import provinces from "china-division/dist/provinces.json";
import cities from "china-division/dist/cities.json";
import areas from "china-division/dist/areas.json";
import styled from "styled-components";
import Mapcom from "@com/useMap";
import Cupload from "@com/useUpload.js"
 const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: 600px 600px;
  grid-template-rows: repeat(12, 36px);
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
  .remark {
    grid-row: 11 / 13;
  }
  .upload {
    grid-column: 2;
    grid-row: 1 / 4;
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
    grid-row: 4 / 6;
  }
  .lat {}
  .upload, .address, .lat {
    .ant-form-item-label {
    flex-basis: 5em;
   
  }
  }
  .map {
    grid-column: 2;
    grid-row: 7 / -1;
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
export default function Set() {
  const [form] = Form.useForm();
  const defaultProject = [
    { label: '项目概述', value: '1' },
    { label: '运行监控', value: '2' },
  ]
  const optionalProject = [
    { label: '电气安全', value: '1' },
    { label: '配电管理', value: '2' },
    { label: '结算收费', value: '3' },
    { label: '能源管理', value: '4' },
    { label: '光伏发电', value: '5' },
    { label: '碳排管理', value: '6' },
    { label: '数据报表', value: '7' },
    { label: '运维管理', value: '8' },
  ]
  const energyType = [
    { label: '电', value: '1' },
    { label: '水', value: '2' },
    { label: '燃气', value: '3' },
    { label: '煤炭', value: '4' },
  ]
  const { Item } = Form;
  const { TextArea } = Input;
  const params = {
    ProjectType: "预付费项目",
    ProjectValidStageTime: "", //项目有效期
    Name: "",
    Address: "",
    LineAnalysisEnabled: 0,
    Lng: "",
    Lat: "",
    
    BigScreenUrl: "",
    Remark: "", //备注
  };
  let logo = null // 项目logo
  let picture = null // 项目图片
  const [initialValues] = useState(params);
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
  const setAaddress = ({Lng='', Lat='', Address='', province='', city='', district=''}={}) => {
    
   form.setFieldsValue({
    Lng,
    Lat,
    Address
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
  return (
    <Formbox
      form={form}      
      initialValues={initialValues}
      labelAlign="left"
      size="middle"
    >
      <Item label="项目ID">
        <Input placeholder="系统自增项目ID" disabled />
      </Item>
      <Item label="项目名称" required>
        <Input placeholder="请输入项目名称" />
      </Item>
      <Item label="项目有效期" required name="ProjectValidStageTime">
        <DatePicker />
      </Item>
      <Item label="默认模块">
          <Ccheckbox options={defaultProject} defaultValue={['1', '2']} onChange={checkChange} disabled />
      </Item>
      <Item label="可选模块" className='optional'> 
         <Ccheckbox options={optionalProject} defaultValue={[]} onChange={checkChange} />
      </Item>
      <Item label="能源种类">
         <Ccheckbox options={energyType} defaultValue={[]} onChange={checkChange} />
      </Item>
      <Item label="数据大屏启用">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Item label="数据大屏url">
        <Input placeholder="请输入数据大屏地址" />
      </Item>
      <Item label="数据驾驶舱启用">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Item label="项目备注" name="Remark" className='remark'>
        <TextArea rows={2} placeholder="请输入备注0-99字" maxLength={99} />
      </Item>
      <div className='upload'>
         <Item label="项目logo" className="left" required>
           <div className="img">
            <Cupload wpx={212} hpx={32} swpx={155} shpx={32} style={{padding: '16px'}} getfile={(file) => logo=file} /> 
           </div>
           <Info>（图片大小为: 212*32 png 格式)</Info>
         </Item>
         <Item label="项目图片" required>
           <div className="img">
            <Cupload wpx={248} hpx={168} swpx={200} shpx={116} getfile={(file) => picture=file} /> 
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
        <Item name="Address">
          <Input placeholder="请输入项目的详细地址" /> 
        </Item>
      </Item>
      <Item label="经纬度" className="lat" required>
        <Row gutter={16}>
          <Col span={12}>
            <Item name="Lng">
              <Input placeholder="经度" /> 
            </Item>
          </Col>
          <Col span={12}>
            <Item name="Lat">
              <Input placeholder="纬度" /> 
            </Item>
          </Col>
        </Row>
      </Item>
      <div className='map'>
        <Mapcom setAaddress={setAaddress} initialValues={initialValues} />
      </div>
    </Formbox>
  );
}
