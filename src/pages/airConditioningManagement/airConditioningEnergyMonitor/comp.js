import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { drawEcharts } from "@com/useEcharts/index";
import { Radio, Button, Tooltip, ConfigProvider, Divider } from "antd";
import UseTable from "@com/useTable";
import BlueColumn from "@com/bluecolumn";
import {
  TbCol,
  TbColAir,
  PieOption,
  Chart_Options,
  Column_Options,
  MdTbCol,
  MdOptions,
  MdTbData,
  MdColHidden,
  PlainOptions,
  PlainColumns
} from "./data.js";
import UseModal from "@com/useModal";
import tip from "@imgs/tips.png";
import { AirModal, BasicInfo } from "./style.js";
import IChart from "@com/useEcharts/Ichart"


export const AirTable = ({
  tabId,
  openEnergyModal,
  openFrModal,
  openFreModal,
}) => {
  const [columns, setColumns] = useState([]);
  const datasource = [
    {
      name: "123",
      address: "ceshi",
      time: "2020-12-13",
      elec: "200",
      timecol: "2020-12-13",
      enable: "200",
      close: "200",
      type: "200",
      address2: "200",
    },
  ];
  const HandleCol = (index, event) => {
    return (TbCol[index]["render"] = (text, record, index) => {
      return (
        <span onClick={event} style={{ cursor: "pointer", color: "#237ae4" }}>
          {text}
        </span>
      );
    });
  };
  useEffect(() => {
    if (tabId == 1) {
      HandleCol(3, openEnergyModal);
      HandleCol(5, openFrModal);
      HandleCol(6, openFreModal);
      setColumns(TbCol);
    }
    if (tabId == 2) {
      setColumns(TbColAir);
    }
  }, [tabId]);

  return (
    <UseTable
      style={{ overflow: "hidden" }}
      columns={columns}
      dataSource={datasource}
      scroll={{ x: tabId == 1 ? "1565px" : "100%" }}
    ></UseTable>
  );
};

export const AirChart = ({ tabId }) => {
  const chartRef = useRef();
  const pirRef = useRef();
  const columnRef = useRef();
  let pieChart, columnChart, mainChart;
  useEffect(() => {
    console.log(tabId);
    if (tabId == 1) {
      pieChart = drawEcharts(pirRef.current, PieOption);
      columnChart = drawEcharts(columnRef.current, Chart_Options);
    }
    if (tabId == 2) {
      mainChart = drawEcharts(chartRef.current, Column_Options);
    }
    return () => {
      pieChart?.dispose();
      columnChart?.dispose();
      mainChart?.dispose();
    };
  }, [tabId]);
  return (
    <div className="chart">
      {tabId == 1 ? (
        <div className="airChart" key="tab1">
          <div className="airPie" ref={pirRef}></div>
          <div className="airColumn" ref={columnRef}></div>
        </div>
      ) : (
        <div className="chartCol" ref={chartRef} key="tab2"></div>
      )}
    </div>
  );
};

export const AirEnergyDetail = ({ energyRef }) => {
  // const chartRef = useRef();
  // let chart = useRef();
  // useEffect(() => {
  //   if (chartRef.current) {
  //     chart.current = drawEcharts(chartRef.current, MdOptions);
  //   }
  //   return () => {
  //     chart.current?.dispose();
  //   };
  // }, []);
  return (
    <UseModal
      title="空调电量明细"
      ref={energyRef}
      width={861}
      mold="cust"
      closable={true}
    >
      <div className="modalContent">
        <AirModal>
          <UseTable
            showHeader={false}
            dataSource={MdTbData}
            columns={MdColHidden}
          ></UseTable>
        </AirModal>
        <div
          className="chart"
          style={{ width: 814, height: 274,display:"flex" }}
         
        > <IChart {...MdOptions} type={2} ></IChart></div>
       
        <BlueColumn
          name="电量明细表-2024-01-01"
          bg={{ width: 3, height: 16 }}
          fontSize={16}
          styled={{ color: "#1e50e6" }}
        >
          <Tooltip
            placement="right"
            title="多联机空调仅展示用电量，无起始/结束示值及倍率信息"
          >
            <img src={tip} alt="" style={{ width: 17, height: 17 }} />
          </Tooltip>
        </BlueColumn>
        <UseTable columns={MdTbCol}></UseTable>
      </div>
    </UseModal>
  );
};

//开启关闭频次 纯组件（展示组件）
export const Frequency = ({ domRef, time = "2024-08-01",value=0,onChange=()=>{} }) => {
  const initdata = [
    {
      title: "设备名称",
      value: "",
    },
    {
      title: "通信地址",
      value: "",
    },
    {
      title: "所属区域",
      value: "",
    },
    {
      title: "安装地址",
      value: "",
    },
    {
      title: "安装状态",
      value: "",
    },
  ];
  return (
    <UseModal
      ref={domRef}
      title={"开关频次-" + time}
      mold="cust"
      closable={true}
      width={883}
      footer={<div style={{height:16}}></div>}
    >
      <Divider
        style={{ marginTop: 0, marginBottom: 16, borderColor: "#dddddd" }}
      ></Divider>
      <BlueColumn
        name="基本信息"
        bg={{ width: 3, height: 16 }}
        fontSize={16}
        styled={{ color: "#1e50e6" }}
      ></BlueColumn>
      <BasicInfo>
        {initdata.map(({title,value}, index) => (
          <div className="flexbox">
            <div>{title}</div>
            <div>{value}</div>
          </div>
        ))}
      </BasicInfo>
      <BlueColumn
        name="空调控制历史记录"
        bg={{ width: 3, height: 16 }}
        fontSize={16}
        styled={{ color: "#1e50e6",marginBottom:16 }}
      ><Radio.Group options={PlainOptions} onChange={onChange} value={value} style={{marginLeft:'auto'}} /></BlueColumn>
      <UseTable columns={PlainColumns}></UseTable>
    </UseModal>
  );
};
