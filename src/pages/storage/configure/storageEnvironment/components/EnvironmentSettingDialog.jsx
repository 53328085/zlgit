import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react'
import { useMemoizedFn, useRequest } from 'ahooks'
import { StorageDeviceDesigner } from '@api/api'
import { message } from 'antd'
import TableTransfer from '@pages/storage/configure/storageEnvironment/components/TableTransfer'
import { getDeviceTitle } from '@pages/storage/configure/storageEnvironment/Constant'

/**
 * 左侧表格列配置
 * 包含设备编号、设备名称、设备类型和安装地址列
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
 * 包含设备编号、设备名称和设备类型列
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
 * 环境配置对话框组件
 * 用于选择和配置存储设备
 * @param {Object} props - 组件属性
 * @param {Function} props.onRefreshClick - 刷新按钮点击回调
 * @param {string} props.projectId - 项目ID
 * @param {string} props.siteId - 站点ID
 * @param {string} props.containerId - 容器ID
 * @param {string} props.tab - 标签页标识
 * @param {Object} ref - 组件引用
 * @returns {JSX.Element} 环境配置对话框
 */
const EnvironmentSettingDialog = ({ onRefreshClick, projectId, siteId, containerId, tab }, ref) => {
  //模态框引用
  const modalRef = useRef(null)
  //源数据状态 - 包含所有设备数据（已配置和未配置）
  const [sourceData, setSourceData] = useState([])
  //目标键状态 - 已选中的设备SN列表
  const [targetKeys, setTargetKeys] = useState([])

  /**
   * 显示对话框函数
   * 重置数据并获取配置信息
   * @returns {void}
   */
  const showDialog = useMemoizedFn(() => {
    //重置
    setSourceData([])
    setTargetKeys([])
    getConfigInfo()
    modalRef.current?.onOpen()
  })

  /**
   * 获取配置信息请求
   * 根据项目、站点、容器ID和标签页获取设备配置数据
   * @type {Function}
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
   * 保存点击事件处理函数
   * 验证选择的设备并调用API保存配置
   * @returns {Promise<void>}
   */
  const onSaveClick = useMemoizedFn(async () => {
    if (targetKeys.length <= 0) {
      message.error('请选择设备')
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
   * @returns {Object} 暴露的方法对象
   */
  useImperativeHandle(ref, () => ({
    showDialog
  }))

  /**
   * 表格转移变化处理函数
   * 更新目标键状态
   * @param {Array} newTargetKeys - 新的目标键数组
   * @param {string} direction - 移动方向
   * @param {Array} moveKeys - 被移动的键数组
   * @returns {void}
   */
  const onChange = (newTargetKeys, direction, moveKeys) => {
    //
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

export default forwardRef(EnvironmentSettingDialog)
