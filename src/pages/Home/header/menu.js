import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, useLocation} from 'react-router-dom'
import { useStore } from "react-redux";
import { Menu, Image } from "antd";
import './style.less'
//import {getrunMenus, designerMenus, siderRunMenus, siderDesignerMenus} from '@redux/systemconfig'
import imgurl from './icon/index.js'
const Ciocn = (props) => {
  const url = props.url || imgurl['01H']
  return <Image src={url} width={36} preview={false} style={{height: '36px'}} /> 
}
export default function Hmenu() {
  const store = useStore();
  const navigate = useNavigate()
  const location = useLocation()
  const [current, SetCurrent] = useState('index')  
  const isconfig = store.getState()?.system.configState
  const Menus   = store.getState()?.system.menus;

  const {runMenus, siderRunMenus, designerMenus, siderDesignerMenus} = Menus;
  let [config , SetConfig] = useState(isconfig)
  let [runmenus, setRunMenus] = useState(runMenus)
  let [siderrunmenus, setSiderRunMenus] = useState(siderRunMenus)
  let [designermenus, setDesignerMenus] = useState(designerMenus)
  let [siderdesignermenus, setSiderDesignerMenus] = useState(siderDesignerMenus)
  let [menus, setMenus] = useState([]);
  store.subscribe(() => {
    SetConfig(store.getState()?.system.configState)
    const {runMenus, siderRunMenus, designerMenus, siderDesignerMenus}   = store.getState()?.system.menus;   
     setRunMenus(runMenus)
     setSiderRunMenus(siderRunMenus)
     setDesignerMenus(designerMenus)
     setSiderDesignerMenus(siderDesignerMenus)
  })
useEffect(() => {
  const run = runmenus?.map(item => ({
    no: item.no,
    label: item.label,
    key: item.key,
    icon: <Ciocn url={current == 'index' ? imgurl[`${item.no}H`] : imgurl[`${item.no}N`]} />,
    className: 'custsubmenu',
    danger: true,
    nested: siderrunmenus[item.key]?.length > 0 ?  siderrunmenus[item.key][0]?.['key'] : null
  }))
  const designer = designermenus?.map(item => ({
   no: item.no,
   label: item.label,
   key: item.key,
   icon: <Ciocn url={current == 'config' ? imgurl[`${item.no}H`] : imgurl[`${item.no}N`]} />,
   className: 'custsubmenu',
   danger: true,
   nested: siderdesignermenus[item.key]?.length > 0 ?  siderdesignermenus[item.key][0]?.['key'] : null
  }))
  setMenus(config ? designer : run)
  console.log()
}, [config, runmenus, siderrunmenus])


  
  const onSelect = ({   key, keyPath, domEvent }) => {
      console.log(key);
      console.log(keyPath)

    
     let item = menus.find(item => item?.key === key);
      if (!item) return;
      const {nested, label, no} = item || {};  
     
      SetCurrent(key)  
      let url, state;
      if(config) {
         url = no === '0202' ? `/config/${key}` : `/config/${key}/${nested}`
         state = key === 'designerProject' ? {primary: key, index: true, title: label} : {nested, title: label, primary: key}
      } else {
        url = key == 'runtimeProject' ? `/index/${key}` : `/index/${key}/${nested}`;
        state =  {nested, title: label, primary: key}
      }
      
      navigate(url, {state}) 
     
  }
  useEffect(() => {    
      SetCurrent(location.state?.primary)       
   },[location.pathname])
 return <Menu onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={menus} className="headrmenu" />;


}
