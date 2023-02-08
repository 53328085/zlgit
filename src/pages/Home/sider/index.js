import React, {useState, useEffect} from 'react'
import { useStore } from "react-redux";
import {Menu, Image} from 'antd'
import {useNavigate, useLocation} from 'react-router-dom'
import styled from 'styled-components'
import {monitoring, energy, devops, electric, distribution, prepayment, photovoltaic, carbon, module} from './menus'
import {monitoringConf} from './configuremenus'
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
  store.subscribe(() => {    
    SetConfig(store.getState()?.system.configState)
     
  })


  useEffect(() => {  
    let state = location.state || {}
    console.log(state)
    let {selectedKeys, key} = state;
    setPath(key)
    config ? setMenus(siderDesignerMenus[key]) : setMenus(siderRunMenus[key])
    Setkey(selectedKeys) 
  },[location.pathname])

  const onSelect = (item) => {      
     console.log(item)
     let {key} = item;
     let label = menus[key]?.find(item => item.key == key)?.label
     Setkey(key)
     let url;
     if (config) {
      url = `/config/${path}/` + key
     }else {
      url = `/index/${path}/` + key
     }
      
     navigate(url, {state: {title: label, selectedKeys: key, key: path}})
  }

  return (
    <Sdiv> 
       <Title/>
       <Showimg/>
       <Cmenu  onClick={onSelect} selectedKeys={[key]} items={menus} className={style.custmenu}></Cmenu>
    </Sdiv>
  )
}
