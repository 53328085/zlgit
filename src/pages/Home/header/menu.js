import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
import { useStore } from "react-redux";
import { Menu, Image } from "antd";
import './style.less'
import {getrunMenus, designerMenus, siderRunMenus, siderDesignerMenus} from '@redux/systemconfig'
import imgurl from './icon/index.js'
const Ciocn = (props) => {
  const url = props.url || imgurl['01H']
  return <Image src={url} width={36} preview={false} style={{height: '36px'}} /> 
}
export default function Hmenu() {
  const store = useStore();
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [current, SetCurrent] = useState('index')  
  const isconfig = store.getState()?.system.configState
 
  let [config , SetConfig] = useState(isconfig)
  store.subscribe(() => {
    SetConfig(store.getState()?.system.configState)

  })
 const runMenus = store.getState()?.system.runMenus;
 const siderRunMenus = store.getState()?.system.siderRunMenus
 const designerMenus = store.getState()?.system.designerMenus;
 const siderDesignerMenus = store.getState()?.system.siderDesignerMenus;
 console.dir(siderRunMenus)
 const run = runMenus.map(item => ({
   label: item.label,
   key: item.key,
   icon: <Ciocn url={current == 'index' ? imgurl[`${item.no}H`] : imgurl[`${item.no}N`]} />,
   className: 'custsubmenu',
   danger: true,
   active: siderRunMenus[item.key]?.length > 0 ?  siderRunMenus[item.key][0]?.['route'] : null
 }))
 const designer = designerMenus.map(item => ({
  label: item.label,
  key: item.key,
  icon: <Ciocn url={current == 'index' ? imgurl[`${item.no}H`] : imgurl[`${item.no}N`]} />,
  className: 'custsubmenu',
  danger: true,
  active: siderDesignerMenus[item.key]?.length > 0 ?  siderDesignerMenus[item.key][0]?.['route'] : null
}))
 const menus =  config ? designer : run;
/*  const menus =  [
  config ?  {
      label: '公共模块',
      key: "module",
      icon: <Ciocn url={current == 'module' ? imgurl['00H'] : imgurl['00N']} />,
      className: 'custsubmenu',
      danger: true,
      active: 'project',
      title: '项目管理',      
    } : null,
    {
      label: '项目概述' ,
      key:  config ? "config" : "index",
      icon: <Ciocn url={current == 'index' ? imgurl['01H'] : imgurl['01N']} />,
      className: 'custsubmenu',
      danger: true,
      title: '项目概述',     
    },
    {
      label: '运行监控',
      key: "monitoring",
      icon: <Ciocn url={current == 'monitoring' ? imgurl['02H'] : imgurl['02N']} />,
      className: 'custsubmenu',
      danger: true,
      active: config ? 'deviceType' : 'outline',
      title: '运行概述',      
    },
    {
      label: "电气安全",
      key: "electric",
      icon: <Ciocn url={current == 'electric' ? imgurl['03H'] : imgurl['03N']} />,
      className: 'custsubmenu',
      danger: true,
      active: 'safe',
      title: '电气安全',      
    },
    {
        label: "配电管理",
        key: "distribution",
        icon: <Ciocn url={current == 'distribution' ? imgurl['04H'] : imgurl['04N']} />,
        className: 'custsubmenu',
        danger: true,
        active: 'summary',
        title: '配电概述',
    },
    {
        label: "结算收费",
        key: "prepayment",
        icon: <Ciocn url={current == 'prepayment' ? imgurl['05H'] : imgurl['05N']} />,
        className: 'custsubmenu',
        danger: true,
        active: 'summary',
        title: '配电概述',        
    },
    {
        label: "能源管理",
        key: "energy",
        icon: <Ciocn url={current == 'energy' ? imgurl['06H'] : imgurl['06N']} />,
        className: 'custsubmenu',
        danger: true,
        active: 'summary',
        title: '能源概述',
    },
    {
        label: "光伏发电",
        key: "photovoltaic",
        icon: <Ciocn url={current == 'photovoltaic' ? imgurl['07H'] : imgurl['07N']} />,
        className: 'custsubmenu',
        danger: true,
        active: 'summary',
        title: '概述',
    },
    {
      label: "储能管理",
      key: "storage",
      icon: <Ciocn url={current == 'storage' ? imgurl['11H'] : imgurl['11N']} />,
      className: 'custsubmenu',
      danger: true,
      active: 'summary',
      title: '概述',
    },
    {
        label: "碳排管理",
        key: "carbon",
        icon: <Ciocn url={current == 'carbon' ? imgurl['08H'] : imgurl['08N']} />,
        className: 'custsubmenu',
        danger: true,
        active: 'monitor',
        title: '运行监控',
    },

    {
      label: "运维管理",
      key: "devops",
      icon: <Ciocn url={current == 'devops' ? imgurl['09H'] : imgurl['09N']} />,
      className: 'custsubmenu',
      danger: true,
      active: 'summary',
      title: '运维管理',
   },
    
   ]   */
  
  const onSelect = ({key}) => {
      console.log(key)
      let item = menus.find(item => item?.key === key);
      if (!item) return;
      const {active, title} = item || {};  
     
      SetCurrent(key)  
      let url, state;
      if(config) {
         url = key === 'config' ? '/config/summary' : `/config/${key}/${active}`
         state = key === 'config' ? {path: key, index: true,title} : {selectedKeys: active, title, path:key}
      } else {
        url = key === 'index' ? '/index' : `/index/${key}/${active}`
        state = key === 'index' ? {path: key, index: true,title} : {selectedKeys: active, title, path:key}
      }
      
      navigate(url, {state})
     
  }
  useEffect(() => {    
      SetCurrent(location.state?.path)       
   },[location.pathname])
 return <Menu onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={menus} className="headrmenu" />;


}
