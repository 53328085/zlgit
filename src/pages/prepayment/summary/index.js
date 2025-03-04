import React, { useEffect, useState, useRef, useCallback } from "react";

import { useSelector } from "react-redux";

import moment from "moment";
import styled, { css } from "styled-components";
import Pagecount from "@com/pagecontent";
import Titlelayout from '@com/titlelayout';
import Cost from "./cost";
import { selectProjectId } from "@redux/systemconfig.js";
import {
  Radio,
  Timeline,
  Image,
  Select,
  Button,
  Typography,
  message,
} from "antd";
import projectimg from "@imgs/projectimg.png";
import { drawEcharts } from "@com/useEcharts";
import { PrepayConfig, PrepayRun } from "@api/api";
const { Title, Paragraph, Text } = Typography;
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
   display: flex;
   flex-direction: column;
 // display: grid;
  color: #515151;
 // grid-template-rows: 48px minmax(176px, auto) minmax(304px, 1fr) minmax(267px, 1fr);
  gap: 16px;
 // grid-template-columns: 1fr;
  flex: 1;
  .itemContent {
      display: flex;
      flex: 1;
      padding: 0 8px;
      background-color: #fff;
    }
  
  .header {
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
  
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    //   grid-template-columns: repeat(2, minmax(360px,1fr)) repeat(6, minmax(140px,1fr));
    //  grid-template-rows: 176px;
    // column-gap: 16px;
    // justify-content: space-between;
    gap: 16px;
    .box{
      height: 176px;
      flex: 1 1 360px;
    }
    .item {
      height: 176px;
      flex: 1 1 140px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      //  align-items: center;
      border: 1px solid #d7d7d7; 
      color: #333;
      background-color: #fff;
      border-radius: 8px;
     // box-shadow: 0px 1px 2px rgb(0 0 0 / 35%);
      .imgBox {
        height: 88px;
        background-color: ${(props) => props.theme.primaryColor};
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
    display: flex; 
    gap: 16px; 
    height: 304px;
    .box1 {
      flex: 1 1 808px;
    }
    .box2 {
      flex: 1 1 375px;
    }
    .box3 {
      flex: 1 1 464px;
    }
  }
  .lower {
    height: 267px;
    display: flex;
    gap: 16px;
    .box {
      flex: 1 1 550px
    }
  }
`;

const Timelinebox = styled(Timeline)`
  max-height: 115px;
  overflow-y: scroll;
  padding-top: 8px;
  width: 100%;
  padding-left: 8px;
  .ant-timeline-item {
    padding-bottom: 8px;
    padding-left: 4px;
  }
  .box {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .title {
    color: #1e1e1e;
  }
  .content {
    font-size: 12px;
    color: #6b6b6b;
  }
  .cutdot.yellow {
    border-color: #ff9900;
    background-color: #ff9900;
  }
  .cutdot {
    display: inline-block;
    width: 16px;
    height: 16px;
    padding: 2px;
    border-radius: 50%;
    border: 1px solid #f00;
    background: #f00;
    background-clip: content-box;
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

const legend = {
  top: 0,
  // bottom: 0,
  icon: "rect",
  itemHeight: 2,
  itemWidth: 12,
  itemGap: 20,
};

const TimeLine = ({
  date,
  alarmType,
  deviceAddress,
  alarmReason,
  sn,
  index,
}) => {
  return (
    <Timeline.Item
      color="red"
      dot={<span className={index == 2 ? "cutdot yellow" : "cutdot"}></span>}
    >
      <div className="box">
        <Text ellipsis className="title">
          {date}&nbsp;{alarmType}
        </Text>
        <Text className="content">
          {deviceAddress}&nbsp;{sn ? `设备编号SN${sn}` : ""}&nbsp;{alarmReason}
        </Text>
      </div>
    </Timeline.Item>
  );
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
        axisTick: {
          show: false,
        },
      },
      dataset: {
        source: data,
      },
      series: [
        {
          type: "bar",
          stack: "total",
          encode: {
            x: "value",
            y: "name",
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
        //formatter: "{@[1]}kwh",
      },
    });
  };
  const [loginf, setLoginf] = useState({
    name: "",
    password: "",
  });
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [costData, setCostData] = useState({});
  const alarmInfo = costData.alarmInfo?.slice(0, 3) || [];
  const [rankData, setRankData] = useState({});
  const [info, setInfo] = useState({});
  const [jumurl, setJumurl] = useState();
  const dateType = useRef();
  const getLogInfo = () => {
    QueryPrepayServerUrl(projectId)
      .then((res) => {
        let { success, data } = res;
        if (success && data) {
          setJumurl(data.url);
        } else {
          setJumurl("");
        }
      })
      .catch(),
      GetPrepayUserInfo(projectId)
        .then((res) => {
          let { success, data } = res;
          if (success && data) {
            setLoginf({
              name: data.prepayUserName,
              password: data.prepayPassword,
            });
          } else {
            setLoginf({
              name: "",
              password: "",
            });
          }
        })
        .catch();
  };
  const getProjectInfo = async () => {
    try {
      let { success, data } = await GetPrepayProjects(projectId);
      if (success && Array.isArray(data) && data.length > 0) {
        let arr = data.map((d) => {
          let { name, id, ...other } = d;
          return { label: name, value: id, ...other };
        });
        setInfo(arr[0]);
        let id = arr[0].value;
        setAreaId(id);
        setAreas([...arr, { label: "全部", value: 0 }]);
        getBaseInfo(id);
        pageData(id);
      } else {
        setAreas([]);
        message.warning("没有园区");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getBaseInfo = (id) => {
    BaseInfoSummary(id, projectId)
      .then((res) => {
        let { success, data } = res;

        if (success && data) {
          setCostData(data);
        } else {
          setCostData({});
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const pageData = async (id, type = 3) => {
    console.log(type);
    try {
      //  dateType.current = type
      TransactionStatistics(id, projectId, type).then((res) => {
        let { success, data } = res;
        if (success && data) {
          let { incomeTrend = [], payMode = [] } = data;
          let pieData = payMode.map((i) => ({ name: i.name, value: i.value }));
          drawEcharts(bref.current, {
            dataset: {
              dimensions: [
                "date",
                {
                  name: "lastYearIncome",
                  displayName:
                    type == 3
                      ? "上日"
                      : type == 2
                        ? "上月"
                        : type == 1
                          ? moment().add(-1, "y").format("yyyy")
                          : "",
                },
                {
                  name: "thisYearIncome",
                  displayName:
                    type == 3
                      ? "本日"
                      : type == 2
                        ? "本月"
                        : type == 1
                          ? moment().format("yyyy")
                          : "",
                },
              ],
              source: incomeTrend,
            },
            series: [
              { type: "bar", barGap: 0 },
              { type: "bar", barGap: 0 },
            ],
            grid,
          });

          drawEcharts(pref.current, {
            pieData: { data: pieData, radius: "65%" },
            type: 3,
            legend: {
              top: "auto",
              bottom: 0,
            },
          });
        }
      }),
        EnergyRanking(id, projectId, type).then((res) => {
          let { success, data } = res;
          if (success && data) {
            setRankData(data);
            drawStach(data["electricRanking"]);
          }
        }),
        EnergyTrends(id, projectId, type).then((res) => {
          let { data, success } = res;
          if (success && data) {
            let { electricTrend, waterTrend, hotWaterTrend } = data;
            drawEcharts(l2ref.current, {
              color: ["#099c9c"],
              dataset: {
                dimensions: [
                  "name",
                  {
                    name: "value",
                    displayName: "用水量(kWh)",
                  },
                ],
                source: waterTrend,
              },
              series: [
                {
                  type: "line",
                },
              ],
              grid,
              legend,
            });
            drawEcharts(lref.current, {
              color: ["#5e92f9"],
              dataset: {
                dimensions: [
                  "name",
                  {
                    name: "value",
                    displayName: "用电量(kWh)",
                  },
                ],
                source: electricTrend,
              },
              series: [{ type: "line" }],
              grid,
              legend,
            });
            drawEcharts(l3ref.current, {
              color: ["#ff6803"],
              dataset: {
                dimensions: [
                  "name",
                  {
                    name: "value",
                    displayName: "热水量(kWh)",
                  },
                ],
                source: hotWaterTrend,
              },
              series: [{ type: "line" }],
              grid,
              legend,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLogInfo();

    getProjectInfo();
  }, [projectId]);

  const ranks = [
    { label: "电", value: "electricRanking" },
    { label: "冷水", value: "waterRanking" },
    { label: "热水", value: "hotWaterRanking" },
    { label: "燃气", value: "gasRanking" },
  ];
  const onChange = (e) => {
    setAreaId(e);
    pageData(e);
  };
  const rankChange = (e) => {
    let data = rankData[e.target.value];
    drawStach(data);
  };
  const dates = [
    { label: "日", value: 3 },
    { label: "月", value: 2 },
    { label: "年", value: 1 },
  ];
  const dateChange = (e) => {
    // console.log(e.target.value)
    pageData(areaId, e.target.value);
  };

  const jump = useCallback(() => {
    let { name, password } = loginf;
    if (!jumurl) return message.warning("网站地址为空");
    window.open(`${jumurl}/?userName=${name}&pwd=${password}&type=dark`);
  }, [loginf, jumurl]);
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
          {areaId > 0 && (
            <Button
              onClick={jump}
              type="primary"
              style={{ marginLeft: "auto" }}
            >
              控制台
            </Button>
          )}
        </div>
        <div className="upper">
          <Titlelayout className="box" title="项目信息" hv="32px" pl="16px" pt="16px" pv="8px" layout="flex"> 
            <div
              className="itemContent"
              style={{ justifyContent: "space-between" }}
            >
              <Image
                src={info.imageBase64
                  ? "data:image/png;base64," + info.imageBase64 : projectimg}
                preview={false}
                height={124}
                width={192}
              ></Image>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "138px",
                  justifyContent: "space-around",
                }}
              >
                <Title level={5} ellipsis={{ rows: 2, tooltip: info.label }}>
                  {info.label}
                </Title>
                <Paragraph ellipsis={{ rows: 3, tooltip: info.address }}>
                  {info.address}
                </Paragraph>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout className="box" title="告警信息" hv="32px" pl="16px" pt="16px" pv="8px" layout="flex">            
            <div className="itemContent">
              <Timelinebox>
                {alarmInfo.map((d, index) => (
                  <TimeLine {...d} index={index} key={d.sn} />
                ))}
              </Timelinebox>
            </div>
          </Titlelayout>
          <Cost data={costData} />
        </div>
        <div className="middle">
          <Titlelayout className="box1" title="项目收入趋势" hv="32px" pl="16px" pt="16px" pv="8px" layout="flex">           
            <div className="itemContent" style={{ flexDirection: "column" }}>
              <Radio.Group
                options={dates}
                size="small"
                onChange={dateChange}
                optionType="button"
                buttonStyle="solid"
                defaultValue={3}
              />
              <div ref={bref} style={{ flex: 1 }}></div>
            </div>
          </Titlelayout>
          <Titlelayout className="box2" title="支付方式" hv="32px" pl="16px" pt="16px" pv="8px" layout="flex">             
            <div ref={pref} className="itemContent"></div>
          </Titlelayout>
          <Titlelayout className="box3" title="客户累计能耗排名" hv="32px" pl="16px" pt="16px" pv="8px" layout="flex">            
            <div className="itemContent" style={{ flexDirection: "column" }}>
              <Radio.Group
                options={ranks}
                size="small"
                onChange={rankChange}
                optionType="button"
                buttonStyle="solid"
                defaultValue="electricRanking"
              />
              <div ref={stref} style={{ flex: 1 }}></div>
            </div>
          </Titlelayout>
        </div>
        <div className="lower">
          <Titlelayout className="box" title="用电量趋势" hv="32px" pl="16px" pt="16px" pv="8px" layout="flex">             
            <div ref={lref} className="itemContent"></div>
          </Titlelayout>
          <Titlelayout className="box" title="用水量趋势" hv="32px" pl="16px" pt="16px" pv="8px" layout="flex"> 
            <div ref={l2ref} className="itemContent"></div>
          </Titlelayout>
          <Titlelayout className="box" title="用气趋势" hv="32px" pl="16px" pt="16px" pv="8px" layout="flex"> 
            <div ref={l3ref} className="itemContent"></div>
          </Titlelayout>
        </div>
      </Mainbox>
    </Pagecount>
  );
}
