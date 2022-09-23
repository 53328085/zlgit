import React from 'react'
import style from './style.module.less'
import  UseTable from '@com/useTable'
import {devicecolumns} from './columns'
import dashed from '@imgs/dashed.png'
export default function deviceChange() {
  return (
    <div>
        <div className={style.btns}>
            <div className={style.btn}>新增设备</div>
            <div className={style.btn}>更换设备</div>
            <div className={style.btn}>解绑设备</div>
        </div>
      
        <img src={dashed} alt="" className={style.dash}/>
        <UseTable columns={devicecolumns}></UseTable>
    </div>
  )
}
