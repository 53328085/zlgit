import React, {useState, useEffect} from 'react'
import { useStore } from "react-redux";
import {Menu, Image} from 'antd'
import {useNavigate, useLocation} from 'react-router-dom'
import styled from 'styled-components'
import style from './style.module.less'
import Title from '../header/title'
import energyicon from '@imgs/energy.png'
const Imgbox = styled.div`
   padding: 20px 0 16px 0;
   border-bottom: 1px dotted #ffff;
   margin: 0 8px 20px 8px;
`
const Showimg = () => {
  return (
    <Imgbox>  <Image src={energyicon} preview={false} style={{border: '1px solid #fff'}} /></Imgbox>
   )
}
const Sdiv = styled.div`
   display: flex;
   flex-direction: column;
   padding-top:16px;
`
const Cmenu = styled(Menu)`
   background: none;
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
  const store = useStore();
  const navigate = useNavigate()
  const location = useLocation()
  const isconfig = store.getState()?.system.configState
  const {siderRunMenus, siderDesignerMenus } =  store.getState()?.system.menus
  let [config , SetConfig] = useState(isconfig)
  const [key, Setkey] = useState('')
  const [menus, setMenus] = useState()

  const [path, setPath] = useState('')
  const unsubscribe = store.subscribe(() => {    
    SetConfig(store.getState()?.system.configState)
  })


  useEffect(() => {  
    try {
      SetConfig(store.getState()?.system.configState)
      let state = location.state || {}
      console.log(state)
      let {nested, primary } = state;
      setPath(primary)
      let sidermenu = config ? siderDesignerMenus[primary] : siderRunMenus[primary];
      let sidermenus = sidermenu?.map(({no, label, key}) => ({no, label,key})) || [];
      setMenus(sidermenus)
      Setkey(nested) 
    } catch (error) {
      console.log(error);
    }
   return () => {
    unsubscribe();
   }
  },[location.pathname, config])

  const onSelect = ({key}) => {   
     let label = menus[key]?.find(item => item.key == key)?.label
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
