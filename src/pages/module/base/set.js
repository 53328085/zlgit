import React, { useState, useEffect, useMemo, useRef } from "react";

import {
  Form,
  Input,
  DatePicker,
  Select,
  Switch, 
  Divider,
  Checkbox,
  message
} from "antd";
import styled from "styled-components";
import moment from 'moment';

import {ProjectSetting} from '@api/api.js'

import Mapcom from "@com/useMap/indexset";
//import useMap from "@com/useMap/useInitMap"
//import useMap from "@com/useMap/indexset"
import Cupload from "@com/useUpload.js" 
import Titlelayout from '@com/titlelayout'
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from 'react-i18next'
import {manager, maintenance} from '@redux/user' //   布尔值  是否是 项目管理员， 运营人员；
import {publishState, getCurrProjectInfo, currProject, iszhCN} from '@redux/systemconfig' // 布尔值 发布状态 
 
import {SaveButton} from "@com/useButton"

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
    
   // }
 
  
   
  }
  .map { 
    display: flex;
    height: 370px;
    width: 624px;
    margin-left: 96px;
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
  grid-template-columns: repeat(${props => props.colum}, ${props => props.wh || "96px"});
  grid-auto-rows: auto;
  gap: 16px;
  .ant-checkbox-wrapper {
    margin: 0px;
    color: #999;
    font-size: 14px;
    width: ${props => props.wh || " 96px"};
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
    background-color: ${props => props.theme.primaryColor};
    border-color:${props => props.theme.primaryColor};
  }
   .ant-checkbox {
    opacity: 0;
   }
   .ant-checkbox+span {
    padding: 0 16px 0 0;
   }
 }
`
Dcheckbox.defaultProps = {
  colum: 4
}

const getVal = (key) => {
  switch(key) {
    case  'safeEnabled':
     return 2;
    case  'distributionEnabled':
      return 3;
    case  'prepayEnabled':
        return 4;  
    case  'energyEnabled':
          return 5; 
     case  'solarEnabled':
       return 6;  
       case  'storageEnabled':
        return 7;   
        case  'carbonEnabled':
          return 8; 
          case  'maintenanceEnabled':
          return 9;       
  }
}

export default function ProjectSet({projectId}) {
  const dispatch = useDispatch(); 
  const ispublish = useSelector(publishState)
  const iszh = useSelector(iszhCN)

  console.log(iszh)
  const {t} = useTranslation("comm","common")

  const CurrProject = useSelector(currProject)

  const {QueryProjectInfo, SaveProjectInfo} = ProjectSetting
  const [form] = Form.useForm();
  const map = useRef();
 
  let defaultpage = [{label: t("common:ProjectOverview"), value: 0}, {label: t("common:OperationMonitoring"), value: 1}]
  const [homepage, setHomePage] =useState(defaultpage)

  console.log(homepage);
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
 
  let bkmenus = [
    { label: t("common:ElectricalSafety"), key: 'safeEnabled', value: 0 },
    { label: t("common:DistributionManagemet"), key: 'distributionEnabled', value: 0 },
    { label: t("common:SettlementFee"), key: 'prepayEnabled', value: 0 },
    { label: t("common:EnergyManagement"), key: 'energyEnabled', value: 0 },
    { label: t("common:PhotovoltaicEnergy"), key: 'solarEnabled', value: 0 },
    { label:  t("common:StorageManagement"), key: 'storageEnabled', value: 0 },
    { label: t("common:CarbonEmissionManagement"), key: 'carbonEnabled', value: 0 },  
    { label: t("common:OperationMaintenanceManagement"), key: 'maintenanceEnabled', value: 0 },
  ]


  const optionalProject = [
    { label: t("common:ElectricalSafety"), value: 'safeEnabled' },
    { label: t("common:DistributionManagemet"), value: 'distributionEnabled' },
    { label: t("common:SettlementFee"), value: 'prepayEnabled' },
    { label: t("common:EnergyManagement"), value: 'energyEnabled' },
    { label: t("common:PhotovoltaicEnergy"), value: 'solarEnabled' },
    { label:  t("common:StorageManagement"), value: 'storageEnabled' },
    { label: t("common:CarbonEmissionManagement"), value: 'carbonEnabled' },  
    { label: t("common:OperationMaintenanceManagement"), value: 'maintenanceEnabled' },
  ]
  const energyType = [
    { label: t("common:Electricity"), value: 'electricEnabled' },
    { label: t("common:Coldwater"), value: 'waterColdEnabled' },
    { label: t("common:Hotwater"), value: 'waterHotEnabled' },
    { label: t("common:Steam"), value: 'steamEnabled' },
    { label: t("common:Gas"), value: 'gasEnabled' },
    { label: t("common:Coal"), value: 'coalEnabled' },
    { label: t("common:Fuel"), value: 'oilEnabled' },   
  ]

  const chChnage =(value) => {
    let {target: {checked, id}} = value
    console.log(checked)
    console.log(homepage)
    if(checked) {
      let item = bkmenus.find(item => item.key == id);
      setHomePage([...homepage, item])
    }else {
      let items = homepage.filter(item => item.key!=id);
      setHomePage([...items])
    }
   
  }



  const { Item } = Form;
  const { TextArea } = Input;

 
 const [address, setAddress] = useState()
 
  const params = {   
    id: '',
    validStageTime: "", //项目有效期
    name: "",
    address: "",
    lngLat: '', // 经纬度 
   // bigScreenUrl: "",
    remark: "", //备注
   // imgLogo: '',
    logoImage: '',

    //imgProject: '',
    projectImage: '',
    homeMenu: 0,
  };  
 
let initial = {} // 获取的接口项目信息
const queryProjectInfo = async () => {
   try {
    let {data, success, errMsg} = await QueryProjectInfo(projectId)
    if(!success)  return dispatch(getCurrProjectInfo({})) ;  
      dispatch(getCurrProjectInfo({...CurrProject, ...data} || {}))
     initial = data;
     let homemenus = []
     bkmenus.forEach(item => {
        if (data[item.key] ==1) {


          item.value =getVal(item.key);
          homemenus.push(item)
        }
     })
    setHomePage([...defaultpage, ...homemenus])  
 
    for(let key of Object.keys(params)) {
      if (key == 'validStageTime' && data[key]) {
         params[key] = moment(data[key]);
      } else {
         params[key] = data[key];
      }
    }
    setAddress(data.address)
   
 
    const bool = {}
    for(let b of module) {
      bool[b] = Boolean(data[b])
    }
    form.setFieldsValue({...params, ...bool})
   } catch (error) {
    dispatch(getCurrProjectInfo({}))
   }
  
}
const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}


const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: t("comm:sevalidityperiod"),
    },
  ],
};
const checkLog = (_, value) => {   
   if (!!value) {
     return Promise.resolve();
   }
   return Promise.reject(new Error(t("common:Logouploadmust")));
  
}
const checkProject = (_, value) => { 
  if (!!value) {
    return Promise.resolve();
  }
  return Promise.reject(new Error(t("common:Pictureuploadmust")));
 
}
const setAaddress = (value) => {
 
  if (ispublish) return;
  try {    
  let {lng, lat, address} = value
  
   lng && lat && form.setFieldValue('lngLat', `${lng},${lat}`)
  
  address && form.setFieldValue('address', address);
  
} catch (error) {
    console.log(error)
}
}

// const serachMap =  useMap({id: "map", lngLat, setAaddress})

// console.log(serachMap)
 

const onInput = (e) =>  {
   const value = e.target.value?.trim()
   if(value) {
    // valueref.current = value
     map.current?.serachMap(value)
   }
}
 
 




 
const onFinish = async (values) => {
  try {
    for(let b of module) {
      values[b] = Number(values[b])
    }
    values['validStageTime'] = values['validStageTime'].format('YYYY-MM-DD HH:mm:ss')
   let params = {...initial, ...values};
   console.log(params)
   let {success, errMsg} = await SaveProjectInfo(params)
   
   if(success) {
    queryProjectInfo()
    message.success(t("comm:savesuccessfully"))
   }else {
    message.error(errMsg || t("comm:dataerr"))
   }
 
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
    <Titlelayout title={<div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}><span>{t("common:Infrastructure")}</span>  <SaveButton onClick={onSave} isicon={false} /></div>}>
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
      <Item label={t("comm:ProjectID")} name="id">
        <Input placeholder={t("comm:systemID")} disabled />
      </Item>
      <Item label={t("comm:ProjectName")}  name="name" rules={[{
        required: true
      }]}>
        <Input placeholder={t("comm:enterprojectname")} />
      </Item>
      <Item label={t("comm:Projectvalidityperiod")} required name="validStageTime" {...config}>
        <DatePicker   format="YYYY-MM-DD" disabledDate={disabledDate} />
      </Item>
      </div>
      <Divider dashed  className="divider" />
      <Item label={t("common:DefaultModule")}>
          <Dcheckbox colum={iszh ? 4 : 2} wh="auto">
            <Checkbox checked disabled>{t("common:ProjectOverview")}</Checkbox>
            <Checkbox checked disabled>{t("common:OperationMonitoring")}</Checkbox>
          </Dcheckbox>
      </Item>
      <Item label={t("common:OptionalModules")}> {/* className='optional' */}
           <Dcheckbox colum={iszh ? 4 : 2} wh="auto" >
             {optionalProject.map(o => <Item noStyle name ={o.value} valuePropName='checked' key={o.value}><Checkbox onChange={chChnage}>{o.label}</Checkbox></Item>)}
          </Dcheckbox>
     
      </Item>
      <Item label={t("common:homepage")}  name="homeMenu">
                <Select options={homepage}>
                </Select>
      </Item>
      <Divider dashed  className="divider" />
      <Item label={t("common:EnergyType")}  > {/* className="type" */}
          <Dcheckbox>
             {energyType.map(o => <Item noStyle name ={o.value} valuePropName='checked' key={o.value}><Checkbox>{o.label}</Checkbox></Item>)}
          </Dcheckbox>
      </Item>
      <Divider dashed  className="divider" />    
      <Item label={t("common:Enable_DigitalCockpit")} valuePropName="checked" name="dataCockpitEnabled" >
        <Switch
          checkedChildren={t("comm:Yes")}
          unCheckedChildren={t("comm:No")}
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Divider dashed  className="divider" />
      <Item label={t("common:Enable_AppFunction")} valuePropName="checked" name="appEnabled">
        <Switch
          checkedChildren={t("comm:Yes")}
          unCheckedChildren={t("comm:No")}
          style={{
            width: "64px",
          }}
        />
      </Item>
      <Divider dashed  className="divider" />
      <Item label={t("common:Enable_ShiftManagement")} valuePropName="checked" name="shiftEnabled">
        <Switch
          checkedChildren={t("comm:Yes")}
          unCheckedChildren={t("comm:No")}
          style={{
            width: "64px",
          }}
        />
      </Item>
      </div>
      <div className="rightlayout">
      <div className='upload'> 
         <Item label={t("comm:Projectlogo")} className="left" required>
           <div className="img">
            <Item noStyle name="logoImage" rules={[
              {
                validator: checkLog,
              },
            ]}>
              <Cupload wpx={208} hpx={64} swpx={200} shpx={116} style={{padding: '16px'}} isDel={ispublish}  /> 
            </Item>
           </div>
           <Info>{t("comm:sizeofpicture", {size: "208*64"})}</Info>
         </Item>
         <Item label={t("comm:Projectpicture")}  required> {/* 图片改变时传值，不改变时传空 */}
           <div className="img">
            <Item noStyle name="projectImage" rules={[
              {
                validator: checkProject,
              },
            ]}>
            <Cupload wpx={248} hpx={168} swpx={200} shpx={114} isDel={ispublish} /> 
            </Item>
           </div>
           <Info>{t("comm:sizeofpicture", {size: "248*168"})}</Info>
         </Item>
      </div>
      <Divider dashed  className="divider" style={{width: '624px',minWidth: '624px', marginLeft: '96px'}} />    
      <Item label={t("comm:ProjectAddress")} name="address" labelCol={iszh ? null : {flex: "160px"}}  rules={[  
              {
                required: true,
                message: t("common:Message_enterfullddress"),
              },
            ]}
            tooltip={t("common:Message_clickmaptoget")}
            > 
          <Input placeholder={t("common:Message_enterfullddress")}  onBlur={onInput}  />         
      </Item>
      <Item label={t("comm:longitudeatitude")}  name="lngLat" labelCol={iszh ? null : {flex: "160px"}} rules={[  
              {
                required: true,
                message:  t("comm:mapgetit"),
              },
            ]}> 
              <Input placeholder={t("comm:longitude")} /> 
      </Item>
 
    
      <div className='map'> 
         <Mapcom setAaddress={setAaddress}   ref={map} />         
      </div> 
      <Divider dashed  className="divider" style={{width: '624px', minWidth: '624px', marginLeft: '96px'}} />
      <Item label={t("comm:Projectremark")}   name="remark"> 
        <TextArea placeholder={t("common:ProjectDetails")} maxLength={99} style={{height: '32px'}} />
      </Item> 
    
      </div>
    </Formbox>
    </Titlelayout>
  );
}
