import React from 'react'
import {Button} from 'antd'
import {useSelector} from 'react-redux'
import {selectCurProject} from '../../redux/user'
import { systemConfigInfo } from "@redux/systemconfig";
import style from './index.module.less'
export default function Footer() {
  const config = useSelector(systemConfigInfo)    
  
  const copyright =config?.copyright || `COPYRIGHT  ${config.companyName} ALL RIGHTS RESERVED`

 
  return (
    <div>
    <span>
      {copyright}
      <Button href="https://beian.miit.gov.cn/" ghost className={style.record}>{config.recordNo}</Button>
    </span>
     </div>
  )
}
