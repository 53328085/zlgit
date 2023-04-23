import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import Pagecount from '@com/pagecontent'
import {selectProjectId, selectOneLevel} from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import AirCondition from './airCondition'
import TemperatureSensor from './temperatureSensor'
import WaterSensor from './waterSensor'

export default function Index() {
  const [value, setvalue] = useState('airCondition')
  const projectId = useSelector(selectProjectId);
  const areaList = useSelector(selectOneLevel)
  const tabs = [
    {label: '储能柜空调', key: 'airCondition'},
    {label: '环境温度传感器', key: 'temperatureSensor'},
    {label: '水浸传感器', key: 'waterSensor'},
  ]
 const propsData ={
  tabs,
  value,
  setvalue
  }
  const ProjectCom = {
    airCondition: AirCondition ,
    temperatureSensor: TemperatureSensor,
    waterSensor: WaterSensor,
   }

   let Com = ProjectCom[value]
  return (
    <CustContext.Provider value={propsData}>
      <Pagecount showserach={false} pd="16px">   
      { <Com projectId={projectId} areaList={areaList}/>}
      </Pagecount>
    </CustContext.Provider>
  )
}