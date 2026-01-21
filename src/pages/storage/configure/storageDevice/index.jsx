import React, { useState } from 'react'
import PageContent from '@com/pagecontent'
import CustContext from '@com/content.js'
import { ContainerDeviceType } from '@pages/storage/configure/container/Constant'
import DeviceCommView from '@pages/storage/configure/storageDevice/components/DeviceCommView'
import { useOutletContext } from 'react-router-dom'

export default function Index () {
  let { exparams } = useOutletContext()
  let { areaId, projectId, containerId, stationName } = exparams
  const [tabValue, setTabValue] = useState(99)
  const tabs = [
    { label: '电表', key: 99 },
    { label: '电池堆', key: ContainerDeviceType.BatteryStack },
    { label: '电池簇', key: ContainerDeviceType.BatteryCluster },
    { label: '电池组', key: ContainerDeviceType.BatteryPack },
  ]
  const tabProps = {
    tabs,
    value: tabValue,
    setvalue: setTabValue
  }

  return (
    <CustContext.Provider value={tabProps}>
      <PageContent pd="16px">
        <DeviceCommView
          type={tabValue}
          areaId={areaId}
          containerId={containerId}
          projectId={projectId}
          stationName={stationName}
        />
      </PageContent>
    </CustContext.Provider>
  )
}
