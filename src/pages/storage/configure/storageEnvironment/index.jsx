import React, { useState } from 'react'
import PageContent from '@com/pagecontent'
import CustContext from '@com/content.js'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { StorageDeviceDesigner } from '@api/api'
import { message } from 'antd'
import { isArray } from 'lodash'
import EnvironmentCommView from '@pages/storage/configure/storageEnvironment/components/EnvironmentCommView'

export default function Index () {
  // 从路由上下文中获取参数
  let { exparams } = useOutletContext()
  // 解构获取区域ID、项目ID、容器ID和站点名称
  let { areaId, projectId, containerId, stationName } = exparams
  // 处理容器ID，如果是对象则取其value属性
  const containerIdValue = containerId && typeof containerId === 'object' ? containerId.value : containerId
  // 获取URL查询参数
  let [searchParams] = useSearchParams()
  // 从URL参数中获取item值，用于确定默认选中的页签
  const itemParam = searchParams.get('item')
  // 默认选中页签的值，如果URL中有item参数则使用该参数，否则默认为'301'
  const initialTabValue = itemParam !== null ? itemParam.toString() : '301'
  // 当前选中的页签值
  const [tabValue, setTabValue] = useState(initialTabValue)
  // 页签数据数组
  const [tabs, setTabs] = useState([])
  // 页签组件所需属性
  const tabProps = {
    tabs,
    value: tabValue,
    setvalue: setTabValue
  }

  /**
   * 获取动态页签数据
   * 该函数通过API调用获取页签数据，并在成功后更新tabs和tabValue状态
   * @returns {Promise} API请求Promise对象
   */
  useRequest(async () => {
    // 在请求函数内部进行参数验证，如果参数无效则直接返回空结果而不发起请求
    if (!projectId || !containerId) {
      console.log('Missing required parameters, skipping request')
      return Promise.resolve({ data: [] }) // 返回一个解析后的Promise，避免实际请求
    }
    // 检查containerId的值是否有效
    if (!containerIdValue) {
      console.log('ContainerId value is invalid, skipping request')
      return Promise.resolve({ data: [] })
    }
    // 参数有效，执行实际的API调用
    return StorageDeviceDesigner.getStorageEnvironmentTabsApi(projectId, containerIdValue)
  }, {
    manual: false,
    // 请求成功后的回调函数，用于更新页签数据和选中状态
    onSuccess: ({ data }) => {
      setTabs(data.map(item => {return { label: item.value, key: item.key.toString() }}))
      if (isArray(data) && data.length > 0) {
        let isIncludeItem = data.find(item => item.key.toString() === initialTabValue)
        setTabValue(isIncludeItem ? initialTabValue : data[0].key.toString())
      }
    },
    // 依赖项数组，当projectId或containerIdValue变化时重新执行请求
    refreshDeps: [projectId, containerIdValue],
    // 请求失败的回调函数，用于显示错误消息
    onError: (err) => {
      message.error(err.message)
    }
  })

  return (
    <>
      {
        tabs.length > 0 &&
        <>
          <CustContext.Provider value={tabProps}>
            <PageContent pd="16px">
              <EnvironmentCommView
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