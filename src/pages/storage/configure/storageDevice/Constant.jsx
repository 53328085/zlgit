import { Space } from 'antd'
import { CustLink } from '@com/useButton'

export const getDeviceTitle = (type) => {
  switch (type) {
    case '201':
      return 'PCS'
    case '202':
      return 'EMU'
    case '203':
      return '电池堆'
    case '204':
      return '电池簇'
    case '205':
      return '电池组'
    default:
      return '电表'
  }
}

export const getTableColumns = (type, onTableDeleteClick) => {
  return [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      align: 'center',
    },
    {
      title: '设备编号',
      dataIndex: 'sn',
      align: 'center',
    },
    {
      title: '设备类型',
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: '网关编号',
      dataIndex: 'gatewaySn',
      align: 'center',
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (text, record) => (
        <Space>
          <CustLink type="danger" text="delete" onClick={() => onTableDeleteClick(record)}/>
        </Space>
      )
    },
  ]
}


