import React  from 'react'
import {i18t} from "@com/useButton"
export default function Icard(props) {
    return (
        <div className="cardItem" >
            <img src={props.img} className="cardImg" alt={props.title}></img>
            <div className="ItemValue">
                <div className="valueTitle"><span>{props.name}</span><span>{props.title}</span></div>
                <div className="valueData">{props.value}</div>
                <div className="btnStyle">

                    <div className="btnBoxStyle">
                        <p className="timeStyle">{i18t("comm","childdevice")}</p><p className="timeValueStyle">{props.childrenCnt}</p>
                    </div>
                    <div className="btnBoxStyle">
                        <p className="timeStyle">{i18t("comm","connection")}</p><p className="timeValueStyle">{props.connMethod}</p>
                    </div>
                </div>

                <div className="btnBoxStyle">
                    <p className="timeStyle">{i18t("comm","updateTime")}</p><p className="timeValueStyle">{props.lastSampleTime}</p>
                </div>
            </div>
            {props.state == 2 ? <div className="state">{i18t("comm","normal")}</div> : <div className="stateOff">{i18t("comm","offline")}</div>}

        </div>
    )
}