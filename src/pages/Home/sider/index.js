import React, {useState, useEffect} from 'react'
import {MenuUnfoldOutlined,MenuFoldOutlined} from "@ant-design/icons"
import { useDispatch } from "react-redux";
import {Menu, Image,Button} from 'antd'
import {useNavigate, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import styled, {css} from 'styled-components'

// import style from './style.module.less'
import Title from '../header/title'
import {  configState, siderDesignerMenus, siderRunMenus, getisDistribution, adaptation,  getPgTitle} from "@redux/systemconfig";
 
import ShowSide from "@com/showsider"
//import svgs from './svgs'
import * as svgcom from './svgs'
 
 
const Micon = ({iconname}) => {
   const location = useLocation()
   let {primary} = location.state || {}   
    const Com =  svgcom[iconname] 
   return   Com ?  <Com  className={iconname + " custicon "+primary}/> : null
  // return <span className="custicon">&#9673;</span>
}
const Imgbox = styled.div`
    height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .ant-image {
      padding-bottom: 16px;
    //  border-bottom: 1px dotted #fff;
      .ant-image-img {
        height: 114px;
      }
    }
`

/* const Sdiv = styled.div`
   display: flex;
   flex-direction: column;
   padding-top:16px;
` */

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
     &::after{
      content: none;
     }
     ${props => props.laptop ? sty : ''}
    
   }
   .custicon path:nth-of-type(1){
    fill:  ${props => props.theme.asiderfontcolor || "#ffffff"};
   }
   .custicon.PCSMonitor,.control.custicon.runtimeMonitor {
    g path{
      fill:  ${props => props.theme.asiderfontcolor || "#ffffff"};
    }
   }
   .ant-menu-item.ant-menu-item-selected{    
      border-radius: 6px;
      background-color:${props => props.theme.asiderbgcolorA || "#3333cc"} ;
      ${props => props.laptop ? sty : ''}     
      .ant-menu-title-content {
        color: ${props => props.theme.asiderfontcolorA || "#33FF00"};
      }
      .custicon path:nth-of-type(1) {
        fill: ${props => props.theme.asiderfontcolorA || "#33FF00"};
      }
      .custicon.PCSMonitor,.control.custicon.runtimeMonitor {
        g path{
          fill:  ${props => props.theme.asiderfontcolorA || "#ffffff"};
        }
        
      }
      
    }
   .ant-menu-title-content  {
     color: ${props => props.theme.asiderfontcolor || "#ffffff"};;
     display: inline-block;   
     padding-left: 10px;
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
  console.log(siderRunMenu)
  const siderDesignerMenu = useSelector(siderDesignerMenus)
  const {laptop} = useSelector(adaptation)
 
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
      console.log(state)
      let {nested, primary, title } = state;
      dispatch(getPgTitle(title))
    //  console.log(state,location)
      dispatch(getisDistribution(primary === 'runtimeDistribution'))
      setPath(primary)
      let sidermenu = config ? siderDesignerMenu[primary] : siderRunMenu[primary];
      let sidermenus = sidermenu?.map(({no, label, key}) => ({no, label,key, icon: <Micon iconname={key} />})) || []; 
       console.dir(sidermenu)
     // console.log(nested,sidermenus)    
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
       <Cmenu laptop={laptop} onClick={onSelect} selectedKeys={[key]} items={menus} mode="inline" path={path}></Cmenu>
       </div>
    </Sdiv>
  )
}
