import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {nanoid} from '@reduxjs/toolkit'
import Ichart  from '@com/useEcharts/Ichart';

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
             let time = data.map(t => t.x)
             let datay = data.map(t => t.y)
             source.push(time, datay)
           }else { 
            source.push(data.map(t => t.y))
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
  const {u: uData, i: iData} = datas || {}
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
      let {success, data} = await  PowerQuality.XBPP(body)
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
    series:  [{ type: "bar",  seriesLayoutBy: 'row'}, { type: "bar",  seriesLayoutBy: 'row'}, { type: "bar",  seriesLayoutBy: 'row'}],  
    grid: { 
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "30px",
      containLabel: true,
    },
    legend: {
        bottom: 0,
        icon: 'circle',
        itemHeight: 12,
        itemWidth: 12,
        itemGap: 20,
    },
   
    xAxis: {
      axisLabel: { 
         interval: "auto"
      },
    

    },
    /* title: {      
      left: 'center',
      textStyle: {
        fontWeight: "border",
        fontSize: 60,
        color: "#62b9df"
      }
    }, */
  }
  const barOptionU= { // 电压
    ...cption,
    title: {
      left: "center",
      text:"谐波电压",
      textStyle:{
        color: "#0a8dcd"
      
      }
    },
    dataset: {
      dimensions: hasU ? ["time",...uData?.map(u => u.name)] : [],
      source: getsoucre(uData, hasU),
      sourceHeader: false
    },
  }
  const barOptionI= { // 电流
    ...cption,
    title: {
      left: "center",
      text:"谐波电流",
      textStyle:{
        color: "#0a8dcd"
      
      }
    },
    dataset: {
      dimensions: hasI ? ["time",...iData?.map(u => u.name)] : [],
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
