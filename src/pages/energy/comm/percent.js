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
  // console.log(props,"公共能耗同比");
  return (
    <div className={style.rightBottom}>
      <span className={style.title}>公共能耗同比</span>

      <div className={style.items}>
        <div className={style.itemIcon}>
          <img className={style.itemImg} src={totalPublic}></img>
        </div>
        <div className={style.itemData}>
          <span>{props.energyTotalGive.name}</span>
          <span className={style.dataStyle} style={{ color: "#039" }}>
            {props.energyTotalGive.periodValue}
          </span>
        </div>
        <img className={style.upOrDown} src={up}></img>
        <span className={style.percentUp}>+7.88</span>
        <span>%</span>
      </div>

      <div className={style.items}>
        <div className={style.itemImgBg}>
          <img className={style.lightingImg} src={lighting}></img>
        </div>
        <div className={style.itemData}>
          <span>{props.energySubGive[0].name}</span>
          <span className={style.dataStyle}>
            {props.energySubGive[0].periodValue}
          </span>
        </div>
        <img className={style.upOrDown} src={up}></img>
        <span className={style.percentUp}>+3.25</span>
        <span>%</span>
      </div>

      <div className={style.items}>
        <div className={style.itemImgBg}>
          <img className={style.airConditionImg} src={airCondition}></img>
        </div>
        <div className={style.itemData}>
          <span>{props.energySubGive[1].name}</span>
          <span className={style.dataStyle}>
            {props.energySubGive[1].periodValue}
          </span>
        </div>
        <img className={style.upOrDown} src={up}></img>
        <span className={style.percentUp}>+18.75</span>
        <span>%</span>
      </div>

      <div className={style.items}>
        <div className={style.itemImgBg}>
          <img className={style.powerImg} src={power}></img>
        </div>
        <div className={style.itemData}>
          <span>{props.energySubGive[2].name}</span>
          <span className={style.dataStyle}>
            {props.energySubGive[2].periodValue}
          </span>
        </div>
        <img className={style.upOrDown} src={down}></img>
        <span className={style.percentUp}>-8.13</span>
        <span>%</span>
      </div>

      <div className={style.items}>
        <div className={style.itemImgBg}>
          <img className={style.specialImg} src={special}></img>
        </div>
        <div className={style.itemData}>
          <span>{props.energySubGive[3].name}</span>
          <span className={style.dataStyle}>
            {props.energySubGive[3].periodValue}
          </span>
        </div>
        <img className={style.upOrDown} src={down}></img>
        <span className={style.percentUp}>-1.59</span>
        <span>%</span>
      </div>
    </div>
  );
}
