 

export   const cols =[ // 能耗监测     
    {
      title: '用电量(kWh)',
      dataIndex: 'e', 
      key:'e',
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