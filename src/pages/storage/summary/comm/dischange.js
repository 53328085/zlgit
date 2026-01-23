import React from 'react'

import {useQueryChargeETrends,useQuerySOC} from '../api'
import {isObject} from "@com/usehandler"
import Chartcom from './chart'
 import ChartBar from './chartbar'
 
export default function Index() {
  const onHander =(api) => {
    return async (params)=>{
        const {data, success} = await api(params)
         if(success && isObject(data)) {
            return data
         }else {
            return []
         }
  }
}
  const getData = onHander(useQueryChargeETrends)  
  const getData2 = onHander(useQuerySOC)
  
  return (
    <div className='power'>
        <ChartBar title="充放电趋势" getData={getData}   dataZoom={false} />  
       
       <Chartcom title="电池SOC" getData={getData2} type="line" dataZoom={false} />  
       
    </div>
  )
}
