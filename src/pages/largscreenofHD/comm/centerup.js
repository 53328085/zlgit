import React, {  useMemo} from "react";

import Ichart from '@com/useEcharts/Ichart'
import {isObject} from "@com/usehandler"
import dayjs from "dayjs";
import Layoutcom from './layout'
export default function Index({datas}) {
 
  
  
 const lineopt=useMemo(()=>{
    const {x=[], y=[],y1=[]}=isObject(datas) ? datas : {}
     return{
         series:   [{ 
           type: "line", 
           seriesLayoutBy: 'row', 
           smooth:0.3, 
           tooltip:{
          // valueFormatter: value=> value+unit
           }, 
          },
          { 
           type: "line", 
           seriesLayoutBy: 'row',  
           smooth:0.3, 
           tooltip:{
            // valueFormatter: value=> value+unit
             }, 
          }
         
         ] ,
         grid: {
           left: "0px",
           right: "0",
           top: "40px",
           bottom: "0px",
           containLabel: true,
           
         },
         legend: {
           show:true,
           icon: "circle",
           color:[
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: '#00C5FF' // 0% 处的颜色
              }, {
                  offset: 1, color: '#0079ED' // 100% 处的颜色
              }],
              
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: '#7FF2CC' // 0% 处的颜色
              }, {
                  offset: 1, color: '#58CBA5' // 100% 处的颜色
              }],
              
            }
           ],
           textStyle: {
             color: "#fff",
             
           },
           // itemHeight: 4,
           // itemWidth: 16,
         },
         yAxis:{
          name:"kW",
          nameTextStyle:{
            color:"#fff",
          },
          axisLine:{ 
            show:false,
           },
           axisLabel: {
             color: "#fff",
             
           },
           splitLine:{
            show:false
           }
         },
         xAxis: {
           axisLabel: {
             showMaxLabel: true,
             hideOverlap: true,
             interval: "auto",
             color: "#fff",
           }
         },
         dataset: {
             dimensions: [
                 { name: '时间', type: 'time' },
                 { name: "本月最高负荷" },
                 { name: "上月最高负荷" },
               ] ,
               source: [x,y, y1],
               sourceHeader: false,
         },
         color:["#3772FF","#5ED9A7"]
     }
 }, [datas])
 
  const title=`用电负荷趋势${dayjs().format("MM")}月`
  return (
    <Layoutcom title={title}    flex="318px">
        <Ichart {...lineopt}></Ichart>
    </Layoutcom>
  );
}
