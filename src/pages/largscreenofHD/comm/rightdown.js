import React, { useEffect, useMemo, useState } from "react";
import { Carousel, Badge} from 'antd'
 import {isObject} from '@com/usehandler'
import { Rightdown } from "../style";
 import Ichart from '@com/useEcharts/Ichart'
 import Cempty from "@com/useEmpty"
import Layoutcom from './layout'
 
import {useGetHuaDongAlarmInfo} from '../api'
import {useGetData,usecustompie} from '../usehook'
import nodata from "../icon/noData.png"
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
  const piecolor=["#FFB12B","#FF6021","#FF07A4"]
   const piecolor2=["rgba(255, 177, 43, 0.3)","rgba(255, 96, 33, 0.3)","rgba(255, 7, 164, 0.3)"]
export default function Index() {
 
  const datas = useGetData(useGetHuaDongAlarmInfo)
  const {levelNums=[],alarmInfos=[]} =  isObject(datas) ? datas : {}
  let chartDatas=levelNums?.map?.((d,i)=>({
    value:d.num,
    name:d.level,
    icon: "circle",
    itemStyle: {
               color: piecolor2[i%3] , 
             }
  }))  
    let chartDatas2=levelNums?.map?.((d,i)=>({
    value:d.num,
    name:d.level,
    icon: "circle",
    itemStyle: {
               color: piecolor[i%3] , 
             }
  })) 
  const baroption = usecustompie({datas:chartDatas, datas2:chartDatas2})
   
 
  
 

  return (
    <Layoutcom title="告警信息"     flex="283px" pd="0px 20px 20px 20px">
        <Rightdown>
       {levelNums?.length  ?  <div className="levelchart">
        
           <div className="barchart">
             <Ichart custoption={baroption} emptyStyle={{height:"60px"}} />
            </div> 
            <div className="levels">
      {
      levelNums?.map?.((d,i)=>(<div className="level">
           <Badge color={piecolor[i%3]} text={new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(d.level)+"告警"}/> 
           <span className="value">{d.num}</span>
        </div>
       ))
      }
            
          </div> 
          </div>  
          : <Cempty image={nodata} imgStyle={{height:"75px"}} tip={"暂无告警数据"} ></Cempty> 
    }
         <div className="contentwrap">
          <div className="cols">
            <div>设备名称</div>
            <div>告警信息</div>
            <div>告警时间</div>
          
          </div>
         <div className="slider-container">
         <Carousel autoplay {...settings} style={{height: 128 }}>
             { alarmInfos?.map?.(d=>(
              <div className="row" key={d.name}>
                <div> {d.deviceName}</div>
                <span>{d.alarmName}</span>  
                <span>{d.alarmTime}</span>
              </div>
             ))}
          </Carousel>
          </div>
         </div>
 
        </Rightdown>
    </Layoutcom>
  );
}
