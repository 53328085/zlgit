 
 
 
export  const totalcolumns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (_, row,index)=> index+1,
      width: 60,
      fixed: "left",
      ellipsis:true,
      align:'center'
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
        width:140,
      },
      {
        title: "同比用电量（kWh）",
        dataIndex: 'lastperiodValue',
        key: 'lastperiodValue',
        width:140,
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
        title: "能耗类型",
        dataIndex: 'energyCategory',
        key: 'energyCategory',
        width: 140,
         fixed: "left",
         ellipsis:true,
      },
      {
        title: "能耗分项",
        dataIndex: 'energyCategorySub',
        key: 'energyCategorySub',
        width: 140,
         fixed: "left",
         ellipsis:true,
      },
    {
        title: "设备名称",
        dataIndex: 'name',
        key: 'name',
        width: 140,
         fixed: "left",
         ellipsis:true,
      },
      {
        title: "设备编号",
        dataIndex: 'sn',
        key: 'sn',
        width: 140,
        fixed: "left",
        ellipsis:true,
      },
      {
        title: "安装地址",
        dataIndex: 'address',
        key: 'address',
        width: 140,
        fixed: "left",
        ellipsis:true,
      },
     
  ]
