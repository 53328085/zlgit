import React from 'react'
import style from './style.module.less'
export default function index({name=''}) {
  return (
      <div className={style.title}>
        <div className={style.columns}></div>
        <div className={style.name}>{name}</div>
      </div>
  )
}
