import React, { useState,  useEffect,memo, useRef } from "react";
import moment from "moment";
import Pagecount from '@com/pagecontent' 
import {useSearchParams, useOutletContext} from 'react-router-dom'
import {EnergyFlowRuntime, Carbon} from "@api/api"
import {useSelector} from 'react-redux'
import {selectOneLevel, currProject} from '@redux/systemconfig.js'
import {getTime} from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
import {CustButton} from '@com/useButton'
import Ichart  from '@com/useEcharts/Ichart';
import {ComDatePicker} from "@com/comstyled" 

const {queryElectric, queryWater} = EnergyFlowRuntime
 
 
 
 
 
 
 
export default function Index() {   
  let {enterpriseId} = useOutletContext() || {}
 
  

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
    
    
    }
  ],
  type: 5,
})
 
  const getData = async () => {
    
   
    
    let params  = {
      enterpriseId,
      type,
      date: getTime(moment(date), type)
    }
     try {
       
      let {success, data} = await Carbon.QueryFlow(params)
      if(success && data.constructor==Object) {
       
         const {link=[] } = data
        let arr = []
         let sources = Array.from(new Set([...link.map(i => i.source)]))

      
       
        sources.forEach(s => {
            let depth =link.filter(l => l.source == s).map(d =>  d.target)
            
             arr = [...arr, s, ...depth]

         })    
       
        let datas = Array.from(new Set([...arr])).map(name => ({name}))
       
  




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
 
 
   const mapref = useRef()

 

   const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>碳排流向</span>
        <Space size={16}>
          <ComDatePicker   /> 
         
        </Space>
    </div>
  )
   
    return (
      <Pagecount  pd="0px">   
      <Titlelayout title={CTitle} >
          <div style={{display: 'flex', flex:1,  alignItems: 'center',justifyContent: 'center',}} ref={mapref}>
               <Ichart  custoption={options}   />
          </div>
       </Titlelayout>
      </Pagecount>
    )
}
