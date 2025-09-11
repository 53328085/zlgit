import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Pagecount from '@com/pagecontent'
import { selectProjectId, selectOneLevel, adaptation } from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import AirCondition from './airCondition'
import TemperatureSensor from './temperatureSensor'
import WaterSensor from './waterSensor'
import { Monitoring } from '@api/api.js'
import { useReactive } from 'ahooks'

export default function Index() {
  const [value, setvalue] = useState('airCondition')
  const projectId = useSelector(selectProjectId);
  const areaList = useSelector(selectOneLevel)
  const { laptop } = useSelector(adaptation)
  const {
    DeviceManager: { QueryPlanList }
  } = Monitoring

  const tabs = [
    { label: '储能柜空调', key: 'airCondition' },
    { label: '环境温度传感器', key: 'temperatureSensor' },
    { label: '水浸传感器', key: 'waterSensor' },
  ]
  const propsData = {
    tabs,
    value,
    setvalue
  }
  const ProjectCom = {
    airCondition: AirCondition,
    temperatureSensor: TemperatureSensor,
    waterSensor: WaterSensor,
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
        {<Com projectId={projectId} areaList={areaList} alarmPlanList={state.alarmPlanList} laptop={laptop} />}
      </Pagecount>
    </CustContext.Provider>
  )
}