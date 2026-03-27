import React from "react";
import { Progress } from "antd";
import { Layoutcom, Titlesty } from "../style";
import {useLineopt} from "../data"
import Ichart from '@com/useEcharts/Ichart'
const Titlecom = function ({ title, subtitle }) {
  return (
    <Titlesty>
      <span className="chartTitle">{title}</span>
      <span className="subtitle">{subtitle}</span>
    </Titlesty>
  );
};
export default function Index({ children, title, subtitle, flex,pd, ...props }) {
  return (
    <Layoutcom flex={flex} pd={pd}>
      <Titlecom title={title} subtitle={subtitle}></Titlecom>
      <div className="chartwrap">{children}</div>
    </Layoutcom>
  );
}
  const Probar = function ({  data, index  }) {
  let i = index + 1
  let fag = i<4  ;
  
  return (
      <div className="proitem">
        <div className="rank">
           <span className={fag ? "top" : "top other"}><span className="mgr">TOP</span> {i}</span>
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
export  const Prowarp = function({datas }) { 
 
  return (
      <div className="probox">
           {
                      datas?.map?.((d,index)=>  <Probar index={index} data={d}    key={d.name}></Probar>)
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