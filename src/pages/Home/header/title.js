import React from 'react'
import styled from 'styled-components'
import {Image, Typography} from 'antd'
import {useSelector} from 'react-redux'
import {  useLocation } from 'react-router-dom'
const {Text} = Typography
//import {selectCurProject} from '@redux/user'
import {collapsed, currProject} from '@redux/systemconfig'
import logo from '@imgs/czt.png'

const Divlog = styled.div` 
   height: 70px;
   display: flex;
   flex-direction: column;
   justify-content: space-evenly;
   align-items: center;
   span {
     font-size: 16px;
     line-height: 1;
     color:#fff;
   }

`
export default function  Title (){
   // const project = useSelector(selectCurProject)  
  //  const { logoImageBase64} = project 
   // const {chineseTitle} = useSelector(systemConfigInfo)
    const Currproject = useSelector(currProject) || {};
    const location = useLocation();
    const overview = (location?.state?.primary=="runtimeProject") || (location?.state?.primary=="designerProject");

    let projectLog = Currproject.logoImage;
    let smallLog = Currproject.smallLogoImage
   console.log("Currproject" ,Currproject)
    let Collapsed = useSelector(collapsed) 
   if (Collapsed && !overview) {
     return   smallLog   ?  <img  height={70}  width={54 }   src={smallLog }></img> : <div  style={{height:70}}></div> 
   }else {
      return    projectLog ? <img  height={70}  width={200 }   src={projectLog }></img> :  <div   style={{height:70, width:200}}></div> 
   }
 
  }