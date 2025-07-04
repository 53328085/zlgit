import React,{useRef, useEffect, useState, useMemo} from 'react'
 
import Pagecount from '@com/pagecontent'
import {isObject} from "@com/usehandler"
 
import {useOutletContext} from "react-router-dom"
import {useOverview} from "./api"
import imgurl from './imgs'
import {custsty,  Mainwrap} from './style'
import Ichart from "@com/useEcharts/Ichart"
 
let timedata = Array.from({length: 10},(_, index)=> `0${index}:0${index}`)
let randData = Array.from({length:10}, (_, index)=> Math.round(Math.random()*100))
console.log(timedata)
console.log(randData)
export default function Index() {
  const [datas, setDatas] = useState({})
 
  const {projectId} = useOutletContext()

 const [lineopt, baropt] = useMemo(()=> {
   let {lightRate, lightEnergy} = isObject(datas) ? datas : {}
   const comm ={
    grid: {
      left: "0px",
      right: "0",
      top: "40px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: "0px", 
      textStyle: {
        color:"#fff"
      }
    },
    xAxis: {
      axisLabel: {
        showMaxLabel: true,
        hideOverlap: true,
        interval: "auto"
      }
    },
   }
   let lopt ={
    series: [{ type: "line", seriesLayoutBy: 'row',smooth:false }],
    ...comm,
    dataset: {
      dimensions:[
        {
          name: "时间", type: "time"
        },
        "亮灯率"
      ],
      source:[
        timedata,
        randData
      ],
      sourceHeader: false,
    },

  }
  let bopt ={
    series: [{ type: "bar", seriesLayoutBy: 'row' }],
    ...comm,
    dataset: {
      dimensions:[
        {
          name: "时间", type: "time"
        },
        "用水量"
      ],
      source:[
        timedata,
        randData
      ],
      sourceHeader: false,
    },

  }

 return [lopt,bopt]
 }, [datas])


  const getData =async ()=> {
    try {
     let {success, data} = await useOverview({projectId})
     if(success && isObject(data)) {
       setDatas(data)
     }else {
      setDatas({})
     }

    } catch (error) {
      
    }
  }
  useEffect(()=> {
    if(Number.isInteger(projectId)){
       getData()
    }

  },[projectId])
  return (
    <Pagecount custsty={custsty} bgcolor="none">
      <Mainwrap>
        <div className="up">
          <div className="shownum">
            <img src={imgurl["todayLightRate"]}></img>
            <div className='data'>
              <span className='title'>今日亮灯率</span>
              <span className='num'>{datas?.todayLightRate}%</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["todayLightNum"]}></img>
            <div className='data'>
              <span className='title'>今日亮灯数</span>
              <span className='num'>{datas?.todayLightNum}</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["todayLightNum"]}></img>
            <div className='data'>
              <span className='title'>今日路灯用电（kWh）</span>
              <span className='num'>{datas?.todayEnergy}</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["todayCarbon"]}></img>
            <div className='data'>
              <span className='title'>今日碳排量（kg）</span>
              <span className='num'>{datas?.todayCarbon}</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["alarmNum"]}></img>
            <div className='data'>
              <span className='title'>异常告警</span>
              <span className='num'>{datas?.alarmNum}</span>
            </div>
          </div>
        </div>
        <div className="down">
          <div className='left'>
          </div>
          <div className="right">
            <div className="titleUp">
              平台概况
            </div>
            <div className="content">
              <div className="info">
                <div className="item">
                     <img src={imgurl?.["departNum"]}></img>
                     <div className='data'>
                        <span className='label'>管理单位</span>
                        <span className='value'>{datas?.departNum}</span>
                     </div>
                </div>
                <div className="item">
                     <img src={imgurl?.["lightNum"]}></img>
                     <div className='data'>
                        <span className='label'>路灯</span>
                        <span className='value'>{datas?.lightNum}</span>
                     </div>
                </div>
                <div className="item">
                     <img src={imgurl?.["lineNum"]}></img>
                     <div className='data'>
                        <span className='label'>回路</span>
                        <span className='value'>{datas?.lineNum}</span>
                     </div>
                </div>
              </div>
               <div className='chartTitle'>近7日亮灯率(%)</div>
               <div className="chartWrap">
<Ichart {...lineopt} />
               </div>
               <div className='chartTitle'>近7日用电量(kWh)</div>
               <div className="chartWrap">
<Ichart {...baropt} />
               </div>

            </div>
          </div>
        </div>
      </Mainwrap>
         
    </Pagecount>
  )
}

