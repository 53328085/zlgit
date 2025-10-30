import React,{useRef, useEffect, useState, useMemo} from 'react'
 import {CloseOutlined} from "@ant-design/icons"
import Pagecount from '@com/pagecontent'
import {isObject} from "@com/usehandler"
 
import {useOutletContext} from "react-router-dom"
import {useOverview,useDetail} from "./api"
import imgurl from './imgs'
import {custsty,  Mainwrap,TitP} from './style'
import Ichart from "@com/useEcharts/Ichart"
import {Point,Cspin} from "@com/comstyled" 
import { message } from 'antd'
 
 
export default function Index() {
  const [datas, setDatas] = useState({})
  const [loading, setLoading] = useState(false)
  const {projectId} = useOutletContext()
  const [info, setInfo] = useState()
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
       Array.isArray(incomes?.x) ? incomes?.x : [],
       Array.isArray(incomes?.y) ? incomes?.y : [],
      ],
      sourceHeader: false,
    },

  }
 return [lopt,bopt, copt, inopt]
 }, [datas])


  const getData =async ()=> {
    try {
      setLoading(true)
     let {success, data} = await useOverview({projectId})
     if(success && isObject(data)) {
       setDatas(data)

     }else {
      setDatas({})
     }
     setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const getpoint=async(rid, x, y) => {
    try {
      if(!Number.isInteger(Number.parseInt(rid))) return message.warning("路灯Id无效")
      let {success, data, errMsg} = await useDetail({rid, projectId})
     if(success && isObject(data)) {
        setInfo({x, y, ...data})
     }else {
      setInfo({x,y})
      if(!success)  message.warning(errMsg || "数据出错")
    }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=> {
    if(Number.isInteger(projectId)){
       getData()
    }

  },[projectId])
  const tref=useRef()
  useEffect(()=> {
    console.log(tref)
  },[])
  const onMouseDown =(event)=> {
    try {
      let ball = tref.current
      let shiftX = event.clientX - tref.current.getBoundingClientRect().left;
      let shiftY = event.clientY - tref.current.getBoundingClientRect().top;
      moveAt(event.pageX, event.pageY);
  
      // 移动现在位于坐标 (pageX, pageY) 上的球
      // 将初始的偏移考虑在内
      function moveAt(pageX, pageY) {
        ball.style.left = pageX - shiftX + 'px';
        ball.style.top = pageY - shiftY + 'px';
      }
    
      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }
    
      // 在 mousemove 事件上移动球
      document.addEventListener('mousemove', onMouseMove);
    
      // 放下球，并移除不需要的处理程序
      ball.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        ball.onmouseup = null;
      };
    } catch (error) {
      console.log(error)
    }

  }
  const onMouseMove=(e)=> {
    // console.log(e)
  }
  return (
    <Pagecount custsty={custsty} bgcolor="none">
        <Cspin spinning={loading}>
      <Mainwrap>
      
        <div className="up">
          <div className="shownum">
            <div className='imgwrap'>
            <img src={imgurl["todayLightRate"]}></img>
            </div>
            <div className='data'>
              <span className='title'>亮灯率</span>
              <span className='num'>{ (datas?.lightRate && (typeof parseFloat(datas?.lightRate) == "number"))? `${parseFloat(datas?.lightRate)?.toFixed(2)}%`: "--" }</span>
            </div>
          </div>
          <div className="shownum">
            <div className="imgwrap">
            <img src={imgurl["todayLightNum"]}></img>
            </div>           
            <div className='data'>
              <span className='title'>亮灯数</span>
              <span className='num'>{datas?.lightUpNum ? datas?.lightUpNum : "--"}</span>
            </div>
          </div>
          <div className="shownum">
            <div className="imgwrap">
            <img src={imgurl["todayEUsed"]}></img>
            </div>
           
            <div className='data'>
              <span className='title'>今日路灯用电（kWh）</span>
              <span className='num'>{datas?.todayEUsed ? datas?.todayEUsed : "--"}</span>
            </div>
          </div>
          <div className="shownum">
            <div className="imgwrap">
            <img src={imgurl["todayEnergy"]}></img>
            </div>

           
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
            <div className="imgwrap">
            <img src={imgurl["todayCarbon"]}></img>
            </div>
            <div className='data'>
              <span className='title'>今日碳排量（g）</span>
              <span className='num'>{datas?.todayCarbon ? datas?.todayCarbon : "--"}</span>
            </div>
          </div>
          <div className="shownum">
            <div className="imgwrap">
            <img src={imgurl["alarmNum"]}></img>
            </div>
            <div className='data'>
              <span className='title'>异常告警</span>
              <span className='num'>{datas?.alarmNum ? datas?.alarmNum : '--'}</span>
            </div>
          </div>
        </div>
        <div className="down">
        <div className="left">
        <div className="titleUp">
                 <div className="titlehd overew">
                  平台概览
                 </div>
                 <div className='manger'>
                        <span className='label'>管理单位</span>
                        <span className='value'>{datas?.department || "=="}</span>
                  </div>
            </div>
            <div className="content">
            <div className="infobox">
           
              <div className="info">
              <div className="item">
                    <div className='imgbox'>
                     <img src={imgurl?.["lineNum"]}></img>
                     </div>
                     <div className='data'>
                        <span className='label'>回路</span>
                        <span className='value'>{datas?.loopNum}</span>
                     </div>
                </div>
                <div className="item">
                     <div className="imgbox">
                     <img src={imgurl?.["lightNum"]}></img>
                     </div>
                    
                     <div className='data'>
                        <span className='label'>高杆路灯</span>
                        <span className='value'>{datas?.highPoleNum}</span>
                     </div>
                </div>
               
                <div className="item">
                  <div className="imgbox">
                  <img src={imgurl?.["sun"]}></img>
                  </div>
                     <div className='data'>
                        <span className='label'>太阳能路灯</span>
                        <span className='value'>{datas?.solarNum}</span>
                     </div>
                </div>
              </div>
              </div>
               <div className='chartTitle titlehd'>近7日亮灯率(%)</div>
               <div className="chartWrap">
<Ichart {...lineopt} />
               </div>
               <div className='chartTitle titlehd mt-4'>近7日用电量(kWh)</div>
               <div className="chartWrap">
<Ichart {...baropt} />
               </div>

            </div>
          </div>
          <div className="middler">
            <img src={datas?.image} className='img' onClick={()=>{}}/>
            {
              datas?.locationInfos?.map(l=><Point left={l.x} top={l.y} key={l.lightName} data-descr={l.lightName} onClick={()=>getpoint(l.lightId, l.x, l.y)}></Point>)
            }
           {info && <TitP left={info.x} top={info.y}   onDrag={()=> false} ref={tref}>
          <h5 className="title">{info.name} <CloseOutlined style={{color: "#2AFAFF", position: "absolute", top: "4px", right: "4px"}} onClick={() => setInfo(null)}  /> </h5>
             <div className="contentbox">
               {
                
                  info?.fields?.map(i => ( <div className="content">
                    <p className="key">{i.name}</p>
                    <p className="value">{i.value}</p>
                </div>))

               } 
              </div>
          </TitP>}
          </div>
           <div className="right">
            <div className="content">
           <div className='chartTitle titlehd'>发电量统计</div>
               <div className="chartWrap">
<Ichart {...createopt} />
               </div>
               <div className='chartTitle titlehd mt-4'>发电收益折算(元)</div>
               <div className="chartWrap">
<Ichart {...incomeopt} />
               </div>
           </div>
           </div>
        </div>
        
      </Mainwrap>
      </Cspin>
    </Pagecount>
  )
}

