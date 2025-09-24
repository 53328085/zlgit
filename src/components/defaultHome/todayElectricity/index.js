import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId, iszhCN } from '@redux/systemconfig.js'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 
import moment from 'moment';
import {useTranslation} from 'react-i18next'
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}

 


export default function DefaultHome(props){
  const {type} = props
  const projectId = useSelector(selectProjectId)
  const iszh = useSelector(iszhCN)
  const { QueryElectricToday } = HomeRuntime
  const {t} =useTranslation(["overview", "comm"])

  const [options, setOptions] = useState({
    series: [{ type: "line",  seriesLayoutBy: 'row', areaStyle: {color: "#d6e3fd"} }],  
    grid:{
      // 图表 grid
      left: "0px",
      right: "0",
      top: "35px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      left: "left",
      top: "5px"
    },
    xAxis:{
      axisLabel:{
        interval:'auto'
      }
    },
    yAxis: {
      show: false,
    },
    dataset: {}
  })
  useEffect(() => {
    if(projectId && type == "runtTime") {
    let date = moment().format("yyyy-MM-DD")
    QueryElectricToday(projectId, date).then(res => {
        let { success, data } = res
        if (success) {
          if (data.constructor == Object) {
            let {x, y, y1} = data   

            let dataset = {
              dimensions: [
                {name: t("comm:date"), type: 'time'},
                {name: t("overview:ElectricityConsumption")},
              ],
              source: [
                x, 
                y,
              ],
             sourceHeader: false,
            }
          
            setOptions({...options, dataset})
           // drawBar(dataSets)
          }
        } else {
          message.error(res.errMsg)
        }
      }).catch(e => {
        console.log(e);
      })
   
    }
  }, [iszh])
  
  return (
         <Titlelayout title={t("overview:ElectricityConsumptionOfToday")} {...fs} style={{minHeight: '200px', height:"100%"}} layout="flex">
         <div  style={{flex: 1, display: 'flex'}}>
              <Ichart {...options} />
         </div>
         </Titlelayout>
  )
}
