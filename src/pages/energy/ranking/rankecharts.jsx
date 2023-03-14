import React, { forwardRef, useImperativeHandle, useState } from 'react'
import BlueColumn from '@com/bluecolumn' 
import Charts from './charts'
import style from './ranking.module.less'
import Empty  from './imgs/empty.png'
export default forwardRef(
  function RankeCharts({name},ref) {

    const [list,setlist]=useState([])
    console.log(list)
    useImperativeHandle(ref,()=>({
      setlist
    }))
    return (
      <div className={style.rankcad}>
        <BlueColumn name={name}/>
        <div className={style.chartsarea}>
          {list.length>0? <Charts list={list}/>:<img src={Empty} style={{width:132}}></img>}
         
        </div>
      </div>
    )
  }
) 
