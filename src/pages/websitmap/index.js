import React, { useState,  useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
 
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next"
import styled from "styled-components";
 
 
 
 

 
 

import {   getJump, iszhCN, themeColor, adaptation} from "@redux/systemconfig"; 
import {hextodec} from "@com/usehandler"

import websitbig from './bg.jpg'
import * as svgcom  from "@pages/Home/header/icon"
import { message } from "antd";

const Mainbox = styled.div` 
  flex: 1;
  display: flex;
  flex-direction: column;
 // min-height: 780px;
//  min-width:1440px;
  overflow: auto;
 
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props=> props.theme.primaryColor};
    color:#fff;
    font-size: 32px;
    height: 64px;
  }
  .maincontent {
    background-image: url(${websitbig});
    background-repeat: no-repeat;
    background-size: cover;
    
    padding-top: 128px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(5,66px);
    row-gap: 66px;
    flex:1;
    padding: 128px 16px 16px 16px;
    grid-auto-flow: column;
    .item {
     display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 74px;
    overflow: hidden;
    height: 66px;
    color: ${props => props.theme.menusfontcolor || '#b2c1d1'}; 
    background-color: ${props => props.theme.menusbgcolor || '#003366'};
    border-radius: 6px;
  
    .custicon {
              g path:nth-of-type(1) {
                fill: ${props => props.theme.menusactivefontcolor || '#fff'}; 
              }
        }
    &:hover,&:active {
       background-color: rgba(${props => props.rgba[0]},${props => props.rgba[1]},${props => props.rgba[2]}, 0.2) ; 
       color:${props => props.theme.menusactivefontcolor || '#ffffff'}; 
       cursor: pointer;
       .custicon {
              g path:nth-of-type(1) {
                fill: ${props => props.theme.menusactivefontcolor || '#fff'}; 
              }
        }
    }
   
    }
    .item.end {
       justify-self: flex-end;
    }
  }
`;
  
 
const Micon = ({iconname}) => {   
    const Com = svgcom[iconname]
    const Def = svgcom["def"]
   return   Com ?  <Com  className={iconname + " custicon "}/> :   <Def className="def" ></Def>
  
}
 
export default function Index() {
  const navigate = useNavigate();
  const {menusactive} = useSelector(themeColor)
  const menusactiveoc = hextodec(menusactive)
 const items = [
   {
    label: "项目概述",
    key: "runtimeProject",
    icon:  <Micon iconname="runtimeProject" />
   },
   {
    label: "运行监控",
    key: "runtimeMonitor",
    icon:  <Micon iconname="runtimeMonitor" />,
    nested: "monitor",

   },
   {
    label: "电气安全",
    key: "runtimeSafe",
    icon:  <Micon iconname="runtimeSafe" />,
    nested: "summary",
   },
   {
    label: "配电管理",
    key: "runtimeDistribution",
    icon:  <Micon iconname="runtimeDistribution" />,
    nested: "monitor"
   },
   {
    label: "能源管理",
    key: "runtimeEnergy",
    icon:  <Micon iconname="runtimeEnergy" />,
    nested: "summary",
   },
   {
    label: "运维管理",
    key: "runtimeMaintenance",
    icon:  <Micon iconname="runtimeMaintenance" />,
    nested: "summary"
   },
   {
    label: "数字孪生",
    key: "digitalTwin",
    icon:  <Micon iconname="digitalTwin" />
   },
   {
    label: "远程控制",
    key: "runtimeMonitor",
    icon:  <Micon iconname="remote" />,
    nested:"remote",
   },
   {
    label: "视频监控",
    key: "runtimeMonitor",
    icon:  <Micon iconname="camera" />,
    nested: "camera"
   },
 ]
 
  const onjump = ({label,key, nested})=> {
    try {
      // if(key=="digitalTwin") return message.warning("开发中……")
      let  url = ['runtimeProject',"digitalTwin"].includes(key) ? `/index/${key}` : `/index/${key}/${nested}`;
      let  state = ['runtimeProject',"digitalTwin"].includes(key)  ?  {index: true, nested, title: label, primary: key} : {nested, title: label, primary: key}
        navigate(url, {state}) 
    } catch (error) {
      console.log(error)
    }
  
  }
  
  return ( 
      <Mainbox   rgba={menusactiveoc}>
         <div className="title">
          香炉山钨业公司综合能源管理平台
         </div>
      <div className="maincontent">
        {
          items.map((it, i)=> (<div className={i>4 ? "item end" : "item"} key={it.nested||it.key} onClick={()=>onjump(it)} >
            {it.icon}
            <span>{it.label}</span>
          </div>))
        }
      </div>

       
      </Mainbox>
     
  );
}
