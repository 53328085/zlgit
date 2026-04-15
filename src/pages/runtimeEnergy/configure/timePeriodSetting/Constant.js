import dayjs from 'dayjs'
import { Popconfirm, Space, Tag, Typography } from 'antd'

const { Link } = Typography

export const getColumns = (onTableEditClick, onTableDeleteClick) => {
  return [
    {
      title: '方案名称',
      dataIndex: 'planName',
    },
    {
      title: '应用状态',
      dataIndex: 'enable',
      render: (_, record) => <Tag
        color={record.enable === 1 ? 'green' : record.enable === 2 ? '' : 'blue'}>{record.enable === 1 ? '应用中' : record.enable === 2 ? '已失效' : '未生效'}</Tag>,
    },
    {
      title: '启用日期',
      dataIndex: 'enableDate',
      render: (_, record) => dayjs(record.enableDate).format('YYYY-MM-DD')
    },
    {
      title: '时段数',
      dataIndex: 'count',
    },
    {
      title: '方案内容',
      dataIndex: 'periods',
    },
    {
      title: '操作',
      key: 'op',
      render: (_, record) => {
        return (
            <Space size={32}>
              <Link disabled={record.enable !== 0} onClick={() => onTableEditClick(record)} underline> 修改 </Link>
              <Popconfirm title="是否删除" onConfirm={() => onTableDeleteClick(record)}>
                <Link disabled={record.enable === 1} type="danger" underline>删除</Link>
              </Popconfirm>
            </Space>
        )
      }
    },
  ]
}

export const getTimePeriodTypeOptions = () => {
  return [
    { label: '尖', value: 1 },
    { label: '峰', value: 2 },
    { label: '平', value: 3 },
    { label: '谷', value: 4 },
    { label: '深谷', value: 5 }
  ]
}

export const getTimePeriodOptions = () => {
  const options = []
  const totalIntervals = 24 * 4 // 24小时 * 4个15分钟间隔

  for (let i = 0; i < totalIntervals + 1; i++) {
    const hours = Math.floor(i / 4)
    const minutes = (i % 4) * 15
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    options.push({
      label: timeStr,
      value: timeStr,
    })
  }
  return options
}

export const getStepOptions = () => {
  return Array.from({ length: 14 }, (_, index) => ({ label: index + 1, value: index + 1 }))
}

export const DefaultFormInfo = {
  planName: '',
  step: 4,
  enableDate: dayjs().add(1, 'day'),
  newTariffTimes: [
    {
      tariffTimeType: null,
      startTime: '00:00',
      endTime: '',
    },
    {
      tariffTimeType: null,
      startTime: '',
      endTime: '',
    },
    {
      tariffTimeType: null,
      startTime: '',
      endTime: '',
    },
    {
      tariffTimeType: null,
      startTime: '',
      endTime: '00:00',
    }
  ]
}
