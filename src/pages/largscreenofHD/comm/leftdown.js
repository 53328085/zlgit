import React from "react";
 
import { useGetHuaDongDeviceRunInfo } from "../api";
import imgurl from "../icon";
import { Leftdown } from "../style";
 
import {useGetData } from '../usehook'
import Layoutcom from "./layout";
export default function Index({ projectId }) {
 
 
  const data  = useGetData(useGetHuaDongDeviceRunInfo)
  return (
    <Layoutcom title="设备运行工况" flex="420px">
      <Leftdown>
        <div className="part">
          <div className="title">在线率</div>
          <div className="value">{data?.onlineRate}</div>
          <div className="imgbox">
            <img src={imgurl["online"]} className="img"></img>
          </div>
        </div>
        <div className="part">
          <div className="sub">
            <div className="imgbox">
              <img src={imgurl["normal"]} className="img"></img>
            </div>
            <div className="valuewrap">
              <div className="title">正常</div>
              <div className="value">{data?.onlineNum}</div>
            </div>
          </div>
         <div className="sub">
            <div className="imgbox">
              <img src={imgurl["offline"]} className="img"></img>
            </div>
            <div className="valuewrap">
              <div className="title">离线</div>
              <div className="value">{data?.offlineNum}</div>
            </div>
          </div>
        </div>
      </Leftdown>
    </Layoutcom>
  );
}
