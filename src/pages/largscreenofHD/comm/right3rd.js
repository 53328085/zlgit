import React,{useEffect, useRef} from "react";
 
import { isObject } from "@com/usehandler";
 
import {delayTime} from "../data"
import { Right3rd } from "../style";
import imgurl from '../icon'
import {useGetHuaDongStreetLightRunInfo} from '../api'
import {useGetData,usepieoption } from '../usehook'
import Ichart from '@com/useEcharts/Ichart'
import Layoutcom from "./layout";
export default function Index() {
  const data = useGetData(useGetHuaDongStreetLightRunInfo);
  const pieRef = useRef();
  const rateRef= useRef();
  const { lightRate, lightTypes,todayEUsed } =isObject(data) ? data : {}
  const option = usepieoption({datas:lightTypes?.map(d=>({name:d.typeName,value:d.num}))})
  const rateopt = usepieoption({datas:[{name:'亮灯率',value:Number.parseFloat(lightRate)},{name:'灭灯率',value:100-Number.parseFloat(lightRate)}],emphasis:{label:{formatter: ["{d}%", "{a|{b}}"].join("\n")}}})
 

  useEffect(()=>{
   let timer,dataIndex=0;

   timer= setInterval(()=>{ 
       if (lightTypes.length==dataIndex) { 
      dataIndex=0;
   }
     pieRef?.current?.dispatchAction?.({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex,
        });  
        dataIndex++;
       pieRef?.current?.dispatchAction?.({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: dataIndex%lightTypes.length,
        });
   },delayTime)
   return ()=>{
     clearInterval(timer)
    
}} ,[lightTypes])
useEffect(()=>{
   if (lightRate) {
     rateRef?.current?.dispatchAction?.({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0,
        });
   }
 },[lightRate])
 useEffect(()=>{
   if (Array.isArray(lightTypes) && lightTypes.length>0) {
     pieRef?.current?.dispatchAction?.({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0,
        });
   }
 },[lightTypes])
  return (
    <Layoutcom title="路灯运行情况" flex="185px">
      <Right3rd>
        <div className="streetlingtMap" key="rate">
           <Ichart custoption={option} ref={pieRef} />
         </div>
          <div className="streetlingtMap" key="light">
           <Ichart custoption={rateopt} ref={rateRef}  />
         </div>
          <div className="part">
          <div className="title">今日用电(kWh)</div>
          <div className="value">{todayEUsed}</div>
          <div className="imgbox">
            <img src={imgurl["online"]} className="img"></img>
          </div>
        </div>
      </Right3rd>
    </Layoutcom>
  );
}
