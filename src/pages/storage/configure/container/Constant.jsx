import { Space } from 'antd'
import { CustLink } from '@com/useButton'

export const getTableColumns = (levelLabel, onTableEditClick, onTableDeleteClick) => {
  return [
    {
      title: levelLabel,
      dataIndex: 'areaName',
    },
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
          <CustLink onClick={() => onTableEditClick(record)} text="edit"/>
          <CustLink type="danger" text="delete" onClick={() => onTableDeleteClick(record)}/>
        </Space>
      )
    },

  ]
}

export const getBMSOptions = () => {
  return [
    { label: '电池堆', value: 0 },
    { label: '电池簇', value: 1 },
    { label: '电池组', value: 2 }
  ]
}

export const ContainerDeviceType = {
  BatteryStack: 0,
  BatteryCluster: 1,
  BatteryPack: 2
}

/**
 * 处理BMS数据
 * @param value
 * @returns {number}
 */
export const valueToBinary = (value) => {
  // 初始化二进制数，初始值为0
  let binaryNumber = 0
  // 遍历输入的value数组
  value.forEach((bit) => {
    const position = parseInt(bit, 10)
    if (!isNaN(position)) {
      binaryNumber |= (1 << position) // 设置对应的位为1
    }
  })
  // 返回最终的二进制数
  return binaryNumber
}

export const binaryToValue = (binaryNumber) => {
  // 初始化一个空数组
  const value = []
  // 遍历 binaryNumber 的每一位（最多8位）
  for (let i = 0; i < 8; i++) {
    // 使用按位与运算检查第 i 位是否为 1
    if (binaryNumber & (1 << i)) {
      value.push(i) // 将对应的位推入数组
    }
  }
  // 返回最终的 value 数组
  return value
}

