import React from 'react'
import styled from 'styled-components'
import {Image} from 'antd'
import {useSelector} from 'react-redux'
import {selectCurProject} from '../../../redux/user'
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
    const project = useSelector(selectCurProject)  
    const {titleEn, titleCn, logoImageBase64, ThemeColor} = project 
   return (
    <Divlog>
        <Image rootClassName={style.custlog} preview={false} width={112} src={logoImageBase64 ? 'data:image/png;base64,' + logoImageBase64 : logo}></Image>
       {/*  <span >{titleCn || '正泰智慧能源服务平台'}</span> */}
        <span>正泰综合能源服务平台</span>
    </Divlog>
   )
  }