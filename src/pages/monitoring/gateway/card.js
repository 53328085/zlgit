import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.less'
export default function Icard(props) {
    return (
        <div className={style.cardItem} >
            <div className={style.cardImgBox}><img src={props.img} className={style.cardImg} alt={props.title}></img></div>
            <div className={style.ItemValue}>
                <div className={style.valueTitle}><span>{props.name}</span><span>{props.title}</span></div>
                <div className={style.valueData}>{props.value}</div>
                <div className={style.btnStyle}>

                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>子设备</p><p className={style.timeValueStyle}>{props.childrenCnt}</p>
                    </div>
                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>联网方式</p><p className={style.timeValueStyle}>{props.connMethod}</p>
                    </div>
                </div>

                <div className={style.btnBoxStyle}>
                    <p className={style.timeStyle}>更新时间</p><p className={style.timeValueStyle}>{props.lastSampleTime}</p>
                </div>
            </div>
            {props.state == 2 ? <div className={style.state}>正常</div> : <div className={style.stateOff}>失联</div>}

        </div>
    )
}