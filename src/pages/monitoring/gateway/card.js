import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.less'
export default function Icard(props) {
    return (
        <div className="cardItem" >
            <img src={props.img} className="cardImg" alt={props.title}></img>
            <div className="ItemValue">
                <div className="valueTitle"><span>{props.name}</span><span>{props.title}</span></div>
                <div className="valueData">{props.value}</div>
                <div className="btnStyle">

                    <div className="btnBoxStyle">
                        <p className="timeStyle">子设备</p><p className="timeValueStyle">{props.childrenCnt}</p>
                    </div>
                    <div className="btnBoxStyle">
                        <p className="timeStyle">联网方式</p><p className="timeValueStyle">{props.connMethod}</p>
                    </div>
                </div>

                <div className="btnBoxStyle">
                    <p className="timeStyle">更新时间</p><p className="timeValueStyle">{props.lastSampleTime}</p>
                </div>
            </div>
            {props.state == 2 ? <div className="state">正常</div> : <div className="stateOff">失联</div>}

        </div>
    )
}