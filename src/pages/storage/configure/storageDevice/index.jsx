import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Pagecount from '@com/pagecontent'
import { selectProjectId, selectOneLevel,adaptation } from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import Devices from './devices'
import PCS from './PCS'
import BatteryStack from './batteryStack'
import BatteryCluster from './batteryCluster'
import BatteryPack from './batteryPack'
import { Monitoring } from '@api/api.js'
import { useReactive } from 'ahooks'

export default function Index() {
  const {
    DeviceManager: { QueryPlanList }
  } = Monitoring
  const [value, setvalue] = useState('devices')
  const projectId = useSelector(selectProjectId);
  const areaList = useSelector(selectOneLevel)
  const {laptop} = useSelector(adaptation)
  const tabs = [
    { label: '电表', key: 'devices' },
    { label: 'PCS', key: 'PCS' },
    { label: '电池堆', key: 'batteryStack' },
    { label: '电池簇', key: 'batteryCluster' },
    { label: '电池组', key: 'batteryPack' },
  ]
  const propsData = {
    tabs,
    value,
    setvalue
  }
  const ProjectCom = {
    devices: Devices,
    PCS: PCS,
    batteryStack: BatteryStack,
    batteryCluster: BatteryCluster,
    batteryPack: BatteryPack,
  }
  let Com = ProjectCom[value]

  const state = useReactive({
    alarmPlanList: []
  })

  useEffect(() => {
    QueryPlanList(projectId).then(res => {
      if (res.success && Array.isArray(res.data)) {
        state.alarmPlanList = [{ name: '不启用告警方案', id: 0 }, ...res.data]
      } else {
        state.alarmPlanList = [{ name: '不启用告警方案', id: 0 }]
      }
    })

  }, [])
  return (
    <CustContext.Provider value={propsData}>
      <Pagecount showserach={false} pd="16px">
        {<Com projectId={projectId} alarmPlanList={state.alarmPlanList} laptop={laptop} />}
      </Pagecount>
    </CustContext.Provider>
  )
}