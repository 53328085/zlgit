import React, { useEffect, useMemo, useState } from "react";
import {Badge,Carousel} from 'antd'
import { useSelector } from "react-redux";
import { selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import { isObject } from "@com/usehandler";
import Ichart from '@com/useEcharts/Ichart'
import { Centerdown } from "../style";
import { colors, useOpt } from "../data";
import { useQueryEnergyDetail,body } from "../api";
import dayjs from "dayjs";
import Layoutcom from './layout'
export default function Index() {
  const areaId = useSelector(selectOneLevelDefaultId);
  const projectId = useSelector(selectProjectId);
    const [datas, setDatas] = useState({
      data:[],
      total: 0,
      percentage:0,
      top5:[]
    });
 const option = useOpt(datas)
  const getData = async () => {
    try {
      let query = {
        projectId: projectId,
        start: dayjs().subtract(7,"day").format("YYYY-MM-DD"),
        end: dayjs().format("YYYY-MM-DD"),        
      };
      let { data, success } = await useQueryEnergyDetail({},body);  // 参数，接口需要重写。先用这个接口
      if (success && isObject(data)) {
         const {proportion         } = data
         if (Array.isArray(proportion)) {
           
           
              let ranks = proportion.sort((a,b)=> parseFloat(b.value) - parseFloat(a.value))?.map(a=>({...a, value:parseFloat(a.value)}));
              let total = ranks?.reduce((a,b)=> a+ b.value,0)
              let beforefive= ranks?.slice(0,5)?.reduce((a,b)=> a+ b.value,0)
              let percentage = beforefive!==0?   ((beforefive/total)*100)?.toFixed(2) + "%":0

             // setMaxValue(max);
              setDatas({
                data:ranks,
                total,
                percentage,
                top5:ranks?.slice(0,5)
              });
           
          
         }else{ 
          setDatas({
            data:[],
            total: 0,
            percentage:0,
            top5:[]
          });
         }
        
      }else { 
        setDatas({
          data:[],
          total: 0,
          percentage:0,
          top5:[]
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
 
  useEffect(() => {
    if ([areaId, projectId].some((id) => Number.isInteger(parseInt(id)))) {
      getData();
    }
  }, [areaId, projectId]);
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    speed: 1000,
    autoplaySpeed: 1000,
   
  }
  
  return (
    <Layoutcom title="分项用能排名" subtitle="近7天"    flex="316px">
        <Centerdown>
         <div className="centertitle">
          <div className="percentage">
             前五区域用电量占比{datas.percentage}
          </div>
          <div className="info">
            <div className="centertotal">
               本月共计用电<span className="month">{datas.total}kWh</span>
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
         <Carousel autoplay {...settings} style={{height: 188,width: 760}}>
             {datas.data?.map?.((d,index)=>(
              <div className="row" key={d.name}>
                <span>NO.{index+1}</span>
                <Badge color={colors[index%colors.length]} text={d.name}/>
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
