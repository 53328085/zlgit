import React from 'react'

import {useQueryContainerCapacity,useQueryChargeAndDischargePower } from '../api'

import Chartcom from './chart'
import ChartBar from './chartbar'
import { isObject } from 'lodash';
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
  const getData = onHander(useQueryContainerCapacity)  
  const getData2 = onHander(useQueryChargeAndDischargePower)
 // const getData3 = onHander(useQueryLoadSummaryPower)
  return (
    <div className='power'>
        <ChartBar title="充放电量" getData={getData} />
      
       <Chartcom title="充放电功率" getData={getData2} />  
       
    </div>
  )
}
