import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, useLocation} from 'react-router-dom'
import { Menu } from "antd";
import './style.less'
import { 
  SettingOutlined,
} from "@ant-design/icons";

export default function Hmenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const menus = [
    {
      label: '首页' ,
      key: "/",
      icon: <SettingOutlined />,
      className: 'custsubmenu',
      danger: true,
      title: '首页'
    },
    {
      label: '运行监控',
      key: "/monitoring/outline",
      icon: <SettingOutlined />,
      className: 'custsubmenu',
      danger: true,
      active: 'outline',
      title: '运行概述'
    },
    {
      label: "电气安全",
      key: "safety",
      icon: <SettingOutlined />,
      className: 'custsubmenu'
    },
    {
        label: "配电管理",
        key: "distribution",
        icon: <SettingOutlined />,
        className: 'custsubmenu'
    },
    {
        label: "预付费",
        key: "replay",
        icon: <SettingOutlined />,
        className: 'custsubmenu'
    },
    {
        label: "能源管理",
        key: "energy",
        icon: <SettingOutlined />,
        className: 'custsubmenu'
    },
    {
        label: "光伏发电",
        key: "photovoltaic",
        icon: <SettingOutlined />,
        className: 'custsubmenu'
    },
    {
        label: "碳排管理",
        key: "CO2",
        icon: <SettingOutlined />,
        className: 'custsubmenu'
    },
    {
        label: "运维管理",
        key: "OPS",
        icon: <SettingOutlined />,
        className: 'custsubmenu'
    },
    {
        label: "后台管理",
        key: "adimin",
        icon: <SettingOutlined />,
        className: 'custsubmenu'
    }]
  const [current, SetCurrent] = useState('/index')  
  const onSelect = (e) => {
      let key = e.key
      SetCurrent(key) 
      const {active, title} = menus.find(item => item.key === key)    
      let state = key === '/' ? {headerKeys: key, index: true,title} : {headerKeys: key, selectedKeys: active, title}
      navigate(key, {state})
     
  }
  useEffect(() => {
    SetCurrent(location.state?.headerKeys)
   },[location])
 return <Menu onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={menus} className='headrmenu' />;


}
