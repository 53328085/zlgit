import React, {useState, useEffect} from 'react'
import {Space, Image} from 'antd'

import {useSelector} from 'react-redux'
import {selectCurProject} from '../../../redux/user'
import logo from '@imgs/logo.png'
import style from '../index.module.less'
import styled from 'styled-components'
import HeaderMenu from './menu'
const Divlog = styled.div`
   width: 255px;
   height: 65px;
   display: flex;
   flex-direction: column;
   justify-content: space-evenly;
   align-items: center;
   span {
     font-size: 14px;
     line-height: 1;
   }

`

const Title = () => {
  const project = useSelector(selectCurProject)  
  const {titleEn, titleCn, logoImageBase64, ThemeColor} = project 
 return (
  <Divlog>
      <Image rootClassName={style.custlog} preview={false} width={112} src={logoImageBase64 ? 'data:image/png;base64,' + logoImageBase64 : logo}></Image>
      <span >{titleCn || '正泰智慧能源服务平台'}</span>
  </Divlog>
 )
}
export default function Header() {
  //const [icon, iconSet] = useState()
  
 
 /*  useEffect(() => {
     iconSet(icon)
  }, [logo]) */
  return (
    <div className={style.comheader}>
      <Title /><HeaderMenu/>
      
    </div>
  )
}
