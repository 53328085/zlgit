import React, { useEffect, useMemo, useState } from "react";
import {Carousel } from 'antd'
import { useSelector } from "react-redux";
import { selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import { isObject,chunkArray } from "@com/usehandler";

import { Leftdown,Circle } from "../style";

import { useQueryEnergyRankByArea } from "../api";
import dayjs from "dayjs";
import Layoutcom,{Prowarp} from './layout'
export default function Index() {
  const areaId = useSelector(selectOneLevelDefaultId);
  const projectId = useSelector(selectProjectId);
  const [datas, setDatas] = useState([]);
  const [maxValue, setMaxValue] = useState(0)
  console.log(maxValue)
  const getData = async () => {
    try {
      let query = {
        projectId: projectId,
        start: dayjs().subtract(7,"day").format("YYYY-MM-DD"),
        end: dayjs().format("YYYY-MM-DD"),        
      };
      let { data, success } = await useQueryEnergyRankByArea(query);
      if (success && Array.isArray(data) && data.length > 0) {
         if (isObject(data[0])) {
            let {consumeRank}= data[0];
            if(Array.isArray(consumeRank)) {
             // let max = Math.max(...consumeRank.map(item => parseFloat(item.value)));
              let ranks = consumeRank.sort((a,b)=> parseFloat(b.value) - parseFloat(a.value))?.map(a=>({...a, percent:parseFloat(a.percent)}));
              let arrt =chunkArray(ranks, 5)
             // setMaxValue(max);
              setDatas(arrt);
            }else{
              setDatas([]);
            }
          
         }else{ 
          setDatas([]);
         }
        
      }else { 
        setDatas([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if ([areaId, projectId].some((id) => Number.isInteger(parseInt(id)))) {
    //  getData();
    }
  }, [areaId, projectId]);
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
