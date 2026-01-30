import React, { useEffect, useMemo, useState } from "react";
import {Row, Col,Statistic } from 'antd'
import { useSelector } from "react-redux";
import { selectProjectId  } from "@redux/systemconfig";
import { isObject } from "@com/usehandler";
import Ichart from '@com/useEcharts/Ichart'
 
import { useQueryPVGeneration } from "../api";
 
import Layoutcom from './layout'
import {Rightdown} from '../style'
export default function Index() {
  
  const projectId = useSelector(selectProjectId);
  const [datas, setDatas] = useState({});
   
  const getData = async () => {
    try {
      
      let data = await useQueryPVGeneration({projectId} );
      if (isObject(data)) { 
          setDatas(data);
        }
     else {
          setDatas({});
       
      }
    } catch (e) {
      console.log(e);
    }
  };
 const baropt=useMemo(()=>{
    const {x=[], y=[]}=isObject(datas?.detail) ? datas.detail : {}
     return{
         series:   [{ 
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
                 { name: "发电量" }, 
               ] ,
               source: [x,y],
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
         ],
     }
 }, [datas])
  useEffect(() => {
    if ([ projectId].every((id) => Number.isInteger(parseInt(id)))) {
      getData();
    }
  }, [ projectId]);
  
  return (
    <Layoutcom title="光伏发电统计"    flex="318px" >
     <Rightdown>
      <Row gutter={8}>
         <Col span={8}>
         <Statistic title="本月发电量(kWh)" value={datas?.curMonth} />
         </Col>
         <Col span={8}>
         <Statistic title="本年发电量(kWh)" value={datas?.curYear} />
         </Col>
         <Col span={8}>
         <Statistic title="累计发电量(kWh)" value={datas?.total} />
         </Col>
      </Row>
        <Ichart {...baropt}></Ichart>
        </Rightdown>
    </Layoutcom>
  );
}
