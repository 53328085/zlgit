import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
 
import moment from 'moment';
 
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

 


export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)

  const { QueryElectricToday } = HomeRuntime


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

    let date = moment().format("yyyy-MM-DD")
    QueryElectricToday(projectId, date).then(res => {
        let { success, data } = res
        if (success) {
          if (data.constructor == Object) {
            let {x, y, y1} = data   

            let dataset = {
              dimensions: [
                {name: '日期', type: 'time'},
                {name: "用电量"},
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
   
    
  }, [])
  
  return (
         <Titlelayout title={'今日用电量'} {...fs} style={{height: '200px'}} layout="flex">
         <div  style={{flex: 1, display: 'flex'}}>
              <Ichart {...options} />
         </div>
         </Titlelayout>
  )
}
