export default [
    {
      dataIndex: "sn",
      title: "最新告警时间",
    },
    {
      dataIndex: "categoryName",
      title: "设备编号",
    },
    {
      dataIndex: "status", // status 1: 离线 2：在线
      title: "告警等级",
      render: (text) => <span>{text===1 ? '离线' : text ===2 ? '在线' : ''}</span>
    },
    {
      dataIndex: "address",
      title: "最新告警事件",
    },
    {
      dataIndex: "customer",
      title: "设备类型",
    },
    {
      dataIndex: "lastSampleTime",
      title: "设备型号",
    },
    {
        dataIndex: "lastSampleTime",
        title: "所属应用",
    },
    {
        dataIndex: "lastSampleTime",
        title: "安装地址",
    },
    {
        dataIndex: "lastSampleTime",
        title: "操作",
        render:<a>设备信息</a>
    },
  ]