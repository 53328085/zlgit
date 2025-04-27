import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { MRGB } from "@redux/systemconfig.js";
import { TreeBtn, i18t } from "@com/useButton";
import {Typography} from 'antd'
const {Text} = Typography
const CardItme = styled.div`
  && {
    height: 164px;
    padding: 14px;
    background-color: ${(props) => props.theme.primaryderived || "#ffffff"};
    border: 1px solid rgba(221, 223, 230, 1);
    border-radius: 8px;
    display: flex;
    column-gap: 17px;
    justify-content: flex-start;
    position: relative;
    overflow: hidden;
    .postion {
      position: absolute;
      left: 14;
    }
    .cardImg {
      flex: 0 0 100px;
      height: 136px;
      justify-content: center;
      align-items: center;
      display: flex;
      padding-top: 24px;
    //  background-color: #fff;
      overflow: hidden;
      .img {
        max-width: 100%;
      }
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      row-gap: 4px;
      .line {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: ${(props) => props.theme.bgcolorfont};
        font-weight: bold;
        column-gap: 16px;
        .ant-typography{
          color: ${(props) => props.theme.bgcolorfont};
        }
        .on {
          margin-left: auto;
        }
      }
      .sp.line {
        justify-content: space-between;
      }
      .values {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        background-color: rgba(${props => props.rgb[0]},${props => props.rgb[1]},${props => props.rgb[2]},0.15);
       // border: 1px solid rgba(${props => props.rgb[0]},${props => props.rgb[1]},${props => props.rgb[2]},0.2);
        border-radius: 6px;
        .item {
          padding: 0 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .field {
            color: ${(props) => props.theme.fieldname || "#ffffff"};
            font-size: 14px;
          }
          .value {
            color: ${(props) => props.theme.fieldvalue || "#1E50E6"};
            font-size: 16px;
            white-space: nowrap;
          }
        }
        .join {
          grid-row-start: 2;
          grid-column: 1 / -1;
        }
      }
    }

    .state {
      position: absolute;
      top: 4px;
      right: -18px;
      transform: rotate(45deg);
      background-color: ${(props) => props.theme.normalColor || "#009966"};
      color: ${(props) => props.theme.fntnormalColor || "#ffffff"};
      width: 65px;
      text-align: center;
      font-size: 14px;
    }

    .stateOff {
      position: absolute;
      top: 4px;
      right: -18px;
      transform: rotate(45deg);
      background-color: ${(props) => props.theme.offlineColor || "#666666"};
      color: ${(props) => props.theme.fntofflineColor || "#ffffff"};
      width: 65px;
      text-align: center;
      font-size: 14px;
    }
  }
`;
const Gateway = (props) => {
  return (
    <>
      <div className="line">
        <Text ellipsis={{tooltip: props.name}}>{props?.name}</Text>
        <span>{props.title}</span>
       {/*  {props.state == 2 ? (
          <TreeBtn type={2} ns="comm" text="normal" className="on" />
        ) : (
          <TreeBtn type={4} ns="comm" text="offline" className="on" />
        )} */}
      </div>
      <div className="line">{props.value}</div>
      <div className="values">
        <div className="item">
          <span className="field">{i18t("comm", "childdevice")}</span>
          <span className="value">{props.childrenCnt}</span>
        </div>
        <div className="item">
          <span className="field">{i18t("comm", "connection")}</span>
          <span className="value">{props.connMethod}</span>
        </div>
        <div className="item join">
          <span className="field">{i18t("comm", "updateTime")}</span>
          <span className="value">{props.lastSampleTime}</span>
        </div>
      </div>
    </>
  );
};
const Device = (props) => {
  const {fields:datas,state,deviceStyle} = props
  const fields = useMemo(()=> {
    /* let t='' ;
    if(deviceStyle == 12) {
      t = {Close: "合闸", Open: "分闸"}[fields?.[3]?.value] ?? "" ;
    }else if(deviceStyle == 1 && state && ["Close", "Open"].includes(fields?.[3]?.value)) {
      t = {Close: "合闸", Open: "分闸"}[fields?.[3]?.value] ?? "" ;
    }else {
      t = fields?.[3]?.value 
    }
    return t */
    if(Array.isArray(datas) && datas.length > 0 ) {
     return  datas.map(f=> {
        const  value = f?.value
        const  farmt =  value=="Close" ? "合闸" :  value=="Open" ? "分闸" : value
        return {...f, value: farmt}
    })
   }else {
    return []
   }
  }, [datas])
  return (
    <>
      <div className="line sp">
        <Text ellipsis={{tooltip: props.title}}>{props.title}</Text>
        <span>SN:{props.category}</span>
       {/*  {props.state == 2 ? (
          <TreeBtn type={2} ns="comm" text="normal" />
        ) : props.state == 1 ? (
          <TreeBtn type={4} ns="comm" text="offline" />
        ) : (
          <TreeBtn
            type={3}
            ns="comm"
            text="alarm"
            params={{ text: "", text2: "" }}
          />
        )} */}
      </div>
      <div className="line sp">
        <Text ellipsis={{tooltip: props.value}}>{props.value}</Text>
        <span>{props.lastSampleTime}</span>
      </div>
      <div className="values"> 
            <div className="item">
              <Text ellipsis={{ellipsis: fields?.[0]?.name}} className="field">{fields?.[0]?.name}</Text>
              <span className="value">{fields?.[0]?.value}</span>
            </div> 
            <div className="item">
            <Text ellipsis={{ellipsis: fields?.[1]?.name}} className="field">{fields?.[1]?.name}</Text>
              <span className="value">{fields?.[1]?.value}</span>
            </div> 
            <div className="item">
            <Text ellipsis={{ellipsis: fields?.[2]?.name}} className="field">{fields?.[2]?.name}</Text>
              <span className="value">{fields?.[2]?.value}</span>
            </div> 
            <div className="item">
            <Text ellipsis={{ellipsis: fields?.[3]?.name}} className="field">{fields?.[3]?.name}</Text>
              <span className="value">{fields?.[3]?.value}</span>
            </div> 
      </div>
    </>
  );
};
export default function Index(props) {
  // 1.网关设备 2.其他设备
  let { device, img, title, ...rest } = props;
   const mrgb = useSelector(MRGB) 
   const [r, g, b] = Array.isArray(mrgb) ? mrgb : [] 
  return (
    <CardItme rgb={[r, g, b]}>
      <div className="cardImg">
        <img src={img} className="img" alt={title}></img>
      </div>
      <div className="content">
        {device == 1 ? <Gateway {...rest}  /> : <Device {...rest}   title={title} />}
      </div>
      {
          device == 1 ? <div className="postion">{props.state == 2 ? (
            <TreeBtn type={2} ns="comm" text="normal" />
          ) : props.state == 1 ? (
            <TreeBtn type={4} ns="comm" text="offline" />
          ) : (
            <TreeBtn
              type={3}
              ns="comm"
              text="alarm"
              params={{ text: "", text2: "" }}
            />
          )}
          </div>
          : <div className="postion">
            {props.state == 2 ? (
          <TreeBtn type={2} ns="comm" text="normal" className="on" />
        ) : (
          <TreeBtn type={4} ns="comm" text="offline" className="on" />
        )}
          </div>
        }
    </CardItme>
  );
}
