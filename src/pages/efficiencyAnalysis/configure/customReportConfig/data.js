const lightType = ["","道路灯", "高杆路灯", "太阳能路灯", "景观灯","其他"];
export const cols = [
  {
    title: "设备名称",
    dataIndex: "lightName",
    key: "lightName",
    fixed: "left"
  },
  {
    title: "设备编号",
    dataIndex: "model",
    key: "model",
    fixed: "left"
  },
  {
    title: "是否作为虚拟设备",
    dataIndex: "cSn",
    key: "cSn",
    fixed: "left"
  },
  {
    title: "所属园区",
    dataIndex: "areaName",
    key: "areaName",
    fixed: "left"
  },
  
];
export const mockopt=[
  "空压机报表",
  "制冷机报表",
  "空调报表"
]
export const plainOptions=[
    {
      label: '照明',
      value: '1',
    },
    {
      label: '插座',
      value: '2',
    },
    {
      label: '公共区域照明（含应急）',
      value: '3',
    },
]
export const bindcol =[
  {
    title: "设备名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "设备编号",
    dataIndex: "cSn",
    key: "cSn",
  },
  {
    title: "所属区域",
    dataIndex: "areaName",
    key: "areaName",
  }, 
]
export const rules = [
  {
    required: true,
  },
];
export const w255 = { width: "255px" };
export const ckoptions =[
  {
    label: "KPI（m³/kWh）",
    value: "1",
  },
  {
    label: "用电量（kWh）",
    value: "2",
  },
  {
    label: "低温端-出水温度（℃）",
    value: "3",
  },
  {
    label: "kpi2（-）",
    value: "4",
  },
  {
    label: "低温端-出水温度（℃",
    value: "5",
  },
 
]