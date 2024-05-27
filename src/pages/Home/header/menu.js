import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, useLocation, useResolvedPath} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Menu, Image } from "antd";
import './style.less'
import {getJump, runMenus, designerMenus, siderDesignerMenus, siderRunMenus, configState, configProject} from '@redux/systemconfig'
import useJump from "./useJump";
import imgurl from './icon/index.js'
 
const Ciocn = (props) => {
  const url = props.url || imgurl['0104H']
  return <Image src={url} width={36} preview={false} style={{height: '36px'}} /> 
}
export default function Hmenu() { 
  const dispath = useDispatch()
  const navigate = useNavigate()
  const {state} = useLocation()
  let path = useResolvedPath()
  let paths = path.pathname.slice(1).split('/')
 // const [current, SetCurrent] = useState(state.primary)

  const current = useMemo(() => state?.primary, [state])
  
  const isconfig = useSelector(configState)
  
  const  runmenus = useSelector(runMenus)
  const siderrunmenus = useSelector(siderRunMenus)
  const designermenus = useSelector(designerMenus)
  const siderdesignermenus = useSelector(siderDesignerMenus)
  //const [menus, setMenus] = useState([]) 
  useJump(current, isconfig)
  const run = runmenus?.map(item => ({
    no: item.no,
    label: item.label,
    key: item.key,
    icon: <Ciocn url={current == item.key ? imgurl[`${item.no}H`] : imgurl[`${item.no}N`]} />,
    className: 'custsubmenu',
    danger: true,
    nested: siderrunmenus[item.key]?.length > 0 ?  siderrunmenus[item.key][0]?.['key'] : ''
  }))
  const designer = designermenus?.map(item => ({
   no: item.no,
   label: item.label,
   key: item.key,
   icon: <Ciocn url={current == item.key ? imgurl[`${item.no}H`] : imgurl[`${item.no}N`]} />,
   className: 'custsubmenu',
   danger: true,
   nested: siderdesignermenus[item.key]?.length > 0 ?  siderdesignermenus[item.key][0]?.['key'] : ''
  }))
  const menus = isconfig ? designer : run


  const onSelect = ({key}) => {
    
     let item = menus.find(item => item?.key === key);   
      if (!item) return;
      const {nested, label, no} = item || {};  
     /*  if(key === 'designerProject' || key == 'runtimeProject' ) {
        dispath(getJump(true))
      }else {
        dispath(getJump(false))
      } */
   //   SetCurrent(key)  
      let url, state;
      if(isconfig) {
         url = no === '0202' ? `/config/${key}` : `/config/${key}/${nested}`
         state = key === 'designerProject' ? {primary: key, index: true, title: label} : {nested, title: label, primary: key}
      } else {
        url = key == 'runtimeProject' ? `/index/${key}` : `/index/${key}/${nested}`;
        state = key == 'runtimeProject'  ?  {index: true, nested, title: label, primary: key} : {nested, title: label, primary: key}
      }
    
      navigate(url, {state}) 
     
  }
 useEffect(() => {    
    if(state) {
      let {primary} = state
      dispath(getJump(['designerProject', 'runtimeProject'].includes(primary)))    
    } else {
       let url, state
       let primary = paths[1];
       let len = paths.length > 2;
       let nested = len ? paths[2] : ''
       let isdes = primary.slice(0, 8)=='designer' // 是否设计态
       dispath(configProject(isdes))
       if(isdes) {
          url =  primary =='designerProject' ? `/config/${primary}` : `/config/${primary}/${nested}`
          let title = len ? siderdesignermenus[primary]?.find(item => item.key ==nested)?.label : designermenus[primary]?.label || ''
          state = primary === 'designerProject' ? {primary, index: true, title} : {nested, title, primary}
       }else {
        url = primary == 'runtimeProject' ? `/index/${primary}` : `/index/${primary}/${nested}`;
        let title = len ? siderrunmenus[primary]?.find(item => item.key ==nested)?.label :  runmenus[primary]?.label || ''
        state = primary == 'runtimeProject'  ?  {index: true, nested, title, primary} : {nested, title, primary}
       }
      
       navigate(url, {state})
    }  
   },[state]) 

  return <Menu onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={menus} className="headrmenu" />;


}
