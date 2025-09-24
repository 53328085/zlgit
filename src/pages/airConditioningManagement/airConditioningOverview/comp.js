import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { Detail, FooterChart } from "./style.js";
import {
  EnergyData,
  AirChartData,
  Radio_Options,
  Chart_Options,
  TbHeader,
} from "./data.js";
import { drawEcharts } from "@com/useEcharts/index";
import Icharts from "@com/useEcharts/Ichart.js";
import BlueColumn from "@com/bluecolumn/index.jsx";
import { Radio, Button, Table } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import UseTable from "@com/useTable";
import i18 from "../../../i18n";
import air from "./imgs/air.png";
import rise from "./imgs/rise.png";
import down from "./imgs/down.png";
const CusCard = ({
  title = "能耗情况(kWh)",
  secTitle = "当日累计用电量",
  thrTitle = "上一日累计用电量",
  value1 = "",
  value2 = "",
  value3 = "",
  imgurl = "",
}) => {
  return (
    <div className="card">
      <div className="head">
        <img
          src={imgurl}
          alt=""
          style={{ width: 23, height: 23, marginRight: 6 }}
        />
        <span>
          {title}
          <span style={{ color: "#999" }}> (kWh)</span>
        </span>
      </div>
      <div className="body">
        <div>{secTitle}</div>
        <div style={{ color: "#3d94ff" }}>{value1}</div>
        <div className={`small ${Number(value2) > 0 ? "rise" : "down"}`}>
          环比昨日：<span>{value2}</span>
        </div>
      </div>
      <div className="footer">
        <div>{thrTitle}</div>
        <div
          className={`small ${Number(value2) > 0 ? "rise" : "down"}`}
          style={{ color: "#3d94ff" }}
        >
          {value3}
        </div>
      </div>
    </div>
  );
};
export const DetailComp = React.memo(({ overData }) => {
  const [energyData, setEnergyData] = useState(EnergyData);
  useEffect(() => {
    if (overData && typeof overData === "object") {
      const {
        periodUseE = "",
        useMom = "",
        lastPeriodUseE = "",
        periodSaveE = "",
        saveMom = "",
        saveRate = "",
        periodCarbon = "",
        carbonMom = "",
        lastPeriodCarbon = "",
        ranking = [],
      } = overData;
      const arr = [
        {
          ...energyData[0],
          value1: periodUseE,
          value2: useMom,
          value3: lastPeriodUseE,
        },
        {
          ...energyData[1],
          value1: periodSaveE,
          value2: saveMom,
          value3: saveRate,
        },
        {
          ...energyData[2],
          value1: periodCarbon,
          value2: carbonMom,
          value3: lastPeriodCarbon,
        },
      ];
      setEnergyData(arr);
      const xAxis = ranking?.map((it) => it?.name);
      const sdata = ranking?.map((it) => it?.value);
      AirChartData["xAxis"][0]["data"] = xAxis;
      AirChartData["series"][0]["data"] = sdata;
    }
  }, [overData]);

  return (
    <Detail>
      {energyData.map((item, index) => (
        <CusCard {...item} key={index} />
      ))}

      <div className="chart">
        <div className="head">
          <img
            src={air}
            alt=""
            style={{ width: 23, height: 23, marginRight: 6 }}
          />
          <span>空调用能排名</span>
        </div>
        {/* <div className="chart-box"> */}
        <Icharts custoption={AirChartData} type={5}></Icharts>
        {/* </div> */}
      </div>
    </Detail>
  );
});

export const FooterChartComp = React.memo(({ tableData, chartData }) => {
  // const chartDomRef = useRef();
  const tableRef = useRef();
  const [tabId, setTabId] = useState("1");
  console.log(chartData);
  const chartOptions = useMemo(
    () => ({
      ...Chart_Options,
      xAxis: {
        type: "category",
        data: chartData?.x || [],
        axisPointer: {
          type: "shadow",
        },
      },
      series: [
        { ...Chart_Options.series[0], data: chartData?.y || [] },
        { ...Chart_Options.series[1], data: chartData?.y1 || [] },
        {
          ...Chart_Options.series[2],
          data: chartData?.y2.map((it) => parseFloat(it)) || [],
        },
      ],
    }),
    [chartData]
  );
  const MemoChart = useCallback(() => {
    return <Icharts custoption={chartOptions} type={5}></Icharts>;
  }, [chartOptions]);
  const ColMap = (arr = TbHeader, index = 0, key = "render") => {
    arr[index][key] = (value) => {
      return (
        <div>
          {value}
          <img
            src={parseFloat(value) > 0 ? rise : down}
            alt=""
            style={{ width: 16, height: 16, marginLeft: 4 }}
          ></img>
        </div>
      );
    };
  };
  useEffect(() => {
    // tabId == "1" && drawEcharts(chartDomRef.current, Chart_Options);
    if (tabId == "2") {
      ColMap(TbHeader, 3);
      ColMap(TbHeader, 5);
    }
  }, [tabId]);
  return (
    <FooterChart>
      <BlueColumn
        name="空调能耗趋势"
        bg={{ borderRadius: "4px" }}
        styled={{ marginBottom: 16 }}
      >
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <Button
            icon={<DownloadOutlined />}
            style={{
              borderRadius: "2px",
              width: "96px",
              display: tabId == "1" ? "none" : "block",
            }}
            onClick={() => {
              tableRef.current.downloadAll();
            }}
          >
            {i18.t("export", { ns: "button" })}
          </Button>
          <Radio.Group
            block
            options={Radio_Options}
            defaultValue="1"
            optionType="button"
            buttonStyle="solid"
            size="large"
            style={{ marginLeft: 16 }}
            onChange={(e) => {
              setTabId(e.target.value);
            }}
          />
        </div>
      </BlueColumn>
      {tabId == "1" ? (
        // <div ref={chartDomRef} className="chartdom">
        <MemoChart></MemoChart>
      ) : (
        <UseTable
          ref={tableRef}
          columns={TbHeader}
          dataSource={tableData}
          style={{ overflow: "auto" }}
          summary={(pageData) => {
            let summaryData = ["汇总", ...Array(5).fill(0)];
            pageData.forEach(
              ({ periodUseE, lastPeriodUseE, lastSamePeriodUseE }) => {
                summaryData[1] += parseFloat(periodUseE || 0);
                summaryData[2] += parseFloat(lastPeriodUseE || 0);

                summaryData[4] += parseFloat(lastSamePeriodUseE || 0);
              }
            );
            console.log("summaryData", summaryData[1], summaryData[2]);
            summaryData[3] =
              summaryData[2] == 0
                ? 0
                : (
                    ((summaryData[1] - summaryData[2]) / summaryData[2]) *
                    100
                  ).toFixed(2);
            summaryData[5] =
              summaryData[2] == 0
                ? 0
                : (
                    ((summaryData[1] - summaryData[4]) / summaryData[2]) *
                    100
                  ).toFixed(2);
            return (
              <Table.Summary.Row>
                {summaryData.map((item, index) => (
                  <Table.Summary.Cell align="center">
                    {[3, 5].includes(index) ? (
                      <>
                        {item}%
                        <img
                          src={parseFloat(item) > 0 ? rise : down}
                          alt=""
                          style={{ width: 16, height: 16, marginLeft: 4 }}
                        ></img>
                      </>
                    ) : (
                      item
                    )}
                  </Table.Summary.Cell>
                ))}
              </Table.Summary.Row>
            );
          }}
          onExport={() => {
            return {
              list: tableData,
              total: tableData.length,
            };
          }}
        ></UseTable>
      )}
    </FooterChart>
  );
});
