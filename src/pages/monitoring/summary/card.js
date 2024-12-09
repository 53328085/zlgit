import React from "react";

export default function Icard({img, title, value,isShow,on,off,per,onValue,offValue,perValue,isRed,isGreen,isredE, after=null}){
    return(
        <div className="cardItem">
            <div className="cardImgBox"><img src={ img }  className="cardImg" alt={title}></img></div>
            <div className="ItemValue">
                <div className="valueTitle">{ title }</div>
                <div className="valueData">{ value }</div>
            </div>
            {isShow?<div className="boxCard">
                <p><span>{on}</span>{isGreen?<span style={{color:'green'}}>{onValue}</span>:<span>{onValue}{after}</span>}</p>
                <p><span>{off}</span>{isRed?<span style={{color:'red'}}>{offValue}</span>:<span>{offValue}{after}</span>}</p>
                <p><span>{per}</span>{isredE?<span style={{color:'red'}}>{perValue}</span>:<span>{perValue}{after}</span>}</p>
                </div>:''}
        </div>
    )
}