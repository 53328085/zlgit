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
 
  {
    title: "KPI（m³/kWh）",
    dataIndex: "no",
    key: "no",
  },
  {
    title: "用电量（kWh）",
    dataIndex: "mSn",
    key: "mSn",
  },

  {
    title: "低温端-出水温度（℃）",
    dataIndex: "address",
    key: "address",
  },
  
];
export const mock = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];