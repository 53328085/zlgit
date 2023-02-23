import React from 'react'
import Comp from './comp'
import Table from '@com/useTable'
export default function parkstreet() {
  const columns=[{
    title:'园区名称',
    dataIndex:''
  },
  {
    title:'安装地址',
    dataIndex:''
  },
  {
    title:'公共照明名称',
    dataIndex:''
  },
  {
    title:'所属控制箱',
    dataIndex:''
  },
  {
    title:'控制器编号',
    dataIndex:''
  },
  {
    title:'备注',
    dataIndex:''
  },
  {
    title:'操作',
    dataIndex:''
  }]
  return (
    <div>
     <Comp>
      <Table columns={columns}></Table>
     </Comp>
    </div>
  )
}
