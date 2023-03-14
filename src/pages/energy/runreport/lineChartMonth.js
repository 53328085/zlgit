import React from "react";
import { Line } from "@ant-design/plots";
export default function Index() {
  const dataInfo = [
    {
      name: "日用电量(kWh)",
      day: "1",
      value: 13,
    },
    {
      name: "日用电量(kWh)",
      day: "2",
      value: 334,
    },
    {
      name: "日用电量(kWh)",
      day: "3",
      value: 635,
    },
    {
      name: "日用电量(kWh)",
      day: "4",
      value: 45,
    },
    {
      name: "日用电量(kWh)",
      day: "5",
      value: 140.9,
    },
    {
      name: "日用电量(kWh)",
      day: "6",
      value: 62,
    },
    {
      name: "日用电量(kWh)",
      day: "7",
      value: 7,
    },
    {
      name: "日用电量(kWh)",
      day: "8",
      value: 19,
    },
    {
      name: "日用电量(kWh)",
      day: "9",
      value: 183,
    },
  ];
  const config = {
    data: dataInfo,
    xField: "day",
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
