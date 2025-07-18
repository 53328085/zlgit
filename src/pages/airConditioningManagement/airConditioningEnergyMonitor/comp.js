import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { drawEcharts } from "@com/useEcharts/index";
import Ichart from "@com/useEcharts/Ichart";
import { Radio, Button } from "antd";
import UseTable from "@com/useTable";
import { TbCol, TbColAir,PieOption,Chart_Options,Column_Options } from "./data.js";
import * as echarts from "echarts";

export const AirTable = ({ tabId }) => {
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    if (tabId == 1) {
      setColumns(TbCol);
    }
    if (tabId == 2) {
      setColumns(TbColAir);
    }
  }, [tabId]);

  return (
    <UseTable
      columns={columns}
      scroll={{ x: tabId == 1 ? "max-content" : false }}
    ></UseTable>
  );
};

export const AirChart = ({tabId}) => {

  const chartRef = useRef();
  const pirRef=useRef()
  const columnRef = useRef()
  let pieChart, columnChart, mainChart;
  useEffect(() => {
    console.log(tabId)
    if(tabId==1){
      pieChart=drawEcharts(pirRef.current,PieOption)
      columnChart = drawEcharts(columnRef.current,Chart_Options)
    }
    if(tabId==2){
      mainChart = drawEcharts(chartRef.current,Column_Options)
    }
  }, [tabId]);
  return <div className="chart">
    {
        tabId==1?(
            <div className="airChart" key="tab1">
                <div className="airPie" ref={pirRef}></div>
                <div className="airColumn" ref={columnRef}></div>
            </div>
        ):<div className="chartCol" ref={chartRef} key="tab2"></div>
    }
  </div>;
};
