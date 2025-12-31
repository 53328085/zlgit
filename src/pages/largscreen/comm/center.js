import React, { useEffect, useMemo, useState } from "react";
import {Badge} from 'antd'
import { useSelector } from "react-redux";
import { selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import { isObject } from "@com/usehandler";
import Ichart from '@com/useEcharts/Ichart'
import { Leftup } from "../style";
import { colors } from "../data";
import { useQueryOverview } from "../api";
import dayjs from "dayjs";
import Layoutcom from './layout'
export default function Index() {
  const areaId = useSelector(selectOneLevelDefaultId);
  const projectId = useSelector(selectProjectId);
  const [datas, setDatas] = useState({});
  const len =colors.length
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
 const baropt=useMemo(()=>{
    const {x=[], y=[],y1=[]}=datas
     return{
         series:   [{ 
           type: "bar", 
           seriesLayoutBy: 'row',           
           tooltip:{
          // valueFormatter: value=> value+unit
           }, 
          },
          { 
           type: "bar", 
           seriesLayoutBy: 'row',  
           tooltip:{
            // valueFormatter: value=> value+unit
             }, 
          }
         
         ] ,
         grid: {
           left: "0px",
           right: "0",
           top: "40px",
           bottom: "0px",
           containLabel: true,
           
         },
         legend: {
          show:true,
         // icon: "circle",
          itemWidth:12,
          itemHeight:8,
          textStyle: {
            color: "#fff",
            
          },
          // itemHeight: 4,
          // itemWidth: 16,
        },
        yAxis:{
         nameTextStyle:{
           color:"#fff",
         },
         axisLine:{ 
           show:false,
          },
          axisLabel: {
            color: "#fff",
            
          },
          splitLine:{
           show:false
          }
        },
        xAxis: {
          axisLabel: {
            showMaxLabel: true,
            hideOverlap: true,
            interval: "auto",
            color: "#fff",
          }
        },
         dataset: {
             dimensions: [
                 { name: '时间', type: 'time' },
                 { name: "本月用电量" },
                 { name: "上月用电量" },
               ] ,
               source: [x,y, y1],
               sourceHeader: false,
         },
         color:[
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#00C5FF' // 0% 处的颜色
            }, {
                offset: 1, color: '#0079ED' // 100% 处的颜色
            }],
            
          },
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#7FF2CC' // 0% 处的颜色
            }, {
                offset: 1, color: '#58CBA5' // 100% 处的颜色
            }],
            
          }
         ],
     }
 }, [datas])
  useEffect(() => {
    if ([areaId, projectId].some((id) => Number.isInteger(parseInt(id)))) {
      getData();
    }
  }, [areaId, projectId]);
  const title=`用能趋势${dayjs().format("MM")}月`
  return (
    <Layoutcom title={title}    flex="316px">
        <Ichart {...baropt}></Ichart>
    </Layoutcom>
  );
}
