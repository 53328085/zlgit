import {nanoid} from '@reduxjs/toolkit'
export default [
    {
      dataIndex: "Name",
      title: "线路名称",
    },
    {
      dataIndex: "StartTime",
      title: "开始日期",
    },{
        dataIndex: "EndTime",
        title: "结束日期",
      },{
        dataIndex: "Total",
        title: "用电量-总表(Kwh)",
      },{
        dataIndex: "Per",
        title: "用电量-分表(Kwh)",
      },{
        dataIndex: "Difference",
        title: "总-分差额",
      },{
        dataIndex: "Rate",
        title: "线损率(%)",
      },
  ]
export const onDesc = {
    expandedRowRender: (record) => {
       const desc = record.data.map(r => <span key={nanoid()}>{r.description}{r.display}</span>)
       return (<div key={nanoid()}>{desc}</div>)
      },
    rowExpandable: (record) => Array.isArray(record.data) && record.data?.length > 0
  }