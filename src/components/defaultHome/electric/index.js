import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId, iszhCN } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
 
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import {CustTransO} from "@com/useButton"
import {useTranslation} from "react-i18next"
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}




export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  const iszh = useSelector(iszhCN)
  const {t} = useTranslation(["overview", "comm"])
  const [options, setOptions] = useState({
    series: [{ type: "line",  seriesLayoutBy: 'row' }],  
    grid:{
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: "5px",
      itemHeight: 4,
      itemWidth: 16,
    },
    dataset: {}
  })

 
  
 

  const { GetUseETrends } = HomeRuntime

  useEffect(() => {
   
      GetUseETrends(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(data.constructor == Object){
              let {x, y} = data
              let dataset = {
                dimensions: [
                  {name:  t("comm:date"), type: 'time'},
                  {name:   t("overview:ElectricityConsumption") },
                  
                ],
                source: [x, y],
                sourceHeader: false,
              }
            
              setOptions({...options, dataset})
            }
          }else{
            message.error(res.errMsg)
          }
      }).catch()
   
  }, [iszh])
  
  return (
         <Titlelayout title={<CustTransO text="ElectricityConsumption"  />} {...fs} layout="flex" style={{height: "200px"}}>
             <div   style={{flex: 1, display: 'flex'}}>
                 <Ichart {...options} />
             </div>
         </Titlelayout>
  )
}
