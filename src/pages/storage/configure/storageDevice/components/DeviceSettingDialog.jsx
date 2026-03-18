/**
 * 设备设置对话框组件
 * 用于选择和配置储能设备
 */
import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState, useEffect } from 'react'
import { useMemoizedFn, useRequest } from 'ahooks'
import TableTransfer from '@pages/storage/configure/storageDevice/components/TableTransfer'
import { getDeviceTitle } from '@pages/storage/configure/storageDevice/Constant'
import { StorageDeviceDesigner } from '@api/api'
import { message } from 'antd'

/**
 * 左侧表格列配置
 * 显示未选中设备的信息
 */
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
/**
 * 右侧表格列配置
 * 显示已选中设备的信息
 */
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

/**
 * 设备设置对话框组件
 * @param {Function} onRefreshClick - 刷新点击回调函数
 * @param {string} projectId - 项目ID
 * @param {string} siteId - 站点ID
 * @param {string} containerId - 容器ID
 * @param {string} tab - Tab页标识
 * @param {number} limit - 选择设备数量限制，默认为0（无限制）
 * @param {RefObject} ref - 组件引用
 * @returns {JSX.Element} 设备设置对话框
 */
const DeviceSettingDialog = ({ onRefreshClick, projectId, siteId, containerId, tab, limit = 0 }, ref) => {
  const modalRef = useRef(null)
  const [sourceData, setSourceData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])

  /**
   * 显示对话框并获取配置信息
   * 重置状态并加载设备配置数据
   */
  const showDialog = useMemoizedFn(() => {
    //重置
    setSourceData([])
    setTargetKeys([])
    getConfigInfo()
    modalRef.current?.onOpen()
  })

  /**
   * 获取设备配置信息的请求
   * 根据项目、站点、容器和tab参数获取设备配置列表
   */
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

  /**
   * 保存设备配置
   * 验证选择的设备数量并调用API保存配置
   */
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

  /**
   * 使用useImperativeHandle暴露组件方法给父组件
   * 使得父组件可以通过ref调用showDialog方法
   */
  useImperativeHandle(ref, () => ({
    showDialog
  }))

  /**
   * 处理设备转移变化
   * 当设备从左侧移动到右侧或反之，检查是否超出数量限制
   * @param {Array} newTargetKeys - 新的目标键数组
   * @param {string} direction - 移动方向 ('left' 或 'right')
   * @param {Array} moveKeys - 被移动的键数组
   */
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