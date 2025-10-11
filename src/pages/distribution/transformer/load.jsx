import React, {useEffect, useMemo,useState} from 'react'
import {Badge} from 'antd'
import {Loadwrapper} from './style'
import{useTransformerLoadRate} from './api'
import Ichart from '@com/useEcharts/Ichart';
import {isObject} from "@com/usehandler"
export default function Index({sn, projectId}) {
  const [datas, setDatas,] = useState({})
  const getData =async ()=> {
    try{
      const {success, data} = await  useTransformerLoadRate({sn, projectId})
      if(success && isObject(data)) {
        setDatas(data)
      }else {
        setDatas({})
      }
    } catch (error) {
      console.log(error)
    }
   
  } 
  useEffect(()=>{
    if(sn && Number.isInteger(projectId)) {
        getData()
    }
   
  },[sn, projectId])
  const goption = useMemo(()=>{
    return {
        type:5,
        series: [
          {
            type: 'gauge',
            radius: "90%",
          
            axisLine: { //仪表盘轴线
              lineStyle: {
                width: 20,
                color: [
                  [datas?.lightLimit/100, 'rgba(39, 111, 255, 1)'],
                  [datas?.highLimit/100, 'rgba(5, 192, 110, 1)'],
                  [1, 'rgba(255, 112, 38, 1)']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 4
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 40,
              fontSize: 15
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%\n',
              color: "#606266",
              fontSize: 15, 
            },
            data: [
              {
                name: '实时负载率',
                value: datas?.occuredLoadRate,
                title: {
                  offsetCenter: [0, '50%'],
                  show:true,
                  fontSize:15,
                  color: "#606266",
                  fontWeight: "bold",
                //  lineHeight: 66,
               
                },
              }
            ]
          }
        ]
      };
  },[datas])
  return (
    <Loadwrapper>
        <div className='leftwrap'>
         <Badge status='processing' text="变压器负载率"></Badge>
         <div className="chart">
            <Ichart  custoption={goption}></Ichart>
         </div>
         <div className="bottom"></div>
        </div>
        <div className='rightwrap'>
           <Badge status='processing' text="视在功率曲线"></Badge>
        </div>
    </Loadwrapper>
  )
}
