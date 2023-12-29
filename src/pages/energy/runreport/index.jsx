import React, { useState} from 'react'

import { QueryRunReport } from '@api/api'
import './index.less'
import Report from '@com/reportPrint'
import Pagecom from './pagecomp'
export default function Index() {
  const [reportData, setData] = useState(null)
  const  [params, setType] = useState()
  console.log(params)
  const getReport = async (params) => {
    try {
    
      let {success, data} =  await  QueryRunReport.RunReport(params)
      if(success) {
        setData(data)
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
           <Report  getReport={getReport} params={params} reportName="能源管理分析报告" >
              {
                reportData && <Pagecom data={reportData}  params={params}  />
              }
           </Report>
    </div>
  )

}




