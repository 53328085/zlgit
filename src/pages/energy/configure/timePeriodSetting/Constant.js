import moment from 'moment'
import { Popconfirm, Space, Typography } from 'antd'

const { Link } = Typography

export const getColumns = (onTableEditClick,onTableDeleteClick) => {
  return [
    {
      title: '启用日期',
      dataIndex: 'enableDate',
    },
    {
      title: '时段数',
      dataIndex: 'count',
    },
    {
      title: '时段',
      dataIndex: 'periods',
    },
    {
      title: '操作',
      key: 'op',
      render: (_, record) => {
        return (
          moment(record.enableDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'days', true) > 0 ?
            <Space size={32}>
              <Link onClick={() => onTableEditClick(record)} underline> 修改 </Link>
              <Popconfirm title="是否删除" onConfirm={() => onTableDeleteClick(record)}>
                <Link type="danger" underline>删除</Link>
              </Popconfirm>
            </Space> : null
        )
      }
    },
  ]
}
