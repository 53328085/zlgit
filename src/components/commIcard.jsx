import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { MRGB } from "@redux/systemconfig.js";
import { TreeBtn, i18t } from "@com/useButton";
import {Typography} from 'antd'
const {Text} = Typography
const CardItme = styled.div`
  && {
    height:${props=> props.device==1 ? "160px" : "210px"} ;
    padding: 14px;
    background-color: ${(props) => props.theme.primaryderived || "#fff"};
    border: 1px solid rgba(221, 223, 230, 1);
    border-radius: 8px;
    display: flex;
    row-gap: 10px;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    overflow: hidden;
    padding-bottom: ${props=> props.device==1 ? "10px" : "12px"} ;
    .postion {
      position: absolute;
      left: 14;
    }
    .upcontent{
      display: flex;
      column-gap: 16px;
      height: ${props=> props.device==1 ? "90px" : "102px"} ;
      .cardImg {
      flex: 0 0 100px;
      height: ${props=> props.device==1 ? "90px" : "102px"};
      justify-content: center;
      align-items: center;
      display: flex;
    //  background-color: #fff;
      overflow: hidden;
      .img {
        max-width: 100%;
      }
    }
     .rightinfo{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .line {
        display: flex;
        column-gap: 8px;
        font-size: 13px;
        .label {
          color: rgba(96, 98, 102, 1);
          
        }
        .ant-typography{
          color: ${(props) => props.theme.bgcolorfont};
          font-size: 15px;
          font-weight: 500;
        }
        .statebtn{
          margin-left: auto;
        }
      }
     }
    }
    .values {
        flex: 1;
        display: grid;
        grid-template-columns:${props=> props.len < 3 ? "1fr" : "1fr 1fr"};
        grid-auto-rows: 1fr;
       // grid-template-rows: 1fr 1fr;
        background-color: rgba(${props => props.rgb[0]},${props => props.rgb[1]},${props => props.rgb[2]},0.15);
       // border: 1px solid rgba(${props => props.rgb[0]},${props => props.rgb[1]},${props => props.rgb[2]},0.2);
        border-radius: 6px;
        align-items: ${props=> props.len<2 ? "flex-start" : "center"};
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
       
      }
      .values.gateway {
        grid-template-columns: 1fr 1fr;
      }
  /*   .content {
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
        display: grid;
        grid-template-columns: 1fr 160px;
        justify-content: space-between;
      }
      .gateway {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 1fr;
       // grid-template-rows: 1fr 1fr;
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
      .values {
        flex: 1;
        display: grid;
        grid-template-columns:${props=> props.len < 3 ? "1fr" : "1fr 1fr"};
        grid-auto-rows: 1fr;
       // grid-template-rows: 1fr 1fr;
        background-color: rgba(${props => props.rgb[0]},${props => props.rgb[1]},${props => props.rgb[2]},0.15);
       // border: 1px solid rgba(${props => props.rgb[0]},${props => props.rgb[1]},${props => props.rgb[2]},0.2);
        border-radius: 6px;
        align-items: ${props=> props.len<2 ? "flex-start" : "center"};
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
       
      }
    } */

 

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
function useBtn(state) { 
  const statebtn = {
    2:<TreeBtn type={2} ns="comm" text="normal" />,
    1:<TreeBtn type={4} ns="comm" text="offline" />,
 }[state] || <TreeBtn
             type={3}
             ns="comm"
             text="alarm"
             params={{ text: "", text2: "" }}
           />
  return statebtn;
}
const Gateway = (props) => {
  const statebtn ={
    2:<TreeBtn type={2} ns="comm" text="online" />,
    1:<TreeBtn type={4} ns="comm" text="offline" />,
 }[props.state]
  return (
    <>
      <div className="line">
      <div className="label">
          设备名称
        </div>
        <Text ellipsis={{tooltip: props.name}}>{props?.name}</Text>
        <span>{props.title}</span>      
      </div>
      <div className="line">
      <div className="label">
          设备编号
        </div>
        <Text ellipsis={{tooltip: props.value}}> {props.value}</Text>
        </div>
        <div className="line">
      <div className="label">
          更新时间
        </div>
        <Text ellipsis={{tooltip: props.lastSampleTime}}> {props.lastSampleTime}</Text>
        <div className="statebtn">{statebtn}</div>
        </div>
     {/*  <div className="gateway">
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
      </div> */}
    </>
  );
};
const Device = (props) => {
     // deviceStyle:22 太阳能路灯
   const statebtn =useBtn(props.state) 

  return (
    <>
      <div className="line">
        <div className="label">
          设备名称
        </div>
        <Text ellipsis={{tooltip: props.title}}>{props.title}</Text>
         
      </div>
      <div className="line"> 
        <div className="label">
          设备编号
        </div>
        <Text ellipsis={{tooltip: props.category}}>{props.category}</Text>    
      </div>
      <div className="line">
        <div className="label">
          安装地址
        </div>
        <Text ellipsis={{tooltip: props.value}}>{props.value}</Text>        
      </div>
      <div className="line">
        <div className="label">
          更新时间
        </div>
        <Text ellipsis={{tooltip: props.lastSampleTime}}>{props.lastSampleTime}</Text>
        <div className="statebtn">{statebtn}</div>
      </div>
    </>
  );
};
export default function Index(props) {
  // 1.网关设备 2.其他设备
  let { device, img, title, ...rest } = props;
   const mrgb = useSelector(MRGB) 
   const [r, g, b] = Array.isArray(mrgb) ? mrgb : [] 
   const fields = useMemo(()=> {
   const datas = props.fields
    if(Array.isArray(datas) && datas?.length > 0 ) {
     return  datas.map(f=> {
        const  value = f?.value
        const  farmt =  value=="Close" ? "合闸" :  value=="Open" ? "分闸" : value
        return {...f, value: farmt}
    })
   }else {
    return []
   }
  }, [props.fields])
   const items = <div className="values">{ fields?.map?.(f=>( <div className="item" >
    <Text ellipsis={{ellipsis: f?.name}} className="field">{f?.name}</Text>
    <span className="value">{f?.value}</span>
  </div> ))
}
  </div>

const gatewayitems = (<div className="values gateway">
  <div className="item">
<span className="field">{i18t("comm", "childdevice")}</span>
<span className="value">{props.childrenCnt}</span>
</div>
<div className="item">
<span className="field">{i18t("comm", "connection")}</span>
<span className="value">{props.connMethod}</span>
</div>
</div>)

  return (
    <CardItme rgb={[r, g, b]} len={props.fields?.length} device={props.device}>
      <div className="upcontent">
      <div className="cardImg">
        <img src={img} className="img" alt={title}></img>
      </div>
      <div className="rightinfo">
         {device == 1 ? <Gateway {...rest}  /> : <Device {...rest}   title={title} />}
      </div>
      </div>
      
        {device == 1 ?gatewayitems: items}
     
      {/* <div className="content">
        {device == 1 ? <Gateway {...rest}  /> : <Device {...rest}   title={title} />}
      </div> */}
    {/*   {
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
        } */}
    </CardItme>
  );
}
