import React from 'react'
import styled from 'styled-components'
import {Image, Typography} from 'antd'
import {useSelector} from 'react-redux'

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
    const currproject = useSelector(currProject) || {}
    let projectLog = currproject.logoImage;
    let Collapsed = useSelector(collapsed)
    console.log("Collapsed", Collapsed)
 
   return (
        <img  height={70}  width={Collapsed ? 54 : 200 }   src={projectLog || logo}></img>
   )
  }