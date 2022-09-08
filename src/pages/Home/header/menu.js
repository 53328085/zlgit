import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, useLocation} from 'react-router-dom'
import { Menu, Image } from "antd";
import './style.less'
//import imgurl from './icon/index.js'
import h01 from './icon/01H.png'
import n01 from './icon/01N.png'
import h02 from './icon/02H.png'
import n02 from './icon/02N.png'
import h03 from './icon/03H.png'
import n03 from './icon/03N.png'
import h04 from './icon/04H.png'
import n04 from './icon/04N.png'
import h05 from './icon/05H.png'
import n05 from './icon/05N.png'
import h06 from './icon/06H.png'
import n06 from './icon/06N.png'
import h07 from './icon/07H.png'
import n07 from './icon/07N.png'
import h08 from './icon/08H.png'
import n08 from './icon/08N.png'
import h09 from './icon/09H.png'
import n09 from './icon/09N.png'
import h10 from './icon/10H.png'
import n10 from './icon/10N.png'
import { 
  SettingOutlined,
} from "@ant-design/icons";
//console.log(imgurl)
const Ciocn = (props) => {
  const url = props.url || h01
  return <Image src={url} width={36} preview={false} style={{height: '36px'}} /> 
}
export default function Hmenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const [current, SetCurrent] = useState('/index')  
  const menus = [
    {
      label: '首页' ,
      key: "/index",
      icon: <Ciocn url={current == '/index' ? h01 : n01} />,
      className: 'custsubmenu',
      danger: true,
      title: '首页'
    },
    {
      label: '运行监控',
      key: "/index/monitoring/outline",
      icon: <Ciocn url={current == '/index' ? h02 : n02} />,
      className: 'custsubmenu',
      danger: true,
      active: 'outline',
      title: '运行概述',
      path: 'monitoring'
    },
    {
      label: "电气安全",
      key: "safety",
      icon: <Ciocn url={current == '/index' ? h03 : n03} />,
      className: 'custsubmenu'
    },
    {
        label: "配电管理",
        key: "distribution",
        icon: <Ciocn url={current == '/index' ? h04 : n04} />,
        className: 'custsubmenu'
    },
    {
        label: "预付费",
        key: "replay",
        icon: <Ciocn url={current == '/index' ? h05 : n05} />,
        className: 'custsubmenu'
    },
    {
        label: "能源管理",
        key: "/index/energy/summary",
        icon: <Ciocn url={current == '/index' ? h06 : n06} />,
        className: 'custsubmenu',
        danger: true,
        active: 'summary',
        title: '能源概述',
        path: 'energy'
    },
    {
        label: "光伏发电",
        key: "photovoltaic",
        icon: <Ciocn url={current == '/index' ? h07 : n07} />,
        className: 'custsubmenu'
    },
    {
        label: "碳排管理",
        key: "CO2",
        icon: <Ciocn url={current == '/index' ? h08 : n08} />,
        className: 'custsubmenu'
    },
    {
        label: "运维管理",
        key: "OPS",
        icon: <Ciocn url={current == '/index' ? h09 : n09} />,
        className: 'custsubmenu'
    },
    {
        label: "后台管理",
        key: "adimin",
        icon: <Ciocn url={current == '/index' ? h10 : n10} />,
        className: 'custsubmenu'
    }] 
  const onSelect = (e) => {
      let key = e.key
      SetCurrent(key) 
      const {active, title, path} = menus.find(item => item.key === key)    
      let state = key === '/index' ? {headerKeys: key, index: true,title} : {headerKeys: key, selectedKeys: active, title, path}
      navigate(key, {state})
     
  }
  useEffect(() => {
    SetCurrent(location.state?.headerKeys)
   },[location])
 return <Menu onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={menus} className="headrmenu" />;


}
