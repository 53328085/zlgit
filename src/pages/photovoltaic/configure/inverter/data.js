
export const bindcol = [
  {
    title: "设备名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "设备编号",
    dataIndex: "sn",
    key: "sn",
  },

  {
    title: "所属区域",
    dataIndex: "areaName",
    key: "areaName",
  },
  /*  {
     title: "安装地址",
     dataIndex: "address",
     key: "address",
   }, */
];
export const GridConnectedTypeData = [
  { label: "自发自用", value: 1 },
  { label: "余量上网", value: 2 },
  { label: "全量上网", value: 3 },]
export const rules = [
  {
    required: true,
  },
];
export const cabinetColumns =
  [
    {
      align: "center",
      title: "光伏并网柜名称",
      dataIndex: "name",
      key: "name",
    },
    {
      align: "center",
      title: "光伏并网柜编号",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "总表名称",
      dataIndex: "meterName",
      key: "meterName",
      align: "center",
    },
    {
      align: "center",
      title: "总表编号",
      dataIndex: "meterSn",
      key: "meterSn",
    },
    {
      title: "光伏逆变器数",
      dataIndex: "capacity",
      key: "capacity",
      align: "center",
    },
    {
      title: "所属站点",
      dataIndex: "stationName",
      key: "stationName",
      align: "center",
    },
    {
      title: "安装地址",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
  ]