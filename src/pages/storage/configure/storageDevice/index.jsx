import React, { useEffect, useState } from 'react'
import PageContent from '@com/pagecontent'
import CustContext from '@com/content.js'
import DeviceCommView from '@pages/storage/configure/storageDevice/components/DeviceCommView'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { StorageDeviceDesigner } from '@api/api'
import { message } from 'antd'
import { isArray } from 'lodash'

/**
 * 存储设备配置页面组件
 * 用于展示和管理存储设备的相关配置信息
 */
export default function Index () {
  // 从路由上下文中获取额外参数
  let { exparams } = useOutletContext()
  // 从exparams中解构出区域ID、项目ID、容器ID和站点名称
  let { areaId, projectId, containerId, stationName } = exparams
  
  // 容器ID的state，用于存储容器ID的值
  const [containerIdValue, setContainerIdValue] = useState(containerId && typeof containerId === 'object' ? containerId.value : null)
  
  // 获取URL搜索参数
  let [searchParams] = useSearchParams()
  // 从URL参数中获取item值，用于确定默认选中的页签
  const itemParam = searchParams.get('item')
  
  // 默认选中的页签值，如果URL中有item参数则使用该参数，否则默认为'101'
  const initialTabValue = itemParam !== null ? itemParam.toString() : '101'
  
  // 当前选中的页签state
  const [tabValue, setTabValue] = useState(initialTabValue)
  // 页签数据state
  const [tabs, setTabs] = useState([])
  
  // 页签属性对象，用于传递给上下文提供者
  const tabProps = {
    tabs,
    value: tabValue,
    setvalue: setTabValue
  }

  /**
   * 当containerId发生变化时，更新containerIdValue的值
   * 用于保持容器ID状态与传入的containerId参数同步
   */
  useEffect(() => {
    setContainerIdValue(containerId && typeof containerId === 'object' ? containerId.value : null)
  }, [containerId])

  /**
   * 获取动态页签数据的请求处理
   * 该函数通过useRequest hook发起API请求，获取存储设备的页签配置信息
   * 在请求前会进行参数验证，如果参数无效则返回空结果
   * 请求成功后会更新页签数据和默认选中的页签
   * 请求失败时会显示错误信息
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
    return StorageDeviceDesigner.getStorageDeviceTabsApi(projectId, containerIdValue)
  }, {
    manual: false,
    // 请求成功时的回调函数
    onSuccess: ({ data }) => {
      // 将API返回的数据转换为页签格式并设置到tabs state中
      setTabs(data.map(item => {return { label: item.value, key: item.key.toString() }}))
      // 如果存在数据且数据长度大于0，判断初始页签是否存在于返回的数据中
      if (isArray(data) && data.length > 0) {
        // 查找初始页签是否在返回数据中存在
        let isIncludeItem = data.find(item => item.key.toString() === initialTabValue)
        // 如果存在则使用初始页签，否则使用第一个页签
        setTabValue(isIncludeItem ? initialTabValue : data[0].key.toString())
      }
    },
    // 请求刷新依赖项
    refreshDeps: [projectId, containerIdValue],
    // 请求失败时的回调函数
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