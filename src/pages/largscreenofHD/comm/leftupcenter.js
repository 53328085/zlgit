import React, {   useMemo , useState } from "react";
import {useRequest} from 'ahooks'
 
 
import Ichart from '@com/useEcharts/Ichart'

import {isObject} from "@com/usehandler"
import { Leftcenter } from "../style";
import { colors,intervalTime ,usebarline} from "../data";
import {useGetHuaDongCarbonInfo} from '../api'
import Layoutcom from './layout'
import imgurl from '../icon'
// 碳排管理
export default function Index({projectId}) {
   
  const getData = async()=>{
    try{
      console.log("启动轮询")
       const {data, success} = await useGetHuaDongCarbonInfo({projectId})
       if (success && isObject(data)){
        return data
       }else {
         return {}
       }
        
    } catch (error) {
     
      console.log(error)
      return {}
    }
   
    
  }
 const {data} = useRequest(getData,{
    manual:false,
    pollingInterval: intervalTime,
    pollingErrorRetryCount: 3,
    refreshDeps:[projectId],
  
 })
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
 
        <Ichart custoption={lineopt}></Ichart>
        </Leftcenter>
    </Layoutcom>
  );
}
