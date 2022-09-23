import React from "react";
import style from './style.module.less'
export default function Index(props) {
    return(
        <div className={style.card}>
            <div className={style.cardTitle}>{props.title}</div>
            <div className={style.cardContent}>
                <div className={style.imgDiv}></div>
                <div className={style.desc}>
                    <span className={style.normalSign}></span>
                    <span>{props.desc}</span>
                </div>
                <div className={style.cardData}>{ props.value }</div>
            </div>
        </div>
    )
}