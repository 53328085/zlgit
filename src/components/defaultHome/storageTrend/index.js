import React, {useRef, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 import {isObject} from "@com/usehandler"
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import {useTranslation} from "react-i18next"
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y",
  
  
}

export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  
  const { GetCFETrends } = HomeRuntime
  const [datas, setDatas] = useState({})
  const {x=[], y=[], y1=[]} = datas
  const {t} = useTranslation("overview")

    const  options = {
      series: [{ type: "line",  seriesLayoutBy: 'row' }, { type: "line",  seriesLayoutBy: 'row' }],  
      grid:{
        // 图表 grid
        left: "0px",
        right: "0",
        top: "30px",
        bottom: "0px",
        containLabel: true,
      },
      dataset: {
        dimensions: [ {name: t("comm:date"), type: 'time'},{name:t("Chargecapacity")}, {name:t("dischargecapacity")}],
        source: [x, y, y1]
      }
    }

  

  useEffect(()=>{
    if (props.type == 'runtTime') {
      GetCFETrends(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(isObject(data)){
               setDatas(data)
             // getConfig(data.x, data.y, data.y1)
            }else{
                setDatas({})
             // getConfig([],[],[])
            }
          }else{
            message.error(res.errMsg)
          }
      })
    } else {
      setDatas({x:['3月23日', '3月24日', '3月25日', '3月26日', '3月27日', '3月28日', '3月29日'],y:['170', '160','140.4', '90.23', '153.24', '211.5', '141.65'],y1:['200', '300','170.4', '190.23', '273.24', '241.5', '201.65']})
    }
    
  },[])
  
  return (
         <Titlelayout title={t("ChargeAndDischargeVolumeTrend")} {...fs}   layout="flex" style={{height: '100%'}}>
            <div style={{flex: 1,minHeight: '200px', height: "100%", overflow: 'hidden%'}}  >
                <Ichart {...options} />
            </div>
         </Titlelayout>
  )
}
