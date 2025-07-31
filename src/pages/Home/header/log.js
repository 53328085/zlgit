import React, {useRef,  useCallback, useState, useEffect} from "react";
import { Dropdown, Space, Form, Input, message, Typography, Radio } from "antd";

import styled, {css, createGlobalStyle} from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {useNavigate, useLocation} from "react-router-dom"
import { clearToken, selectUser, userRest, platformLang} from "@redux/user";
import { configProject, comSetFirst, getJump, currentscreen, isGranary,datascreen, configState, setIntl,setIszhCN, selectProjectId,getMenus,
   setMenus,menus,adaptation,getThemeColor,
  themelist,
  themes,
 getThemeId,
 themeColor
 } from "@redux/systemconfig";

import moment from "moment";
import {useTranslation, Trans, Translation} from 'react-i18next';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
 
import 'moment/locale/zh-cn';
 import './log.less'
import CModal from "@com/useModal"
import imgurl from "./icon";
import lg from './icon/lg.svg'
import {pwdValidator, phoneValidator} from '@pages/rule.js'
import {Login,CustTheme} from '@api/api' 
import {CustButton} from '@com/useButton'
import {handlermenu,isObject, hextodec} from "@com/usehandler"

import svgurl from './icon/svg'
import {ReactComponent  as Hux} from './icon/hux.svg'
import * as svgcom from './icon' 
const Micon = ({iconname}) => { 
      const Com = svgcom[iconname] 
    const Def = svgcom["def"]
   return   Com ?  <Com  className={iconname + " custicon"}/> :   <Def className="def" ></Def>
  // return <span className="custicon">&#9673;</span>
}

const {Text} = Typography 

const CDropdown=createGlobalStyle`
.ant-dropdown-menu-submenu-popup ul {
  border-radius: 8px;
}
.custDropdown {
    .ant-dropdown-menu {
       padding: 0px;
       width: 158px;
       padding: 8px 6px;

       .ant-dropdown-menu-item  {
      //  line-height: 40px;
        height: 40px;
        font-size: 14px;
        display: flex;
        align-items: center;
        transition: all 0.1s;
        padding: 0px 16px;
        column-gap: 8px;
        &:hover {
            background-color:  ${props => props.theme.primaryColor};
            color: #ffffff;
            g path:nth-of-type(1){
                fill:  #ffffff; 
              }
          } 
      }
      .ant-dropdown-menu-submenu-title {
        display: flex;
        align-items: center;
        column-gap: 8px;
        &:hover {
            background-color:  ${props => props.theme.primaryColor};
            color: #ffffff;
            g path:nth-of-type(1){
                fill:  #ffffff; 
              }
             .ant-dropdown-menu-submenu-arrow-icon {
              path {
                fill: #ffffff;
              }
             }
          } 
      }
   
    }
  
}
   
`
const Lngdiv = styled.div`
  display: flex;
  padding: 16px 0;
  column-gap: 32px;
  align-items: center;
  border-top: 1px dotted #d7d7d7;
  
  span {
    color: #515151;
    font-size: 16px;
  }
`
const Cradio = styled(Radio)`
 && {
  margin-left: auto;
  .ant-radio-inner {
    width: 28px;
    height: 28px;
    background-color: ${props => props.theme.primaryColor || '#237AE4'};;
    &:after {
      background-color: #fff;
    }
  }
 }
`
const Cdiv = styled.div`
  display: flex;
  height: inherit;
  overflow: hidden;
  align-items: center;
`;
const Ldiv = styled.div`
  height: inherit;
  background-color:  ${props => props.theme.menusbgcolorR || '#135abd'};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 28px;
 // border-bottom: 1px solid ${props => props.theme.menusbgcolor || '#003366'};
 // border-top: 1px solid ${props => props.theme.menusbgcolor || '#003366'};
`;

let style = css`width: 58px;
       border-right: none;
       font-size: 12px;
       .custicon {
          g path:nth-of-type(1) {
                fill: ${props => props.theme.menusbgcolorRfont || '#ffffff'}; 
              }
        }
       
    &:hover {
      .custicon {
          g path:nth-of-type(1) {
                fill: ${props => props.theme.menusbgcolorRA || '#3988e7'}; 
              }
        }
       
    }
       `


const Logbox = styled.div`
  &&{
    height: inherit;
    width: 74px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //padding: 4px 0;
    position: relative;
    row-gap: 6px;
    cursor: pointer;
    &:not(:last-of-type)::after{
    content: '';
    position: absolute;
    right:0;
    width: 1px;
    height: 30px;
    display: block;
    background-color: ${props => props.theme.menusbgcolorRborder || '#ffffff'} ;
  }
    span {
      line-height: 1;
      color: ${props => props.theme.menusbgcolorRfont || '#ffffff'};
      font-size: 13px;
      &:hover{
        line-height: 1;
       color: ${props => props.theme.menusbgcolorRA || '#3988e7'}
      }
    }
    .custicon {
          g path:nth-of-type(1){
                fill: ${props => props.theme.menusbgcolorRfont || '#ffffff'}; 
              }
        }
     
 
  &:hover {
    .custicon {
          g path:nth-of-type(1) {
                fill: ${props => props.theme.menusbgcolorRA || '#3988e7'}; 
              }
        }
     
        span {
       color: ${props => props.theme.menusbgcolorRA || '#3988e7'}
    }
    }

    ${props => props.laptop ? style : null}
  }
`
const Ciocn = (props) => {
  const url = props.url || svgurl['0104']
  return <div className="logo"><img src={url}  className="shadow" style={{height: '100%', width: "100%"}} /></div> 
}
const Triangle = styled.div`
   /*  width: 0; 
     height: 0;
     border-width: 30px;
     border-style: solid;
     border-color: transparent  ${props => props.theme.menusbgcolorR || '#135abd'} transparent transparent;
     display: ${props => props.laptop ? "none" : 'block'}; */
     height: 70px;
    // width:232px;
    flex: 0 1 auto;
     display: flex;
     justify-content: flex-end;
     background-image: linear-gradient(to right, rgba(${props=>props.srgb[0]}, ${props=>props.srgb[1]}, ${props=>props.srgb[2]}, ${props=>props.startOpacity}),rgba(${props=>props.ergb[0]}, ${props=>props.ergb[1]}, ${props=>props.ergb[2]}, ${props=>props.endOpacity})) ;
      
`;
const Cipt = styled(Input)`
  && {
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
  }
`
const Ciptpd = styled(Input.Password)`
  && {
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
  }
`
const langpack = {
  en: enUS,
  zh: zhCN
}

export default function Log() {
  // const [user, setUser] = useState('')
  const {i18n} = useTranslation()
 
  const user = useRef()
  const navgite = useNavigate()
  const projectId = useSelector(selectProjectId)
  const  screenadr = useSelector(currentscreen)
  const  isgranary = useSelector(isGranary) 
  const setmenus = useSelector(setMenus)
  const allmenus = useSelector(menus)
  const adap =useSelector(adaptation) || {}
 const themelists = useSelector(themelist)
 let Themes = useSelector(themes);
  
   let item = themelists?.length> 0 ? {label: '主题', key:"theme", children: themelists, icon: <Micon iconname="theme" />} : null

  const items=process.env.NODE_ENV === 'development' ? [   // 王工正式线屏蔽语言切换
    {label: '账户管理', key:"mg", icon:  <Micon iconname="account" />},
    {label: '语言切换', key:"lng",icon:  <Micon iconname="lang" />},
    {label: '退出系统', key:"exit", icon:  <Micon iconname="exit" />},
    item
  ]: [
    {label: '账户管理', key:"mg",icon:  <Micon iconname="account" />},
    {label: '退出系统', key:"exit",icon:  <Micon iconname="exit" />},
    item
  ]
 // const [items, setItems] = useState(inita)
  
  let dataScreen =setmenus?.find(i => i.key=='dataScreen')?.label //数据大屏
  let projectSet = setmenus?.find(i => i.key=='projectSet')?.label //项目设置
  let systemSet = setmenus?.find(i => i.key=='systemSet')?.label // 平台设置
  //const showscreen =  screenadr?.type==1 || screenadr?.type==2
  const dispatch = useDispatch()
  const {name, roleType, mobile, userId} = useSelector(selectUser) || {};
  const {menusbgcolorR,startColor,endColor,startOpacity,endOpacity } = useSelector(themeColor)
 
  const srgb=hextodec(startColor)
  const ergb=hextodec(endColor)
  let strmob = mobile.toString()
  const start = strmob.slice(0, 3).padEnd(7, '*')+strmob.slice(-4);
 
  const comurl = useSelector(comSetFirst) 
  const config = useSelector(configState)
  const Langes = useSelector(platformLang)

  const Datascreen = useSelector(datascreen)
  const showscreen =  Datascreen?.bigScreenEnabled==1 || Datascreen?.bigScreenEnabled==2
  const Item = Form.Item
  const [form] = Form.useForm()
  const [mform] = Form.useForm()
  const [pform] = Form.useForm()
  const onExit = async () => {
    navgite('/')
    /*   try {
     await dispatch(userRest());
      await dispatch(systemConfigRest())
        return navgite('/')
      } catch (error) {
        console.log(error);
        return navgite('/')
      } */
  }
  const account = () => {
    user.current.onOpen()
  }
/* const onJump = useCallback(() => {  
   let {type, key, primary} = screenadr   
 
   if(type == 0) return ;
   if(!key.trim() && type > 0) {
    return  message.warn({content: '请配置大屏地址', duration: 0.5})
    
   }else {
    let url =  type == 1 ?  '\\'+ primary+key : type == 2 ? key : '';  
    if (!url) return;
    window.open(url, '_blank')
   }
  
  
}, [screenadr, isgranary]) */

// &#8730;
/* const getcurTheme= async(userId, projectId)=> {
  try {
    let {success, data} = await CustTheme.QueryTheme(projectId)
    let datalen = Array.isArray(data) && data.length> 0 && success ;
    let item =[];
    let params ={
      projectId,
      userId
    }
    let {success:suc, data:themedata} = await CustTheme.GetUserTheme(params)
    let {themeId} = themedata || {}
    if(suc && themeId && datalen){
      try {
        let theme = data.find(d => d.id == themeId)?.context
        let themeobj =  JSON.parse(theme)
        if(theme &&  isObject(themeobj)){
          dispatch(getThemeColor({...themeobj, themeId}))
        }
        item=  data.map(d => ({label: d.id==themeId ? <span style={{color:isObject(themeobj) ? themeobj.primaryColor : "",fontWeight: "bolder" }}>{d.name}</span> : d.name, key: d.themeId}))
      } catch (error) {
        
      }
     
    }else if(datalen){
        let thobj = JSON.parse(data[0].context)
        if(isObject(thobj)){
          dispatch(getThemeColor({...thobj, themeId: null}))
        }
        item=  data.map((d,idx) => ({label: idx==0 ? <span style={{color:isObject(thobj) ? thobj.primaryColor : "", fontWeight: "bolder" }}>{d.name}</span> : d.name, key: d.themeId})) 
    }else {
       item =[];
    }

    if (Array.isArray(item) && item.length > 0) {
  
    }else{
    
    }
      
  
   

  } catch (error) {
    console.log(error)
  }
}
 */
 
const onJump = useCallback(() => {  
  let {bigScreenEnabled, bigScreenUrl} = Datascreen   

  if(bigScreenEnabled == 0) return ;
  if(!bigScreenUrl && type > 0) {
   return  message.warn({content: '请配置大屏地址', duration: 0.5})
   
  }else {  
   window.open(bigScreenUrl, '_blank')
  }
 
 
}, [Datascreen])


 // moment 语言环境设置 antd 组件国际化 中文 zh-cn, 英文 en， echart图表国际化 中文 ZH， 英文 EN， 页面中自定义的文字国际 i18 中文 zh-Cn, 英文 en 
const lref = useRef();
const zhcn = localStorage.getItem('i18nextLng')?.slice(0,2)?.toLowerCase()?? 'zh'
const [lngval, setLngval] = useState(zhcn)
 
const langChange = (e) => {
     
    setLngval(e.target.value)
}
const lngOk = () => {
    try {
    const lang = langpack[lngval]
    let key = lngval==='zh' ? 'zh-cn' : lngval
    
    moment(key);
    dispatch(setIntl({lang, locale: key}))
    dispatch(setIszhCN(lngval==='zh'))
    i18n.changeLanguage(lngval)
     
   const lngmenus =  handlermenu(allmenus.fullmenu, lngval=='zh' ? 'cn' : lngval)
  
   dispatch(getMenus({...lngmenus,projectId}))
    lref.current.onCancel();
  } catch (error) {
      console.log(error)
  }
   // navgite('/')
}
const getTheme =async ()=>{
  let {success, data} =  await CustTheme.GetProjectTheme({projectId}) 
  if(success && isObject(data)) {
    let {themeId} =data
    dispatch(getThemeId(themeId))
       let themedata = Themes.find(t =>t.id==themeId)
        
          dispatch(getThemeColor({id:themedata.id, name:themedata.name, ...themedata.context}))
  }
}
const settheme = async (themeId) => {
  try {
    let params ={
      themeId,
    //  userId,
      projectId,
     }
    console.log(projectId)
    let {success} = await  CustTheme.SelProjectTheme(params) // 选择项目主题
    if(success){
        getTheme()
     /*   dispatch(getThemeId(themeId))
       let data = Themes.find(t =>t.id==themeId)
          dispatch(getThemeColor({id:data.id, name:data.name, ...data.context})) */
       
    }
  } catch (error) {
    console.log(error)
  }
   
}
 

  const onClick = ({key}) => {
      
      if(Number.isInteger(parseInt(key))){
       
        settheme(key)

      }else if(key == 'mg') {
        account()
      }else if(key == 'exit') {
        onExit()
      }else if(key == 'lng') {
         lref.current.onOpen()
      }
  
  }
  const onOk = () => {
    form.validateFields().then(() => {
      let {mobile, pwd, oldPwd} = form.getFieldsValue()
      console.log(oldPwd)
      Login.UpdateCurrentAccount({mobile, pwd, oldPwd}).then(res => {
         let {success, errMsg} = res
         if(success) {
          return message.success("保存成功", 1, user.current.onCancel())
         }
         return message.warning(errMsg || '保存失败', 1)
      })
      
    }).catch(e => {
      message.warning(e.message || '保存失败', 1)
    })
  }
  const back = () => {
   //  dispatch(configProject(false));
     dispatch(getJump(true))
     navgite("/index/runtimeProject", {
      // state: { type: 'index',  primary: key,  index: true, title: label }
      state: { type: 'index', primary: "runtimeProject", index: true, title: "项目概述" },
    })
  }

  const onConfigure = () => {   // 
     dispatch(getJump(false))
     let {key, label} = comurl || {}
    if (!!comurl && comurl.key) {
      dispatch(configProject(true));
      navgite(`/config/designerCommon/${key}`, {
        state: {type: 'config', nested: key,  title: label, primary: 'designerCommon' },
      })
      
    }else {
      return message.warning('请先设置用户权限')
    }
   
  }
  const projectcfg =() => {
    navgite("/projectList")
  }
/*   useEffect(() => {
    return () => {
      unsubscribe()
    }
  }) */

  // 修改手机号码 , 密码
  const onmobile = () => {
     mref.current.onOpen();
  }
  const onpass = () => {
    pref.current.onOpen();
 }
  const mref = useRef();
  const pref = useRef()
  const monOk = async() => { 
     try {
      let {mobile} = await mform.validateFields()     
      let  param= {
         projectId,
         userId ,
         mobile ,
         oldPwd: "",
          pwd: ""
      }
       let {success} =  await Login.ResetUserMobile(param)
       if(success) {
        message.success("保存成功,重新登录后生效")
        mref.current.onCancel()
       }else {
        message.warning(errMsg || '数据出错')
       }
 
     } catch (error) {
        console.log(error)
     }
    }
    const ponOk = async() => { 
      try {
       let {oldPwd, pwd} = await pform.validateFields()
      
       let  param= {
          projectId,
          userId ,
          mobile:'' ,
          oldPwd,
           pwd,
       }
        let {success} =  await Login.ResetUserPassword(param)
        if(success) {
          message.success("保存成功,重新登录后生效")
         pref.current.onCancel()
        }else {
         message.warning(errMsg || '数据出错')
        }
  
      } catch (error) {
         console.log(error)
      }
     }
  const Custfoot =(<Space>
    <CustButton type="primary" onClick={onmobile} key="phone">修改手机号码</CustButton>
    <CustButton type="primary" onClick={onpass} key="user">修改用户密码</CustButton>
  </Space>)



  return (
    <Cdiv>
      {!adap.laptop && <Triangle laptop={adap.laptop} srgb={srgb} ergb={ergb} startOpacity={startOpacity} endOpacity={endOpacity} >
       <Hux style={{fill: menusbgcolorR}} />    
      </Triangle>}
      <Ldiv>
        {
          config ? 
          (<Logbox laptop={adap.laptop}  onClick={back}>
             <Micon iconname="back" />
            <span> 返回</span>
          </Logbox>)
          :
        <>
      { isgranary ? <Logbox laptop={adap.laptop}  onClick={() => window.open('http://10.5.7.60:4242/ses', '_blank')}>
          <Micon iconname="screen" />
          <span> {dataScreen}</span>
        </Logbox> : showscreen  &&  <Logbox laptop={adap.laptop}  onClick={onJump}>
        <Micon iconname="screen" />
          <span> {dataScreen}</span>
        </Logbox>
        }
 
 
 
        { roleType < 4 ? (<Logbox laptop={adap.laptop}    onClick={onConfigure}> 
          <Micon iconname="projectSet" />
          <span>{projectSet}</span>
        </Logbox>):null}
        { roleType < 3 ? (<Logbox  Idiv laptop={adap.laptop}   onClick={projectcfg}>
          <Micon iconname="platform" />
          <span>{systemSet}</span>
        </Logbox>):null}
        </>
        }
        <CDropdown />
        <Dropdown
         menu={{items, 
         onClick, 
        }} 
         placement="bottom" 
        trigger={['click']
      } 
        overlayClassName="custDropdown">
        <Logbox  laptop={adap.laptop}>
        <Micon iconname="user" />
            <span>{name}</span>
        </Logbox>
        </Dropdown> 
     
       
      </Ldiv>
     
      <CModal  title="账户信息" mold="cust"  ref={user} width="440px" closable onOk={onOk}  footer={Custfoot}>
      <Form
        form={form}
        name="modalform"
        colon={false}
        initialValues={{
          name: name,
          mobile: start,
        }}
        size="middle"
        labelCol={{ flex: "7em" }}
        labelAlign="left"
        preserve={false}
        requiredMark={false}
      >
    <Item
      label="账户名"
      name="name"
    >
      <Cipt disabled />
    </Item>
    <Item label="手机号" name="mobile" >
      <Cipt placeholder="" disabled />
    </Item>
     
    
   
  
  
  </Form>
 
      </CModal>

      <CModal  title="修改密码" mold="cust"  ref={pref} width="440px" closable onOk={ponOk}  >
      <Form
        form={pform}
        name="modalform"
        colon={false}
        initialValues={{
          name: name,
          
        }}
        size="middle"
        labelCol={{ flex: "7em" }}
        labelAlign="left"
        preserve={false}
        requiredMark={false}
      >
    <Item
      label="账户名"
      name="name"
    >
      <Cipt disabled />
    </Item>
    
    <Item label="输入旧密码" name="oldPwd"  rules={
      [
        {
          required: true,
          message: '请输入旧密码',             
        },
        {
            min: 6,
            max: 20,
            message: "密码6位到18位之间"
         }, 
      ]
    }>
    <Ciptpd placeholder="请输入旧密码" />
    </Item>
    <Item label="输入新密码" name="pwd" rules={
      [
        {
          required: true,
          message: '请输入新密码',             
        },
        {
            validator: pwdValidator
         }, 
      ]}>
      <Ciptpd placeholder="请输入新密码"  />
    </Item>
    <Item label="确认新密码" name="RePwd" rules={
      [
        {
          required: true,
          message: '请确认新密码',             
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('pwd') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入的新密码不匹配'));
          },
        }),
      ]}>
    <Ciptpd placeholder="请确认新密码"  />
    </Item>
  
  
  </Form>
 
      </CModal>

      <CModal  title="修改手机号码" mold="cust"  ref={mref} width="440px" closable onOk={monOk} >
      <Form
        form={mform}
        name="modalform"
        colon={false}
        initialValues={{
          name: name,
          mobile:  '',
        }}
        size="middle"
        labelCol={{ flex: "7em" }}
        labelAlign="left"
        preserve={false}
        requiredMark={false}
      >
    <Item
      label="账户名"
      name="name"
    >
      <Cipt disabled />
    </Item>
    <Item label="手机号" name="mobile"   rules={[
        {
          required: true,
          message: '请输入手机号码',             
        },
       {
            validator: phoneValidator
        }, 
     
      ]}>
      <Cipt placeholder="请输入手机号码"  />
    </Item>  
  </Form>
 
      </CModal>


      <CModal  nolf="no" title={<Space><img src={lg} title="" style={{verticalAlign: "-5px"}}  /> <span style={{color: "#515151"}}>语言切换</span></Space>} mold="cust"  ref={lref} width="440px"  onOk={lngOk} wrapClassName="wrap" >
      {Langes?.length > 0 ?  (<Radio.Group onChange={langChange} value={lngval} style={{display: 'flex', flexDirection: "column"}}>
         
          {
            Langes.map(l => (
              <Lngdiv>
                <img  src={imgurl[l.name]} /> <span>{l.text}</span> <Cradio value={l.name}></Cradio>
             </Lngdiv>
            ))
          }
          
          <div style={{height: "96px", borderBottom: "1px solid #d7d7d7"}} ></div>
        </Radio.Group>)
          : <Text type="warning">没有设置国际语言</Text>
        }
      </CModal>
    </Cdiv>
  );
}
