import React, { useState} from 'react'

import { DistributionRoomRuntime } from '@api/api'
 
import Report from '@com/reportPrint'
import Pagecom from './pagecomp'
export default function Index() {
  const [reportData, setData] = useState({})
  const  [params, setType] = useState()
  
  const getReport = async (params) => {
    try {
    
      let {success, data} =  await  DistributionRoomRuntime.Report(params)
      if(success) {
        setData(data || {})
        setType(params)
        return true
      }else {
        setType(null)
        return false
      }
    } catch (error) {
       setType(null)
       return false
    }
  
  }

 

  return (
    <div style={{display: "flex", flex: 1}}>
           <Report  getReport={getReport} params={params} reportName="配电站运行分析报告" >
               {
                 reportData?.rooms?.map((data, index)=>  <Pagecom data={data} index={index + 1} key={index} params={params}  />)
               }
           </Report>
    </div>
  )

}




