import React from 'react'
import styled from 'styled-components'
import {Image, Typography} from 'antd'
import {useSelector} from 'react-redux'
import {  useLocation } from 'react-router-dom'
const {Text} = Typography
//import {selectCurProject} from '@redux/user'
import {collapsed, currProject} from '@redux/systemconfig'
import logo from '@imgs/czt.png'

const Smllog = styled.div` 
    width: 54px;
    height: 70px;
   
   
  //  background-color: ${props => props.theme.logBgColor};

`
const Biglog = styled.div` 
    width: 200px;
    height: 70px;
    background-color: ${props => props.overview ? props.theme.logBgColor : ""};
    overflow: hidden;
    transform: translateY(-1px);
    

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
   
    let Collapsed = useSelector(collapsed) 
    let swtich = (Collapsed && !overview)
  if (Collapsed && !overview) {
     return   <Smllog>{smallLog && <img  height={70}  width={54 }   src={smallLog }></img> }</Smllog>
   }else {
      return   <Biglog overview={overview}>{projectLog && <img  height={70}  width={200 }   src={projectLog }></img>}</Biglog>
   }  
  
  }
