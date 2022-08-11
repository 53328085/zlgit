import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, NavLink} from 'react-router-dom'
import { Menu } from "antd";
import './style.less'
import { 
  SettingOutlined,
} from "@ant-design/icons";

export default function Hmenu() {
  const navigate = useNavigate()
  const menus = [
    {
      label: '首页' ,
      key: "/index",
      icon: <SettingOutlined />,
      className: 'custsubmenu',
      danger: true
    },
    {
      label: '运行监控',
      key: "/index/monitoring",
      icon: <SettingOutlined />,
      className: 'custsubmenu',
      danger: true
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
      SetCurrent(e.key)
      navigate(e.key)
  }

 return <Menu onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={menus} className='headrmenu' />;


}
