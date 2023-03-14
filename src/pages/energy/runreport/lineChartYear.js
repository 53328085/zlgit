import React from "react";
import { Line } from "@ant-design/plots";
export default function Index() {
  
  const dataInfo = [
    {
      name: "月用电量(kWh)",
      month: "1月",
      value: 13,
    },
    {
      name: "月用电量(kWh)",
      month: "2月",
      value: 34,
    },
    {
      name: "月用电量(kWh)",
      month: "3月",
      value: 35,
    },
    {
      name: "月用电量(kWh)",
      month: "4月",
      value: 45,
    },
    {
      name: "月用电量(kWh)",
      month: "5月",
      value: 140.9,
    },
    {
      name: "月用电量(kWh)",
      month: "6月",
      value: 62,
    },
    {
      name: "月用电量(kWh)",
      month: "7月",
      value: 97,
    },
    {
      name: "月用电量(kWh)",
      month: "8月",
      value: 19,
    },
    {
      name: "月用电量(kWh)",
      month: "9月",
      value: 183,
    },
  ];
  const config = {
    data: dataInfo,
    xField: "month",
    yField: "value",
    seriesField: "name",
    label: {},
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#5B8FF9",
          fill: "#C8E0F0",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };
  return <Line style={{ width: 500, height: 321, margin: 12 }} {...config} />;
}
