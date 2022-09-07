import React from 'react'
import BlueColumn from '@com/bluecolumn' 
import Charts from './charts'
import style from './ranking.module.less'
export default function RankeCharts({name}) {
  return (
    <div className={style.rankcad}>
      <BlueColumn name={name}/>
      <div className={style.chartsarea}>
        <Charts/>
      </div>
    </div>
  )
}
