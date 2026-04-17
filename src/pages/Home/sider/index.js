import React, {useState, useEffect} from 'react'
import {MenuUnfoldOutlined,MenuFoldOutlined} from "@ant-design/icons"
import { useDispatch } from "react-redux";
import {Menu, Image,Button, theme} from 'antd'
import {useNavigate, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import styled, {css} from 'styled-components'
import {hextodec} from "@com/usehandler"
// import style from './style.module.less'
import Title from '../header/title'
import {  configState, siderDesignerMenus, siderRunMenus, getisDistribution, adaptation,  getPgTitle, themeColor} from "@redux/systemconfig";
 
import ShowSide from "@com/showsider"
import {Sdiv,Cmenu } from "./style"
//import svgs from './svgs'
import * as svgcom from './svgs'
import * as svgseted from './svgs/setting' 
 
const Micon = ({iconname}) => {
   const location = useLocation()
   let {primary} = location.state || {}   
    let normal=["camera","report","environment"]
    const Com = !normal.includes(iconname) ?   svgcom[primary+iconname] : svgcom[iconname]
    
    const Def = svgcom["def"]
   return   Com ?  <Com  className={iconname + " custicon "+primary}/> :   <Def className="def" ></Def>
  
}
const MiconSet = ({iconname}) => { // 设计态
  const location = useLocation()
  let {primary} = location.state || {}   
   let normal=["camera","report","environment"]   
   const Com = !normal.includes(iconname) ?   svgseted[primary+iconname] : svgseted[iconname]
   
   const Def = svgcom["def"]
  return   Com ?  <Com  className={iconname + " custicon "+primary}/> :   <Def className="def" ></Def>
 
}
 


/*   siderRunMenus: null, // 项目 sider
        siderDesignerMenus: null, // 设置 sider */

const mixkey =(itme,key)=>({...itme,key:key+"/"+itme.key,title:itme.label})
         
export default function Sider() {
  const navigate = useNavigate()
  const location = useLocation()
  const config = useSelector(configState)
  const siderRunMenu = useSelector(siderRunMenus)
  console.log(location)
  const siderDesignerMenu = useSelector(siderDesignerMenus)
  const {laptop} = useSelector(adaptation)
  const curtheme = useSelector(themeColor)
   
  const {asiderfontcolor="#fff", asiderfontcolorA="#33ff00"} = curtheme
  
  const rgb=hextodec(asiderfontcolor)??"#fff"
  
  const rgba=hextodec(asiderfontcolorA) ?? "#33ff00"
 
  const dispatch = useDispatch()
  
  const [key, Setkey] = useState('')
  const [menus, setMenus] = useState()

  const [path, setPath] = useState('')
  console.log("menus",menus)
/*   const Showimg = () => {
    let {primary} = location.state || {}   
    let imgsrc = config ? imgurl.config : imgurl[primary]
  
    return (
      <Imgbox>
      <Image  width={184}   src={imgsrc} preview={false} style={{outline: '1px solid #fff'}} fallback={imgurl.config} />
     
      </Imgbox>
     )
  } */

  useEffect(() => {
    try {
    
      let state = location.state || {}    
      
      let {nested, primary, title } = state;
      dispatch(getPgTitle(title))
    //  console.log(state,location)
      dispatch(getisDistribution(primary === 'runtimeDistribution'))
      setPath(primary)
      let sidermenu = config ? siderDesignerMenu[primary] : siderRunMenu[primary];
   //   let sidermenus = sidermenu?.map(({no, label, key,children=[]}) => config ? {no, label,key,title:label, children:children?.length>0 ? children.map(c=>mixkey(c,key)) : null, icon: <MiconSet iconname={key}  />} : {no, label,key,title:label, children:children?.length>0 ? children.map(c=>mixkey(c,key)) : null, icon: <Micon iconname={key}  />}) || [];   
    let sidermenus = sidermenu?.map(({no, label, key,children=[]}) => ({no, label,key,title:label,children:children?.length ? children : null,  icon: config ? <MiconSet iconname={key}  />  
      : <Micon iconname={key} />}) ) || [];       
     setMenus(sidermenus)
      Setkey(nested) 
    } catch (error) {
      console.log(error);
    }
  
  },[location, config, siderDesignerMenu,siderRunMenu])

  const onSelect = ({item,key,keyPath}) => {  
     let label =item?.props?.title??""
     let fragment = keyPath?.reverse().join?.("/")
     Setkey(key)
     let url;
     if (config) {
      url = `/config/${path}/` + fragment
     }else {
      url = `/index/${path}/` + fragment
     }
     let nested = key?.split?.("/")
    // dispatch(getPgTitle(label))
     navigate(url, {state: {title: label, nested: nested?.[1]??nested?.[0], primary: path}})
  }
  
  return (
    <Sdiv> 
       <Title/>
      {/*  <Showimg/>
       <ShowSide show={false} /> */}
       <div className='sidecontent'>
       <ShowSide   />
       <Cmenu laptop={laptop}  onClick={onSelect} selectedKeys={[key]} items={menus} mode="inline" rgb={rgb} rgba={rgba} path={path}></Cmenu>
       </div>
    </Sdiv>
  )
}
