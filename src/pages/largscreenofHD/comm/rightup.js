import React from "react";
 
import { isObject } from "@com/usehandler";
 
 
import { Rightup } from "../style";
import imgurl from '../icon'
import {useGetHuaDongDistributionInfo} from '../api'
import {useGetData } from '../usehook'

import Layoutcom from "./layout";
export default function Index() {
  const data = useGetData(useGetHuaDongDistributionInfo);
  const { num, capacity,maxPowr } =isObject(data) ? data : {}
  return (
    <Layoutcom title="变配电情况" flex="185px">
      <Rightup>
         <div className="item">
           <div className="title">变压器数量</div>
           <div className="value">
             {num}
           </div>
           <div className="icon">
             <img src={imgurl["nums"]} className="img" alt="变压器数量"></img>
           </div>
         </div>
          <div className="item">
           <div className="title">变压器容量</div>
           <div className="value">
             {capacity}
           </div>
           <div className="icon">
             <img src={imgurl["capacity"]} className="img" alt="变压器容量"></img>
           </div>
         </div>
          <div className="item">
           <div className="title">最大功率</div>
           <div className="value">
             {maxPowr}
           </div>
           <div className="icon">
             <img src={imgurl["maxPower"]} className="img" alt="最大功率"></img>
           </div>
         </div>
      </Rightup>
    </Layoutcom>
  );
}
