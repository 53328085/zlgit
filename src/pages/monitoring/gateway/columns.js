import {
    nanoid
} from "@reduxjs/toolkit";

export default [{
        dataIndex: "sn",
        title: "网关编号",
    },
    {
        dataIndex: "categoryName",
        title: "网关型号",
    },
    {
        dataIndex: "address",
        title: "安装地址",
    },
    {
        dataIndex: "enabled",
        title: "是否启用",
        render: (text) => <span> {text === 1 ? '启用' : '未启用'} </span>
    },
    {
        dataIndex: 'imei',
        title: "IMEI"
    }
]

export const onDesc = {
    expandedRowRender: (record) => {
       const desc = record.data.map(r => <span key={nanoid()}>{r.description}{r.display}</span>)
       return (<div key={nanoid()}>{desc}</div>)
      },
    rowExpandable: (record) => Array.isArray(record.data) && record.data?.length > 0
  }