import React, { useEffect, useMemo, useState } from "react";
import {Carousel } from 'antd'
import { useSelector } from "react-redux";
import { selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import { isObject,chunkArray } from "@com/usehandler";

import { Rightupcenter,Circle } from "../style";

import { useQueryOverview } from "../api";
import dayjs from "dayjs";
import Layoutcom,{Chartcom} from './layout'
export default function Index() {
  const areaId = useSelector(selectOneLevelDefaultId);
  const projectId = useSelector(selectProjectId);
  const [datas, setDatas] = useState([]);
  const mock= [{x:datas.x, y:datas.y,name: 'COP'},{x:datas.x, y:datas.y1,name:'COP1'}]
   const getData = async () => {
     try {
       let body = {
         projectId: projectId,
         dayMonthYear: 2,
         startDate: dayjs().startOf().format("YYYY-MM-DD"),
         endDate: dayjs().endOf().format("YYYY-MM-DD"),
         areaIds: [areaId],
         meterType: 1,
         name: "全部",
         group: 1,
       };
       let { data, success } = await useQueryOverview({}, body);
       if (success && isObject(data)) {
         let { detail } = data;
         if (isObject(detail)) {
           setDatas(detail);
         } else {
           setDatas({});
         }
       }
     } catch (e) {
       console.log(e);
     }
   };
 

  useEffect(() => {
    if ([areaId, projectId].some((id) => Number.isInteger(parseInt(id)))) {
     // getData();
    }
  }, [areaId, projectId]);
  return (
    <Layoutcom title="制冷机COP曲线" subtitle="近7天" flex="316px">
        <Rightupcenter>
          <div className="slider-container">
<Carousel autoplay effect="fade">
           {
            mock?.map?.((d,index)=>  <Chartcom datas={d} index={index} ></Chartcom>)
           }  
</Carousel>
</div>
        </Rightupcenter>
    </Layoutcom>
  );
}
