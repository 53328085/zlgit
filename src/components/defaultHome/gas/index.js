import React, {useRef, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from "react-i18next"
import { selectProjectId } from '@redux/systemconfig.js'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
import {CustTransO} from "@com/useButton"
const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}


export default function DefaultHome(props){
  let {type} =props
  const projectId = useSelector(selectProjectId)
  const {t} = useTranslation(["comm","overview"])
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
    color: ['#ff6803'],
    dataset: {},
  })

  const { GetUseETrends_Gas } = HomeRuntime

  useEffect(() => {
     if(type =="runtTime" && projectId) {
      GetUseETrends_Gas(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(data.constructor == Object){
              let {x=[], y=[]} = data
              let dataset = {
                dimensions: [
                  {name: t("comm:date"), type: 'time'},
                  {name: t("overview:Monthlygascapacity", {unit: "（m³）"})},
                  
                ],
                source: [
                  x, 
                  y,
                ],
               sourceHeader: false,
              }
            
              setOptions({...options, dataset})
            }
          }else{
            message.error(res.errMsg)
          }
      }).catch()
     
   
  }
}, [projectId, type])
  
  return (
    <Titlelayout title={<CustTransO text="Monthlygascapacity" />} {...fs} style={{minHeight: '200px'}} layout="flex">
        <div style={{flex:1, display: 'flex'}}>
        <Ichart {...options} />
        </div>
    </Titlelayout>
  )
}
