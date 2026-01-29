import React from 'react'

import {useQueryChargeETrends,useQuerySOC} from '../api'
import {isObject} from "@com/usehandler"
 
 import ChartBar from './chartbar'
 import Chartdouble from './chartdouble'
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
  
  
  return (
    <div className='power'>
        <ChartBar title="充放电趋势" getData={getData}   dataZoom={false} />  
       
       <Chartdouble title="电池SOC"  type={202} dataZoom={false} />  
       
    </div>
  )
}
