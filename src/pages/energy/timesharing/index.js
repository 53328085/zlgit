import React from 'react'
import  SelectForm from '@com/useSelect'
import style from './style.module.less'
import RadioTree from '@com/radiotree'
import Timenergy from './timenergy'
import Bluecolumn from '@com/bluecolumn';
import Timepercent from './timepercent'
export default function Index() {
  return (
    <div className={style.timesharing}>
      <SelectForm isplan={true} isset={false}/>
      <div className={style.sharecontent}>
        <RadioTree/>
        <div className={style.sharingtime}>
        <Bluecolumn name="分时能耗"/>
        <div style={{height:'16px'}}> </div>
        <Timenergy/>
        </div>
        <Timepercent/>
      </div>
      
    </div>
  )
}
