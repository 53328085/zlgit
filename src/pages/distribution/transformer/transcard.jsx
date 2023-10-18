import React from 'react'
import style from './style.module.less'
import transform from '@imgs/transform.png'
import RightArrow from  '@imgs/rightArrow.png'
export default function TransCard({message}) {
  return (
    <div className={style.card}>
      <img src={transform} alt="" style={{width:107,height:87}}/>
      <div className={style.title}>
        <div style={{marginBottom:16}}>
            <p className={style.txtline}>{message?.name}</p>
            <p>S11-M-315</p>
        </div>
        <div>
            <p className={style.tag}>最佳经济运行</p>
           
        </div>
        
      </div>
      {/* <img src={RightArrow} style={{paddingLeft:6}}></img> */}
    </div>
  )
}
