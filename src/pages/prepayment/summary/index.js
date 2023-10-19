import React, { useEffect, useState, useRef, useCallback } from "react";

import { useSelector } from "react-redux";
 
 
import styled from "styled-components";
import Pagecount from "@com/pagecontent";
import Itembox from "./Item";
import Cost from "./cost";
import { selectProjectId } from "@redux/systemconfig.js";
import {
  Radio,
  Timeline,
  Typography,
  Select,
  Button,
  message,
} from "antd";

import { drawEcharts } from "@com/useEcharts";
import { PrepayConfig, PrepayRun } from "@api/api";
let { QueryPrepayServerUrl } = PrepayConfig;
let {
  GetPrepayUserInfo,
  GetPrepayProjects,
  BaseInfoSummary,
  TransactionStatistics,
  EnergyRanking,
  EnergyTrends,
} = PrepayRun;

const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-rows: 48px 176px 304px 267px;
  row-gap: 16px;
  justify-content: flex-end;

  .header {
    width: 1680px;
    height: 48px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #d7d7d7;
    display: flex;
    align-items: center;
    padding: 0 16px;
  }
  .line {
    width: 0;
    height: 33px;
    margin: 0 24px;
    border-left: 1px dashed #d7d7d7;
  }
  .upper {
    display: grid;
    grid-template-columns: repeat(2, 360px) repeat(6, 140px);
    grid-template-rows: 176px;
    column-gap: 16px;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #d7d7d7;
      width: 100%;
      height: 100%;
      color: #333;
      background-color: #fff;
      box-shadow: 0px 1px 2px rgb(0 0 0 / 35%);
      .imgBox {
        width: 144px;
        height: 88px;
        background-color: #237ae4;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .descBox {
        display: flex;
        align-items: center;
        flex-direction: column;
        span {
          line-height: 44px;
        }
      }
      strong {
        font-size: 22px;
      }
    }
  }
  .middle {
    display: grid;
    grid-template-columns: 808px 375px 464px;
    column-gap: 16px;
  }
  .lower {
    display: grid;
    grid-template-columns: repeat(3, 550px);
    column-gap: 16px;
  }
`;

const Timelinebox = styled(Timeline)`
  max-height: 115px;
  overflow-y: scroll;
  padding-top: 16px;
  .ant-timeline-item {
    padding-bottom: 8px;
  }
  .title {
    color: #1e1e1e;
  }
  .content {
    font-size: 12px;
    color: #6b6b6b;
  }
`;

const grid = {
  // 图表 grid
  left: "0px",
  right: "0",
  top: "30px",
  bottom: "0px",
  containLabel: true,
};


export default function Index() {
  const projectId = useSelector(selectProjectId);
  const bref = useRef(null);
  const pref = useRef(null);
  const stref = useRef(null);
  const lref = useRef(null);
  const l2ref = useRef(null);
  const l3ref = useRef(null);
  const drawStach = (data) => {
    drawEcharts(stref.current, {
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
        axisLabel: {
          color: "#545454",
        },
      },
      dataset: {
        source: data
      },
      series: [
        {
          type: "bar",
          stack: "total",
          encode: {
            x: "value",
            y: "name"
          },
          barWidth: 20,
          itemStyle: {
            borderRadius: 10,
          },
        },
      ],
      grid: {
        top: "10px",
        bottom: "0px",
        right: "0px",
        left: "0px",
        containLabel: true,
      },
      legend: {
        show: false,
      },
      label: {
        show: true,
        formatter: "{@[1]}kwh",
      },
    });
  }
  const [loginf, setLoginf] = useState({
    url: "",
    name: "",
    password: "",
  });
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [costData, setCostData] = useState({});
  const [rankData, setRankData] = useState({})
  const getLogInfo = async () => {
    try {
      let [address, user] = await Promise.allSettled([
        QueryPrepayServerUrl(projectId),
        GetPrepayUserInfo(projectId),
      ]);

      setLoginf({
        url: address?.value?.data.url,
        name: user?.value?.data.prepayUserName,
        password: user?.value?.data.prepayPassword,
      });
    } catch (error) {}
  };
  const getProjectInfo = async () => {
    try {
      let { success, data } = await GetPrepayProjects(projectId);
      if (success && Array.isArray(data) && data.length > 0) {
        let arr = data.map((d) => ({ label: d.name, value: d.id }));
        let id = arr[0].value;
        setAreaId(id);
        setAreas(arr);
        pageData(id);
      } else {
        message.warning("没有园区");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pageData = async (id) => {
    try {
      BaseInfoSummary(id, projectId).then((res) => {
        let { success, data } = res;
        
        if (success && data) {
          setCostData(data);
        } else {
          setCostData({});
        }
      }),
        TransactionStatistics(id, projectId).then((res) => {
          let { success, data } = res;
          if (success && data) {
            let { incomeTrend = [], payMode = [] } = data;
            drawEcharts(bref.current, {
              dataset: {
                dimensions: ["月份", "2023", "2024"],
                source: incomeTrend,
              },
              series: [
                { type: "bar", barGap: 0 },
                { type: "bar", barGap: 0 },
              ],
              grid,
            });

            drawEcharts(pref.current, {
              pieData: { data: payMode, radius: "65%" },
              type: 3,
              legend: {
                top: "auto",
                bottom: 0,
              },
            });
          }
        }),
        EnergyRanking(id, projectId).then((res) => {
          let {success, data} = res
          if(success && data) {
            setRankData(data)
            drawStach(data['electricRanking'])
          }
        }),
        EnergyTrends(id, projectId).then((res) => {
          let {data, success} = res;
          if(success && data) {
            let {electricTrend, waterTrend,hotWaterTrend} = res;
            drawEcharts(l2ref.current, {
              color: ["#099c9c"],
              dataset: {
                source: hotWaterTrend
              },
              series: [
              
                { 
                  encode: {
                    x: "name",
                    y: "value"
                  },
                  type: "line" }
              ],
              grid: {
                top: "30px",
                left: 0,
                right: 0,
                bottom: "0",
                containLabel: true,
              },
            });
          }
        });
    } catch (error) {}
  };
  useEffect(() => {
    getLogInfo();
    getProjectInfo();
  }, [projectId]);



 
  const datasetMonthe = {
    dimensions: ["time", "用电量"],
    source: [
      { time: "1", 用电量: 5600 },
      { time: "2", 用电量: 4600 },
      { time: "3", 用电量: 3600 },
      { time: "4", 用电量: 5611 },
      { time: "5", 用电量: 5644 },
      { time: "6", 用电量: 4677 },
      { time: "7", 用电量: 3688 },
      { time: "8", 用电量: 5088 },
      { time: "9", 用电量: 6677 },
      { time: "10", 用电量: 5866 },
      { time: "11", 用电量: 4677 },
      { time: "12", 用电量: 1877 },
    ],
  };
  const datasetMonthw = {
    dimensions: ["time", "用水量"],
    source: [
      { time: "1", 用水量: 7600 },
      { time: "2", 用水量: 4600 },
      { time: "3", 用水量: 1600 },
      { time: "4", 用水量: 2611 },
      { time: "5", 用水量: 5644 },
      { time: "6", 用水量: 4677 },
      { time: "7", 用水量: 2688 },
      { time: "8", 用水量: 3088 },
      { time: "9", 用水量: 4677 },
      { time: "10", 用水量: 5866 },
      { time: "11", 用水量: 6677 },
      { time: "12", 用水量: 7877 },
    ],
  };
  const datasetMonthg = {
    dimensions: ["time", "天燃气"],
    source: [
      { time: "1", 天燃气: 5600 },
      { time: "2", 天燃气: 4600 },
      { time: "3", 天燃气: 3600 },
      { time: "4", 天燃气: 5611 },
      { time: "5", 天燃气: 5644 },
      { time: "6", 天燃气: 4677 },
      { time: "7", 天燃气: 1688 },
      { time: "8", 天燃气: 2088 },
      { time: "9", 天燃气: 3677 },
      { time: "10", 天燃气: 5866 },
      { time: "11", 天燃气: 4677 },
      { time: "12", 天燃气: 7877 },
    ],
  };

  useEffect(() => {
    drawEcharts(lref.current, {
      color: ["#5e92f9"],
      dataset: datasetMonthe,
      series: [{ type: "line" }],
      grid: {
        top: "30px",
        left: 0,
        right: 0,
        bottom: "0",
        containLabel: true,
      },
      legend: {
        top: 0,
        // bottom: 0,
        icon: "rect",
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
      },
    });
    drawEcharts(l2ref.current, {
      color: ["#099c9c"],
      dataset: datasetMonthw,
      series: [{ type: "line" }],
      grid: {
        top: "30px",
        left: 0,
        right: 0,
        bottom: "0",
        containLabel: true,
      },
    });
    drawEcharts(l3ref.current, {
      color: ["#ff6803"],
      dataset: datasetMonthg,
      series: [{ type: "line" }],
      grid: {
        top: "30px",
        left: 0,
        right: 0,
        bottom: "0",
        containLabel: true,
      },
      legend: {
        top: 0,
        // bottom: 0,
        icon: "rect",
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
      },
    });


  });
  const ranks = [{label: "电", value: 'electricRanking'}, {label: "冷水", value: 'waterRanking'}, {label: "热水", value: 'hotWaterRanking'}, {label: "燃气", value: 'gasRanking'}]
  const onChange = (e) => {
    setAreaId(e);
    pageData(e);
  };
  const rankChange =(e) => {
    let data = rankData[e.target.value]
    drawStach(data)
  } 
 
  const jump = useCallback(() => {
    let { url, name, password } = loginf;
    if (!url) return message.warning("网站地址为空");
    window.open(
      `${url}/?name=${name}&password=${password}&type=dark&projectId=${projectId}`
    );
  }, [loginf]);
  return (
    <Pagecount bgcolor="#eeeff3" pd="0px">
      <Mainbox>
        <div className="header">
          <span>园区选择</span>
          <Select
            placeholder="请选择园区"
            size="middle"
            value={areaId}
            style={{ width: "320px", marginLeft: "12px" }}
            options={areas}
            onChange={onChange}
          ></Select>
          <Button onClick={jump} type="primary" style={{ marginLeft: "auto" }}>
            控制台
          </Button>
        </div>
        <div className="upper">
          <Itembox title="项目信息"></Itembox>
          <Itembox title="告警信息">
            <Timelinebox>
              <Timeline.Item color="red">
                <div>
                  <p className="title">
                    13:48:55 客户欠费{" "}
                    <span className="content">
                      {" "}
                      02303 张三 / 13588455699 欠费 100.32元
                    </span>
                  </p>
                  {/* <p className='content'>02303  张三 / 13588455699  欠费 100.32元</p> */}
                </div>
              </Timeline.Item>
              <Timeline.Item color="red">
                <div>
                  <p className="title">
                    13:20:23 客户欠费
                    <span className="content">
                      {" "}
                      02303 张三 / 13588455699 欠费 100.32元
                    </span>
                  </p>
                  {/* <p className='content'>02304  李四 / 13588455699  欠费 100.32元</p> */}
                </div>
              </Timeline.Item>
              <Timeline.Item color="red">
                <div>
                  <p className="title">
                    13:20:23 客户欠费
                    <span className="content">
                      {" "}
                      02303 张三 / 13588455699 欠费 100.32元
                    </span>
                  </p>
                  {/* <p className='content'>02305  王五 / 13588455699  欠费 100.32元</p> */}
                </div>
              </Timeline.Item>
              <Timeline.Item color="red">
                <div>
                  <p className="title">
                    13:20:23 客户欠费
                    <span className="content">
                      {" "}
                      02303 张三 / 13588455699 欠费 100.32元
                    </span>
                  </p>
                  {/* <p className='content'>02305  王五 / 13588455699  欠费 100.32元</p> */}
                </div>
              </Timeline.Item>
            </Timelinebox>
          </Itembox>
          <Cost data={costData} />
        </div>
        <div className="middle">
          <Itembox
            title="项目收入趋势"
          >
            <div ref={bref} className="itemContent"></div>
          </Itembox>
          <Itembox title="支付方式">
            <div ref={pref} className="itemContent"></div>
          </Itembox>
          <Itembox title="客户累计能耗排名">
            <div className="itemContent" style={{flexDirection:"column"}}>
              <Radio.Group options={ranks} size="small" onChange={rankChange}  optionType="button"
              buttonStyle="solid" defaultValue="electricRanking" />
            <div ref={stref} style={{flex: 1}}></div>
            </div>
          </Itembox>
        </div>
        <div className="lower">
          <Itembox
            title="用电量趋势"
          >
            <div ref={lref} className="itemContent"></div>
          </Itembox>
          <Itembox
            title="用水量趋势"
          >
            <div ref={l2ref} className="itemContent"></div>
          </Itembox>
          <Itembox title="用气趋势">
            <div ref={l3ref} className="itemContent"></div>
          </Itembox>
        </div>
      </Mainbox>
    </Pagecount>
  );
}
