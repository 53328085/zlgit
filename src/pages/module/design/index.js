import React, { useState, useEffect, useMemo, useRef } from "react";

import {
  Form,
  Input,
  DatePicker,
  Select,
  Switch, 
  Divider,
  Checkbox,
  Space,
  message,
  Alert,
  Typography,
} from "antd";
import styled from "styled-components";

import {ProjectSetting} from '@api/api.js'

import Mapcom from "@com/useMap/indexset";
//import useMap from "@com/useMap/useInitMap"
//import useMap from "@com/useMap/indexset"
import Cupload from "@com/useUpload.js" 
import Titlelayout from '@com/titlelayout'
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from 'react-i18next'
import {manager, maintenance} from '@redux/user' //   布尔值  是否是 项目管理员， 运营人员；
import {publishState, getCurrProjectInfo, currProject, iszhCN, selectProjectId, getThemeColor,themeColor} from '@redux/systemconfig' // 布尔值 发布状态 
 
import {SaveButton, CustButton} from "@com/useButton" ;
import Ccolor from './custColor';
const {Text, Link} =Typography
 const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: 500px 500px;
  column-gap: 64px ;
  //grid-template-rows: repeat(16, 32px);
  //gap: 16px 128px;
 // grid-auto-flow: column;
 // justify-content: space-between;
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
    position: relative;
    grid-auto-rows: auto;
   row-gap: 16px;
   display: grid;
   .row {
    display:  grid;
   // grid-template-rows: repeat(3, 32px);
    row-gap: 16px;
   }
 
}

  
`; 
const Info = styled.span`
  font-size: 12px;
  color: rgba(0,0,0,0.85);
`





export default function Index() {
  const dispatch = useDispatch(); 
  const ispublish = useSelector(publishState)
  const iszh = useSelector(iszhCN)
  const projectId= useSelector(selectProjectId)
  
  const {t} = useTranslation("comm","common")

  const CurrProject = useSelector(currProject)

  const {QueryProjectInfo, SaveProjectInfo} = ProjectSetting
  const [form] = Form.useForm();


  

 







  const { Item } = Form;

 
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
const onrest=()=>{
  form.resetFields()
  dispatch(getThemeColor(form.getFieldsValue()))
 
}
/* useEffect(() => {
  queryProjectInfo(); 
}, [projectId]) */
 
  return (
    <Titlelayout title={<div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
      <span>网站设计</span>  <Space size={32}><CustButton onClick={onrest} ghost>恢复默认值</CustButton><SaveButton onClick={onSave} isicon={false} /></Space></div>}>
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
      <div className="leftlayout" >
        <div className="row">
        <Item label="方案名称" name="name"   required={[
          {
            required: true
          }
        ]

        }>
         <Input></Input>
      </Item>
      <Divider dashed  className="divider" />
      <Item label="主题色">
        <Item name="primaryColor" initialValue="#237ae4" noStyle>
        <Ccolor name="primaryColor" />
        </Item>       
        <Link>应用于网站和ant-design主色,ECharts图表的第一种颜色,其他需要主色的元素。使整个网站主色彩一致</Link>
      </Item>
      <Item label="错误色">
        <Item name="errorColor" initialValue="#ff4d4f" noStyle>
        <Ccolor name="errorColor" />
        </Item>
        <Text type="danger">应用于ant-design错误信息显示,其他需要错误色的元素</Text>
      </Item>
      <Item label="警告色">
        <Item name="warningColor" initialValue="#faad14" noStyle>
        <Ccolor name="warningColor" />
        </Item>
        <Text type="warning">应用于ant-design警告信息显示,其他需要警告色的元素</Text>
      </Item>
      <Item label="成功色">
        <Item name="successColor" initialValue="#52c41a" noStyle>
        <Ccolor name="successColor" />
        </Item>
        <Text type="success">应用于ant-design成功信息显示,其他需要成功色的元素</Text>
      </Item>
      <Divider dashed  className="divider" />
      <Item label="模块菜单栏背景色"  name="menusbgcolor" initialValue="#036">
      <Ccolor name="menusbgcolor" />
      </Item>
      <Item label="模块菜单栏字体色"  name="menusfontcolor" initialValue="#b2c1d1">
      <Ccolor name="menusfontcolor" />
      </Item>
     
      <Item label="当前模块背景色"  name="menusactive" initialValue="#1c62b6">
      <Ccolor name="menusactive" />
      </Item>
      <Item label="当前模块下边框线颜色"  name="menusborder" initialValue="#0f6">
      <Ccolor name="menusborder" />
      </Item>
      <Item label="当前模块字体颜色"  name="menusactivefontcolor" initialValue="#fff">
      <Ccolor name="menusactivefontcolor" />
      </Item>
      <Item label="右边模块菜单栏背景色"  name="menusbgcolorR" initialValue="#135abd">
      <Ccolor name="menusbgcolorR" />
      </Item>
      <Item label="右边模块菜单栏活动色"  name="menusbgcolorRA" initialValue="#3988e7">
      <Ccolor name="menusbgcolorRA" />
      </Item>
      <Item label="右边模块字体颜色"  name="menusbgcolorRfont" initialValue="#fff">
      <Ccolor name="menusbgcolorRfont" />
      </Item>
      <Item label="右边模块分隔线颜色"  name="menusbgcolorRborder" initialValue="#fff">
      <Ccolor name="menusbgcolorRborder" />
      </Item>
      
      </div>
     
      
      
      </div>
      <div className="leftlayout">
      <Item label="运行态侧边栏起始色"  name="runasiderstart" initialValue="#0b41c7">
      <Ccolor name="runasiderstart" />
      </Item>
      <Item label="运行态侧边栏结束色"  name="runasiderend" initialValue="#7662ff">
      <Ccolor name="runasiderend" />
      </Item>
      <Item label="设计态侧边栏起始色"  name="desasiderstart" initialValue="#039">
      <Ccolor name="desasiderstart" />
      </Item>
      <Item label="设计态侧边栏结束色"  name="desasiderend" initialValue="#033">
      <Ccolor name="desasiderend" />
      </Item>
      <Item label="侧边栏字体颜色"  name="asiderfontcolor" initialValue="#fff">
      <Ccolor name="asiderfontcolor" />
      </Item>
      <Item label="当前侧边栏字体颜色"  name="asiderfontcolorA" initialValue="#3f0">
      <Ccolor name="asiderfontcolorA" />
      </Item>
      <Item label="当前侧边栏背景色"  name="asiderbgcolorA" initialValue="#3333cc">
      <Ccolor name="asiderbgcolorA" />
      </Item>
      <Item label="已有方案"  name="schemes" >
       
      </Item>
      
      </div>

    </Formbox>
    </Titlelayout>
  );
}
