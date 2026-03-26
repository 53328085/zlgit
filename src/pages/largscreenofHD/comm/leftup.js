import React from "react";
import {useRequest} from 'ahooks'
 
 
import Ichart from '@com/useEcharts/Ichart'

import {isObject} from "@com/usehandler"
import { Leftup } from "../style";
import { colors,intervalTime ,useLineopt} from "../data";
import {useGetHuaDongTodyEnergyInfo} from '../api'
import Layoutcom from './layout'
import Item from "./item"
export default function Index({projectId}) {
   
  const getData = async()=>{
    try{
      console.log("启动轮询")
       const {data, success} = await useGetHuaDongTodyEnergyInfo({projectId})
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
 const {hourEnergies,totalEnergies} = isObject(data) ? data : {}
  
 
  const lineopt= useLineopt({datas:hourEnergies})
   
  return (
    <Layoutcom title="今日能耗统计"  flex="420px">
        <Leftup>
            <div className="items">
             { totalEnergies?.map?.(d => <Item {...d} key={d.name}></Item>)}
            </div>
 
        <Ichart custoption={lineopt}></Ichart>
        </Leftup>
    </Layoutcom>
  );
}
