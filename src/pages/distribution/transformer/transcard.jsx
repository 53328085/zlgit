import React from 'react'
import style from './style.module.less'
import transform from '@imgs/transform.png'
import RightArrow from  '@imgs/rightArrow.png'
export default function TransCard({message,activeCard,choose,index,activeIndex}) {
  let flag = activeIndex===index
  console.log(style)
  return (
    <div className={flag?`${style.activecard} ${style.card}`:style.card} onClick={()=>{choose(index)}}>
      <img src={transform} alt="" style={{width:107,height:87}}/>
      <div className={style.title}>
        <div style={{marginBottom:16}}>
            <p>{message.name}</p>
            <p>S11-M-315</p>
        </div>
        <div>
            <p>额定容量</p>
            <p>{message.value}</p>
        </div>
        
      </div>
      <img src={RightArrow} style={{paddingLeft:6}}></img>
    </div>
  )
}
