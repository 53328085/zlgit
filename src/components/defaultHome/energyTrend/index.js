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

  const { GetMonthEnergyTrends } = HomeRuntime


  const [options, setOptions] = useState({
    series: [{ type: "bar",  seriesLayoutBy: 'row' }, { type: "bar",  seriesLayoutBy: 'row' }],  
    grid:{
      // 图表 grid
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    dataset: {},
    type: 2

  })
  console.log(options)
  useEffect(() => {

    
      GetMonthEnergyTrends(projectId).then(res => {
        let { success, data } = res
        if (success) {
          if (data.constructor == Object) {
            let {x, y, y1} = data           
            let dataset = {
              dimensions: [
                {name: '日期', type: 'time'},
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
          }
        } else {
          message.error(res.errMsg)
        }
      }).catch(e => {
        console.log(e);
      })
   
    
  }, [])
  
  return (
         <Titlelayout title={'月度能耗趋势'} {...fs} style={{height: '200px'}} layout="flex">
         <div  style={{ flex:1, display: 'flex'}} >
              <Ichart {...options} />
         </div>
         </Titlelayout>
  )
}
