import React, { useEffect, useMemo, useState } from "react";
import {Badge,Carousel} from 'antd'
 
import { Centerdown } from "../style";
import { colors, useOpt } from "../data";
 
import Layoutcom from './layout'
export default function Index({datas,monthTotal}) {
   
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    vertical: true,
   // verticalSwiping: true,
   speed: 2000,
   autoplaySpeed: 1000,
   
  }
  
  return (
    <Layoutcom title="分项用能排名" subtitle="近7天"    flex="318px" pd="0px 20px 20px 20px">
        <Centerdown>
         <div className="centertitle">
          <div className="percentage">
             前五区域用电量占比{datas?.percent}
          </div>
          <div className="info">
            <div className="centertotal">
               本月共计用电<span className="month">{monthTotal}kWh</span>
            </div>
            <div className="percentline">
              {datas?.top5?.map?.((item,index)=>(<div   style={{width: item.width+'px',backgroundColor:colors?.[index]}}></div>) )}
            </div>
          </div>
         </div>
         <div className="contentwrap">
          <div className="cols">
            <div>排名</div>
            <div>区域名称</div>
            <div>用电量(kWh)</div>
            <div>用电量占比(%)</div>
          </div>
         <div className="slider-container">
         <Carousel autoplay {...settings} style={{height: 160 }}>
             {datas?.data?.map?.((d,index)=>(
              <div className="row" key={d.name}>
                <span>NO.{index+1}</span>
                <Badge color={colors[index%colors.length]} text={d.name}/>
                <span>{d?.value}</span>
                <span>{d?.percent}</span>
              </div>
             ))}
          </Carousel>
          </div>
         </div>

        </Centerdown>
    </Layoutcom>
  );
}
