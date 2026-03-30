import React from "react";
 
import { isObject } from "@com/usehandler";
 
 
import { Right2nd } from "../style";
import imgurl from '../icon'
import {useGetHuaDongAirConditionerRunInfo} from '../api'
import {useGetData,usebarlineright2nd } from '../usehook'
import Ichart from '@com/useEcharts/Ichart'
import Layoutcom from "./layout";
export default function Index() {
  const data = useGetData(useGetHuaDongAirConditionerRunInfo);
  const { runNumm, eUse,eSave,monthEnergies={} } =isObject(data) ? data : {}
  const option = usebarlineright2nd({datas:monthEnergies})
  return (
    <Layoutcom title="空调运行情况" flex="285px">
      <Right2nd>
        <div className="tip">
         <div className="item">
           <div className="icon">
             <img src={imgurl["nums"]} className="img" alt="运行/台备份"></img>
           </div>
           <div className="data">
           <div className="title">运行/台备份</div>
           <div className="value">
             {runNumm}
           </div>
          </div>
         </div>
          <div className="item">
              <div className="icon">
             <img src={imgurl["air2"]} className="img" alt="空调用量"></img>
           </div>
           <div className="data"> 
           <div className="title">空调用量</div>
           <div className="value">
             {eUse}
           </div>
         </div>
         </div>
          <div className="item">
             <div className="icon">
             <img src={imgurl["air3"]} className="img" alt="节能电量"></img>
           </div>
           <div className="data">
           <div className="title">节能电量</div>
           <div className="value">
             {eSave}
           </div>
          </div>
         </div>
         </div>
        <div className="airconditionermap">
           <Ichart custoption={option} />
         </div>
      </Right2nd>
    </Layoutcom>
  );
}
