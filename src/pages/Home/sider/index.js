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
 

const Sdiv = styled.div`
    display: grid;
    grid-template-rows: 70px 1fr;
    row-gap: 10px;
    height: inherit;
    .sidecontent {
       display: grid;
       padding: 0 6px;
       grid-template-columns: 1fr;
       grid-template-rows: 24px 1fr;
       row-gap: 10px;
    }
    .btn {
      margin-left: 8px;
      justify-self: flex-start;
    }
`
const sty = css`
height: 28px;line-height: 28px; font-size: 12px;
`
const styopc = css`
  fill:  rgba(${props=> props.rgb[0]}, ${props=> props.rgb[1]}, ${props=> props.rgb[2]}, 0.7);
`
const styopca = css`
  fill:  rgba(${props=> props.rgba[0]}, ${props=> props.rgba[1]}, ${props=> props.rgba[2]}, 0.7);
`
const Cmenu = styled(Menu)`
   background: none;
   && {
    border-right: none;
   }
   &&  {
    overflow-y: auto;
    overflow-x: hidden;
   }
  
   .ant-menu-item {
     padding-left: 10px !important;
     display: flex;
     align-items: center;
     transition: padding 0.1s, width  0.3s cubic-bezier(.215,.61,.355,1);
     &::after{
      content: none;
     }
     ${props => props.laptop ? sty : ''}
    
   }
   .def{
     path {
      background-color: transparent;
     }
     
   }
   .custicon path:nth-of-type(1){
   ${styopc}
   }
   .custicon.PCSMonitor,
   .control.custicon.runtimeMonitor,
   .deviceLedger.custicon.ledger,
   .region.custicon.runtimeEnergy,
   .meterReading.custicon.cabinets
   {
    g path{
      ${styopc}
    }
   }
   .quality.custicon.runtimeDistribution{
    g{
      path {
        ${styopc}
      }
      path:last-of-type{
        fill:transparent
      }
    }
   }
   .summary.custicon.runtimeSolar,.propare.custicon.runtimeSolar{

        g {
          path:nth-of-type(1){
           fill: transparent;
          }
          path:nth-of-type(2){
          ${styopc}
        }
        }
      }
   .ant-menu-item.ant-menu-item-selected,.ant-menu-item:active{    
      border-radius: 6px;
      background-color:${props => props.theme.asiderbgcolorA || "#3333cc"} ;
      ${props => props.laptop ? sty : ''}     
      .ant-menu-title-content {
        color: ${props => props.theme.asiderfontcolorA || "#33FF00"};
      }
      .custicon path:nth-of-type(1) {
        ${styopca}
      }
      .custicon.PCSMonitor,.control.custicon.runtimeMonitor,.deviceLedger.custicon.ledger,.region.custicon.runtimeEnergy {
        g path{
          ${styopca}
        }
        
      }
      .summary.custicon.runtimeSolar,.propare.custicon.runtimeSolar{
        g { 
          path:nth-of-type(1){
           fill: transparent;
          }
          path:nth-of-type(2){
          ${styopca}
        }
        }
      }
      .quality.custicon.runtimeDistribution{
    g{
      path {
        ${styopca}
      }
      path:last-of-type{
        fill:transparent
      }
    }
   }
    }
   .ant-menu-title-content  {
     color: ${props => props.theme.asiderfontcolor || "#ffffff"};;
     display: inline-block;   
     padding-left: 10px;
     transition: padding 0.1s, width 0.3s cubic-bezier(.215,.61,.355,1);

     ${props => props.laptop ? sty : ''}
  
    
   }
   &.ant-menu-inline-collapsed {
     .ant-menu-title-content {
      opacity: 0;
      display: none;
     }
     .ant-menu-item {
       padding-left: 0px !important;
       padding-right: 0px !important;
       justify-content: center;
     }
   }
`
/*   siderRunMenus: null, // 项目 sider
        siderDesignerMenus: null, // 设置 sider */


        
export default function Sider() {
  const navigate = useNavigate()
  const location = useLocation()
  const config = useSelector(configState)
  const siderRunMenu = useSelector(siderRunMenus)
   
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
      let sidermenus = sidermenu?.map(({no, label, key}) => config ? {no, label,key, icon: <MiconSet iconname={key}  />} : {no, label,key, icon: <Micon iconname={key}  />}) || [];        
     setMenus(sidermenus)
      Setkey(nested) 
    } catch (error) {
      console.log(error);
    }
  
  },[location, config, siderDesignerMenu,siderRunMenu])

  const onSelect = ({key}) => {       
     let label = menus?.find(item => item.key == key)?.label
     Setkey(key)
     let url;
     if (config) {
      url = `/config/${path}/` + key
     }else {
      url = `/index/${path}/` + key
     }
    // dispatch(getPgTitle(label))
     navigate(url, {state: {title: label, nested: key, primary: path}})
  }

  return (
    <Sdiv> 
       <Title/>
      {/*  <Showimg/>
       <ShowSide show={false} /> */}
       <div className='sidecontent'>
       <ShowSide   />
       <Cmenu laptop={laptop} onClick={onSelect} selectedKeys={[key]} items={menus} mode="inline" rgb={rgb} rgba={rgba} path={path}></Cmenu>
       </div>
    </Sdiv>
  )
}
