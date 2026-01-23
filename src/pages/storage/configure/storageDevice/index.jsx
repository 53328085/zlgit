import React, { useEffect, useState } from 'react'
import PageContent from '@com/pagecontent'
import CustContext from '@com/content.js'
import DeviceCommView from '@pages/storage/configure/storageDevice/components/DeviceCommView'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { StorageDeviceDesigner } from '@api/api'
import { message } from 'antd'

export default function Index () {
  let { exparams } = useOutletContext()
  let { areaId, projectId, containerId, stationName } = exparams
  const containerIdValue = containerId && typeof containerId === 'object' ? containerId.value : containerId;
  let [searchParams] = useSearchParams()
  const itemParam = searchParams.get('item')
  const initialTabValue = itemParam !== null ? itemParam.toString() || '10' : '10'
  const [tabValue, setTabValue] = useState(initialTabValue)
  const [tabs, setTabs] = useState([])
  const tabProps = {
    tabs,
    value: tabValue,
    setvalue: setTabValue
  }

  /**
   * 获取动态页签数据
   */
  useRequest(async () => {
    // 在请求函数内部进行参数验证，如果参数无效则直接返回空结果而不发起请求
    if (!projectId || !containerId) {
      console.log('Missing required parameters, skipping request');
      return Promise.resolve({ data: [] }); // 返回一个解析后的Promise，避免实际请求
    }
    // 检查containerId的值是否有效
    if (!containerIdValue) {
      console.log('ContainerId value is invalid, skipping request');
      return Promise.resolve({ data: [] });
    }
    // 参数有效，执行实际的API调用
    return StorageDeviceDesigner.getStorageDeviceTabsApi(projectId, containerIdValue);
  }, {
    manual: false,
    onSuccess: ({ data }) => {
      setTabs(data.map(item => {return { label: item.value, key: item.key.toString() }}))
    },
    refreshDeps: [projectId, containerIdValue],
    onError: (err) => {
      message.error(err.message)
    }
  })

  return (
    <>
    {
      tabs.length>0&&
      <>
      <CustContext.Provider value={tabProps}>
      <PageContent pd="16px">
        <DeviceCommView
          tab={tabValue}
          areaId={areaId}
          containerId={containerIdValue}
          projectId={projectId}
          stationName={stationName}
        />
      </PageContent>
    </CustContext.Provider>
      </>
    }
    </>
  )
}
