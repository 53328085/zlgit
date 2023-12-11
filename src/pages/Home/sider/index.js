import React, {useState, useEffect} from 'react'
import { useDispatch } from "react-redux";
import {Menu, Image} from 'antd'
import {useNavigate, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import style from './style.module.less'
import Title from '../header/title'
import {  configState, siderDesignerMenus, siderRunMenus, getisDistribution} from "@redux/systemconfig";
import imgurl from './icon';
 
const Micon = () => {
   return <span className="custicon">&#9673;</span>
}
const Imgbox = styled.div`
    height: 158px;
    display: flex;
    justify-content: center;
    align-items: center;
    .ant-image {
      padding-bottom: 16px;
      border-bottom: 1px dotted #fff;
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
    grid-template-rows: 64px 158px 1fr;
    height: inherit;
`
const Cmenu = styled(Menu)`
   background: none;
   && {
    border-right: none;
   }
   &&  {
    overflow-y: auto;
   }
   .ant-menu-item {
     padding-left: 32px;
     display: flex;
     align-items: center;
   }
   .custicon {
    font-size: 16px;
    color:#fff;
   }
   .ant-menu-item.ant-menu-item-selected{    
      background-color: #3333cc;
      .ant-menu-title-content, .custicon {
        color:#33FF00;
      }
    }
   .ant-menu-title-content {
     color:#fff;
     display: inline-block;   
     padding-left: 32px;
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
  const dispatch = useDispatch()
  
  const [key, Setkey] = useState('')
  const [menus, setMenus] = useState()

  const [path, setPath] = useState('')

  const Showimg = () => {
    let {primary} = location.state || {}   
    let imgsrc = config ? imgurl.config : imgurl[primary]
    return (
      <Imgbox>  <Image  width={184}   src={imgsrc} preview={false} style={{outline: '1px solid #fff'}} fallback={imgurl.config} /></Imgbox>
     )
  }

  useEffect(() => {  
    try {
    
      let state = location.state || {}    
      let {nested, primary } = state;
    //  console.log(state,location)
      dispatch(getisDistribution(primary === 'runtimeDistribution'))
      setPath(primary)
      let sidermenu = config ? siderDesignerMenu[primary] : siderRunMenu[primary];
      let sidermenus = sidermenu?.map(({no, label, key}) => ({no, label,key, icon: <Micon/>})) || []; 
     // console.log(nested,sidermenus)    
      setMenus(sidermenus)
      Setkey(nested) 
    } catch (error) {
      console.log(error);
    }
  
  },[location, config])

  const onSelect = ({key}) => {       
     let label = menus?.find(item => item.key == key)?.label
     Setkey(key)
     let url;
     if (config) {
      url = `/config/${path}/` + key
     }else {
      url = `/index/${path}/` + key
     }
     
     navigate(url, {state: {title: label, nested: key, primary: path}})
  }

  return (
    <Sdiv> 
       <Title/>
       <Showimg/>
       <Cmenu  onClick={onSelect} selectedKeys={[key]} items={menus} className={style.custmenu}></Cmenu>
    </Sdiv>
  )
}
