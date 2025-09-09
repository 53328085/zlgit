 

 
export  const totalcolumns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (_, row,index)=> index+1
    },
    {
      title: "公共能耗名称",
      dataIndex: 'name',
      key: 'name',
      width: 140,
    },
    {
        title: "用电量（kWh）",
        dataIndex: 'periodValue',
        key: 'periodValue',
      },
      {
        title: "同比用电量（kWh）",
        dataIndex: 'lastperiodValue',
        key: 'lastperiodValue',
      },
      {
        title: "同比",
        dataIndex: 'yoy',
        key: 'yoy',
        width:100
      },
  ];
  export const dtlcolumns = [
    {
        title: "设备名称",
        dataIndex: 'name',
        key: 'name',
        width: 140,
         fixed: "left"
      },
      {
        title: "设备编号",
        dataIndex: 'sn',
        key: 'sn',
        width: 140,
        fixed: "left"
      },
      {
        title: "安装地址",
        dataIndex: 'address',
        key: 'address',
        width: 140,
        fixed: "left"
      },
      {
        title: "总能耗(kWh)",
        dataIndex: 'total',
        key: 'total',
        width: 100,
        fixed: "left"
      },
  ]