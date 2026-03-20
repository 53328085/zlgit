import React  from "react";
import {Carousel } from 'antd'
 

import { Leftdown,Circle } from "../style";

 
import Layoutcom,{Prowarp} from './layout'
export default function Index({datas}) { 
  return (
    <Layoutcom title="区域用能排名" subtitle="近7天" flex="382px">
        <Leftdown>
          <div className="downtitle"><div className="circle"><Circle/>用电量</div><span>一级区域</span></div>
          <div className="slider-container">
<Carousel autoplay>
           {
            datas?.map?.((d,index)=>  <Prowarp datas={d} idx={index} ></Prowarp>)
           }  
</Carousel>
</div>
        </Leftdown>
    </Layoutcom>
  );
}
