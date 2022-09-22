import React from 'react'
import  SelectForm from '@com/useSelect'
import style from './style.module.less'
import RadioTree from '@com/radiotree'
import Bluecolumn from '@com/bluecolumn';
import Usagetable from './usagetable'
export default function Index() {
  return (
    <div className={style.usage}>
      <SelectForm isset={false}/>
      <div className={style.content} >
          <RadioTree/>
          
          <div className={style.usagetable}>
            <Bluecolumn name='能耗用量'/>
            <div style={{height:'16px'}}></div>
            <Usagetable/>
          </div>
      </div>
    </div>
  )
}
