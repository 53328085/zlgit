  

export const baseColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 160,
      key: 'name',
      fixed: "left"
    },
    {
      title: "编号",
      dataIndex: 'sn',
      width: 100,
      key: 'sn',
       fixed: "left"
    },
    {
      title: "类型",
      dataIndex: 'type',
      width: 100,
      key: 'type',
    //   fixed: "left",
      render: (text) => {
        const type= {
            1: "站点",
            2: "并网柜",
            3: "逆变器"
        }[text] || "未知";
        return <span  >{type}</span>;
      },
    },
    {
      title: "安装地址",
      dataIndex: 'address',
      width: 100,
      key: 'address',
   //    fixed: "left",
    },
    {
      title: "总发电量 (kWh)",
      dataIndex: 'totalGeneration',
      width: 100,
      key: 'totalGeneration',
    //  fixed: "left",
    },
    {
      title: "总用电量 (kWh)",
      dataIndex: 'totalUseEnergy',
      width: 100,
      key: 'totalUseEnergy',
    //  fixed: "left", 
    },
  ]