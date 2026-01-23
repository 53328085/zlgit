import React from 'react'

import {useQueryMeterPower,useQueryChargeAndDischargePower,useQueryLoadSummaryPower} from '../api'

import Chartcom from './chart'
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
  const getData = onHander(useQueryMeterPower)  
  const getData2 = onHander(useQueryChargeAndDischargePower)
  const getData3 = onHander(useQueryLoadSummaryPower)
  return (
    <div className='power'>
        <Chartcom title="关口表功率" getData={getData} />
       <div className="down">
       <Chartcom title="充放电功率" getData={getData2} /> 
       <Chartcom title="负载总表功率" getData={getData3} />  
       </div>
    </div>
  )
}
