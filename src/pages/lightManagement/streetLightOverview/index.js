import React,{useRef, useEffect, useState, useMemo} from 'react'
 
import Pagecount from '@com/pagecontent'
import {isObject} from "@com/usehandler"
 
import {useOutletContext} from "react-router-dom"
import {useOverview} from "./api"
import imgurl from './imgs'
import {custsty,  Mainwrap} from './style'
import Ichart from "@com/useEcharts/Ichart"
import {Point} from "@com/comstyled" 
let timedata = Array.from({length: 10},(_, index)=> `0${index}:0${index}`)
let randData = Array.from({length:10}, (_, index)=> Math.round(Math.random()*100))
let randData2 = Array.from({length:10}, (_, index)=> Math.round(Math.random()*100))
console.log(timedata)
console.log(randData)
export default function Index() {
  const [datas, setDatas] = useState({})
 
  const {projectId} = useOutletContext()

 const [lineopt, baropt, createopt, incomeopt ] = useMemo(()=> { // 亮灯率 ， 市电，绿电, 发电量
   let {
    lightRates, 
    useds,
    creates,
    incomes,

   } = isObject(datas) ? datas : {}
   
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
        interval: "auto",
        fontSize: "10px",
        color: "#fff"
      }
    },
   }
   let lopt ={  // 亮灯率
    series: [{ type: "line", seriesLayoutBy: 'row',smooth:false,  symbolSize: 8, showSymbol:true }],
    ...comm,
    color: ["#1098FF"],
    dataset: {
      dimensions:[
        {
          name: "时间", type: "time"
        },
        "亮灯率"
      ],
      source:[
      
       lightRates?.x,
       lightRates?.y
      ],
      sourceHeader: false,
    },

  }
  let bopt ={ // 用电量
    series: [{ type: "bar", seriesLayoutBy: 'row', stack: "ec" },{ type: "bar", seriesLayoutBy: 'row' , stack: "ec"}],
    ...comm,
    color: ["#5372FF", "#47DC73"],
    dataset: {
      dimensions:[
        {
          name: "时间", type: "time"
        },
        "市电",
        "绿电"
      ],
      source:[
      useds?.x , 
        useds?.y,
        useds?.y1,
      ],
      sourceHeader: false,
    },

  }
  let copt ={ // 发电量
    series: [{ type: "bar", seriesLayoutBy: 'row'} ],
    ...comm,
    color: ["#5372FF", "#47DC73"],
    dataset: {
      dimensions:[
        {
          name: "时间", type: "time"
        },
        "发电量",
        
      ],
      source:[
        Array.isArray(creates?.x) ? creates?.x : [],
        Array.isArray(creates?.y) ? creates?.y :[],
       /*  timedata,
        randData */
      ],
      sourceHeader: false,
    },

  }
  let inopt = {  // 发电收益
    series: [{ type: "line", seriesLayoutBy: 'row',smooth:false,  symbolSize: 8, showSymbol:true }],
    ...comm,
    color: ["#05C06E"],
    dataset: {
      dimensions:[
        {
          name: "时间", type: "time"
        },
        "金额"
      ],
      source:[
        timedata,
        randData
       
      ],
      sourceHeader: false,
    },

  }
 return [lopt,bopt, copt, inopt]
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
              <span className='title'>亮灯率</span>
              <span className='num'>{Number.isInteger(parseFloat(datas?.lightRate))? `${parseFloat(datas?.lightRate)*100?.toFixed(2)}%`: "--" }</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["todayLightNum"]}></img>
            <div className='data'>
              <span className='title'>亮灯数</span>
              <span className='num'>{datas?.lightUpNum ? datas?.lightUpNum : "--"}</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["todayEUsed"]}></img>
            <div className='data'>
              <span className='title'>今日路灯用电（kWh）</span>
              <span className='num'>{datas?.todayEUsed ? datas?.todayEUsed : "--"}</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["todayEUsed"]}></img>
            <div className='data'>
              <span className='title'>今日路灯发电（kWh）</span>
              <span className='num'>{datas?.todayECreate ? datas?.todayECreate : "--"}</span>
            </div>
          </div>
          <div className="shownum">
            <div className="imgwrap">
            <img src={imgurl["todayIncome"]} className='img'></img>
            </div>
          
            <div className='data'>
              <span className='title'>今日发电收益（元）</span>
              <span className='num'>{datas?.todayIncome ? datas?.todayIncome : "--"}</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["todayCarbon"]}></img>
            <div className='data'>
              <span className='title'>今日碳排量（kg）</span>
              <span className='num'>{datas?.todayCarbon ? datas?.todayCarbon : "--"}</span>
            </div>
          </div>
          <div className="shownum">
            <img src={imgurl["alarmNum"]}></img>
            <div className='data'>
              <span className='title'>异常告警</span>
              <span className='num'>{datas?.alarmNum ? datas?.alarmNum : '--'}</span>
            </div>
          </div>
        </div>
        <div className="down">
        <div className="left">
        <div className="titleUp">
                 <div className='manger'>
                        <span className='label'>管理单位</span>
                        <span className='value'>{datas?.department || "=="}</span>
                  </div>
            </div>
            <div className="content">
            <div className="infobox">
           
              <div className="info">
              <div className="item">
                     <img src={imgurl?.["lineNum"]}></img>
                     <div className='data'>
                        <span className='label'>回路</span>
                        <span className='value'>{datas?.loopNum}</span>
                     </div>
                </div>
                <div className="item">
                     <img src={imgurl?.["lightNum"]}></img>
                     <div className='data'>
                        <span className='label'>路灯</span>
                        <span className='value'>{datas?.highPoleNum}</span>
                     </div>
                </div>
               
                <div className="item">
                     <img src={imgurl?.["sun"]}></img>
                     <div className='data'>
                        <span className='label'>太阳能路灯</span>
                        <span className='value'>{datas?.solarNum}</span>
                     </div>
                </div>
              </div>
              </div>
               <div className='chartTitle'>近7日亮灯率(%)</div>
               <div className="chartWrap">
<Ichart {...lineopt} />
               </div>
               <div className='chartTitle mt-4'>近7日用电量(kWh)</div>
               <div className="chartWrap">
<Ichart {...baropt} />
               </div>

            </div>
          </div>
          <div className="middler">
            <img src={datas?.image} className='img' onClick={()=>{}}/>
            {
              datas?.locationInfos?.map(l=><Point left={l.x} top={l.y} key={l.lightName} data-descr={l.lightName}></Point>)
            }
          </div>
           <div className="right">
            <div className="content">
           <div className='chartTitle'>发电量统计</div>
               <div className="chartWrap">
<Ichart {...createopt} />
               </div>
               <div className='chartTitle mt-4'>发电收益折算(元)</div>
               <div className="chartWrap">
<Ichart {...incomeopt} />
               </div>
           </div>
           </div>
        </div>
      </Mainwrap>
         
    </Pagecount>
  )
}

