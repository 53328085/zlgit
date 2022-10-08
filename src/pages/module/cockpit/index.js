import React from 'react'
import dirve from '@imgs/drive.png' 
import style from './style.module.less'
export default function Index() {
  return (
    <div className={style.drivebg}>
      <img src={dirve} className={style.drive}></img>
    </div>
  )
}
