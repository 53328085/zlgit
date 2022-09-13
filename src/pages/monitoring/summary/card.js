import React from "react";
import style from './style.module.less'
export default function Icard({img, title, value}){
    return(
        <div className={style.cardItem}>
            <img src={ img } className={style.cardImg} alt={title}></img>
            <div className={style.ItemValue}>
                <div className={style.valueTitle}>{ title }</div>
                <div className={style.valueData}>{ value }</div>
            </div>
        </div>
    )
}