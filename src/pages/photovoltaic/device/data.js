export   const DCColumns = [
    {
      title: "输入回路",
      dataIndex: `name`,
      align: 'center',
    }, {
      title: "电压（V）",
      dataIndex: `voltage`,
      align: 'center',
    }, {
      title: "电流（A）",
      dataIndex: `current`,
      align: 'center',
    }
  ]
  export   const options = [
    {
      label: '图表模式',
      value: "1",
    },
    {
      label: '列表模式',
      value: "2",
    },
  ];
 
  export   const communicationColumns = [
    {
      title: "参数",
      dataIndex: `name`,
      align: 'center', 
    }, {
      title: "A相",
      dataIndex: `a`,
      align: 'center', 
    }, {
      title: "B相",
      dataIndex: `b`,
      align: 'center',
      
    }, {
      title: "C相",
      dataIndex: `c`,
    }
  ]