import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState, useEffect } from 'react'
import { useMemoizedFn, useRequest } from 'ahooks'
import ElectricTransfer from '@pages/storage/configure/storageDevice/components/ElectricTransfer'
import { getDeviceTitle } from '@pages/storage/configure/storageDevice/Constant'
import { StorageDeviceDesigner } from '@api/api'
import { message } from 'antd'

const ElectricSettingDialog = ({ onRefreshClick, projectId, siteId, containerId, tab }, ref) => {
  const modalRef = useRef(null)
  const [mainTable, setMainTable] = useState([])
  const [loadTable, setLoadTable] = useState([])
  const [gridTable, setGridTable] = useState([])
  const [unknownTable, setUnknownTable] = useState([])

  const showDialog = useMemoizedFn(() => {
    //重置
    setMainTable([])
    setLoadTable([])
    setGridTable([])
    setUnknownTable([])
    getConfigInfo()
    modalRef.current?.onOpen()
  })

  const { run: getConfigInfo } = useRequest(() => {
    const requiredParams = [projectId, siteId, containerId]
    if (requiredParams.some(param => param === undefined || param === null)) {
      return Promise.resolve({ data: null })
    }
    return StorageDeviceDesigner.getStorageDeviceConfigListApi(projectId, siteId, containerId, tab)
  }, {
    manual: true,
    onSuccess: ({ data }) => {
      if (data) {
        const config = data?.configed ?? []
        const noConfig = data?.noConfiged ?? []
        // 根据设备类型分离配置的设备
        const gridDevices = config.filter(item => item.type === 101)
        const mainDevices = config.filter(item => item.type === 102)
        const loadDevices = config.filter(item => item.type === 103)
        
        setGridTable(gridDevices)
        setMainTable(mainDevices)
        setLoadTable(loadDevices)
        setUnknownTable([...noConfig]) // 未配置的设备
      }
    },
    refreshDeps: [containerId, tab]
  })

  const onSaveClick = useMemoizedFn(async () => {
    if (mainTable.length <= 0 && loadTable.length <= 0 && gridTable.length <= 0) {
      message.error('请选择设备')
      return
    }
    const params = [
      ...mainTable.map(item => {
        return {
          sn: item.sn,
          type: 102
        }
      }),
      ...loadTable.map(item => {
        return {
          sn: item.sn,
          type: 103
        }
      }),
      ...gridTable.map(item => {
        return {
          sn: item.sn,
          type: 101
        }
      })
    ]
    try {
      const {
        success,
        errMsg
      } = await StorageDeviceDesigner.setStorageDeviceConfigApi(params, projectId, siteId, containerId, tab)
      if (success) {
        message.success('保存成功')
        onRefreshClick()
        modalRef.current?.onCancel()
      } else {
        message.error(errMsg)
      }
    } catch (error) {
      message.error(error.message)
    }
  })

  useImperativeHandle(ref, () => ({
    showDialog
  }))

  const handleSaveValue = (data) => {
    // 处理 ElectricTransfer 组件传递回来的数据
    console.log('ElectricTransfer data:', data)
    // 更新状态以供后续使用
    setMainTable(data.mainData || [])
    setLoadTable(data.loadData || [])
    setGridTable(data.gridData || [])
    setUnknownTable(data.unknownData || [])
  }

  const handleCloseValue = (value) => {
    // 处理关闭事件
    modalRef.current?.onCancel()
  }

  return (
    <CustomModal
      ref={modalRef}
      onOk={onSaveClick}
      onCancel={() => modalRef.current?.onCancel()}
      title={`选择${getDeviceTitle(tab)}`}
      width={1200}
      closable={false}
      mold="cust"
    >
      <ElectricTransfer
        mainTable={mainTable}
        loadTable={loadTable}
        gridTable={gridTable}
        unknownTable={unknownTable}
        saveValue={handleSaveValue}
        closeValue={handleCloseValue}
        transferTitle={{
          mainTitle: '储能计量表',
          loadTitle: '负载总表',
          gridTitle: '并网关口表',
          unknownTitle: '未分配设备'
        }}
      />
    </CustomModal>
  )
}

export default forwardRef(ElectricSettingDialog)
