import React, {useEffect, useMemo,useState, useContext} from 'react'
import {Badge} from 'antd'
import {Loadwrapper, Item} from './style'
import{useTransformerLoadRate} from './api'
import Ichart from '@com/useEcharts/Ichart';
import {isObject} from "@com/usehandler"
import dayjs from 'dayjs';
import CustContext from '@com/content'
import {Cspin} from "@com/comstyled"
export default function Index({sn, projectId }) {

  const {value} = useContext(CustContext)
  console.log('value',value)
  const [datas, setDatas,] = useState({})
  const [spinning, setSpinning]=useState(false)
  const getData =async ()=> {
    try{
      setSpinning(true)
      const {success, data} = await  useTransformerLoadRate({sn, projectId})
      if(success && isObject(data)) {
        setDatas(data)
        setSpinning(false)
      }else {
        setDatas({})
        setSpinning(false)
      }
    } catch (error) {
      setSpinning(false)
      console.log(error)
    }
   
  } 
  useEffect(()=>{
    if(sn && Number.isInteger(projectId) ) {
        getData()
    }
   
  },[sn, projectId ])
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
              fontSize: 14, 
            },
            data: [
              {
                name: '实时负载率',
                value: datas?.occuredLoadRate,
                title: {
                  offsetCenter: [0, '50%'],
                  show:true,
                  fontSize:14,
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
  const lineopt = useMemo(()=>{
    const {historyTrend} = datas
    const {point, data=[]} =historyTrend?.[0]?.data?.[0] || {}
    return {
        series: [{ type: "line", seriesLayoutBy: 'row',markLine:{
           
         
         
            data: [
              {
                name: "超载",
                yAxis: datas?.overLoadLine,
              },
              {
                name: "重载",
                yAxis: datas?.highLoadLine,
              },
              {
                name: "轻载",
                yAxis: datas?.lightLoadLine,
              }

            ]
        } }],
        grid: {
            left: "0px",
            right: "0",
            top: "40px",
            bottom: "16px",
            containLabel: true,
          },
          yAxis: { 
           max: datas?.overLoadLine ,
          },
          xAxis: {
             axisLabel:{
                formatter: (value) => {
                    return dayjs(value).format('HH:mm')
                }
             }
          },
        dataset: {
            dimensions:[{
              name: 'time', displayName: "时间",
            }, {name: "value", displayName: "视在功率"}],
            source: Array.isArray(data) ? data : [],
            sourceHeader: false,
          },
      };
  },[datas])
  return (
    <Cspin spinning={spinning} tip="数据加载中">
    <Loadwrapper>
     
        <div className='leftwrap'>
         <Badge status='processing' text="变压器负载率"></Badge>
         <div className="chart">
            <Ichart  custoption={goption}></Ichart>
         </div>
         <div className="bottom"> 
         </div>
        </div>
        <div className='rightwrap'>
           <Badge status='processing' text="视在功率曲线"></Badge>
           <div className="chartup">
             <Item bgcolor="rgba(255,177,43,0.25)" fontcolor="#DF981F">
                <p className='title'><span className='name'>轻载</span><span>{datas?.lightLoadNum}次</span></p>
                <span className='per'>{datas?.lightLoadNumRate}%</span>
             </Item>
             <Item bgcolor="rgba(255, 112, 38, 0.25)" fontcolor="#FF7026">
                <p className='title'><span className='name'>重载</span><span>{datas?.highLoadNum}次</span></p>
                <span className='per'>{datas?.highLoadNumRate}%</span>
             </Item>
             <Item bgcolor="rgba(255, 42, 42, 0.25)" fontcolor="#FF2A2A">
                <p className='title'><span className='name'>超载</span><span>{datas?.overLoadNum}次</span></p>
                <span className='per'>{datas?.overLoadNumRate}%</span>
             </Item>
             <Item bgcolor="rgba(39, 111, 255, 0.25)" fontcolor="#0D59B7">
                <p className='title'><span className='name'>正常</span><span>{datas?.normalLoadNum}次</span></p>
                <span className='per'>{datas?.normalLoadNumRate}%</span>
             </Item>
           </div>
           <div className='chart_bottom'> 
           <Ichart   {...lineopt} /> 
           </div>
        </div>
       
    </Loadwrapper>
    </Cspin>
  )
}
