import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
 
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
                  {name: '日期', type: 'time'},
                  {name:  '用电量' },
                  
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
   
  }, [])
  
  return (
         <Titlelayout title={'用电量'} {...fs}>
             <div   style={{width: '422px', height: '142px', display: 'flex'}}>
                 <Ichart {...options} />
             </div>
         </Titlelayout>
  )
}
