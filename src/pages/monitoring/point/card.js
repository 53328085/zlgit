import React, { useState, useEffect, useRef } from 'react'

import style from './style.module.less'

export default function Icard(props) {
    let daluq = props.deviceStyle == 12;
    const statet =daluq ? {
        open: '分闸',
        close: '合闸'
    } :{
        open: '开',
        close: '关'
    }
  

    return (
        <div className={style.cardItem} >
            <div className={style.cardImgBox}><img src={props.img} className={style.cardImg} alt={props.title}></img></div>
            <div className={style.ItemValue}>
                <div className={style.valueTitle}><span>{props.title}</span><span>SN:{props.category}</span></div>
                <div className={style.valueTitle} style={{ color: '#333', fontWeight: 'normal' }}><sapn>{props.value}</sapn>
                     <span>{props.lastSampleTime}</span>  
                </div>
             {/*  <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>更新时间</p><p className={style.timeValueStyle}>{props.lastSampleTime}</p>
               </div> */}
                <div className={style.btnStyle}>

                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>{props.fields[0] ? props.fields[0].name : ''}</p><p className={style.timeValueStyle}>{props.fields[0] ? props.fields[0].value : ''}</p>
                    </div>
                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>{props.fields[1] ? props.fields[1].name : ''}</p><p className={style.timeValueStyle}>{props.fields[1] ? props.fields[1].value : ''}</p>
                    </div>
                    <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>{props.fields[2] ? props.fields[2].name : ''}</p><p className={style.timeValueStyle}>{props.fields[2] ? props.fields[2].value : ''}</p>
                    </div>
                     <div className={style.btnBoxStyle}>
                         
                            <p className={style.timeStyle}>{props.fields[3] ? props.fields[3].name : ''}</p><p className={style.timeValueStyle} style={{color: props?.fields[3]?.value== 'Close'? "#f00":"#3f0" }}>{
                                props.fields[3] ? (statet[props.fields[3].value?.toLowerCase()] || props.fields[3].value) : ''
                            }</p>
                       
                    </div>
                </div>
            </div>
            {props.state == 2 ? <div className={style.state}>正常</div> : props.state == 1 ? <div className={style.stateOff}>失联</div> : <div className={style.stateAlarm}>告警</div>}
            {/*   {props.state==2 ? <div className={style.warning}></div>  
            :<div className={style.warningred}></div>} */}


            {/* {props.deviceStyle==1 && <><div className={style.warning}></div>  
             <div className={style.warningred}></div></> } */}
        </div>
    )
}