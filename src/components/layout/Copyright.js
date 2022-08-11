import React from 'react'
import {Button} from 'antd'
import {useSelector} from 'react-redux'
import {selectCurProject} from '../../redux/user'
import style from './index.module.less'
export default function Footer() {
  const recordNo = useSelector(state => state.system.recordNo)  
  const companyName = useSelector(state => state.system.companyName) 
  const copyright = useSelector(selectCurProject)?.copyright || `COPYRIGHT  ${companyName} ALL RIGHTS RESERVED`

 
  return (
    <div>
    <span>
      {copyright}
      <Button href="https://beian.miit.gov.cn/" ghost className={style.record}>{recordNo}</Button>
    </span>
     </div>
  )
}
