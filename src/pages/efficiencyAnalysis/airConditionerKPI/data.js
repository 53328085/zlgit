 

import {useMemo} from 'react'
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
export const chartdata={ 
  "x": [
      "0:00",
      "1:00",
      "2:00",
      "3:00",
      "4:00",
      "5:00",
      "6:00",
      "7:00",
      "8:00",
      "9:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00"
  ],
  "y": Array.from({ length: 24 }, (_, i) => Math.random() * 1000)
       
}
