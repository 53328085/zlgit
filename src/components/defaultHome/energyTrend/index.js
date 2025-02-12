import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
 
import moment from 'moment';
import {CustTransO} from "@com/useButton"
import {useTranslation} from "react-i18next"
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

 


export default function DefaultHome(props){
  let {type} = props
  const {t} = useTranslation("comm")
  const projectId = useSelector(selectProjectId)

 


  const [options, setOptions] = useState({
    series: [{ type: "bar",  seriesLayoutBy: 'row' }, { type: "bar",  seriesLayoutBy: 'row' }],  
    grid:{
      // 图表 grid
      left: "0px",
      right: "0px",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    dataset: {},
    legend: {
      top: "5px"
    }
  })
  useEffect(() => {
    if(type=="runtTime" && projectId) {
    
    HomeRuntime.GetMonthEnergyTrends(projectId).then(res => {
        let { success, data } = res
        if (success) {
          if (data.constructor == Object) {
            let {x, y, y1} = data           
            let dataset = {
              dimensions: [
                {name: t("date"), type: 'time'},
                {name: moment().format('yyyy') },
                {name: moment().subtract(1, 'y').format('yyyy') },
              ],
              source: [
                x, 
                y,
                y1,
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
    
  }, [projectId, type])
  
  return (
         <Titlelayout title={<CustTransO text="Monthlyenergyconsumptiontrend" />} {...fs} style={{height: '200px'}} layout="flex">
         <div  style={{flex:1, display: 'flex'}}>
              <Ichart {...options} />
         </div>
         </Titlelayout>
  )
}
