import React, {   useMemo , useState } from "react";
import {useRequest} from 'ahooks'
 
 
import Ichart from '@com/useEcharts/Ichart'

import {isObject} from "@com/usehandler"
import { Leftcenter } from "../style";
import { usebarline} from "../data";
import {useGetHuaDongCarbonInfo} from '../api'
import Layoutcom from './layout'
import imgurl from '../icon'
import {useGetData } from '../usehook'
// 碳排管理
export default function Index({projectId}) {
   
 
 

 const data = useGetData(useGetHuaDongCarbonInfo)
 const {monthCarbons={}} = isObject(data) ? data : {}
  
 
  const lineopt= usebarline({datas:monthCarbons})
   
  return (
    <Layoutcom title="碳排管理"  flex="420px">
        <Leftcenter>
            <div className="item">
               <div className="icon">
                 <img src={imgurl["co2"]} alt="icon" className="img" />
               </div>
               <div className="content">
                  <div className="title">累计碳排量(kg)</div>
                  <div className="value">{data?.total}</div>
               </div>
            </div>
        <div className="carbon">
 <Ichart custoption={lineopt}></Ichart>
        </div>
        </Leftcenter>
    </Layoutcom>
  );
}
