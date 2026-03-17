import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState, useEffect } from 'react'
import { useMemoizedFn, useRequest } from 'ahooks'
import TableTransfer from '@pages/storage/configure/storageDevice/components/TableTransfer'
import { getDeviceTitle } from '@pages/storage/configure/storageDevice/Constant'
import { StorageDeviceDesigner } from '@api/api'
import { message } from 'antd'

const leftTableColumns = [
  {
    dataIndex: 'sn',
    title: '设备编号',
    align: 'center',
  },
  {
    dataIndex: 'deviceName',
    title: '设备名称',
    align: 'center',
  },
  {
    title: '设备类型',
    dataIndex: 'category',
    align: 'center',
  },
  {
    dataIndex: 'address',
    title: '安装地址',
    align: 'center',
  },
]
const rightTableColumns = [
  {
    dataIndex: 'sn',
    title: '设备编号',
    align: 'center',
  },
  {
    dataIndex: 'deviceName',
    title: '设备名称',
    align: 'center',
  },
  {
    title: '设备类型',
    dataIndex: 'category',
    align: 'center',
  },
]

const DeviceSettingDialog = ({ onRefreshClick, projectId, siteId, containerId, tab, limit = 0 }, ref) => {
  const modalRef = useRef(null)
  const [sourceData, setSourceData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])

  const showDialog = useMemoizedFn(() => {
    //重置
    setSourceData([])
    setTargetKeys([])
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
        setTargetKeys(config.map(item => item.sn))
        setSourceData([...config, ...noConfig])
      }
    },
    refreshDeps: [containerId, tab]
  })

  const onSaveClick = useMemoizedFn(async () => {
    if (targetKeys.length <= 0) {
      message.error('请选择设备')
      return
    }

    // 限制选中设备数量
    if (limit > 0 && targetKeys.length > limit) {
      message.error(`最多只能选择 ${limit} 个设备`)
      return
    }

    const params = targetKeys.map(item => {
      return {
        sn: item,
        type: Number(tab)
      }
    })
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

  const onChange = (newTargetKeys, direction, moveKeys) => {

    // 限制添加数量
    if (limit > 0 && direction === 'right' && newTargetKeys.length > limit) {
      message.error(`最多只能选择 ${limit} 个设备`)
      return
    }

    setTargetKeys(newTargetKeys)
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
      <TableTransfer
        titles={['未选中设备', '已选中设备']}
        showSearch
        dataSource={sourceData}
        targetKeys={targetKeys}
        onChange={onChange}
        filterOption={(inputValue, item) =>
          item.deviceName.indexOf(inputValue) !== -1 || item.sn.indexOf(inputValue) !== -1
        }
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
        render={item => item.title}
        rowKey={record => record.sn}
      />
    </CustomModal>
  )
}

export default forwardRef(DeviceSettingDialog)
