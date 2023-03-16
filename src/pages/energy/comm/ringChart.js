import React, { useState, useEffect, Fragment } from "react";
import style from "./style.module.less";
import { Pie } from "@ant-design/plots";
import { cloneDeep } from "lodash";

export default function Index(props) {
  // console.log(props,"环状图");
  const ringData = cloneDeep(props.proportionGive);
  ringData.map(item => {
    item.value = parseFloat(item.value)
  })
  console.log(ringData);

  const config = {
    appendPadding: 10,
    data: ringData,
    angleField: "value",
    colorField: "name",
    radius: 0.8,
    innerRadius: 0.8,
    legend: {
      layout: "horizontal",
      position: "bottom",
    },
    label: {
      type: "outer",
      offset: "-50%",
      // content: '{value}',
      content: function content(_ref) {
        return "".concat(_ref.value, "%");
      },
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "总\n100",
      },
    },
  };

  return <Pie style={{ width: 368, height: 321, margin: 12 }} {...config} />;
}
