import React from 'react'
import { Space } from 'antd'
import { CustLink } from '@com/useButton'

export const natureOptions = [
  {
    value: 1,
    label: '业主自投',
  },
  {
    value: 2,
    label: '运营商投资',
  },
  {
    value: 3,
    label: '建设投资',
  },
]

export const getTableColumns = (isPublish, areaFirstName, onTableEditClick, onTableDeleteClick) => {
  let columns = [
    {
      align: 'center',
      title: areaFirstName + '名称',
      dataIndex: 'areaName',
      key: 'areaName',
    },
    {
      align: 'center',
      title: '站点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '站点地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      align: 'center',
      title: '站点编号',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '站点容量 (kVA)',
      dataIndex: 'capacity',
      key: 'capacity',
      align: 'center',
    },
    {
      title: '投运时间',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      align: 'center',
    },
    {
      title: '投资性质',
      dataIndex: 'investmentNature',
      key: 'investmentNature',
      align: 'center',
      render: (_, record) => natureOptions.find(item => item.value === record.investmentNature)?.label ?? record.investmentNature
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
  ]

  if (!isPublish) {
    columns.push({
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <CustLink
            text="edit"
            onClick={() => onTableEditClick(record)}
          />
          <CustLink
            type="danger"
            text="delete"
            onClick={() => onTableDeleteClick(record)}
          />
        </Space>
      )
    })
  }

  return columns

}
