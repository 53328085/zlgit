import {nanoid} from '@reduxjs/toolkit'
export default [
    {
      dataIndex: "Name",
      title: "线路名称",
      align:'center',
      width: '278px'
    },
    {
      dataIndex: "StartTime",
      title: "开始日期",
      align:'center',
      width: '178px'
    },{
        dataIndex: "EndTime",
        title: "结束日期",
        align:'center',
        width: '178px'
      },{
        dataIndex: "Total",
        title: "用电量-总表(Kwh)",
        align:'center',
        width: '174px'
      },{
        dataIndex: "Per",
        title: "用电量-分表(Kwh)",
        align:'center',
        width: '174px'
      },{
        dataIndex: "Difference",
        title: "总-分差额(Kwh)",
        align:'center',
        width: '174px'
      },{
        dataIndex: "Rate",
        title: "线损率(%)",
        align:'center'
      },
  ]
export const onDesc = {
    expandedRowRender: (record) => {
       const desc = record.data.map(r => <span key={nanoid()}>{r.description}{r.display}</span>)
       return (<div key={nanoid()}>{desc}</div>)
      },
    rowExpandable: (record) => Array.isArray(record.data) && record.data?.length > 0
  }