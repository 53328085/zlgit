import React,{useState}  from "react";
import {Carousel } from 'antd'
 

import { Leftdown,Circle } from "../style";

 
import Layoutcom,{Prowarp} from './layout'
export default function Index({datas}) { 
  const [level, setLevel] = useState(1);
  const afterChange = (current) => {
    console.log("current",current);
    setLevel(current+1);
  };
  const  grade = new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(level)
  return (
    <Layoutcom title="区域用能排名" subtitle="近7天" flex="382px">
        <Leftdown>
          <div className="downtitle"><div className="circle"><Circle/>用电量</div><span>{grade}级区域</span></div>
          <div className="slider-container">
<Carousel autoplay afterChange={afterChange}>
           {
            datas?.map?.((d,index)=>  <Prowarp datas={d} idx={index} ></Prowarp>)
           }  
</Carousel>
</div>
        </Leftdown>
    </Layoutcom>
  );
}
