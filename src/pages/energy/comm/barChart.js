import React, { useState, useEffect, Fragment } from "react";
import style from "./style.module.less";
// import { Column } from "@ant-design/plots";
import { cloneDeep } from "lodash";
import * as echarts from "echarts";

export default function Index(props) {
  console.log(props, "柱状图");
  const { detailGive, energyType } = props;
  const barData = cloneDeep(detailGive);
  useEffect(() => {
    let barChart = echarts.init(document.getElementById("barChartInfo"));
    // return;
    barChart.setOption({
      color: ["#237ae4"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        top: "0",
        left: "center",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: barData.x,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "用电量 (kWh)",
          data: barData.y,
          type: "bar",
        },
      ],
      // dataZoom: [
      //   {
      //     // 滚动条以及缩放
      //     type: "inside",
      //     start: 0,
      //     end: 20,
      //     show: true,
      //     showDetail: true,   
      //   },
      //   {
      //     start: 0,
      //     end: 20,
      //   },
      // ],
    });
  }, [barData]);
  return <div style={{ height: 700, margin: 12 }} id="barChartInfo"></div>;
}
