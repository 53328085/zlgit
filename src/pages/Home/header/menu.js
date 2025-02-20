import React, {useState, useMemo, useEffect} from "react";
import {useNavigate, useLocation, useResolvedPath} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Menu, Image } from "antd";
import styled, {css} from "styled-components";
//import './style.less'
import {getJump, runMenus,themeColor, designerMenus, siderDesignerMenus, siderRunMenus, configState, configProject,adaptation} from '@redux/systemconfig'
import useJump from "./useJump";
//import imgurl from './icon/index.js'
import svgurl from './icon/svg'
import {hextodec} from '@com/usehandler'
 
const msty =css`
font-size: 12px;
    display: flex;
     column-gap: 2px;;
    .ant-menu-item{
        width: auto;
        padding: 4px 2px;
        .logo {
            height: 28px;
            width: 28px;
            line-height: 28px;
            overflow: hidden;
            .shadow {
              transform: translateX(-28px);
              filter: drop-shadow(28px 0 0  ${props => props.theme.menusfontcolor || '#b2c1d1'})
            }
           
        }
        &:hover, &:active {
          .logo {
              height: 28px;
              width: 28px;
              line-height: 28px;
              overflow: hidden;
              .shadow {
              transform: translateX(-28px);
              filter: drop-shadow(28px 0 0  ${props => props.theme.menusactivefontcolor || '#ffffff'});
            }
        }
    }
    }
    .ant-menu-item.ant-menu-item-selected {
        background-color: ${props => props.theme.menusactive || '#1c62b6'};
      //  border-bottom: 2px solid ${props => props.theme.menusborder || '#00ff66'};  //去掉下划线 陈舒映
        color:${props => props.theme.menusactivefontcolor || '#ffffff'};
        border-radius: 6px;
        .logo {
              height: 28px;
              width: 28px;
              line-height: 28px;
              overflow: hidden;
              .shadow {
              transform: translateX(-28px);
              filter: drop-shadow(28px 0 0  ${props => props.theme.menusactivefontcolor || '#ffffff'});
            }
           
        }
    }

`
const Cmenu = styled(Menu)`
&&{
   //background-color: transparent;
   background-color: ${props => props.theme.menusbgcolor || '#003366'};
    border-bottom: none;
    overflow: hidden;
    padding: 2px 0 2px 16px;
    height: inherit;
    display: flex;
    column-gap: 4px;
    .ant-menu-item.ant-menu-item-selected {
        background-color: rgba(${props => props.rgba[0]},${props => props.rgba[1]},${props => props.rgba[2]}, 0.2) ;
      //  border-bottom: 2px solid ${props => props.theme.menusborder || '#00ff66'};
        color:${props => props.theme.menusactivefontcolor || '#ffffff'};
        border-radius: 6px;
        .logo {
              height: 36px;
              width: 36px;
              line-height: 36px;
              overflow: hidden;
              .shadow {
              transform: translateX(-36px);
              filter: drop-shadow(36px 0 0  ${props => props.theme.menusactivefontcolor || '#ffffff'});
            }
           
        }
    }
    .ant-menu-item{
        display: flex;
        flex-direction: column;
        justify-content:space-evenly;
        align-items: center;
       // width: 100px;
        flex: 0 1 74px;
        overflow: hidden; // 英语状态下可能会撑开
      //  padding: 4px 0; 
        height: 66px;
        color: ${props => props.theme.menusfontcolor || '#b2c1d1'}; 
        .logo {
            height: 36px;
            width: 36px;
            line-height: 36px;
            overflow: hidden;
            .shadow {
              transform: translateX(-36px);
              filter: drop-shadow(36px 0 0  ${props => props.theme.menusfontcolor || '#b2c1d1'});
            }
            
        }
        &::after {
            right: 0px;
            left: 0px;
            border-bottom: none;
        }
   
        &:hover, &:active {
            background-color:  rgba(${props => props.rgba[0]},${props => props.rgba[1]},${props => props.rgba[2]}, 0.2) ; //${props => props.theme.menusactive || '#1c62b6'} ;
            color:${props => props.theme.menusactivefontcolor || '#ffffff'};
          //  border-bottom: 2px solid  ${props => props.theme.menusborder || '#00ff66'};
            bottom: 0px;
            border-radius: 6px;
            border-bottom: none;
            .logo {
              height: 36px;
              width: 36px;
              line-height: 36px;
            overflow: hidden;
              .shadow {
              transform: translateX(-36px);
              filter: drop-shadow(36px 0 0  ${props => props.theme.menusactivefontcolor || '#ffffff'});
            }
           
        }
        &::after{
          content: none;
        }
        }
    .ant-menu-title-content {
        margin-left: 0px;
        line-height: 1;
        text-align: center;
        a {
            color: #ffffff;
        }
    }
  }
  ${props => props.laptop ? msty : ''}

}
`
/* const Ciocn = (props) => {
  const url = props.url || imgurl['0104H']
  return <Image src={url}  preview={false} style={{height: '100%', width: "100%"}} /> 
} */
const Ciocn = (props) => {
  const url = props.url || svgurl['0104']
  return <div className="logo"><img src={url}  className="shadow" style={{height: '100%', width: "100%"}} /></div> 
}
export default function Hmenu() { 
  const dispath = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const {state} = location

 
 
  
  
 // const [current, SetCurrent] = useState(state.primary)

  const current = useMemo(() => state?.primary, [state])
  
  const isconfig = useSelector(configState)
  const {laptop} =useSelector(adaptation) ||{}
  const {menusactive} = useSelector(themeColor)
  const menusactiveoc = hextodec(menusactive)
  //console.log("menusactiveoc",menusactiveoc)
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
    icon: <Ciocn url={svgurl[item.no]} />,
    className: 'custsubmenu',
    danger: true,
    nested: siderrunmenus[item.key]?.length > 0 ?  siderrunmenus[item.key][0]?.['key'] : ''
  }))
  const designer = designermenus?.map(item => ({
   no: item.no,
   label: item.label,
   key: item.key,
   icon: <Ciocn url={svgurl[item.no]} />,
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
    const {state, pathname} = location

    const paths = pathname.slice(1).split('/')
   
    let isdes = paths?.[0]=='config'; // 是否设计态
    dispath(configProject(isdes))
    if(state) {
    
      let {primary, jumpath, substate} = state
      dispath(getJump(['designerProject', 'runtimeProject'].includes(primary)))    
      if(jumpath && substate) {
        navigate(jumpath, {state:substate})
      }

    } else {
       let url, state
       let primary = paths[1];
       let len = paths.length > 2;
       let nested = len ? paths[2] : ''
    
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
   },[location]) 

  return <Cmenu laptop={laptop} onClick={onSelect} selectedKeys={[current]} mode="horizontal" items={menus} rgba={menusactiveoc}   />;


}
