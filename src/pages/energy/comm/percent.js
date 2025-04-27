import React  from "react";
 
import totalPublic from "@imgs/totalPublic.png";
import lighting from "@imgs/lighting.png";
import airCondition from "@imgs/air-condition.png";
import power from "@imgs/power.png";
import special from "@imgs/special.png";
import up from "@imgs/up.png";
import down from "@imgs/down.png";
import defalut from "./icon/default.png"
import styled from "styled-components";

const imgset = {
  '总用电':totalPublic,
  '照明插座用电': lighting,
  '空调用电': airCondition,
  '动力用电': power,
  '特殊用电': special,
}
const Itemlist = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, 48px);
  row-gap: 12px;
  flex:1;
  overflow-y: auto;
 // padding-top: 28px;
  .item {
    display: flex;
    border: 1px solid #d7d7d7;
    font-size: 12px;
    padding: 3px 14px 3px 3px;
    align-items: center;
    .icon {
      width: 54px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #135abd;
      img {
         
        height: 32px;
      }
    }
    .type {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 24px;
      .sname {
      color: #666;
    }
    .val {
      color: #039;
      font-size: 18px;
    }
    }
    .yoy {
      margin-left: auto;
      font-size: 18px;
      display: flex;
      align-items: center;
      .percent {
        display: inline-block;
        width: 78px;
        padding-left: 12px;
      }
      .up {
        color: #f33;
      
      }
      .down {
        color: #039;
        
      }
    }
  }

`
const Item = (props) => {
    let imgsrc = imgset[props.name] ||defalut
    let f = parseFloat(props.yoy) > 0
    let updown = f ? up  : down
    let pre = f ? 'up' : 'down'
    return (
      <div className="item">
        <div className="icon">
         <img src={imgsrc} alt="" /> 
         </div>
         <div className="type">
            <span className="sname">{props.name}</span>
            <span className="val">{props.periodValue}</span>
         </div>
         <div className="yoy">
             <img src={updown}></img>
            <span className={pre + " percent"}>{props.yoy}</span>
         </div>
      </div>
    )
}




export default function Index(props) {
  const { energySubGive, energyTotalGive } = props;
  
  let list = [];
  list = [energyTotalGive, ...energySubGive]
  return (
      <Itemlist>
          {list.map(data => <Item {...data}/>)}
      </Itemlist>
    
  );
}
