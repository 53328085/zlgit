import React,{useState,useEffect,useRef, useMemo} from 'react'
 

import {Pagelayout} from './style'
import { useSelector } from "react-redux";
import { selectProjectId  } from "@redux/systemconfig";
import {isObject,chunkArray} from "@com/usehandler"
import {useRequest} from 'ahooks'
 import Topcom from './comm/top'
 import Leftupcom from './comm/leftup'
 import Leftdowncom from './comm/leftdown'
 import Centerupcom from './comm/centerup'
 import Centercom from './comm/center'
 import Centerdowncom from './comm/centerdown'
 import Rightupcom from './comm/rightup'
 import Rightcentercom from './comm/rightcenter'
 import Rightdowncom from './comm/rightdown'
 import {useQueryData,useQueryKPICurve} from './api'
 const delay=1000*60*15
export default function Index() {
  const pgref= useRef()
  const projectId = useSelector(selectProjectId);
  const [meterType,setMeterType]=useState(1)
  const [datas,setDatas] = useState({})
  const [kpidata, setKpiData] = useState({})
  const { latest7DaysCOPCurve=[],latest7DaysKPICurve=[]} = useMemo(()=>{
    if(isObject(kpidata)) {
      return { 
       ...kpidata
      }
    }else {
      return {}
    }
  },[kpidata])
 
  const {
    consumeTrend,//用能趋势01月
    latest7DaysEnergyOfArea,//区域用能排名
    latest7DaysEnergyOfClassify,//用项用能占比
    loadTrend, // 用电负荷趋势01月
    rankClassify,// 分项用能排名
    monthTotal,
  } = useMemo(()=>{ 
     
     try {
      let {latest7DaysEnergyOfArea={},rankClassify=[],...rest}= isObject(datas) ? datas : {};
       let dataOfArea=[]
      if(isObject(latest7DaysEnergyOfArea) && Object.keys(latest7DaysEnergyOfArea).length){
       latest7DaysEnergyOfArea.length = Object.keys(latest7DaysEnergyOfArea).length
       dataOfArea=Array.from(latest7DaysEnergyOfArea)
       console.log("dataOfArea",dataOfArea)
         dataOfArea.forEach((arr,idx,arrs) => {
          let total =arr?.reduce((a,b)=> a + parseFloat(b.value) ,0)
          arrs[idx] = arr.map(d=>({...d,percent:(parseFloat(d.value)/total*100)?.toFixed(2)}))  
         })         
       // let total =latest7DaysEnergyOfArea?.reduce((a,b)=> a + parseFloat(b.value) ,0)
       // latest7DaysEnergyOfArea=latest7DaysEnergyOfArea?.map(d=>({...d,percent:(parseFloat(d.value)/total*100)?.toFixed(2)}))
       // latest7DaysEnergyOfArea =chunkArray(latest7DaysEnergyOfArea,5)
      }
      if(Array.isArray(rankClassify)) {
        let ranks = rankClassify.sort((a,b)=> parseFloat(b.value) - parseFloat(a.value))?.map(a=>({...a, value:parseFloat(a.value)}));
        let total =  datas?.monthTotal?.toFixed?.(2)
        let beforefive= ranks?.slice(0,5)?.reduce((a,b)=> a+ b.value,0)
        let percent = beforefive!==0?   ((beforefive/total)*100)?.toFixed(2) + "%":0
        let top5=ranks?.slice(0,5)
         

        rankClassify={
          data:ranks,
          total,
          percent,
          top5: top5.map(t=>({...t,width: Math.ceil(t.value/total*236)}) ) // 236设计稿上的长度
        } 
      }else {
        rankClassify={
          data:[],
            total: 0,
            percent:0,
            top5:[]
        } 
      }
       
      return {...rest,latest7DaysEnergyOfArea:dataOfArea,rankClassify}
     } catch (error) {
      console.log(error)
      return {}
     }
 
  },[datas])

 
 
 

  const getKpi = async ()=>{ 
    try{
      if(!Number.isInteger(parseInt(projectId))) {return}
      let data =await useQueryKPICurve({projectId})
      
      if(isObject(data)){
        setKpiData(data)
      }else {
        setKpiData({})
      }
    } catch (error) {
      
    }
  }
  const getData=async ()=>{  
    try {
      if(![projectId, meterType].every(i =>Number.isInteger(parseInt(i)))) return
      let data =await useQueryData({projectId,meterType })
     
      if(isObject(data)){
         setDatas(data) 
      }else {
        setDatas({})  
      }
    } catch (error) {
       setDatas({}) 
    }   
  }
 useRequest(getData,{
    // manual:false,
    // pollingInterval: 1000*60*15,
    // pollingErrorRetryCount: 3,
    refreshDeps:[projectId,meterType],
  
 })
/*  useEffect(()=>{ 
  let count = 0
 let timer = setInterval(()=>{
     count++
     if (count === 4) {
       count = 1
     }
     setMeterType(count%4)
    
  }, [delay])
  return ()=>{
    clearInterval(timer)
  }
  },[]) */

  useRequest(getKpi,{
    manual:false,
    pollingInterval: delay,
    pollingErrorRetryCount: 3,
    refreshDeps:[projectId ],
  
 })

  // useEffect(()=>{ 
  //   if(Number.isInteger(parseInt(projectId))) {
  //   getKpi()
  //   }
    
  // },[projectId])
 
 
 
  return (
    <Pagelayout ref={pgref}   >
       <Topcom pgref={pgref} setMeterType={setMeterType}   meterType={meterType}  ></Topcom>
       <div className="content" key="content">
         <div className="left" key="left">
             <Leftupcom  datas={latest7DaysEnergyOfClassify}/> 
             <Leftdowncom datas={latest7DaysEnergyOfArea} /> 
         </div>
         <div className="center" key="center">
            <Centerupcom  datas={loadTrend} /> 
            <Centercom datas={consumeTrend} />
            <Centerdowncom datas={rankClassify} monthTotal={monthTotal} />
         </div>
         <div className="right" key="right">
            <Rightupcom datas={latest7DaysCOPCurve} />
            <Rightcentercom datas={latest7DaysKPICurve} />
            <Rightdowncom />
         </div>
       </div>
    </Pagelayout>
  )
}
