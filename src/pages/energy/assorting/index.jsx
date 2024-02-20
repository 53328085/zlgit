import React, { useEffect, useState } from 'react'
import Energy from './energy'
 
import { message } from 'antd'
import { useSelector } from 'react-redux'
import {useOutletContext} from 'react-router-dom' 
import moment from 'moment'
import { energyClassified } from '@api/api'
import {selectOneLevel} from '@redux/systemconfig.js'
import Pagecount from "@com/pagecontent";
import {getTime} from '@com/usehandler'
export default function Index() {
  let {exparams} = useOutletContext()
 // const projectId = useSelector(selectProjectId)
  const oneLevel = useSelector(selectOneLevel)
  const [showData, setShowData] = useState()
  //查询分类能耗
  const getEnergyData = async () => {
    let {view, areaId, date, type:dateType, shiftNo, projectId} = exparams 
    try {
      
     
      let params = {
        projectId,
        type: dateType,
        date: getTime(date, dateType),
        shiftsNo: shiftNo
      }
      let areaIds
      if(areaId!=0){
        areaIds= [areaId]
      }else{
        areaIds= oneLevel?.map(it=>it.id)
      }
      
    
      let res;
      if(view===1){
        res= await energyClassified.QueryEnergy(params, areaIds)
      }else{
        res= await energyClassified.QueryEnergyCost(params, areaIds)
      }
      if (res.success) {
        if (res.data) {
          let xlist=null
          if(dateType ===1 ){
          const hours =   moment().hours()
          xlist =  res.data.consumeDetail[0].x.filter(it=>parseInt(it)<=hours)
      
          }else if (dateType ===2){
           const date =  moment().date()
           xlist = res.data.consumeDetail[0].x.filter(it=>parseInt(it)<=date)
          }         
          setShowData({...res.data,x:xlist})
        } else {
          setShowData([])
        }
      } else {
        message.error(res.errMsg)
      }
    } catch (e) { console.log(e) }
  }
 


  useEffect(() => {
    let values = Object.values(exparams)  
    if(values.length >= 5)   getEnergyData()
  }, [exparams])
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Energy showData={showData} dateType={exparams.type} showType={exparams.view}/> 
    </Pagecount>

  )
}
