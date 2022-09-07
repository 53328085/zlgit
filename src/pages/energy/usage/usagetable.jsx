import React from 'react'
// import UserTable from '@com/useTable'
import { Table } from 'antd';
export default function usagetable() {
let tablecolumns= [
    {
      dataIndex: "sn",
      title: "设备编号",
      fixed:'left',
      align:'center',
      width: 160
    },
    {
      dataIndex: "categoryName",
      title: "设备型号",
      fixed:'left',
      align:'center',
      width: 96,
      render: text => <a>{text}</a>,
    },
    {
      dataIndex: "status", // status 1: 离线 2：在线
      title: "测点",
      fixed:'left',
      align:'center',
      width: 98,
      render: text => <a>{text}</a>,
    },
    {
      dataIndex: "address",
      title: "安装地址",
      fixed:'left',
      align:'center',
      width:122
    },
  ]
  for(let i=1;i<=24;i++){
    tablecolumns.push({
        key: i,
        width:112,
        dataIndex:`time${i}`,
        title:`${i<10?'0'+i:i}:00`,
        align:'right'
    })
  }
 
  return (
    <Table columns={tablecolumns} scroll={{
        x: 1500,
      }}></Table>
  )
}
