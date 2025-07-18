import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { drawEcharts } from "@com/useEcharts/index";
import Ichart from "@com/useEcharts/Ichart";
import { Radio, Button ,Table} from "antd";
import UseTable from "@com/useTable";
import { TbCol, TbColAir,PieOption,Chart_Options,Column_Options } from "./data.js";
import * as echarts from "echarts";

export const AirTable = ({ tabId }) => {
  const [columns, setColumns] = useState([]);
  const datasource=[{
    name:'123',
    address:"ceshi",
    time:"2020-12-13",
    elec:"200",
    timecol:"2020-12-13",
    enable:"200",
    close:"200",
    type:"200",
    address2:"200"
  }]
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
      dataSource={datasource}
      scroll={{ x: tabId == 1 ? "110%" : "100%"}}
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
    return ()=>{
      pieChart?.dispose()
      columnChart?.dispose()
      mainChart?.dispose()
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
