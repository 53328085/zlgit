import React, {useEffect, useState, useContext, useMemo} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId, iszhCN } from '@redux/systemconfig.js'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
import {isObject} from "@com/usehandler"
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import {CustTransO} from "@com/useButton"
import {useTranslation} from "react-i18next"
import Ichart  from '@com/useEcharts/Ichart';
import Context from "@com/content"
const fs = {
//  hv: '24px',
  fc: '#333',
  shadow: "y"
}




export default function DefaultHome(props){
  const {change, laptop} = useContext(Context)
  console.log("change",change)
  const projectId = useSelector(selectProjectId)
  
  const iszh = useSelector(iszhCN)
  const {t} = useTranslation(["overview", "comm"])
  const [data, setData] = useState({})
  const  options  = useMemo(()=> {
    const {x=[], y=[]} = data
    console.log("重新渲染：rander")
    return {
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
    dataset: {
      dimensions: [
        {name:  t("comm:date"), type: 'time'},
        {name:   t("overview:ElectricityConsumption") },
        
      ],
      source: [x, y],
      sourceHeader: false,
    }
  }}, [change, laptop, data])

 
 
 

  const { GetUseETrends } = HomeRuntime

  useEffect(() => {
     
      GetUseETrends(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(isObject(data)){
              setData(data)
          }else{
            setData({})
            message.error(res.errMsg)
          }
      }}).catch()
   
  }, [iszh ])
  
  return (
         <Titlelayout title={<CustTransO text="ElectricityConsumption"  />} {...fs} layout="flex" style={{minHeight: "200px"}}>
             <div   style={{flex: 1, display: 'flex'}}>
                 <Ichart {...options} />
             </div>
         </Titlelayout>
  )
}
