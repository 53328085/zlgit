export default [
    {
      dataIndex: "alarmTime",
      title: "最新告警时间",
      key:'1'
    },
    {
      dataIndex: "sn",
      title: "设备编号",
      key:'2'
    },
    // {
    //   dataIndex: "event", // status 1: 离线 2：在线
    //   title: "告警等级",
    //   render: (text) => <span>{text===1 ? '离线' : text ===2 ? '在线' : ''}</span>,
    //   key:'3'
    // },
    {
      dataIndex: "address",
      title: "最新告警事件",
      key:'4'
    },
    {
      dataIndex: "category",
      title: "设备类型",
      key:'5',
    },
    {
      dataIndex: "name",
      title: "设备型号",
      key:'6'
    },
    {
        dataIndex: "lastSampleTime",
        title: "所属应用",
        key:'7'
    },
    {
        dataIndex: "address",
        title: "安装地址",
        key:'8'
    },
    {
        dataIndex: "",
        title: "操作",
        render:()=><a>设备信息</a>,
        key:'9'
    },
  ]