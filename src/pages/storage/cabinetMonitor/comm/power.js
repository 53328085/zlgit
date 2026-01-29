import React from 'react'

import {useQueryContainerCapacity,useQueryContainerPower } from '../api'

import Chartcom from './chart'
import ChartBar from './chartbar'
import { isObject } from 'lodash';
export default function Index() {
   
  
 
  const onHander =(api) => {
    return async (params)=>{
        const {data, success,errMsg} = await api(params)
         if(success && isObject(data)) {
            return data
         }else {
            if (!success){
              message.error(errMsg || "请求失败")
            }
            return []
         }
  }
}
  const getData = onHander(useQueryContainerCapacity)  
  const getData2 = onHander(useQueryContainerPower)
 // const getData3 = onHander(useQueryLoadSummaryPower)
  return (
    <div className='power'>
        <ChartBar title="充放电量" getData={getData} />
      
       <Chartcom title="充放电功率" getData={getData2} />  
       
    </div>
  )
}
