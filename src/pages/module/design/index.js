import React, { useState, useEffect, useMemo, useRef } from "react";

import {
  Form,
  Input,
  InputNumber,
 
  Space,
  message,
  Typography,
  Tag,
  theme,
  Select
} from "antd";
import styled from "styled-components";

import {ProjectSetting,CustTheme} from '@api/api.js'

import {initithemeColor} from "@com/defaultcolor"

import Titlelayout from '@com/titlelayout'
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from 'react-i18next'

import {publishState, getCurrProjectInfo, currProject, iszhCN, selectProjectId, getThemeColor,themeColor,themes,themeId, getThemeId, getThemes, selectedtheme} from '@redux/systemconfig' // 布尔值 发布状态 
import Pagecount from "@com/pagecontent";
import {SaveButton, CustButton} from "@com/useButton" ;
import {getprimarycolors} from "@com/usehandler";
import Ccolor from './custColor';
import { isObject } from "lodash";

const {Text, Link} =Typography
const { Item } = Form;
const Ctag=styled(Tag)`
 &&{
  font-size: 14px;
  padding: 0 16px;
  &:hover{
    cursor: pointer;
  }
 }
`
 
 const Formbox = styled(Form)`
  
  flex: 1;
 
   padding-top: 32px;
   margin-top: 16px;
   border-top: 1px dotted #d7d7d7;
  display: flex;
   .mainbox {
    display:flex;
    flex-direction: column;
    row-gap: 32px;
    flex:1;
 .list {
     display: flex;
     flex-wrap: wrap;
     gap: 16px;
     min-height: 20px;
   }
 
   
  .items{
   //grid-template-rows: repeat(16, 32px);
    position: relative;
    flex: 1;
    column-width: 500px;
    column-gap: 32px;
    column-rule: 2px dotted #d7d7d7;
   // grid-auto-rows: auto;
   //row-gap: 16px;
  // display: grid;
    
  .ant-form-item-explain-error {
      line-height: 1;
    }
  .ant-form-item {
    margin-bottom: 8px;
  }
  .ant-form-item-label {
    flex-basis: 146px;
    padding-right: 10px;
  }

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
  const defaluttheme =useSelector(themeColor)
  const SelectedTheme = useSelector(selectedtheme)
  const Themes = useSelector(themes)
  const curtheme = useRef();
  curtheme.current = SelectedTheme;
  
 
  console.log("SelectedTheme",SelectedTheme)
  console.log("curtheme.current",curtheme.current)
  
  const [form] = Form.useForm();

  const refid = useRef() // 保存时的ID

const getTheme = async()=>{
  try {
    
    let {success, data, errMsg} = await  CustTheme.QueryTheme(projectId)
    if(success && Array.isArray(data) && data.length >0 ){
      let datas = data.map(d => ({...d, context: JSON.parse(d.context)}))
      let ids = data.map(d =>d.id);
      let maxid = Math.max(...ids)
    //  let minid = Math.min(...ids)
      let formdata;
      if(refid.current == 0) { // 新增时
         
         formdata = datas.find(d => d.id == maxid);
         
      }else if(refid.current==-1){ // 删除时
       
        formdata=datas[0]
      }else if(refid.current>0){ // 编辑时
        formdata = datas.find(d => d.id == refid.current)
      }
      
      dispatch(getThemeId(formdata.id))
      dispatch(getThemeColor({id: formdata.id, name: formdata.name, ...formdata.context}))
      dispatch(getThemes(datas)) 
    }else{
      dispatch(getThemeColor(initithemeColor))
      dispatch(getThemeId(NaN))
      dispatch(getThemes([])) 
    //  form.resetFields()
      if(!success) message.warning(errMsg || "数据出错")
    }
  } catch (error) {
    console.log(error)
  }
 
}
/* const getTheme = async()=>{
  try {
    let {success, data, errMsg} = await  CustTheme.QueryTheme(projectId)
    if(success && Array.isArray(data) && data.length >0 ){
      let datas = data.map(d => ({...d, context: JSON.parse(d.context)}))
      let formdata
      if(!Number.isInteger(refid.current)) { // 页面初始化时      
        formdata = Number.isInteger(parseInt(themeId)) ? datas.find(d=> d.id==themeId)??datas[0] : datas[0]
      }else if(refid.current ==0){ // 新增时
       formdata =datas.reduce((c,p)=> {
           return c.id > p.id ? c : p
       }, {id: 0})
      }else if(refid.current > 0){ // 编辑时
        formdata = datas.find(d => d.id == refid.current)
      }
      
      currtheme.current = formdata;
      dispatch(getThemeColor(formdata.context))
      form.setFieldsValue({id: formdata.id, name: formdata.name, ...formdata.context})
     

    }else{
    
      currtheme.current(null)
      if(!success) message.warning(errMsg || "数据出错")
    }
  } catch (error) {
    console.log(error)
  }
 
} */


const onSave =async () => { // 保存
  try {
    let {id, name, ...params} = await form.validateFields()
    console.dir(params)
    refid.current=id;
    let obj = {id, name, context: JSON.stringify(params)};
   
    let {success, errMsg} =  await  CustTheme.UpdateTheme(projectId, [obj])
    if(success){
      message.success("保存成功")
    
    // if(id > 0)  dispatch(getThemeId(id))
    
      getTheme();
    }else{
      message.warning(errMsg || "数据出错")
    }


  } catch (error) {
    console.log(error)
  }
  
}
const onadd =()=> {
  form.resetFields()
  dispatch(getThemeColor(form.getFieldsValue()))
}
const onrest=()=>{
  try {
    let id = form.getFieldValue("id")
    if(id==0){
       onadd();
    }else if(id>0){
      dispatch(getThemeColor(SelectedTheme))
     
    }
    /* if(refid!=0 && themes?.length>0 && currtheme ){
      let formdata = currtheme.current
     
      dispatch(getThemeColor(formdata.context))
      form.setFieldsValue({id: formdata.id, name: formdata.name, ...formdata.context})
  
    } */
  } catch (error) {
    console.log(error)
  }
}

const selectTheme =(id)=> {
  try {
    refid.current=id
    dispatch(getThemeId(id))
    let formdata = Themes.find(t => t.id ==id)
     
    dispatch(getThemeColor({id: formdata.id, name: formdata.name, ...formdata.context}))
  form.setFieldsValue({id: formdata.id, name: formdata.name, ...formdata.context})
  //  refid.current=id;
  
  } catch (error) {
    console.log(error)
  }

}
const ondelete=async ()=> {

   try {
    let id = form.getFieldValue("id")
    
    if(!Number.isInteger(parseInt(id)) && id>0 ) return message.warning("没有选择方案")
    
    let params ={
      projectId,
      themeId: id
    }
   
    let {success,errMsg}=await  CustTheme.DeleteTheme(params)
    if(success){
      message.success("删除成功")
      refid.current=-1
      getTheme()
    }else{
message.warning(errMsg|| "数据出错")
    }
   } catch (error) {
    
   }
}
 useEffect(() => {
 // getTheme(); 
}, [projectId]) 
useEffect(()=>{
   
  if(isObject(defaluttheme) && defaluttheme.id >0){
    
    form.setFieldsValue(defaluttheme)
  }
  
},[defaluttheme])
useEffect(()=>{
  return ()=> {
    
     dispatch(getThemeColor(curtheme.current))
    }
  
},[])
  return (
    <Pagecount pd="0">
      
    

    <Titlelayout title={<div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}} >
      <span>网站设计</span>  <Space size={32}>
        <CustButton onClick={onrest} ghost>恢复默认值</CustButton>
        <CustButton onClick={onadd}>新增方案</CustButton>
     <CustButton onClick={onSave} isicon={false} >保存方案</CustButton>
     <CustButton onClick={ondelete} type="default" danger>删除</CustButton>
     </Space></div>} layout="flex">
  
    <Formbox
      form={form}   
      labelAlign="left"
      size="middle"
      scrollToFirstError={true}
      disabled={ispublish}
     
     
      validateMessages={
       { required: "缺少'${label}' 数据"}
      
      }
    >
    <div className="mainbox">
         <div className="list">
        <strong>已有方案：</strong> 
        {
         Themes?.length > 0 ?  Themes?.map?.(t => <Ctag key={t.id} color={t?.context?.primaryColor} onClick={() => selectTheme(t.id)}>{t.name}</Ctag>): null
        }
      </div>
      <div className="items" >
        
        <Item label="方案名称" name="name"   rules={[
          {
            required: true
          }
        ]

        }>
         <Input></Input>
      </Item>
     
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
        <Text type="danger">应用于ant-design错误信息,删除提示,其他需要错误色的元素</Text>
      </Item>
      <Item label="警告色">
        <Item name="warningColor" initialValue="#faad14" noStyle>
        <Ccolor name="warningColor" />
        </Item>
        <Text type="warning">应用于ant-design警告信息,其他需要警告色的元素</Text>
      </Item>
      <Item label="成功色">
        <Item name="successColor" initialValue="#52c41a" noStyle>
        <Ccolor name="successColor" />
        </Item>
        <Text type="success">应用于ant-design成功信息显示,其他需要成功色的元素</Text>
      </Item>
    
      <Item label="模块菜单栏背景色"  name="menusbgcolor" initialValue="#003366">
      <Ccolor name="menusbgcolor" />
      </Item>
      <Item label="模块菜单栏字体色"  name="menusfontcolor" initialValue="#b2c1d1">
      <Ccolor name="menusfontcolor" />
      </Item>
     
      <Item label="当前模块背景色"  name="menusactive" initialValue="#1c62b6">
      <Ccolor name="menusactive" />
      </Item>
      <Item label="当前模块下边框线颜色"  name="menusborder" initialValue="#00ff66">
      <Ccolor name="menusborder" />
      </Item>
      <Item label="当前模块字体颜色"  name="menusactivefontcolor" initialValue="#ffffff">
      <Ccolor name="menusactivefontcolor" />
      </Item>
      <Item label="右边模块菜单栏背景色"  name="menusbgcolorR" initialValue="#135abd">
      <Ccolor name="menusbgcolorR" />
      </Item>
      <Item label="右边模块菜单栏活动色"  name="menusbgcolorRA" initialValue="#3988e7">
      <Ccolor name="menusbgcolorRA" />
      </Item>
      <Item label="右边模块字体颜色"  name="menusbgcolorRfont" initialValue="#ffffff">
      <Ccolor name="menusbgcolorRfont" />
      </Item>
      <Item label="右边模块分隔线颜色"  name="menusbgcolorRborder" initialValue="#ffffff">
      <Ccolor name="menusbgcolorRborder" />
      </Item>
      
      
      <Item label="运行态侧边栏起始色"  name="runasiderstart" initialValue="#0b41c7">
      <Ccolor name="runasiderstart" />
      </Item>
      <Item label="运行态侧边栏结束色"  name="runasiderend" initialValue="#7662ff">
      <Ccolor name="runasiderend" />
      </Item>
      <Item label="设计态侧边栏起始色"  name="desasiderstart" initialValue="#003399">
      <Ccolor name="desasiderstart" />
      </Item>
      <Item label="设计态侧边栏结束色"  name="desasiderend" initialValue="#003333">
      <Ccolor name="desasiderend" />
      </Item>
      <Item label="侧边栏字体颜色"  name="asiderfontcolor" initialValue="#ffffff">
      <Ccolor name="asiderfontcolor" />
      </Item>
      <Item label="当前侧边栏字体颜色"  name="asiderfontcolorA" initialValue="#33ff00">
      <Ccolor name="asiderfontcolorA" />
      </Item>
      <Item label="当前侧边栏背景色"  name="asiderbgcolorA" initialValue="#3333cc">
        <Ccolor name="asiderbgcolorA" />
      </Item>
     
      <Item label="项目概述背景色"  name="previewrbgcolor" initialValue="#135abd">
        <Ccolor name="previewrbgcolor" />
      </Item>
      <Item label="网关详情页标题背景色"  name="gatewayheardcolor" initialValue="#003366">
        <Ccolor name="gatewayheardcolor" />
      </Item>
      <Item label="网关详情页背景色"  name="gatewaybgcolor" initialValue="#135abd">
        <Ccolor name="gatewaybgcolor" />
      </Item>
      <Item label="设备详情页标题背景色"  name="deviceheardcolor" initialValue="#003366">
        <Ccolor name="deviceheardcolor" />
      </Item>
      <Item label="设备详情页背景色"  name="devicebgcolor" initialValue="#135abd">
        <Ccolor name="devicebgcolor" />
      </Item>
      <Item label="设备\网关运行状态"   >
        <div style={{display: "flex", columnGap: "8px", flexWrap: "wrap" }}> 
        <Item label="正常" labelCol={{flex: "3em"}} name="normalColor" initialValue="#009966">
          <Ccolor name="normalColor" />
        </Item>
        <Item label="正常字体色" labelCol={{flex: "6em"}} name="fntnormalColor" initialValue="#ffffff">
          <Ccolor name="fntnormalColor" />
        </Item>
        <Item label="告警" labelCol={{flex: "3em"}} name="warningColorstate" initialValue="#ff4d4f">
          <Ccolor name="warningColorstate" />
        </Item>
        <Item label="告警字体色" labelCol={{flex: "6em"}} name="fntwarningColorstate" initialValue="#ffffff">
          <Ccolor name="fntwarningColorstate" />
        </Item>
        <Item label="离线" labelCol={{flex: "3em"}} name="offlineColor" initialValue="#666666">
          <Ccolor name="offlineColor" />
        </Item>
        <Item label="离线字体色" labelCol={{flex: "6em"}} name="fntofflineColor" initialValue="#ffffff">
          <Ccolor name="fntofflineColor" />
        </Item>
        </div>        
      </Item>
      <Item label="设备\网关项右下设置">
      <div style={{display: "flex", columnGap: "8px", flexWrap: "wrap" }}> 
      <Item label="字段名" labelCol={{flex: "4em"}} name="fieldname" initialValue="#ffffff">
          <Ccolor name="fieldname" />
        </Item>
        <Item label="字段值" labelCol={{flex: "4em"}} name="fieldvalue" initialValue="#33ff00">
          <Ccolor name="fieldvalue" />
        </Item>
        <Item label="背景色" labelCol={{flex: "4em"}} name="itembg" initialValue="#000033">
          <Ccolor name="itembg" />
        </Item>
     </div>
    
     </Item>
     <Item label="配电房概述菜单">
      <div style={{display: "flex", columnGap: "8px", flexWrap: "wrap" }}> 
      <Item label="字段名" labelCol={{flex: "4em"}} name="disfieldname" initialValue="#ffffff">
          <Ccolor name="disfieldname" />
        </Item>
        <Item label="字段值" labelCol={{flex: "4em"}} name="disfieldvalue" initialValue="#33ff00">
          <Ccolor name="disfieldvalue" />
        </Item>
        <Item label="列表项背景色" labelCol={{flex: "8em"}} name="dislistbg" initialValue="#000033">
          <Ccolor name="dislistbg" />
        </Item>
        <Item label="列表项背景色hove" labelCol={{flex: "10em"}} name="disitemhover" initialValue="#000033">
          <Ccolor name="disitemhover" />
        </Item>
     </div>
    
     </Item>
       <Item label="主题衍生背景色" shouldUpdate={(cur, pre) => cur.primaryColor!=pre.primaryColor} >
        {
          ()=> {
         
          let arrcolor=getprimarycolors().map?.(d => d.value)??[];
         
            return ( 
              <Item  initialValue="#4a9af0" name="primaryderived" >
              <Ccolor name="primaryderived"  arrcolor={arrcolor}></Ccolor>
              </Item> 
            )
          }
        }
        </Item>
        <Item  label="衍生背景色对应文字" initialValue="#ffffff" name="bgcolorfont" >
              <Ccolor name="bgcolorfont" ></Ccolor>
        </Item>
       
     
      <Item   name="id" noStyle initialValue={0} >
          <Input hidden></Input>
       </Item>
      
      
       <Item label="碳排概述进度条颜色"  name="carnstrokecolor" initialValue="#ffff99">
      <Ccolor name="carnstrokecolor" />
      </Item>
      <Item label="碳排概述进度条末完成颜色" labelCol={{flex:"13em"}} name="carntrailcolor" initialValue="#6633cc">
      <Ccolor name="carntrailcolor" />
      </Item>
      </div>
       </div>
    </Formbox>
    </Titlelayout>
    </Pagecount>
  );

}
