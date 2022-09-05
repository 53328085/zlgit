import React, {useState, useEffect} from 'react'
import {Space, Image} from 'antd'

import {useSelector} from 'react-redux'
import {selectCurProject} from '../../../redux/user'
import logo from '@imgs/logo.png'
import style from '../index.module.less'
//const HeaderMenu = () => import('./HeaderMenu')

import HeaderMenu from './HeaderMenu'


export default function Header() {
  //const [icon, iconSet] = useState()
  const project = useSelector(selectCurProject)  
  const {titleEn, titleCn, logoImageBase64, ThemeColor} = project
  const Log = () => <Image rootClassName={style.custlog} preview={false} height={26} src={logoImageBase64 ? 'data:image/png;base64,' + logoImageBase64 : logo}></Image>
  const Title = () => <Space className={style.title}><span >{titleCn || '智慧能源服务管理平台'}</span>{/* <span>{titleEn || 'Prepayment management system'}</span> */}</Space>
 /*  useEffect(() => {
     iconSet(icon)
  }, [logo]) */
  return (
    <div className={style.comheader}>
     <Log /> <Title/> <HeaderMenu/>
      
    </div>
  )
}
