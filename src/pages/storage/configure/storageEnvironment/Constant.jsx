import { Space } from 'antd'
import { CustLink } from '@com/useButton'

export const getDeviceTitle = (type) => {
  switch (type) {
    case '301':
      return '除湿机'
    case '302':
      return '液冷系统'
    case '303':
      return '消防系统'
    case '304':
      return '风冷空调'
    case '305':
      return '环境温度传感器'
    case '306':
      return '水浸传感器'
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


