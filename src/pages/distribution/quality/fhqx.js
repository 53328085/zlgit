import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {nanoid} from '@reduxjs/toolkit'
import Ichart  from '@com/useEcharts/Ichart';
import moment from 'moment';
import {PowerQuality} from "@api/api"
import { isObject } from '@com/usehandler';
import {RadiogroupB} from '@com/comstyled'
 

const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 32px minmax(286px, 1fr) minmax(286px, 1fr);
  row-gap: 32px;
  padding: 0px 0 16px 16px;
  .switch {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  } 
  .chartbox {
    display: flex;
    
  }
`
 
const options =[
  {
    label: '谐波',
    value: 1,
  },
  {
    label: '间谐波',
    value: 2,
  },
]
const getsoucre  = (datas, condition) => { 
    let source=[]
    if(condition) {
      datas.forEach((d,index) => {
         let {data} = d
         if(Array.isArray(data)) {
           if(index == 0) {
             let time = data.map(t => t.time)
             let datay = data.map(t => t.value)
             source.push(time, datay)
           }else { 
            source.push(data.map(t => t.value))
           }
         }
      })
    } 
    return source
    
  
}
const arrlen =(arr) => {
  return Array.isArray(arr) && arr?.length >0
}
export default function Index({projectId, day, sn}) {
  const [datas, setDatas] = useState({})
  const [group, setGroup] = useState(1)
  const {realTimeList: uData, dayList: iData} = datas || {}
  const hasU = arrlen(uData)
  const hasI = arrlen(iData)
 const onChange =({target: {value}}) =>{
    setGroup(value)
 }
  const getData = async() => {
      try {
       const body = {
        projectId,
        sn,
        day: day.format("yyyy-MM-DD"),
        group
       }
      let {success, data} = await  PowerQuality.FHQX(body)
      if(success && isObject(data)) {
        setDatas(data)
      }else {
        setDatas({})
      }
      } catch (error) {
        console.log(error)
      }
      
  }
  const cption ={   
   
    grid: { 
      left: "0px",
      right: "0",
      top: "48px",
      bottom: "30px",
      containLabel: true,
    },
    legend: {
        top: 26,
        icon: 'circle',
        itemHeight: 12,
        itemWidth: 12,
        itemGap: 20,
    },
   
    xAxis: {
      axisLabel: { 
        formatter: (value) => {
          return moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm")
      },
         interval: "auto"
      },
    

    },
   
  }
  const barOptionU= { // 实时负荷曲线
    ...cption,
    series:  Array(uData?.length).fill({type: "line",  seriesLayoutBy: 'row', stack: 'Total',}),
    title: {
      left: "center",
      text:"实时负荷曲线",
      textStyle:{
        color: "#2596d0"
      
      }
    },
    dataset: {
      dimensions: hasU ? ["time",...uData?.map(u => u.point)] : [],
      source: getsoucre(uData, hasU),
      sourceHeader: false
    },
  }
  const barOptionI= { // 日负荷曲线
    ...cption,
    series:  Array(iData?.length).fill({type: "line",  seriesLayoutBy: 'row', stack: 'Total',}),
    title: {
      left: "center",
      text:"日负荷曲线",
      textStyle:{
        color: "#2596d0"
      
      }
    },
    dataset: {
      dimensions: hasI ? ["time",...iData?.map(u => u.point)] : [],
      source: getsoucre(iData, hasI),
      sourceHeader: false
    },
  }
  useEffect(() => {
     if(Number.isInteger(parseInt(projectId))&& sn && day) {
        getData()
     }
  }, [projectId, day, sn, group])
  return (
    <Mainbox>
       <div className='switch' key={nanoid()}>
          <RadiogroupB      optionType="button" options={options}
           buttonStyle="solid" value={group} onChange={onChange} />
       </div>
       <div className='chartbox' key={nanoid()}>
       <Ichart {...barOptionU} />
       </div>
       <div className='chartbox' key={nanoid()}>
       <Ichart {...barOptionI} />
       </div>
     </Mainbox>
  )
}
