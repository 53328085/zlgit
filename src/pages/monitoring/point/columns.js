import {nanoid} from '@reduxjs/toolkit'
export default [
    {
      dataIndex: "sn",
      title: "设备编号",      
    },
    {
      dataIndex: "categoryName",
      title: "设备型号",
    },
    {
      dataIndex: "status", // status 1: 离线 2：在线
      title: "设备状态",
      render: (text) => <span>{text===1 ? '离线' : text ===2 ? '在线' : ''}</span>
    },
    {
      dataIndex: "address",
      title: "安装地址",
    },
    {
      dataIndex: "customer",
      title: "客户名",
    },
    {
      dataIndex: "lastSampleTime",
      title: "更新时间",
    },
  ]
export const onDesc = {
    expandedRowRender: (record) => {
       const desc = record.data.map(r => <span key={nanoid()}>{r.description}{r.display}</span>)
       return (<div key={nanoid()}>{desc}</div>)
      },
    rowExpandable: (record) => Array.isArray(record.data) && record.data?.length > 0
  }