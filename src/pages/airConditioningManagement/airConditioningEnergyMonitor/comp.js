import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
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
  PlainColumns,
} from "./data.js";
import UseModal from "@com/useModal";
import tip from "@imgs/tips.png";
import { AirModal, BasicInfo, TbEchartDiv, CellDiv } from "./style.js";
import IChart from "@com/useEcharts/Ichart";
import * as echarts from "echarts";

export const AirTable = forwardRef(
  ({ tabId, openEnergyModal, openFrModal, openFreModal }, ref) => {
    const [columns, setColumns] = useState([]);
    const datasource = [
      {
        name: "123",
        address: "ceshi",
        time: "2020-12-13",
        elec: "200",
        timecol: "",
        enable: "200",
        close: "200",
        type: "200",
        address2: "200",
      },
      {
        name: "123",
        address: "ceshi",
        time: "2020-12-13",
        elec: "200",
        timecol: "",
        enable: "200",
        close: "200",
        type: "200",
        address2: "200",
      },
      {
        name: "123",
        address: "ceshi",
        time: "2020-12-13",
        elec: "200",
        timecol: "",
        enable: "200",
        close: "200",
        type: "200",
        address2: "200",
      },
    ];
    const tablechartRef = useRef([]);

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
        TbCol[4]["render"] = () => {
          return (
            <CellDiv>
              <div
                className="bg-segment"
                style={{
                  left: "0%",
                  width: "33.3%",
                  background: "RGB(227,239,255)",
                }}
              ></div>
              <div
                className="bg-segment"
                style={{
                  left: "33.3%",
                  width: "33.4%",
                  background: "RGB(227,250,231)",
                }}
              ></div>
              <div
                className="bg-segment"
                style={{
                  left: "66.7%",
                  width: "33.3%",
                  background: "RGB(250,248,222)",
                }}
              ></div>
              <TbEcharts tablechartRef={tablechartRef} columns={columns} />
            </CellDiv>
          );
        };
        setColumns(TbCol);
      }
      if (tabId == 2) {
        setColumns(TbColAir);
      }
    }, [tabId]);
    useImperativeHandle(
      ref,
      () => {
        return { tablechartRef: tablechartRef.current, columns, datasource };
      },
      [columns, tablechartRef.current.length]
    );
    return (
      <UseTable
        style={{ overflow: "hidden" }}
        columns={columns}
        dataSource={datasource}
        scroll={{ x: tabId == 1 ? "1565px" : "100%" }}
      ></UseTable>
    );
  }
);

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

const TbEcharts = ({ tablechartRef, columns }) => {
  // 模拟数据（随机值示例）
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const values = hours.map(() => Math.floor(Math.random() * 100));
  // 分段颜色配置
  const segments = [
    { bgColor: "RGB(227,239,255)", barColor: "#4c92fb", name: "00：00" },
    { bgColor: "RGB(227,250,231)", barColor: "#05bf23", name: "08：00" },
    { bgColor: "RGB(250,248,222)", barColor: "#f98425", name: "16：00" },
  ];

  const option = {
    tooltip: {
      trigger: "item",
     
    },
    title: [
      {
        text: segments[0].name,
        left: "0%", // 第一个标题位置
        top: -3,
        textStyle: { color: segments[0].barColor, fontSize: 10 },
      },
      {
        text: segments[1].name,
        left: "33%", // 第二个标题位置
        top: -3,
        textStyle: { color: segments[1].barColor, fontSize: 10 },
      },
      {
        text: segments[2].name,
        left: "66%", // 第三个标题位置
        top: -3,
        textStyle: { color: segments[2].barColor, fontSize: 10 },
      },
    ],
    grid: {
      top: 10, // 为顶部标题留出空间
      right: 0,
      bottom: 0,
      left: 0,
      containLabel: false,
    },
    xAxis: {
      type: "category",
      data: hours.map((h) => `${h}:00`),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    series: [
      {
        type: "bar",
        data: values,
        barWidth: "90%",
        barGap: 2,
        itemStyle: {
          color: (params) => {
            const hour = params.dataIndex;
            if (hour < 8) return "#4c92fb";
            else if (hour < 16) return "#05bf23";
            else return "#f98425";
          },
        },
      },
    ],
  };

  const chartRef = useRef();

  useEffect(() => {
    const chartIns = echarts.init(chartRef.current);
    tablechartRef.current.push(chartIns); //保存echarts实例到父组件变量
    chartIns.setOption(option);
    return () => {
      chartIns.dispose();
    };
  }, [columns]);

  return <TbEchartDiv ref={chartRef}></TbEchartDiv>;
};

export const AirEnergyDetail = ({ energyRef }) => {
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
          style={{ width: 814, height: 274, display: "flex" }}
        >
          {" "}
          <IChart {...MdOptions} type={2}></IChart>
        </div>

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
export const Frequency = ({
  domRef,
  time = "2024-08-01",
  value = 0,
  onChange = () => {},
}) => {
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
      footer={<div style={{ height: 16 }}></div>}
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
        {initdata.map(({ title, value }, index) => (
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
        styled={{ color: "#1e50e6", marginBottom: 16 }}
      >
        <Radio.Group
          options={PlainOptions}
          onChange={onChange}
          value={value}
          style={{ marginLeft: "auto" }}
        />
      </BlueColumn>
      <UseTable columns={PlainColumns}></UseTable>
    </UseModal>
  );
};
