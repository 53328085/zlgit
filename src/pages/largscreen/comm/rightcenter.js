import React from "react";
import {Carousel } from 'antd'
 

import { Rightupcenter  } from "../style";

 
import Layoutcom,{Chartcom} from './layout'
export default function Index({datas}) { 
  return (
    <Layoutcom title="空压机KPI曲线" subtitle="近7天" flex="318px">
        <Rightupcenter>
           
          <div className="slider-container">
<Carousel autoplay effect="fade" style={{height: 234 }}>
           {
            datas?.map?.((d,index)=>  <Chartcom datas={d} index={index} key={d.equipmentName} ></Chartcom>)
           }  
</Carousel>
</div>
        </Rightupcenter>
    </Layoutcom>
  );
}
