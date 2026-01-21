import { Space } from 'antd'
import { CustLink } from '@com/useButton'

export const getDeviceTitle = (type) => {
  switch (type) {
    case 0:
      return '电池堆'
    case 1:
      return '电池簇'
    case 2:
      return '电池组'
    default:
      return '电表'
  }
}

export const getTableColumns = (type, onTableDeleteClick) => {
  return [
    {
      title: '所属站点',
      dataIndex: 'siteName',
    },
    {
      title: '储能柜编号',
      dataIndex: 'no',
    },
    {
      title: '储能柜名称',
      dataIndex: 'name',
    },
    {
      title: '安装地址',
      dataIndex: 'address',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <Space>
          <CustLink type="danger" text="delete" onClick={() => onTableDeleteClick(record)}/>
        </Space>
      )
    },
  ]
}
