import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'


const CardItem=styled.div`

 
 
  //  width: 538px;
    height: 152px;
  //  background-color: #fff;
     background-color: ${props => props.theme.primaryderived || '#ffffff'};
  //  border: 1px solid;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    position: relative;
    overflow: hidden;
   

    .cardImg {
        width: 128px;
        height: 128px;
        img {
            max-width: 100%;
        }
        // margin-left: 24px;
        // background-color: #237ae4;
    }

    .ItemValue {
      
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;

        .valueTitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: ${props => props.islight ? "#000000" : "#fff"} ;
            font-weight: 700;
            text-align: left;
           
            span{
                width: 183px;
            }
            &.val {
              color: ${props => props.islight ? "#333333" : "#fff"} ;
              font-weight: normal;
            }
        }
        
        .valueData {
            //margin-top: 10px;
            font-size: 14px;
            color: #333;
           
        }

        .btnStyle {
            display: grid;
            grid-template-columns: repeat(2, 200px);
            grid-template-rows: repeat(2, 35px);
         
            .btnBoxStyle {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border-radius: 93px;
                width: 196px;
             //   border: 1px solid rgb(215, 215, 215);
                height: 24px;
                padding-left: 10px;
                padding-right: 10px;
                border-radius: 40px;
                background-color: ${props => props.theme.itembg || "#000033"};
               // color: #33FF00;
            }

            .timeStyle {
                width: 85px;
                height: 22px;
                font-size: 12px;
                color: ${props => props.theme.fieldname || "#ffffff"};
                line-height: 22px;
                border-radius: 40px;
                z-index: 10;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

          
        }
    }

    .boxCard {
        width: 200px;
        height: 112px;
        position: absolute;
        right: 5px;
        background-color: rgba(242, 242, 242, 0.75);
        border: 1px solid rgb(228, 228, 228);
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        padding: 16px;

        p {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .state {
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: ${props => props.theme.normalColor || "#009966"};
        color: ${props => props.theme.fntnormalColor || "#ffffff"};
        width: 65px;
        text-align: center;
        font-size: 14px;
    }

    .stateOff {
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: ${props => props.theme.offlineColor || "#666666"};
        color: ${props => props.theme.fntofflineColor || "#ffffff"};
        width: 65px;
        text-align: center;
        font-size: 14px;
    }
    .stateAlarm{
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: ${props => props.theme.warningColorstate || "#ff4d4f"};
        color: ${props => props.theme.fntwarningColorstate || "#ffffff"};
        width: 65px;
        text-align: center;
        font-size: 14px;
    }
 

    .btnBoxStyle {
    display: flex;
    flex-direction: row;
  //  margin-bottom: 12px;

   
}

  
`

export default function Icard(props) {
    const statet = {
        open: '开',
        close: '关'
    }
    return (
        <CardItem>
            <div className="cardImg"><img src={props.img}  alt={props.title}></img></div>
            <div className="ItemValue">
                <div className="valueTitle"><span>{props.title}</span><span>SN:{props.category}</span></div>
                <div className="valueTitle" ><sapn>{props.value}</sapn>
                    {/* <span>{props.lastSampleTime}</span> */}
                </div>
                {/*  <div className={style.btnBoxStyle}>
                        <p className={style.timeStyle}>更新时间</p><p className={style.timeValueStyle}>{props.lastSampleTime}</p>
               </div>  */}
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
                    <div className="btnBoxStyle">
                        <p className="timeStyle">{props.fields[3] ? props.fields[3].name : ''}</p><p className="timeValueStyle">{props.fields[3] ? (statet[props.fields[3].value?.toLowerCase()] || props.fields[3].value) : ''}</p>
                    </div>
                </div>
            </div>
            {props.state == 2 ? <div className="state">正常</div> : props.state == 1 ? <div className="stateOff">失联</div> : <div className="stateAlarm">告警</div>}
            {/*   {props.state==2 ? <div className={style.warning}></div>  
            :<div className={style.warningred}></div>} */}


            {/* {props.deviceStyle==1 && <><div className={style.warning}></div>  
             <div className={style.warningred}></div></> } */}
        </CardItem>
    )
}