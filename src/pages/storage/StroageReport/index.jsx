import React, { useState, useCallback} from 'react'

import {StorageRunReport} from '@api/api'
 
import Report from '@com/reportPrint'
import Pagecom from './pagecomp' 
 

export default function Index() {
  const [reportData, setData] = useState(null)
  const  [params, setType] = useState(null)
  const getData =useCallback(async (params) => {  
    try {
     console.log(params)
     const {type, date, projectId} = params
     let {success, data} = await  StorageRunReport.QueryRuntimeStatus(projectId, type-1, date)
     if(success && data) {
       let datas = data?.constructor == Object ? data : {}
       setData({...datas})
       setType(params)
       return true
     }else {
      setData({})
      setType(null)
      return false
     }
    } catch (error) {
        console.log(error)
        setType(null)
        return false
    }
    
}, [params])

  return (
    <div style={{display: "flex", flex: 1}}>
           <Report  getReport={getData} params={params} reportName="储能管理分析报告" >
              {
                reportData && <Pagecom data={reportData}   params={params}  />
              }
           </Report>
    </div>
  )

}




