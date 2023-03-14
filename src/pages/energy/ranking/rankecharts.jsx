import React, { forwardRef, useImperativeHandle, useState } from 'react'
import BlueColumn from '@com/bluecolumn' 
import Charts from './charts'
import style from './ranking.module.less'
export default forwardRef(
  function RankeCharts({name},ref) {

    const [list,setlist]=useState()
    console.log(list)
    useImperativeHandle(ref,()=>({
      setlist
    }))
    return (
      <div className={style.rankcad}>
        <BlueColumn name={name}/>
        <div className={style.chartsarea}>
          <Charts/>
        </div>
      </div>
    )
  }
) 
