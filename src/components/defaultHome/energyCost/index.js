import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 
import moment from 'moment';
import {CustTransO} from "@com/useButton"
import {useTranslation} from "react-i18next"
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}

 


export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  const {t} = useTranslation(["comm"])
  const { GetMonthEnergyTrends } = HomeRuntime


  const [options, setOptions] = useState({
    series: [{ type: "line",  seriesLayoutBy: 'row' }, { type: "line",  seriesLayoutBy: 'row' }],  
    grid:{
      // 图表 grid
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    dataset: {}
  })
  useEffect(() => {

    
      GetMonthEnergyTrends(projectId).then(res => {
        let { success, data } = res
        if (success) {
          if (Object.prototype.toString.call(data).slice(8,-1) == 'Object') {
            let {x, y, y1} = data           
            let dataset = {
              dimensions: [
                {name: t("comm:date"), type: 'time'},
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
   
    
  }, [])
  
  return (
         <Titlelayout title={<CustTransO text="Mecosttrand" />} {...fs} layout="flex" style={{height: "200px"}}>
         <div  style={{flex: 1, display: 'flex'}}>
              <Ichart {...options} />
         </div>
         </Titlelayout>
  )
}
