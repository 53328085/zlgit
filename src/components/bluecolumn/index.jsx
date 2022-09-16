import React from 'react'
import style from './style.module.less'
export default function Index({name='',children,styled={}}) {
  return (
      <div className={style.title} style={styled}>
        <div className={style.columns}></div>
        <div className={style.name}>{name}</div>
        {children}
      </div>
  )
}
