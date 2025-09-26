export const bindcol = [
  {
    title: "逆变器名称",
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
export const rules = [
  {
    required: true,
  },
];
export const w255 = { width: "255px" };

export const GridConnectedTypeData = [
  { label: "自发自用", value: 0 },
  { label: "余量上网", value: 1 },
  { label: "全量上网", value: 2 },]