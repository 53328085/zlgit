import React, { useState,  useEffect,memo, useRef } from "react";
import moment from "moment";
import Pagecount from '@com/pagecontent' 
import {useSearchParams, useOutletContext} from 'react-router-dom'
import {EnergyFlowRuntime} from "@api/api"
import {useSelector} from 'react-redux'
import {selectOneLevel, currProject} from '@redux/systemconfig.js'
import {getTime} from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
import {CustButton} from '@com/useButton'
import Ichart  from '@com/useEcharts/Ichart';
import { Select, Form ,Radio,DatePicker,Divider, message } from 'antd'
import first from '../ranking/img/first.png'
import second from '../ranking/img/second.png'
import third from '../ranking/img/third.png'
import fourth from '../ranking/img/fourth.png'
import fifth from '../ranking/img/fifth.png'

const {queryElectric, queryWater,QueryConsumeRankByDevice} = EnergyFlowRuntime
 
 
const Headcom = memo(() => {
  const {projectName,  logoImage  } = useSelector(currProject) 
  return (
    <div style={{height: "64px", display: 'flex', alignItems: "center", backgroundColor: "#036"}}>
        <img src={logoImage} width={200} height={64} style={{marginRight: '16px'}}></img>
        <span style={{fontSize: "22px", color: "#fff"}}>{projectName}综合能源服务平台</span>
    </div>
  )

})
 
 
 
 
 
 
export default function Index() {   
  let {exparams={},setCustview} = useOutletContext() || {}
  console.log('exparams', exparams)
const imgs = [first, second, third, fourth, fifth ]
  
  const levelone = useSelector(selectOneLevel)
  const areaId = levelone.map(a => a.id);

  let [searchParams] = useSearchParams()
  const isfull = searchParams.get('full')  
  const [Type,setType]=useState('a')
  const changeType = e => {
    setType(e.target.value)
  }
  const CustView = (
  <Form.Item name="viewType" >
     <Radio.Group defaultValue="a" buttonStyle="solid" onChange={changeType}>
         <Radio.Button value="a">能源流向</Radio.Button>
         <Radio.Button value="b">能耗排名</Radio.Button>
       </Radio.Group>
</Form.Item>
  )
  
  useEffect(() => {
    setCustview(CustView);
    return () => {
      setCustview(undefined)
    }
  }, [Type])

 const [options, setOptions] = useState({
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove'
  },
  series: [
    {
      type: 'sankey',
      layout: "none",
      emphasis: {
      },
      data: [],
      links: [],
      lineStyle: {
        color: 'gradient',
        curveness: 0.5
      },
      left: 16,
      top: 32,
      bottom: 32,  
      right: 200,
      nodeGap: 8,
     // layoutIterations: 0,
    
    }
  ],
  type: 5,
})
 
  const getData = async () => {
    let store={};
    if(isfull) {
     store = JSON.parse(window.localStorage.getItem('exparams'))
    }
   
    let {type, date, projectId, energytype} =isfull ? store : exparams
    let params  = {
      projectId,
      type,
      date: getTime(moment(date), type)
    }
     try {
      let hander = ['', queryElectric, queryWater][energytype]    
      let {success, data} = await hander(params, areaId)
      if(success && data.constructor==Object) {
       
         const {link=[] } = data
        let arr = []
         let sources = Array.from(new Set([...link.map(i => i.source)]))

      
       
        sources.forEach(s => {
            let depth =link.filter(l => l.source == s).map(d =>  d.target)
            
             arr = [...arr, s, ...depth]

         })    
       
        let datas = Array.from(new Set([...arr])).map(name => ({name}))
       
     /*    let source =  link.map(i => i.source)
        let target = link.map(i => i.target)
        let nodes =Array.from(new Set([...source, ...target])).map(name => ({name}))

        console.log(nodes) */




         let links = link.map(l =>({...l, value: parseFloat(l.value)}))
          setOptions({
            ...options,
            series: [
              {
                ...options.series[0],
                data: datas,
                links,
                label: {
                  fontSize: 10
                },
                nodeAlign: "left",
                nodeGap: 12,
                lineStyle: {
                  color: "source"
                }
              }
            ]
          })
 
      } 
     } catch (error) {
         
     }
     
     
  }
  const [rankData, setRankData] = useState([])
  
  const [optionsRank, setOptionsRank] = useState({
    series: [{ type: "bar"}],  
    grid:{
      left: "0px",
      right: "0",
      top: "0px",
      bottom: "35px",
      containLabel: true,
    },
    legend: {
      bottom: "5px",
    },
    xAxis: {
      type: 'value',
     
    },
    yAxis: {
      type: 'category',
      axisTick: {
        show: false
      },   
    },
    dataset: {}
  })
const getRankData = async () => {
  let store={};
    if(isfull) {
     store = JSON.parse(window.localStorage.getItem('exparams'))
    }
   
    let {type, date, projectId, energytype} =isfull ? store : exparams
    let params  = {
      projectId,meterType:energytype,
      dayMonthYear:type,
      date: getTime(moment(date), type)
    }
  try {
    let {success,data,errMsg}=await QueryConsumeRankByDevice(params)
    if(success){
      setRankData(data.consumeRank.slice(0,data.leaderboardCount))
      let dataset = {
        dimensions:  [{name: "name"}, {name: "value", displayName: "能耗"}],
        source:data.consumeRank,
      }
    
      setOptionsRank({...optionsRank, dataset})
    }else{
      message.error(errMsg)
    }
  }catch (error) {
     console.log(error) 
  }
  }
  useEffect(() => {
    if(Object.values(exparams).length <4 ) return
    window.localStorage.setItem('exparams', JSON.stringify(exparams))
    getData()
    getRankData()
  }, [exparams])
  useEffect(()=> {
     if(isfull) {
      getData()
      getRankData()
     }
  }, [isfull])
   const full = () => {
      window.open('/directionfull?full=full')
   }
   const mapref = useRef()

   useEffect(() => {
     if(!mapref.current || !isfull) return
     let map = document.getElementsByClassName('ichartmap')[0];
     window.onmousewheel = (event) => {
      
       let {x, y, deltaY } = event
       let {left, right, top, bottom} = mapref.current.getClientRects()[0]
      
       if(x>left && x<right&& y>top && y<bottom) {      
        if(deltaY > 0) {
          setOptions({
            ...options,
            series: [
              {
                ...options.series[0],
                nodeGap: options.series[0].nodeGap+=2,
              }
            ]
          })
          
          mapref.current.style.height = mapref.current.style.height + 20 + 'px'
        }else {
          setOptions({
            ...options,
            series: [
              {
                ...options.series[0],
                nodeGap: options.series[0].nodeGap<12 ? 10 : options.series[0].nodeGap - 2
              }
            ]
          })
          mapref.current.style.height = mapref.current.style.height - 20 + 'px'
        }
        

       }
     }
   }, [options, isfull])
    return (
      <Pagecount  pd="0px">   
      {/* title={ (!isfull) && <CustButton onClick={full} style={{marginLeft: "auto" }}>全屏显示</CustButton>} pv={isfull? "0px" : "16px"}   layout="flex" bl="none" dr="column" */}
      {Type=='a'?<Titlelayout title={<div style={{height:'32px',display:'flex',flexDirection:'row',alignItems:'center'}}><p style={{lineHeight:'32px'}}>能源流向</p> <CustButton onClick={full} style={{marginLeft: "auto" }}>全屏显示</CustButton></div>} layout="flex" >
          {isfull && <Headcom />}
          <div style={{display: 'flex', flex:1,  alignItems: 'center',justifyContent: 'center',}} ref={mapref}>
               <Ichart  custoption={options}   />
          </div>
       </Titlelayout>:
       <Titlelayout title='能耗排名' layout="flex" >
       <div style={{display: 'flex',flexDirection:'row',  alignItems: 'start',justifyContent: 'space-between',}} >
            <div style={{width:'1028px',height:'100%',padding:'16px 0'}}>
            <Ichart {...optionsRank}  />
            </div>
            <div className="chart">
           {rankData.map((item,index)=>{
                return <div style={{width: '588px',height: '88px',display: 'flex',justifyContent: 'space-between',alignItems: 'center',
                backgroundColor: '#f4f8ff',padding: '0 16px',marginBottom: '16px'}}>
                  <img src={imgs[index]} key={index} style={{width: '40px',height: '50px'}}/>
                  <div>
                    <p>设备名称</p>
                    <p>{item.name}</p>
                  </div>
                  <div>
                    <p>能耗占比</p>
                    <p>{item.percent}</p>
                  </div>
                </div>
              })}
           </div>
       </div>
    </Titlelayout>}
      </Pagecount>
    )
}
