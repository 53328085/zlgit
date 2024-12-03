import React, { useState, useEffect, useRef } from 'react'
import {Typography} from 'antd'
import styled from 'styled-components'
import style from './style.module.less'
const {Text} = Typography
const Textbox = styled(Text)`
  &&{
    width: 183px;
    font-weight: 700;
    color: #000;
  }
` 
const Adrbox = styled(Text)`
  &&{
    width: 384px;
    color: #333;
  }
` 
export default function Icard(props) {
    return (
        <div className={style.cardItem} >
            <div className={style.cardImgBox}><img src={props.img} className={style.cardImg} alt={props.title}></img></div>
            <div className={style.ItemValue}>
                <div className={style.valueTitle}>
                    <Textbox ellipsis={{
                        tooltip: props.title
                    }}>{props.title}</Textbox>
                    <Textbox ellipsis={{
                        tooltip: props.category
                    }}>SN:{props.category}</Textbox>
                </div>
                <Adrbox ellipsis={{
                        tooltip: props.value
                    }}>{props.value}</Adrbox>
                {/* <div className={style.btnBoxStyle}>
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
                   {props.fields?.[3] && <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>{props.fields[3] ? props.fields[3].name : ''}</p><p className={style.timeValueStyle}>{props.fields[3] ? props.fields[3].value : ''}</p>
                    </div>}
                </div>
            </div>
            {props.state == 2 ? <div className={style.state}>正常</div> : props.state == 1 ? <div className={style.stateOff}>失联</div> : <div className={style.stateAlarm}>告警</div>}
            {props.state == 2 ? <div className={style.warning}></div>
                : props.state == 3 ? <div className={style.warningred}></div>
                    : props.state == 1 ? <div className={style.loss}></div> : ""}


            {/* {props.deviceStyle==1 && <><div className={style.warning}></div>  
             <div className={style.warningred}></div></> } */}
        </div>
    )
}