import React, { useState, useEffect, useMemo, useRef } from "react";

import {
  Form,
  Input,
  DatePicker,
  Button,
  Switch, 
  Divider,
  Checkbox,
  message
} from "antd";
import styled from "styled-components";
import moment from 'moment';

import {ProjectSetting} from '@api/api.js'
import Mapcom from "@com/useMap";
import Cupload from "@com/useUpload.js" 
import Titlelayout from '@com/titlelayout'
import {useSelector} from "react-redux";
import {manager, maintenance} from '@redux/user' //   布尔值  是否是 项目管理员， 运营人员；
import {publishState} from '@redux/systemconfig' // 布尔值 发布状态 
 
import {CustButton} from "@com/useButton"

 const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: 578px 720px;
  column-gap: 128px ;
  //grid-template-rows: repeat(16, 32px);
  //gap: 16px 128px;
 // grid-auto-flow: column;
  justify-content: space-between;
  align-items: start;
  padding: 32px 0px;
    margin-top: 16px;
    border-top: 1px dotted #d7d7d7;

    .divider {
      margin: 0px;
      border-color: #d7d7d7;
    }
    .ant-form-item-explain-error {
      line-height: 1;
    }
  .ant-form-item {
    margin-bottom: 0px;
  }
  .ant-form-item-label {
    flex-basis: 146px;
    padding-right: 10px;
  }

  .leftlayout{
   //grid-template-rows: repeat(16, 32px);
    grid-auto-rows: auto;
   row-gap: 16px;
   display: grid;
   .row {
    display:  grid;
    grid-template-rows: repeat(3, 32px);
    row-gap: 16px;
   }
 
}
 .rightlayout {
   grid-template-rows: 164px 1px repeat(2, 32px) 370px 1px 32px;
   row-gap: 16px;
   display: grid;
  .ant-form-item-label {
    flex-basis: 96px;
   
  }
  .upload {
  
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 32px;
   .ant-form-item-control-input-content {
    height: 164px;
    display: grid;
    grid-template-rows: 116px 22px;
    row-gap: 16px;
   }
   
    .img {
          border: 1px dotted #dedede;
          display: flex;
          height: 116px;
          width: 200px;
        }
    
    }
 
  
   
  }
  .map { 
    display: flex;
    height: 370px;
    padding-left: 96px;
  }
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
const Dcheckbox = styled.div`
 && {
  display: grid;
  grid-template-columns: repeat(4, 96px);
  grid-auto-rows: auto;
  gap: 16px;
  .ant-checkbox-wrapper {
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
  .ant-checkbox.ant-checkbox-disabled+span {
    color:#999;
  }

  .ant-checkbox.ant-checkbox-checked.ant-checkbox-disabled+span{
    color:#fff;
  }
  .ant-checkbox-wrapper.ant-checkbox-wrapper-checked {
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

  const ismanager = useSelector(manager)
  const ismaintenance = useSelector(maintenance)
  const ispublish = useSelector(publishState)

  

  const {QueryProjectInfo, SaveProjectInfo} = ProjectSetting
  const [form] = Form.useForm();
  const map = useRef();
  const [isbigurl, setIsbig] = useState(false)
  const [addressDtl, setAddressDtl] = useState(null)
  const module = new Set([ // 布尔值转换成0, 1
     'safeEnabled',
    'distributionEnabled',
    'prepayEnabled',
     'energyEnabled',
    'solarEnabled',
    'storageEnabled',
    'carbonEnabled',  
    'maintenanceEnabled',
    'energyEnabled',
    'appEnabled',
    'dataCockpitEnabled',
   'shiftEnabled',
   'electricEnabled',
   'waterColdEnabled',
   'waterHotEnabled',
   'steamEnabled',
   'gasEnabled',
   'coalEnabled',
   'oilEnabled',
  ])
 
 
  const optionalProject = [
    { label: '电气安全', value: 'safeEnabled' },
    { label: '配电管理', value: 'distributionEnabled' },
    { label: '结算收费', value: 'prepayEnabled' },
    { label: '能源管理', value: 'energyEnabled' },
    { label: '光伏发电', value: 'solarEnabled' },
    { label: '储能管理', value: 'storageEnabled' },
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

 const [lngLat, setLngLat] = useState()

  const params = {   
    id: '',
    validStageTime: "", //项目有效期
    name: "",
    address: "",
    lngLat: '', // 经纬度 
   // bigScreenUrl: "",
    remark: "", //备注
    imgLogo: '',
    imgProject: '',
  };  

 

   
const onSwitch = (f) => {
  /* if(!f) {
    form.setFieldValue('bigScreenUrl', '')
  } */
  setIsbig(f)
}
let initial = {} // 获取的接口项目信息
const queryProjectInfo = async () => {
   try {
    let {data, success, errMsg} = await QueryProjectInfo(projectId)
    if(!success) return ;  
     initial = data;
    for(let key of Object.keys(params)) {
      if (key == 'validStageTime' && data[key]) {
         params[key] = moment(data[key]);
      } else {
         params[key] = data[key];
      }
    }

    setLngLat(data['lngLat'])
    const bool = {}
    for(let b of module) {
      bool[b] = Boolean(data[b])
    }
    form.setFieldsValue({...params, ...bool})
   } catch (error) {
    
   }
  
}
const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

const onInput = (e) =>   map.current?.serachMap(e.target.value)
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
const setAaddress = (value) => {
  if (ispublish) return;
  try {   
  let {lng, lat, address} = value
  
   lng && lat && form.setFieldValue('lngLat', `${lng},${lat}`)
  
  address && form.setFieldValue('address', address);
 //province && setAddressDtl([province, city, district])
} catch (error) {
    console.log(error)
}
}
const onFinish = async (values) => {
  try {
    for(let b of module) {
      values[b] = Number(values[b])
    }
    values['validStageTime'] = values['validStageTime'].format('YYYY-MM-DD HH:mm:ss')
   let params = {...initial, ...values};
   let {success, errMsg} = await SaveProjectInfo(params)
   success && message.success({
    content: '保存成功',
    onClose: queryProjectInfo,
   }) 
   !success && message.error(errMsg || '数据错误')
  } catch (error) {
    
  }
    
}
const onSave = () => {
  form.submit()
}
useEffect(() => {
  queryProjectInfo(); 
}, [projectId])

  return (
    <Titlelayout title={<div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}><span>基础设置</span>  <CustButton onClick={onSave}>保存</CustButton></div>}>
    <Formbox
      form={form}   
      labelAlign="left"
      size="middle"
      scrollToFirstError={true}
      disabled={ispublish}
      onFinish={onFinish}
      validateMessages={
       { required: "缺少'${label}' 数据"}
      }
    >
      <div className="leftlayout">
        <div className="row">
      <Item label="项目ID" name="id">
        <Input placeholder="系统自增项目ID" disabled />
      </Item>
      <Item label="项目名称"  name="name" rules={[{
        required: true
      }]}>
        <Input placeholder="请输入项目名称" />
      </Item>
      <Item label="项目有效期" required name="validStageTime" {...config}>
        <DatePicker   format="YYYY-MM-DD" disabledDate={disabledDate} />
      </Item>
      </div>
      <Divider dashed  className="divider" />
      <Item label="默认模块">
          <Dcheckbox>
            <Checkbox checked disabled>项目概述</Checkbox>
            <Checkbox checked disabled>运行监控</Checkbox>
          </Dcheckbox>
         {/*  <Ccheckbox options={defaultProject} defaultValue={['1', '2']}  disabled /> */}
      </Item>
      <Item label="可选模块" > {/* className='optional' */}
           <Dcheckbox>
             {optionalProject.map(o => <Item noStyle name ={o.value} valuePropName='checked' key={o.value}><Checkbox>{o.label}</Checkbox></Item>)}
          </Dcheckbox>
     
      </Item>
      <Divider dashed  className="divider" />
      <Item label="能源种类"  > {/* className="type" */}
          <Dcheckbox>
             {energyType.map(o => <Item noStyle name ={o.value} valuePropName='checked' key={o.value}><Checkbox>{o.label}</Checkbox></Item>)}
          </Dcheckbox>
      </Item>
      <Divider dashed  className="divider" />
     {/*  <Item label="数据大屏启用">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={onSwitch}
          style={{
            width: "64px",
          }}
        />
      </Item> */}
    {/*   <Item label="数据大屏url" name="bigScreenUrl"  >
        <Input placeholder="请输入数据大屏地址" disabled={!isbigurl}/>
      </Item> */}
      <Item label="数据驾驶舱启用" valuePropName="checked" name="dataCockpitEnabled" >
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Divider dashed  className="divider" />
      <Item label="App 功能启用" valuePropName="checked" name="appEnabled">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Divider dashed  className="divider" />
      <Item label="班次管理启用" valuePropName="checked" name="shiftEnabled">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          style={{
            width: "64px",
          }}
        />
      </Item>
      </div>
      <div className="rightlayout">
      <div className='upload'> 
         <Item label="项目logo" className="left" required>
           <div className="img">
            <Item noStyle name="imgLogo" rules={[
              {
                validator: checkLog,
              },
            ]}>
              <Cupload wpx={212} hpx={32} swpx={200} shpx={116} style={{padding: '16px'}} isDel={ispublish}  /> 
            </Item>
           </div>
           <Info>（图片大小为: 212*32 png 格式)</Info>
         </Item>
         <Item label="项目图片" required> {/* 图片改变时传值，不改变时传空 */}
           <div className="img">
            <Item noStyle name="imgProject" rules={[
              {
                validator: checkProject,
              },
            ]}>
            <Cupload wpx={248} hpx={168} swpx={200} shpx={114} isDel={ispublish} /> 
            </Item>
           </div>
           <Info>（图片大小为: 248*168像素 png 格式)</Info>
         </Item>
      </div>
      <Divider dashed  className="divider" style={{width: '624px',minWidth: '624px', marginLeft: '96px'}} />    
      <Item label="项目地址" name="address"  rules={[  
              {
                required: true,
                message: '请输入详细地址',
              },
            ]}
            tooltip="请在地图上点击获取"
            > 
          <Input placeholder="请输入详细地址"   onChange={onInput}  />         
      </Item>
      <Item label="经纬度"  name="lngLat" rules={[  
              {
                required: true,
                message: '请从地图上获取经纬度',
              },
            ]}> 
              <Input placeholder="经纬度" /> 
      </Item>
      <div className='map'> 
         <Mapcom setAaddress={setAaddress} lngLat={lngLat} ref={map} />         
      </div>
      <Divider dashed  className="divider" style={{width: '624px', minWidth: '624px', marginLeft: '96px'}} />
      <Item label="项目备注"   name="remark"> 
        <TextArea placeholder="项目详细地址" maxLength={99} style={{height: '32px'}} />
      </Item> 
      {/* <div className="save">
         <Button type="primary" htmlType="submit">保存</Button>
      </div> */}
      </div>
    </Formbox>
    </Titlelayout>
  );
}
