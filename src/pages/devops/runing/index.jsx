import React, { useState, useCallback} from 'react'
import dayjs from 'dayjs'
import { operation } from '@api/api'
//import './index.less'
import Report from '@com/reportPrint'
import Pagecom from './pagecomp' 
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import {useSelector} from 'react-redux'
const { AlarmStatistics, OrderStatistics, InspectionStatistics, InspectionErrorCounter, InspectionStatisticsTime} = operation
export default function Index() {
  const [reportData, setData] = useState(null)
  const  [params, setType] = useState(null)
  const projectId = useSelector(selectProjectId)                      
  
  const getData =useCallback(async (params) => { // 
   
    console.log(params)

    let {date, projectId} = params
    let today = dayjs().format("YYYY-MM-DD")

    let post = {
      start: date,
      end: today,
      projectId
    }
    let datas = {
      inspec: {},
      order: {},
      alarm: {},
      error: {},
    }
    try {
     //let {success: d, data} = await InspectionStatistics({projectId: projectId, areaId: 0})
     let {success: d, data} = await InspectionStatisticsTime({...post, areaId: 0}) // 巡检任务统计
     let {success: s, data: order} =  await OrderStatistics({...post, areaId: 0}) // 工单事件统计
     let {success: a, data: alarm} =  await AlarmStatistics({...post, areaId: 0}) // 告警事件统计
     let  {success: e, data: error} = await InspectionErrorCounter({projectId, areaId: 0})
     if(d) {
        datas.inspec =  data?.constructor == Object ? data : {}
     }
     if(s) {
      datas.order =  order?.constructor == Object ? order : {}
     }
     if(a) {
      datas.alarm =  alarm?.constructor == Object ? alarm : {}
     }
     if(e) {
      datas.error =  typeof error =='number' ? error : 0
     }
     if(!d && !s && !a && !e){
      setData({})
      setType(null)
      return false
     }else {
      setType(params)
      setData({...datas})
      return true
     }
    } catch (error) {
        console.log(error)
        setType(null)
        return false
    }
    
}, [projectId])

  return (
    <div style={{display: "flex", flex: 1}}>
           <Report  getReport={getData} params={params} reportName="运维管理分析报告" >
              {
                reportData && <Pagecom data={reportData}   params={params}  />
              }
           </Report>
    </div>
  )

}




