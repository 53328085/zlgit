import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import Pagecount from '@com/pagecontent'
import {selectProjectId, selectOneLevel} from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import AirCondition from './airCondition'
import Sensor from './sensor'
import Annihilator from './annihilator'

export default function Index() {
  const [value, setvalue] = useState('airCondition')
  const projectId = useSelector(selectProjectId);
  const areaList = useSelector(selectOneLevel)
  const tabs = [
    {label: '空调', key: 'airCondition'},
    {label: '传感器', key: 'sensor'},
    {label: '灭火器监控', key: 'annihilator'},
  ]
 const propsData ={
  tabs,
  value,
  setvalue
  }
  const ProjectCom = {
    airCondition: AirCondition ,
    sensor: Sensor,
    annihilator: Annihilator,
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