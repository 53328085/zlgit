import React, { useState, useEffect, useMemo, useRef } from "react";

import {
  Form,
  Input,
  InputNumber,
  Divider,
  Space,
  message,
  Typography,
  Tag,
  theme
} from "antd";
import styled from "styled-components";

import {ProjectSetting,CustTheme} from '@api/api.js'

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
  const [themes, setThemes] = useState([])
  const {t} = useTranslation("comm","common")
  console.log(themes)
  const CurrProject = useSelector(currProject)

  const {QueryProjectInfo, SaveProjectInfo} = ProjectSetting
  const [form] = Form.useForm();

  const refid = useRef() // 保存时的ID
 const currtheme = useRef()
const getTheme = async()=>{
  try {
    let {success, data, errMsg} = await  CustTheme.QueryTheme(projectId)
    if(success && Array.isArray(data) && data.length >0 ){
      let datas = data.map(d => ({...d, context: JSON.parse(d.context)}))
      let formdata
      if(!Number.isInteger(refid.current)) { // 页面初始化时      
        formdata = datas[0]
      }else if(refid.current ==0){ // 新增时
       formdata =datas.reduce((c,p)=> {
           return c.id > p.id ? c : p
       }, {id: 0})
      }else if(refid.current > 0){ // 编辑时
        formdata = datas.find(d => d.id == refid.id)
      }
      console.log(formdata)
      currtheme.current = formdata;
      dispatch(getThemeColor(formdata.context))
      form.setFieldsValue({id: formdata.id, name: formdata.name, ...formdata.context})
      setThemes(datas)

    }else{
      setThemes([])
      currtheme.current(null)
      if(!success) message.warning(errMsg || "数据出错")
    }
  } catch (error) {
    console.log(error)
  }
 
}


const onSave =async () => { // 保存
  try {
    let {id, name, ...params} = await form.validateFields()
    refid.current=id;
    let obj = {id, name, context: JSON.stringify(params)};
   
    let {success, errMsg} =  await  CustTheme.UpdateTheme(projectId, [obj])
    if(success){
      message.success("保存成功")
      getTheme()
    }else{
      message.warning(errMsg || "数据出错")
    }


  } catch (error) {
    console.log(error)
  }
  
}
const onrest=()=>{
  try {
    if(refid!=0 && themes?.length>0 && currtheme ){
      let formdata = currtheme.current
     
      dispatch(getThemeColor(formdata.context))
      form.setFieldsValue({id: formdata.id, name: formdata.name, ...formdata.context})
  
    }
  } catch (error) {
    console.log(error)
  }
}
const onadd =()=> {
  form.resetFields()
  dispatch(getThemeColor(form.getFieldsValue()))
}
const selectTheme =(id)=> {
  try {
    let formdata = themes.find(t => t.id ==id)
    dispatch(getThemeColor(formdata.context))
    form.setFieldsValue({id: formdata.id, name: formdata.name, ...formdata.context})
    refid.current=id;
  
  } catch (error) {
    
  }

}
const ondelete=async ()=> {

   try {
    if(!Number.isInteger(refid.current)) return message.warning("没有选择方案")
    let params ={
      projectId,
      themeId: refid.current
    }
    console.log(params)
    let {success,errMsg}=await  CustTheme.DeleteTheme(params)
    if(success){
      message.success("删除成功")
      refid.current=undefined
      getTheme()
    }else{
message.warning(errMsg|| "数据出错")
    }
   } catch (error) {
    
   }
}
 useEffect(() => {
  getTheme(); 
}, [projectId]) 
 
  return (
    <Titlelayout title={<div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
      <span>网站设计</span>  <Space size={32}>
        <CustButton onClick={onrest} ghost>恢复默认值</CustButton>
        <CustButton onClick={onadd}>新增方案</CustButton>
     <CustButton onClick={onSave} isicon={false} >保存方案</CustButton>
     <CustButton onClick={ondelete} type="default" danger>删除</CustButton>
     </Space></div>}>
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
      <div className="leftlayout" >
        <div className="row">
        <Item label="方案名称" name="name"   rules={[
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
      <Divider dashed  className="divider" />
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
      
      </div>
     
      
      
      </div>
      <div className="leftlayout">
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
      <Divider dashed  className="divider" />
      <Item label="项目概述背景色"  name="previewrbgcolor" initialValue="#135abd">
        <Ccolor name="previewrbgcolor" />
      </Item>
      <Item label="已有方案"    >
        <div style={{display: "flex", rowGap: "8px", flexWrap: "wrap"}}>
        {
         themes?.length > 0 ?  themes?.map?.(t => <Ctag key={t.id} color={t?.context?.primaryColor} onClick={() => selectTheme(t.id)}>{t.name}</Ctag>): null
        }
        </div>
      </Item>
      <Item   name="id" noStyle initialValue={0} >
          <Input hidden></Input>
       </Item>
      </div>

    </Formbox>
    </Titlelayout>
  );
}
