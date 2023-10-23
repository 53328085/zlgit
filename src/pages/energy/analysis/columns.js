import {nanoid} from '@reduxjs/toolkit'
export default [
    {
      dataIndex: "name",
      title: "名称",
      align:'center',
      width: '278px'
    },
    {
      dataIndex: "startDate",
      title: "开始日期",
      align:'center',
      width: '178px'
    },{
        dataIndex: "endDate",
        title: "结束日期",
        align:'center',
        width: '178px'
      },{
        dataIndex: "meterTotalValue",
        title: "用电量-总表(kWh)",
        align:'center',
        width: '174px'
      },{
        dataIndex: "meterSubValue",
        title: "用电量-分表(kWh)",
        align:'center',
        width: '174px'
      },{
        dataIndex: "lossValue",
        title: "总-分差额(kWh)",
        align:'center',
        width: '174px'
      },{
        dataIndex: "lossPercent",
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