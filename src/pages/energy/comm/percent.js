import React, { useState, useEffect, Fragment } from "react";
import style from "./style.module.less";
import totalPublic from "@imgs/totalPublic.png";
import lighting from "@imgs/lighting.png";
import airCondition from "@imgs/air-condition.png";
import power from "@imgs/power.png";
import special from "@imgs/special.png";
import up from "@imgs/up.png";
import down from "@imgs/down.png";

export default function Index(props) {
  const { energySubGive, energyTotalGive } = props;
  
  return (
    // <div className={style.rightBottom}>
     <div>
      {/* <span className={style.title}>公共能耗同比</span> */}
      <div className={style.items}>
        <div className={style.itemIcon}>
          <img className={style.itemImg} src={totalPublic}></img>
        </div>
        <div className={style.itemData}>
          <span>{energyTotalGive.name}</span>
          <span className={style.dataStyle} style={{ color: "#039" }}>
            {energyTotalGive.periodValue}
          </span>
        </div>
        {
        parseFloat(energyTotalGive.yoy) > 0 ?  
        <img className={style.upOrDown} src={up}></img>: 
        <img className={style.upOrDown} src={down}></img>
        }  
       <span className={parseFloat(energyTotalGive.yoy) > 0  ? style.percentUp :   style.percentDown}>{energySubGive[0].yoy}</span>
        
      </div>

      <div className={style.items}>
        <div className={style.itemImgBg}>
          <img className={style.lightingImg} src={lighting}></img>
        </div>
        <div className={style.itemData}>
          <span>{energySubGive[0].name}</span>
          <span className={style.dataStyle}>
            {energySubGive[0].periodValue}
          </span>
        </div>
        {
        parseFloat(energySubGive[0].yoy) > 0 ?  
        <img className={style.upOrDown} src={up}></img>: 
        <img className={style.upOrDown} src={down}></img>
        }  
        <span className={parseFloat(energySubGive[0].yoy) > 0  ? style.percentUp :   style.percentDown}>{energySubGive[0].yoy}</span>
       
      </div>

      <div className={style.items}>
        <div className={style.itemImgBg}>
          <img className={style.airConditionImg} src={airCondition}></img>
        </div>
        <div className={style.itemData}>
          <span>{energySubGive[1].name}</span>
          <span className={style.dataStyle}>
            {energySubGive[1].periodValue}
          </span>
        </div>
        {
        parseFloat(energySubGive[1].yoy) > 0 ?  
        <img className={style.upOrDown} src={up}></img>: 
        <img className={style.upOrDown} src={down}></img>
        }  
        <span className={parseFloat(energySubGive[1].yoy) > 0  ? style.percentUp :   style.percentDown}>{energySubGive[1].yoy}</span>
    
      </div>

      <div className={style.items}>
        <div className={style.itemImgBg}>
          <img className={style.powerImg} src={power}></img>
        </div>
        <div className={style.itemData}>
          <span>{energySubGive[2].name}</span>
          <span className={style.dataStyle}>
            {energySubGive[2].periodValue}
          </span>
        </div>
        {
        parseFloat(energySubGive[2].yoy) > 0 ?  
        <img className={style.upOrDown} src={up}></img>: 
        <img className={style.upOrDown} src={down}></img>
        }  
        <span className={parseFloat(energySubGive[2].yoy) > 0  ? style.percentUp :   style.percentDown}>{energySubGive[2].yoy}</span>
      
      </div>

      <div className={style.items}>
        <div className={style.itemImgBg}>
          <img className={style.specialImg} src={special}></img>
        </div>
        <div className={style.itemData}>
          <span>{energySubGive[3].name}</span>
          <span className={style.dataStyle}>
            {energySubGive[3].periodValue}
          </span>
        </div>
        {
        parseFloat(energySubGive[3].yoy) > 0 ?  
        <img className={style.upOrDown} src={up}></img>: 
        <img className={style.upOrDown} src={down}></img>
        }  
        
        <span className={parseFloat(energySubGive[3].yoy) > 0  ? style.percentUp :   style.percentDown}>{energySubGive[3].yoy}</span>
       
      </div>
    </div>
  );
}
