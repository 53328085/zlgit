import React, { useState, useCallback} from 'react'

import { Monitoring } from '@api/api'
 import './index.less'
import Report from '@com/reportPrint'
import Pagecom from './pagecomp' 
import {selectProjectId} from '@redux/systemconfig.js'
import {useSelector} from 'react-redux'
const { Runtime: { RuntimeStatus2 } } = Monitoring
export default function Index() {
  const [reportData, setData] = useState(null)
  const  [params, setType] = useState(null)
  const projectId = useSelector(selectProjectId)                      

  const getData =useCallback(async (params) => { // 缺少 年， 月参数
    try {
     let {success, data} = await RuntimeStatus2({projectId: projectId, areaId: 0})
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
           <Report  getReport={getData} params={params} reportName="运行监控分析报告" >
              {
                reportData && <Pagecom data={reportData}   params={params}  />
              }
           </Report>
    </div>
  )

}




