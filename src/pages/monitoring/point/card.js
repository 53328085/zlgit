import React, { useState, useEffect, useRef } from 'react'



export default function Icard(props) {
    let daluq = props.deviceStyle == 12 || props.deviceStyle == 1;
    const statet = daluq ? {
        open: '分闸',
        close: '合闸'
    } : {
        open: '开',
        close: '关'
    }


    return (
        <div className="cardItem" >
            <div className="cardImgBox"><img src={props.img} className="cardImg" alt={props.title}></img></div>
            <div className="ItemValue">
                <div className="valueTitle"><span>{props.title}</span><span>SN:{props.category}</span></div>
                <div className="valueTitle val"><sapn>{props.value}</sapn>
                    <span>{props.lastSampleTime}</span>
                </div>
                {/*  <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>更新时间</p><p className={style.timeValueStyle}>{props.lastSampleTime}</p>
               </div> */}
                <div className="btnStyle">

                    <div className="btnBoxStyle">
                        <p className="timeStyle" title={props?.fields[0]?.name}>{props.fields[0] ? props.fields[0].name : ''}</p><p className="timeValueStyle">{props.fields[0] ? props.fields[0].value : ''}</p>
                    </div>
                    <div className="btnBoxStyle">
                        <p className="timeStyle" title={props?.fields[1]?.name}>{props.fields[1] ? props.fields[1].name : ''}</p><p className="timeValueStyle">{props.fields[1] ? props.fields[1].value : ''}</p>
                    </div>
                    <div className="btnBoxStyle">
                        <p className="timeStyle" title={props?.fields[2]?.name}>{props.fields[2] ? props.fields[2].name : ''}</p><p className="timeValueStyle">{props.fields[2] ? props.fields[2].value : ''}</p>
                    </div>
                    <div className="btnBoxStyle">

                        <p className="timeStyle" title={props?.fields[3]?.name}>{props.fields[3] ? props.fields[3].name : ''}</p><p className="timeValueStyle" style={{ color: props?.fields[3]?.value == 'Close' ? "#f00" : "null" }}>{
                            props.fields[3] ? (statet[props.fields[3].value?.toLowerCase()] || props.fields[3].value) : ''
                        }</p>

                    </div>
                </div>
            </div>
            {props.state == 2 ? <div className="state">正常</div> : props.state == 1 ? <div className="stateOff">失联</div> : <div className="stateAlarm">告警</div>}

        </div>
    )
}