import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
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


 // const runMenus = store.getState()?.system.menus?.runMenus;
 //const siderRunMenus = store.getState()?.system.menus?.siderRunMenus
 //const designerMenus = store.getState()?.system.menus?.designerMenus;
 // const siderDesignerMenus = store.getState()?.system.menus?.siderDesignerMenus;
useEffect(() => {
  const run = runmenus?.map(item => ({
    label: item.label,
    key: item.key,
    icon: <Ciocn url={current == 'index' ? imgurl[`${item.no}H`] : imgurl[`${item.no}N`]} />,
    className: 'custsubmenu',
    danger: true,
    active: siderrunmenus[item.key]?.length > 0 ?  siderrunmenus[item.key][0]?.['key'] : null
  }))
  const designer = designermenus?.map(item => ({
   label: item.label,
   key: item.key,
   icon: <Ciocn url={current == 'index' ? imgurl[`${item.no}H`] : imgurl[`${item.no}N`]} />,
   className: 'custsubmenu',
   danger: true,
   active: siderdesignermenus[item.key]?.length > 0 ?  siderdesignermenus[item.key][0]?.['key'] : null
  }))
  setMenus(config ? designer : run)
}, [config, runmenus, siderrunmenus])


  
  const onSelect = ({key}) => {
      console.log(key)
      let item = menus.find(item => item?.key === key);
      if (!item) return;
      const {active, label} = item || {};  
     
      SetCurrent(key)  
      let url, state;
      if(config) {
         url = key === 'config' ? '/config/summary' : `/config/${key}/${active}`
         state = key === 'config' ? {path: key, index: true,label} : {selectedKeys: active, label, path:key}
      } else {
        url = key == 'runtimeProject' ? `/index/${key}` : `/index/${key}/${active}`;
        state =  {selectedKeys: active, label, key}
      }
      
      navigate(url, {state})
     
  }
  useEffect(() => {    
      SetCurrent(location.state?.path)       
   },[location.pathname])
 return <Menu onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={menus} className="headrmenu" />;


}
