import React, { useEffect, useMemo, useState } from "react";
import { Carousel} from 'antd'
 import {isObject} from '@com/usehandler'
import { Centerdown } from "../style";
 import Ichart from '@com/useEcharts/Ichart'
import {delayTime}  from '../data'
import Layoutcom from './layout'
import Btncom from "./Btn"
import imgurl from '../icon'
import {useGetHuaDongAreaEnergyInfo} from '../api'
import {useGetData,usebarline} from '../usehook'
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
export default function Index() {
  const [meterType, setMeterType] = useState(1)
  const datas = useGetData(useGetHuaDongAreaEnergyInfo)
  const data = useMemo(()=>{
    if (!Array.isArray(datas) || datas.length==0) return  {}
    let data = datas?.find(d =>d.id==meterType)
    return  isObject(data) ? data : {}
  }, [datas, meterType])
  const baroption = usebarline({datas:data?.monthEnergies, type:meterType})
   
  const imgnames= {0:"1st", 1:"2nd", 2:"3rd"}
  const text =useMemo(()=>{
     return  {1:"本月用电量(kWh)", 2:"本月冷水((m³)", 7:"本月热水(m³)"}[meterType]
  },[meterType])
  useEffect(()=>{ 
    let timer, count=0
    timer = setInterval(()=>{
       if(count>=3) {
         count=0
       }
      
       setMeterType([1,2,7][count])
       count++
    },delayTime)
    return ()=>{
      clearInterval(timer)
    }
  },[])

  return (
    <Layoutcom title="区域能耗趋势" extend={<Btncom meterType={meterType} onClick={setMeterType} />}    flex="232px" pd="0px 20px 20px 20px">
        <Centerdown>
          <div className="charbox">
            <Ichart custoption={baroption} />
          </div>
    {/*      <div className="centertitle">
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
         </div> */}
         <div className="contentwrap">
          <div className="cols">
            <div>#</div>
            <div>区域</div>
            <div>{text}</div>
          
          </div>
         <div className="slider-container">
         <Carousel autoplay {...settings} style={{height: 160 }}>
             { data?.rank?.map?.((d,index)=>(
              <div className="row" key={d.name}>
                <div className={index<3 ? "imgbox" : "circle"}> {index<3 ? <img src={imgurl[imgnames[index]]} className="img"></img>: index+1 }</div>
                <span>{d.name}</span>  
                <span>{d.value}</span>
              </div>
             ))}
          </Carousel>
          </div>
         </div>

        </Centerdown>
    </Layoutcom>
  );
}
