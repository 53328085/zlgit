 

export   const cols =[ // 能耗监测     
    {
      title: '总用电量(kWh)',
      dataIndex: 'eu', 
      key:'eu',
      sorter: (a, b) => parseFloat(a.e) - parseFloat(b.e)
    },
    {
      title: '市电用量(kWh)',
      dataIndex: 'euc', 
      key:'euc',
      sorter: (a, b) => parseFloat(a.e) - parseFloat(b.e)
    },
    {
      title: '市电占比(%)',
      dataIndex: 'cp', 
      key:'cp',
      sorter: (a, b) => parseFloat(a.e) - parseFloat(b.e)
    },
    {
      title: '绿电用量(kWh)',
      dataIndex: 'eus', 
      key:'eus',
      sorter: (a, b) => parseFloat(a.e) - parseFloat(b.e)
    },
    {
      title: '绿电占比(%)',
      dataIndex: 'sp', 
      key:'sp',
      sorter: (a, b) => parseFloat(a.e) - parseFloat(b.e)
    },
    {
      title: '亮灯数/路灯总数',
      dataIndex: 'numberDesc', 
      key:'numberDesc',
    },
    {
      title: '亮灯率',
      dataIndex: 'rate', 
      key:'rate',
      sorter: (a, b) => parseFloat(a.rate) - parseFloat(b.rate)
    },
  ]
  export const tabs =[
    {
    
  }]