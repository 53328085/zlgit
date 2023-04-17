import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import Pagecount from '@com/pagecontent'
import {selectProjectId, selectOneLevel} from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import Devices from './devices'
import PCS from './PCS'
import BatteryStack from './batteryStack'
import BatteryCluster from './batteryCluster'
import BatteryPack from './batteryPack'

export default function Index() {
  const [value, setvalue] = useState('devices')
  const projectId = useSelector(selectProjectId);
  const areaList = useSelector(selectOneLevel)
  const tabs = [
    {label: '电表', key: 'devices'},
    {label: 'PCS', key: 'PCS'},
    {label: '电池堆', key: 'batteryStack'},
    {label: '电池簇', key: 'batteryCluster'},
    {label: '电池组', key: 'batteryPack'},
  ]
 const propsData ={
  tabs,
  value,
  setvalue
  }
  const ProjectCom = {
    devices: Devices ,
    PCS: PCS,
    batteryStack: BatteryStack,
    batteryCluster: BatteryCluster,
    batteryPack: BatteryPack,
   }
   const siteList = [
    {
      id: 1,
      name: '1号站点'
    },{
      id: 2,
      name: '2号站点'
    },{
      id: 3,
      name: '3号站点'
    },
   ]

   let Com = ProjectCom[value]
  return (
    <CustContext.Provider value={propsData}>
      <Pagecount showserach={false} pd="16px">   
      { <Com projectId={projectId} siteList={siteList}/>}
      </Pagecount>
    </CustContext.Provider>
  )
}