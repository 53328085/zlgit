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
  export const watercol= [
    {
      dataIndex: "name",
      title: "名称",
      align:'center',
       
    },
    {
     
      title: "本级用水量 (m³)",
      dataIndex: "currentTotalValue",
      align:'center',
      width: '158px'
    },
    {
        title: "次级用水量",
        children: [
          {
            title: "次级损耗 (m³)",
            dataIndex:"secondTotalValue",
            align:'center',
             width: '168px'
          },
          {
            title: "次级漏损(m³)",
            dataIndex:"secondLossValue",
            align:'center',
             width: '168px'
          },
          {
            title: "次级漏损率 (%)",
            dataIndex:"secondLossPercent",
            align:'center',
             width: '168px'
          }
        ]

      },
      {
        title: "末级用水量",
        children: [
          {
            title: "末级损耗 (m³)",
            dataIndex:"finalTotalValue",
            align:'center',
             width: '168px'
          },
          {
            title: "末级漏损(m³)",
            dataIndex:"finalLossValue",
            align:'center',
             width: '168px'
          },
          {
            title: "末级漏损率 (%)",
            dataIndex:"finalLossPercent",
            align:'center',
             width: '168px'
          }
        ]

      },
      
  ]
  export const steamcol= [
    {
      dataIndex: "name",
      title: "名称",
      align:'center',
       
    },
    {
     
      title: "本级蒸汽量 (m³)",
      dataIndex: "currentTotalValue",
      align:'center',
      width: '158px'
    },
    {
        title: "次级蒸汽量",
        children: [
          {
            title: "次级漏损量 (m³)",
            dataIndex:"secondTotalValue",
            align:'center',
             width: '168px'
          },
          {
            title: "次级漏损(m³)",
            dataIndex:"secondLossValue",
            align:'center',
             width: '168px'
          },
          {
            title: "次级漏损率 (%)",
            dataIndex:"secondLossPercent",
            align:'center',
             width: '168px'
          }
        ]

      },
      {
        title: "末级用水量",
        children: [
          {
            title: "末级损耗 (m³)",
            dataIndex:"finalTotalValue",
            align:'center',
             width: '168px'
          },
          {
            title: "末级漏损(m³)",
            dataIndex:"finalLossValue",
            align:'center',
             width: '168px'
          },
          {
            title: "末级漏损率 (%)",
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