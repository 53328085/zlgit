import React, { useState, useEffect, useRef } from 'react'
import {Typography} from 'antd'
import styled, {keyframes} from 'styled-components'

import bgi from './images/bgi.png'
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
 const flicker =keyframes`from {
    opacity: 0.6;
}
to {
    opacity: 1;
}`
const Carditem = styled.div`

  //  width: 538px;
    height: 152px;
    background-color: #fff;
    border: 1px solid rgb(215, 215, 215);
    border-radius: 4px;
  
    display: flex;
   // align-items: center;
    justify-content: space-between;
    background-image: url(${bgi});
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    &:hover {
        outline: 2px solid  ${props => props.theme.primaryColor};
    }
    .warning {
        width: 14px;
        height: 14px;
        background-color: #08bf00;
       // border: 1px solid rgba(0,0,0,0.2);
        border-radius: 50%;
        position: absolute;
        top: 8px;
        left: 8px;
        animation: ${flicker} 600ms  infinite linear;
    }
    .warningred {
        width: 14px;
        height: 14px;
        background-color: #f13c3c;
      //  border: 1px solid rgba(0,0,0,0.2);
        border-radius: 50%;
        position: absolute;
        top: 8px;
        left: 8px;
        animation: ${flicker} 600ms  infinite linear;
    }
    .loss{
        width: 14px;
        height: 14px;
        background-color: #6b6565;
      //  border: 1px solid rgba(0,0,0,0.2);
        border-radius: 50%;
        position: absolute;
        top: 8px;
        left: 8px;
        animation: ${flicker} 600ms  infinite linear;
    }
    .cardImgBox {
        width: 128px;
        height: 128px;
        // margin-left: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: center;
    }

    .cardImg {
        max-width: 100%;
        // margin-left: 24px;
        // background-color: #237ae4;
    }

    .ItemValue {
       
        text-align: left;
       // width: 100%;
        display: flex;
        flex-direction: column;
       // align-items: flex-start;
        justify-content: space-evenly;
         padding: 0 8px;
        .valueTitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #000;
            font-weight: 700;
            text-align: left;
          
            span{
                width: 183px;
            }
        }

        .valueData {
            //margin-top: 10px;
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
        }

        .btnStyle {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 24px;
            gap: ${props => props.laptop ? "8px" : "16px"};

            .btnBoxStyle {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border-radius: 93px;
             //   width: 186px;
                background-color: #fff;
                border: 1px solid rgb(215, 215, 215);
                height: 24px;
                padding-left: 1px;
                padding-right: 5px;
                color: #003366;
            }

            .timeStyle {
               
                width: 84px;
                height: 22px;
                font-size: 12px;
                background-color: #135ABD;
                color: #fff;
                text-align: center;
                line-height: 22px;
                border-radius: 40px;

                z-index: 10;
            }

           
        }
    }



    .state {
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: ${props => props.theme.normalColor};
        color: ${props => props.theme.fntnormalColor};
        width: 65px;
        text-align: center;
        font-size: 14px;
    }

    .stateOff {
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: ${props => props.theme.offlineColor};
        color: ${props => props.theme.fntofflineColor};
        width: 65px;
        text-align: center;
        font-size: 14px;
    }
    .stateAlarm{
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: ${props => props.theme.warningColorstate};
        color:${props => props.theme.fntwarningColorstate};
        width: 65px;
        text-align: center;
        font-size: 14px;
    }


`
export default function Icard(props) {
    return (
        <Carditem laptop={props.laptop}>
            <div className="cardImgBox"><img src={props.img} className="cardImg" alt={props.title}></img></div>
            <div className="ItemValue">
                <div className="valueTitle">
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
               
                <div className="btnStyle">

                    <div className="btnBoxStyle">
                        <p className="timeStyle">{props.fields[0] ? props.fields[0].name : ''}</p><p className="timeValueStyle">{props.fields[0] ? props.fields[0].value : ''}</p>
                    </div>
                    <div className="btnBoxStyle">
                        <p className="timeStyle">{props.fields[1] ? props.fields[1].name : ''}</p><p className="timeValueStyle">{props.fields[1] ? props.fields[1].value : ''}</p>
                    </div>
                    <div className="btnBoxStyle">
                        <p className="timeStyle">{props.fields[2] ? props.fields[2].name : ''}</p><p className="timeValueStyle">{props.fields[2] ? props.fields[2].value : ''}</p>
                    </div>
                   {props.fields?.[3] && <div className="btnBoxStyle">
                        <p className="timeStyle">{props.fields[3] ? props.fields[3].name : ''}</p><p className="timeValueStyle">{props.fields[3] ? props.fields[3].value : ''}</p>
                    </div>}
                </div>
            </div>
            {props.state == 2 ? <div className="state">正常</div> : props.state == 1 ? <div className="stateOff">失联</div> : <div className="stateAlarm">告警</div>}
            {props.state == 2 ? <div className="warning"></div>
                : props.state == 3 ? <div className="warningred"></div>
                    : props.state == 1 ? <div className="loss"></div> : ""}
        </Carditem>
    )
}