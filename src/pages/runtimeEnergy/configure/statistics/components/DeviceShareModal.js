import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Flex, Typography } from 'antd';
import CModal from '@com/useModal';
import UserTable from '@com/useTable';
import { useSelector } from 'react-redux';
import { adaptation } from '@redux/systemconfig';
import { useMount, useRequest } from 'ahooks';
import { head } from 'lodash';
import { useQueryAreaAllDevicesWithAllocation } from '../api';
import styled from 'styled-components';
import { CustButton } from '@com/useButton';
import { getAreaSharedColumns, getDeviceShareColumns } from '../Constant';

const DeviceInfoContent = styled(Flex)`
  width: 100%;
  height: 80px;
  background-color: #b3d8ff;
  border-radius: 4px;
  padding: 12px;
`

export default function DeviceShareModal({
  open,// 是否打开抽屉
  onClose = null,// 抽屉关闭回调
  projectId,// 项目ID
  areaId,// 区域ID
  areaName,// 区域名称
  deviceStyles,// 设备样式
}) {
  // 设备选择表单
  const [form] = Form.useForm()
  // 搜索参数
  const [searchParams, setSearchParams] = useState({
    type: 0,
    alike: '',
  })
  // 是否为笔记本
  const laptop = useSelector(adaptation) || {}
  // 设备类型选项
  const [deviceTypeOptions, setDeviceTypeOptions] = useState([])
  // 选中的设备类型
  const [selectedRowKey, setSelectedRowKey] = useState(null)
  // 设备表格数据
  const [tableData, setTableData] = useState([]);
  // 分摊类型
  const [sharedType, setSharedType] = useState(1)
  // 分摊列表数据
  const [sharedTableData, setSharedTableData] = useState([])
  // 分摊列表列
  const [sharedColumns, setSharedColumns] = useState([])

  useMount(() => {
    setSharedColumns(getAreaSharedColumns(sharedType, onDeleteClick))
  })

  /**
   * 删除分摊列表中的设备
   */
  const onDeleteClick = (record) => {

  }

  useEffect(() => {
    // 初始化设备类型选项
    if (!open) return
    const options = [...deviceStyles.filter(item => [1, 2, 3, 5, 7, 8, 12, 18].includes(item.deviceStyle))]
    setDeviceTypeOptions(options)
    const initialType = head(options)?.deviceStyle
    form.setFieldsValue({
      type: initialType,
    })
    // 同步更新 searchParams.type，确保 useRequest 的 ready 条件能够满足
    setSearchParams(prev => ({ ...prev, type: initialType }))
  }, [open, deviceStyles])

  useRequest(
    () => useQueryAreaAllDevicesWithAllocation({
      projectId,
      areaId,
      type: searchParams.type,
      alike: searchParams.alike
    }), {
    refreshDeps: [projectId, open, areaId, searchParams],
    ready: areaId && searchParams.type && open,
    onSuccess: ({ data = [] }) => {
      setTableData(data)
    }
  })

  /**
   * 区域选择点击事件
   */
  const onShareAreaClick = () => {
    // 打开区域选择弹窗

  }

  /**
   * 处理抽屉关闭
   */
  const handleClose = () => {
    onClose()
    form.resetFields()
  };

  /**
   * 分摊类型改变事件
   */
  const onSharedTypeChange = (value) => {
    setSharedType(value)
    setSharedColumns(getAreaSharedColumns(value, onDeleteClick))
  }

  return (
    <CModal
      key='shareDrawer'
      width={laptop ? 1200 : 1400}
      onCancel={handleClose}
      open={open}
      closable={false}
      mold="cust"
      destroyOnHidden
      title={`设备分摊(${areaName})`}
      footer={<CustButton text="Cancel" onClick={handleClose} style={{ marginLeft: 'auto' }} />}
    >
      <Flex gap={12} style={{ height: 800 }}>
        <Flex
          gap={12}
          vertical
          style={{
            width: '52%',
            height: '100%',
            border: '1px solid #e5e5e5',
            padding: 12
          }}
        >
          <span>设备选择(单选)</span>
          <Form form={form} layout='inline' style={{ gap: 12 }}>
            <Form.Item label="设备类型" name="type">
              <Select
                style={{ width: 120 }}
                onChange={onSharedTypeChange}
                fieldNames={{ label: 'name', value: 'deviceStyle' }}
                options={deviceTypeOptions}
              />
            </Form.Item>
            <Form.Item name="alike" label="设备搜索">
              <Input.Search
                allowClear
                placeholder="输入设备编号/安装地址/设备名称"
                onSearch={(value) => setSearchParams(prev => ({ ...prev, alike: value }))}
                style={{ width: 290 }}
              />
            </Form.Item>
          </Form>
          <UserTable
            rowKey="id"
            columns={getDeviceShareColumns()}
            rowSelection={{
              type: 'radio',
              selectedRowKey,
              onChange: (keys) => setSelectedRowKey(head(keys) || null)
            }}
            dataSource={tableData}
            scroll={{
              x: 'max-content',
              y: 'calc(100vh - 220px)',
            }}
          />
        </Flex>
        <Flex
          gap={12}
          vertical
          style={{
            width: 'calc(48% - 12px)',
            height: '100%',
            border: '1px solid #e5e5e5',
            padding: 12
          }}
        >
          <span>设备分摊</span>
          <DeviceInfoContent>
            <Flex>
              <div>设备编号</div>
              <div>111</div>
            </Flex>
          </DeviceInfoContent>
          <Flex align='center' gap={12}>
            <span>区域分摊(4条)</span>
            <div style={{ flex: 1 }}></div>
            <Select
              style={{ width: 120 }}
              value={sharedType}
              onChange={onSharedTypeChange}
              options={[
                { label: '按面积', value: 1 },
                { label: '按人数', value: 2 },
                { label: '按产值', value: 3 },
                { label: '按产量', value: 4 },
              ]}
            />
            <CustButton wh='auto' onClick={onShareAreaClick}>区域选择</CustButton>
          </Flex>
          <div style={{ flex: 1 }}>
            <UserTable
              rowKey="areaId"
              columns={sharedColumns}
              dataSource={sharedTableData}
              scroll={{
                x: 'max-content',
                y: 'calc(100vh - 220px)',
              }}
            />
          </div>
        </Flex>
      </Flex>
    </CModal>
  );
}