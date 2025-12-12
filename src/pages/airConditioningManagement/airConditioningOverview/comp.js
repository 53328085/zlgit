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
import exportImg from "./imgs/export.png";
const CusCard = ({
  title = "能耗情况(kWh)",
  secTitle = "当日累计用电量",
  thrTitle = "上一日累计用电量",
  value1 = "",
  value2 = "",
  value3 = "",
  value4="",
  imgurl = "",
  index,
  isextra=false,
  lastTitle=""
}) => {
  return (
    <div className="card">
      <div className="head">
        <img
          src={imgurl}
          alt=""
          style={{ width: 23, height: 23, marginRight: 6 }}
        />
        <span style={{ color: "#303133" }}>
          {title}
          <span style={{ color: "#999" }}> ({index == 2 ? "kg" : "kWh"})</span>
        </span>
      </div>
      <div className="body">
        <div style={{ color: "#909399" }}>{secTitle}</div>
        <div
          style={{
            color: "#1E50E6",
            fontSize: 28,
            lineHeight: 1,
            fontWeight: 500,
          }}
        >
          {(parseFloat(value1))?.toFixed(3)}
        </div>
        <div className={`small`}>
          环比昨日：
          <span>
            {parseFloat(value2) >= 0 ? "+" : "-"}
            {value2}
          </span>
          <img src={parseFloat(value2) > 0 ? rise : down} alt="" />
        </div>
      </div>
      <div className="footer">
        <div>
          <div style={{ color: "#606266" }}>{thrTitle}</div>
          <div
            className={`small`}
            style={{ color: "#303133", fontWeight: 500 }}
          >
            {value3}
          </div>
        </div>

   
          {isextra ? (
            <div>
              <div style={{ color: "#606266" }}>{lastTitle}</div>
              <div
                className={`small`}
                style={{ color: "#303133", fontWeight: 500 }}
              >
                {value4}
              </div>
            </div>
          ) : null}
 
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
        saveMoney="10.00"
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
          isextra:true,
          value4:saveMoney 
        },
        {
          ...energyData[2],
          value1: periodCarbon,
          value2: carbonMom,
          value3: lastPeriodCarbon,
        },
      ];
    //  console.log("ranking",ranking)
     setEnergyData(arr);
      const xAxis = ranking?.map((it) => it?.name);
      const sdata = ranking?.map((it) => it?.value);

    //  AirChartData["xAxis"]["data"] = xAxis;
    //  AirChartData["series"][0]["data"] = sdata;
    }
  }, [overData]);
  const baropt =useMemo(()=> {
    const {ranking=[]} = overData || {}
    console.log("ranking",ranking)
    return {
        
      series: [{ type: "bar"} ],
      grid: {
        left: "0px",
        right: "0",
        top: "0px",
        bottom: "0px",
        containLabel: true,
      },
      legend: {
        show:false
      },
      dataset: {
        dimensions: ["name", {name:"value", displayName:"用能量"}],
        source: ranking
      },
      xAxis: {
        axisLabel: {
          interval:0
        }
      }
     
   
}

  },   
  [overData])
  return (
    <Detail>
     {energyData.map((item, index) => (
        <CusCard {...item} key={index} index={index} />
      ))}  
      
      <div className="chart">
        <div className="head">
          <img
            src={air}
            alt=""
            style={{ width: 23, height: 23, marginRight: 6 }}
          />
          <span>
            空调用能排名<span style={{ color: "#999" }}>(kWh)</span>
          </span>
        </div>
        {/* <div className="chart-box"> */}
        <Icharts  {...baropt}></Icharts>
        {/* </div> */}
      </div>
    </Detail>
  );
});

export const FooterChartComp = React.memo(({ tableData, chartData }) => {
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
          data: chartData?.y3?.map?.((it) => parseFloat(it)) || [],
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
    if (tabId == "2") {
      ColMap(TbHeader, 3);
      ColMap(TbHeader, 5);
    }
  }, [tabId]);
  return (
    <FooterChart>
      <BlueColumn
        name="空调能耗趋势"
        bg={{  height: 13 ,marginRight:8}}
        styled={{ marginBottom: 16, padding: "0px 16px", height: 40 }}
        isbgShow={true}
      >
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <Radio.Group
            block
            options={Radio_Options}
            defaultValue="1"
            optionType="button"
            buttonStyle="solid"
            size="small"
            style={{ marginLeft: 16 }}
            onChange={(e) => {
              setTabId(e.target.value);
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 0px 0 24px",
              cursor: "pointer",
            }}
            onClick={() => {
              tableRef.current.downloadAll();
            }}
          >
            <img src={exportImg} alt="" style={{ marginRight: 4 }} />
            <span style={{ fontWeight: 14 }}>导出</span>
          </div>
        </div>
      </BlueColumn>
      {tabId == "1" ? (
        <div className="chartdom">
          <MemoChart></MemoChart>
        </div>
      ) : (
        <UseTable
          ref={tableRef}
          columns={TbHeader}
          dataSource={tableData}
          style={{ overflow: "auto", padding: "0 16px 16px" }}
          scroll={{ x: 'max-content', y: 15 * 31 }}
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
