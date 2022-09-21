import React from 'react'
import DevopSearch from '@com/devopSearch/devopSearch'
import OrderContent from './ordercontent'
import style from './style.module.less'
export default function Index() {
  return (
    <div className={style.Order}>
      <DevopSearch/>
      <OrderContent style={style}/>
    </div>
  )
}
