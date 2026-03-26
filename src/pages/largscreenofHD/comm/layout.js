import React from "react";
import { Progress } from "antd";
import { Layoutcom, Titlesty } from "../style";
import {useLineopt} from "../data"
import Ichart from '@com/useEcharts/Ichart'
const Titlecom = function ({ title, subtitle,extend }) {
  return (
    <Titlesty>
      <span className="chartTitle">{title}</span>
      <span className="subtitle">{subtitle}</span>
      {extend}
    </Titlesty>
  );
};
export default function Index({ children, title, subtitle, flex,pd,extend, ...props }) {
  return (
    <Layoutcom flex={flex} pd={pd}>
      <Titlecom title={title} subtitle={subtitle} extend={extend}></Titlecom>
      <div className="chartwrap">{children}</div>
    </Layoutcom>
  );
}
  const Probar = function ({  data, index,order }) {
  let i = index + 1
  let fag = i<4 && order==0;
  
  return (
      <div className="proitem">
        <div className="rank">
           <span className={fag ? "top" : "top other"}><span className="mgr">TOP</span> {i+5*order}</span>
           <div className="keyval">
             <span>{data.name}</span>
             <span>{data.value}kWh</span> 
            </div>
        </div>
        <Progress percent={data.percent} strokeColor={{
        from: '#0079ED',
        to: '#00C5FF',
      }} status={fag ? "active": "normal"} showInfo={false}  />
      </div>
  );
};
export  const Prowarp = function({datas,idx}) { 
 
  return (
      <div className="probox">
           {
                      datas?.map?.((d,index)=>  <Probar index={index} data={d}  order={idx} key={d.name}></Probar>)
                     }  
      </div>
  )
}

export const Chartcom=function({index, datas}){
  const lineopt= useLineopt({index, datas:datas?.detail, name:datas?.equipmentName})
  return (
      <div className="chartbox">
           <Ichart {...lineopt}></Ichart>
      </div>
  )
}