import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  useMemo 
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
  PlainColumns,
} from "./data.js";
import UseModal from "@com/useModal";
import tip from "@imgs/tips.png";
import { AirModal, BasicInfo, TbEchartDiv, CellDiv } from "./style.js";
import IChart from "@com/useEcharts/Ichart";
import * as echarts from "echarts";

export const AirTable = forwardRef(
  (
    {
      tabId,
      openEnergyModal,
      openFrModal,
      euList,
      esList,
      pageInfo,
      onPageChange,
      loading = false,
    },
    ref
  ) => {
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState();
    const tablechartRef = useRef([]);

    const HandleCol = (index, event) => {
      return (TbCol[index]["render"] = (text, record, index) => {
        return (
          <span
            onClick={() => {
              event(record);
            }}
            style={{ cursor: "pointer", color: "#237ae4" }}
          >
            {text}
          </span>
        );
      });
    };

    useEffect(() => {
      if (tabId == 1) {
        HandleCol(3, openEnergyModal);
        HandleCol(5, openFrModal);
        HandleCol(6, openFrModal);
        console.log("euList", euList);
        TbCol[4]["render"] = (text, record, index) => {
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
              <TbEcharts
                tablechartRef={tablechartRef}
                columns={columns}
                record={record}
                index={index}
              />
            </CellDiv>
          );
        };
        setColumns(TbCol);
        setDataSource([...euList]);
      }
      if (tabId == 2) {
        setColumns(TbColAir);
        setDataSource([...esList]);
      }
    }, [tabId, euList, esList]); // 添加数据作为依赖项，确保数据更新时组件重新渲染
    useImperativeHandle(
      ref,
      () => {
        return { tablechartRef: tablechartRef.current, columns };
      },
      [columns, tablechartRef.current.length]
    );
    return (
      <UseTable
        style={{ overflow: "hidden" }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: tabId == 1 ? "1565px" : "100%" }}
        pagination={{
          ...pageInfo,
          current: pageInfo.pageNum,
          onChange: (page, pageSize) => {
            if (onPageChange) {
              onPageChange(page, pageSize);
            }
          },
        }}
      ></UseTable>
    );
  }
);

export const AirChart = ({ tabId, proportion, useTrend, saveTrend }) => {
  const chartRef = useRef();
  const pirRef = useRef();
  const columnRef = useRef();
  let pieChart, columnChart, mainChart;
  useEffect(() => {
    console.log(tabId);
    if (tabId == 1) {
      if (proportion.length > 0) {
        PieOption["series"][0]["data"] = proportion;
        pieChart = drawEcharts(pirRef.current, PieOption);
      }
      if (Object.keys(useTrend).length > 0) {
        Chart_Options["xAxis"]["data"] = useTrend["x"];
        Chart_Options["series"][0]["data"] = useTrend["y"];
        Chart_Options["series"][1]["data"] = useTrend["y1"];
        Chart_Options["series"][2]["data"] = useTrend["y2"].map((it) =>
          parseInt(it)
        );
        columnChart = drawEcharts(columnRef.current, Chart_Options);
      }
    }
    if (tabId == 2) {
      if (Object.keys(saveTrend).length > 0) {
        Column_Options["xAxis"]["data"] = saveTrend["x"];
        Column_Options["series"][0]["data"] = saveTrend["y"];
        mainChart = drawEcharts(chartRef.current, Column_Options);
      }
    }
    return () => {
      pieChart?.dispose();
      columnChart?.dispose();
      mainChart?.dispose();
    };
  }, [tabId, proportion, useTrend, saveTrend]); // 添加数据作为依赖项
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

const TbEcharts = ({ tablechartRef, columns, record, index }) => {
  // 从record中获取时间段数据，如果没有则使用默认数据
  const timeData = record?.euh || [];
  const hours = Array.from({ length: 24 }, (_, i) => i);
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
        data: timeData,
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
    if (chartRef.current) {
      const chartIns = echarts.init(chartRef.current);

      // 避免重复添加相同的图表实例
      if (!tablechartRef.current.some((chart) => chart === chartIns)) {
        tablechartRef.current.push(chartIns); //保存echarts实例到父组件变量
      }

      chartIns.setOption(option);

      return () => {
        // 在组件卸载时从tablechartRef中移除实例
        const chartIndex = tablechartRef.current.indexOf(chartIns);
        if (chartIndex > -1) {
          tablechartRef.current.splice(chartIndex, 1);
        }
        chartIns.dispose();
      };
    }
  }, [columns, record, timeData]); // 添加record和timeData作为依赖项

  return <TbEchartDiv ref={chartRef}></TbEchartDiv>;
};

export const AirEnergyDetail = ({ energyRef, airDetail }) => {
  // 使用useState来管理表格数据，确保数据变化时组件重新渲染
  const [tableData, setTableData] = useState([
    {
      value4: "",
      value1: "设备名称",
      value2: "",
      value3: "通信地址",
    },
    {
      value4: "",
      value1: "所属区域",
      value2: "",
      value3: "安装地址",
    },
  ]);

  useEffect(() => {
    if (airDetail && typeof airDetail === "object") {
      // 创建新的数组来触发重新渲染
      setTableData((prevData) => [
        {
          ...prevData[0],
          value2: airDetail["name"] || "",
          value4: airDetail["cSn"] || "",
        },
        {
          ...prevData[1],
          value2: airDetail["areaName"] || "",
          value4: airDetail["address"] || "",
        },
      ]);
      MdOptions["xAxis"]["data"] = airDetail["useTrend"]["x"] || [];
      MdOptions["series"][0]["data"] = airDetail["useTrend"]["y"] || [];
    }
  }, [airDetail]); // 使用具体属性作为依赖项
  return (
    <UseModal
      title="空调电量明细"
      ref={energyRef}
      width={861}
      mold="cust"
      closable={true}
      footer={<div style={{ height: 6 }}></div>}
    >
      <div className="modalContent">
        <AirModal>
          <UseTable
            showHeader={false}
            dataSource={tableData}
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

        {/* <BlueColumn
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
        <UseTable columns={MdTbCol}></UseTable> */}
      </div>
    </UseModal>
  );
};

//开启关闭频次 纯组件（展示组件）
export const Frequency = ({
  domRef,
  time = "",
  value = 0,
  onChange = () => {},
  modalData,
  modalPageInfo ,
  onPageChange = () => {},
  onClose = () => {},
  loading = false,

}) => {
  const initdata = [
    {
      title: "设备名称",
      key: "name",
    },
    {
      title: "通信地址",
      key: "cSn",
    },
    {
      title: "所属区域",
      key: "areaName",
    },
    {
      title: "安装地址",
      key: "address",
    },
  ];
  
  // 根据ioName字段统计设备状态数量
  const generateRadioOptions = () => {
    const tbdata = modalData?.tbdata || [];
    const totalCount = modalData.totalCount;

    // 统计各状态数量（基于ioName字段）
    const statusCounts = tbdata.reduce((acc, item) => {
      const status = item.ioName;
      if (status === "开") {
        acc.open = (acc.open || 0) + 1;
      } else if (status === "关") {
        acc.close = (acc.close || 0) + 1;
      }
      return acc;
    }, {});
    return [
      { label: `全部（${totalCount}）`, value: 0 },
      { label: `开启（${statusCounts.open ?? 0}）`, value: 1 },
      { label: `关闭（${statusCounts.close ?? 0}）`, value: 2 },
    ];
  };

  const dynamicOptions = useMemo(()=>{
    const open=<span style={{color:"#3d94ff"}}>{modalData?.deivemes?.open}</span>
    const close=<span style={{color:"#f40808"}}>{modalData?.deivemes?.close}</span>
    return [
      { label: `全部（${modalData?.deivemes?.total}）`, value: 0 },
      { label: <>开启(<span style={{margin:"0 2px"}}>{open}</span>)</>, value: 1 },
      { label: <>关闭(<span style={{margin:"0 2px"}}>{close}</span>)</>, value: 2 },
    ] 
  },[modalData?.deivemes]);

    

  return (
    <UseModal
      ref={domRef}
      title={"开关频次-" + time}
      mold="cust"
      closable={true}
      width={883}
      footer={<div style={{ height: 16 }}></div>}
      onCancel={onClose}
    >
      <>
        <Divider
          style={{ marginTop: 0, marginBottom: 16, borderColor: "#dddddd" }}
        ></Divider>
        <BlueColumn
          name="基本信息"
          bg={{ width: 3, height: 16 }}
          fontSize={16}
        ></BlueColumn>
        <BasicInfo>
          {initdata.map(({ title, key }, index) => (
            <div className="flexbox">
              <div>{title}：</div>
              {modalData?.deivemes.hasOwnProperty(key) ? (
                <div>{modalData.deivemes[key]}</div>
              ) : (
                ""
              )}
            </div>
          ))}
        </BasicInfo>
        <BlueColumn
          name="空调控制历史记录"
          bg={{ width: 3, height: 16 }}
          fontSize={16}
          styled={{ marginBottom: 16 }}
        >
          <Radio.Group
            options={dynamicOptions}
            onChange={onChange}
            value={value}
            style={{ marginLeft: "auto" }}
          />
        </BlueColumn>

       
        <UseTable
          columns={PlainColumns}
          dataSource={modalData?.tbdata || []}
          loading={loading}
          pagination={{
            ...modalPageInfo,
            current: modalPageInfo.pageNum,
            onChange: (page, pageSize) => {
              if (onPageChange) {
                onPageChange(page, pageSize);
              }
            },
          }}
        ></UseTable>
      </>
    </UseModal>
  );
};
