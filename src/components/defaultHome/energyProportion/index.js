import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import { HomeRuntime } from '@api/api.js'
import moment from 'moment';
  
import { message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y",
  layout: 'flex'
}

 

export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  const [options, setOptions] = useState({
    type: 3,
    pieData: { data: [], total: '100%', radius: ["55%",  "70%"] },
    legend: {
      top: 16,
      orient: 'vertical',
      left: 'left'
    },
    grid: {
      containLabel: true,
      left: 0,
      right: 0,
    }
  })
  const getData = async () => {
     try {
       
      let date = moment().format("yyyy-MM-DD")
      let {success, data} =  await HomeRuntime.EnergyProportion(projectId, date)
       if (success) {
         
         console.log(data)
         setOptions({...options, pieData: {
          ...options.pieData,
          data: data || []
         }})
       }
     } catch (error) {
      
     }
     

  }

  useEffect(() => {
     getData()
   
    
  }, [projectId])
  
  return (
         <Titlelayout title={'分类能耗'} {...fs} style={{height: "200px", width: "456px"}}>
         <div  style={{flex: 1, display: 'flex'}}>
             <Ichart {...options} />
         </div>
         </Titlelayout>
  )
}
