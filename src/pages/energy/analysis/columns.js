import {nanoid} from '@reduxjs/toolkit'
export default [
    {
      dataIndex: "name",
      title: "名称",
      align:'center',
       
    },
    {
     
      title: "本级用电量 (kWh)",
      dataIndex: "currentTotalValue",
      align:'center',
      width: '158px'
    },
    {
        title: "次级损耗",
        children: [
          {
            title: "次级用电量 (kWh)",
            dataIndex:"secondTotalValue",
            align:'center',
             width: '168px'
          },
          {
            title: "次级线损电量(kWh)",
            dataIndex:"secondLossValue",
            align:'center',
             width: '168px'
          },
          {
            title: "次级线损率 (%)",
            dataIndex:"secondLossPercent",
            align:'center',
             width: '168px'
          }
        ]

      },
      {
        title: "末级损耗",
        children: [
          {
            title: "末级用电量 (kWh)",
            dataIndex:"finalTotalValue",
            align:'center',
             width: '168px'
          },
          {
            title: "末级线损电量 (kWh)",
            dataIndex:"finalLossValue",
            align:'center',
             width: '168px'
          },
          {
            title: "末级线损率 (%)",
            dataIndex:"finalLossPercent",
            align:'center',
             width: '168px'
          }
        ]

      },
      
  ]
export const onDesc = {
    expandedRowRender: (record) => {
       const desc = record.data.map(r => <span key={nanoid()}>{r.description}{r.display}</span>)
       return (<div key={nanoid()}>{desc}</div>)
      },
    rowExpandable: (record) => Array.isArray(record.data) && record.data?.length > 0
  }