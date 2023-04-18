import React from "react";
import style from './style.module.less'
export default function Icard({img, title, value,isShow,on,off,per,onValue,offValue,perValue,isRed,isGreen,isredE, after=null}){
    return(
        <div className={style.cardItem}>
            <div className={style.cardImgBox}><img src={ img }  className={style.cardImg} alt={title}></img></div>
            <div className={style.ItemValue}>
                <div className={style.valueTitle}>{ title }</div>
                <div className={style.valueData}>{ value }</div>
            </div>
            {isShow?<div className={style.boxCard}>
                <p><span>{on}</span>{isGreen?<span style={{color:'green'}}>{onValue}</span>:<span>{onValue}{after}</span>}</p>
                <p><span>{off}</span>{isRed?<span style={{color:'red'}}>{offValue}</span>:<span>{offValue}{after}</span>}</p>
                <p><span>{per}</span>{isredE?<span style={{color:'red'}}>{perValue}</span>:<span>{perValue}{after}</span>}</p>
                </div>:''}
        </div>
    )
}