import React from 'react'
import styled from 'styled-components'
import {Image, Typography} from 'antd'
import {useSelector} from 'react-redux'

const {Text} = Typography
//import {selectCurProject} from '@redux/user'
import {systemConfigInfo, currProject} from '@redux/systemconfig'
import logo from '@imgs/logo.png'
import style from '../index.module.less'
const Divlog = styled.div` 
   height: 65px;
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
    const currproject = useSelector(currProject) || {}
    let projectLog = currproject.logoImage || currproject.imgLogo;
    let projectName = currproject.projectName || currproject.name
 
 
   return (
    <Divlog>
        <Image  height={32} width={180} preview={false}    src={projectLog || logo}></Image>
       {/*  <span >{titleCn || '正泰智慧能源服务平台'}</span> */}
        <Text ellipsis={{tooltip: projectName}} style={{maxWidth: "200px", fontSize: "16px", color: "#fff"}}>{projectName || '正泰综合能源服务平台'}</Text>
    </Divlog>
   )
  }