import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.less'
export default function Icard(props){
    return(
        <div className={style.cardItem} >
            <div className={style.cardImgBox}><img src={ props.img }  className={style.cardImg} alt={props.title}></img></div>
            <div className={style.ItemValue}>
                <div className={style.valueTitle}><span>{ props.title }</span><span>{ props.category }</span></div>
                <div className={style.valueData}>{ props.value }</div>
                {/* <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>更新时间</p><p className={style.timeValueStyle}>{props.lastSampleTime}</p>
                    </div> */}
                <div className={style.btnStyle}>
                    
                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>电流</p><p className={style.timeValueStyle}>{props.childrenCnt}</p>
                    </div>
                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>电压</p><p className={style.timeValueStyle}>{props.connMethod}</p>
                    </div>
                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>功率</p><p className={style.timeValueStyle}>{props.connMethod}</p>
                    </div>
                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>用电量</p><p className={style.timeValueStyle}>{props.connMethod}</p>
                    </div>
                </div>
            </div>
            {props.state==2?<div className={style.state}>正常</div>:props.state==1?<div className={style.stateOff}>失联</div>:<div className={style.stateAlarm}>告警</div>}
            
        </div>
    )
}