import React from 'react'
import style from './style.module.less'
export default function Index({ name = '', children, styled = {}, bg = {}, fontSize = 14, bac = '' }) {
  return (
    <div className={style.title} style={styled}>
      <div className={bac == '' ? style.columns : style.red} style={bg}></div>
      <div className={style.name} style={{ fontSize, }}>{name}</div>
      {children}
    </div>
  )
}
