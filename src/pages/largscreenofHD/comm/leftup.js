import React from "react";
import {useRequest} from 'ahooks'
 
 
import Ichart from '@com/useEcharts/Ichart'

import {isObject} from "@com/usehandler"
import { Leftup } from "../style";
import { useLineopt} from "../data";
import {useGetHuaDongTodyEnergyInfo} from '../api'
import Layoutcom from './layout'
import Item from "./item"
import {useGetData } from '../usehook'
export default function Index() {
   
 
 const data = useGetData(useGetHuaDongTodyEnergyInfo)
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
