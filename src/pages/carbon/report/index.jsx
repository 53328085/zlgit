import React, { useState, useCallback} from 'react'

import { Carbon } from '@api/api'
//import './index.less'
import Report from '@com/reportPrint'
import Pagecom from './pagecomp' 
import {selectProjectId} from '@redux/systemconfig.js'
import {useSelector} from 'react-redux'
 
export default function Index() {
  const [reportData, setData] = useState(null)
  const  [params, setType] = useState(null)
  const projectId = useSelector(selectProjectId)                      

  const getData =useCallback(async (params) => { //  
    console.log(params)
    try {
     let {success, data} = await Carbon.QueryCarbonReport(params)
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
    
}, [projectId])

  return (
    <div style={{display: "flex", flex: 1}}>
           <Report  getReport={getData} params={params} reportName="碳排分析报告" >
              {
                reportData && <Pagecom data={reportData}   params={params}  />
              }
           </Report>
    </div>
  )

}




