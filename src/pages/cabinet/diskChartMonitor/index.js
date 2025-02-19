import React, { useEffect, useState, useRef, useMemo } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  Form,
  Image,
  message,
  Progress,
  Button,
  InputNumber,
  Select,
  Space,
  Input,
  DatePicker,
  Typography,
  Drawer,
  Descriptions,
  Timeline,
} from "antd";
import Pagecount from "@com/pagecontent";
import { CloseOutlined } from "@ant-design/icons";
import { isObject } from "@com/usehandler";
import {
  CustLink,
  i18t,
  i18warning,
  CustButton,
  CustButtonT,
  ConfirmBtn,
} from "@com/useButton";
import styled, { css } from "styled-components";

import { Radiogroup, Cdivider } from "@com/comstyled";
import { enterprise, selectProjectId, adaptation } from "@redux/systemconfig";
import Titlelayout from "@com/titlelayout";
import Custmodal from "@com/useModal";
import imgsrc from "./imgs";
import Ichart from "@com/useEcharts/Ichart";

import Usetable from "@com/useTable";
import GouIcon from "@imgs/gou.png";
import temp from "./imgs/temp.png";
import Info from "./info";
import Electric from "./electric";

const { Link, Text, Title } = Typography;
const { Item } = Descriptions;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const titlesty = css`
  padding-left: 16px;
  border-left: 4px solid ${(props) => props.theme.primaryColor};
  font-size: ${(props) => (props.theme.laptop ? "14px" : "16px")};
`;
const Okt = styled.div`
  padding-left: 32px;
  font-size: 16px;
  color: #515151;
  .ok {
    display: flex;
    align-items: center;

    img {
      margin-right: 16px;
    }
  }
  .pwd {
    display: flex;
    align-items: center;
    column-gap: 16px;
    .ipt {
      flex: 1;
      flex-direction: column;
    }
  }
`;
const CDrawer = styled(Drawer)`
  && {
    .ant-drawer-content-wrapper {
      min-width: 928px;
      width: calc(100% - 400px) !important;
      top: 0;
      height: 100%;
    }
    .ant-drawer-body {
      display: flex;
      flex-direction: column;
    }
    .ant-drawer-header {
      .ant-drawer-title {
        ${titlesty}
      }
      .ant-drawer-extra {
        flex: 2;
        display: flex;
      }
    }
  }
`;
const Dot = styled.div`
  && {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid
      ${(props) =>
        props.state == 1
          ? props.theme.primaryColor
          : props.theme.successColor}; // 1 告警确认
    background-color: ${(props) =>
      props.state == 3
        ? "transparent"
        : props.state == 2
        ? props.theme.primaryColor
        : props.theme.successColor};
    background-image: url(${(props) => (props.state == 1 ? GouIcon : null)});
    background-position: center;
    background-size: 8px;
    background-repeat: no-repeat;
  }
`;
const DDrawer = styled(Drawer)`
  && {
    .ant-drawer-content-wrapper {
      //  min-width: 1036px;
      width: ${(props) => props.wh || "100%"} !important;
      top: 0;
      height: 100%;
      transform: translateX(0px) !important;
      .ant-drawer-content {
        background-color: transparent;
      }
    }
    .ant-drawer-extra {
      flex: 2;
      display: flex;
    }
    .ant-drawer-body {
      // display: flex;
      //  column-gap: 8px;
      display: grid;
      grid-template-columns: ${(props) => (props.inner ? "1fr" : "1fr 1036px")};
      grid-template-rows: 1fr;
      column-gap: 8px;
      .left {
        height: 100%;
        position: relative;
        display: flex;

        .leftmain {
          display: flex;
          flex-direction: column;
          row-gap: 16px;
          .alarm {
            padding-left: 16px;
            display: flex;
            row-gap: 32px;
            flex-direction: column;
          }
        }
      }
      .mainbox {
        height: 100%;
        display: flex;
        flex-basis: 1036px;
        flex-direction: column;
        row-gap: 16px;
        background-color: #fff;
        padding: 0 16px;
        .ctitle {
          display: flex;
          justify-content: space-between;
          background-color: #f2f2f2;
          padding: 16px;
          margin: 0 -16px;
          .text {
            ${titlesty}
          }
          .close {
            color: #d6d6d6;
            font-size: 22px;
            transition: all 0.3s;
            &:hover {
              color: #333;
            }
          }
        }
        .htitle {
          height: 32px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: rgb(215, 215, 215);
        }
        .remote {
          height: 40px;
          font-size: 16px;
          width: 144px;
          text-align: left;
          padding: 0 8px;
          img {
            margin-right: 8px;
          }
        }
      }
    }

    .ant-drawer-header {
      .ant-drawer-title {
        padding-left: 16px;
        border-left: 4px solid ${(props) => props.theme.primaryColor};
        font-size: ${(props) => (props.theme.laptop ? "14px" : "16px")};
      }
    }
  }
`;
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  column-gap: 32px;

  .part {
    position: relative;
    flex: 0 0 360px;
    height: 866px;
    background-repeat: no-repeat;
    //  padding-top: 26px;
    //  background-image:  url(${imgsrc["bg"]});
    //  background-size: 320px 866px;
    padding: 26px 1px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .nums {
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 2px;
      color: #0f0;
      white-space: nowrap;
      cursor: pointer;
      .ant-typography {
        color: #0f0;
      }
      .type {
        display: inline-block;
        border-bottom: 1px dotted;
        align-self: stretch;
        text-align: center;
        margin: 0 4px;
        line-height: 1;
        padding-bottom: 4px;
      }
    }
    .textname {
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .loopbashou {
      cursor: pointer;
    }
    .h3d {
      // 默认  P1
      position: absolute;
      width: 142px;
      height: 220px;
      left: 109px;
      bottom: 218px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .detail {
        height: 160px;
        cursor: pointer;
        .state {
          display: flex;
          justify-content: center;
          img + img {
            padding-left: 8px;
          }
        }
      }
    }
    &:nth-of-type(1) {
      background-image: url(${imgsrc["P1"]});
    }
    &:nth-of-type(2) {
      background-image: url(${imgsrc["P2"]});
      .bashou {
        transform: translateY(110px);
        cursor: pointer;
      }
      .h3d {
        bottom: 443px;
        height: 156px;
        .detail {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
      }
      .guis {
        cursor: pointer;
        width: 266px;
        height: 374px;
        bottom: 55px;
        position: absolute;
      }
    }
    &:nth-of-type(3) {
      flex: 0 0 320px;
      background-image: url(${imgsrc["P3"]});
      .values {
        color: #0f0;
        position: absolute;
        left: 13px;

        height: 80px;
        width: 62px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;

        .state {
          display: flex;
          justify-content: center;
          img + img {
            padding-left: 8px;
          }
        }
      }
      .values.first {
        top: 118px;
      }
      .values.second {
        top: 358px;
      }
      .values.thirdly {
        top: 600px;
      }
      .guizhi {
        width: 120px;
        height: 213px;
        position: absolute;
        left: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        .gtitle {
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .guiti {
          height: 160px;
        }
      }
      .guizhi.first {
        top: 105px;
      }
      .guizhi.second {
        top: 345px;
      }
      .guizhi.thirdly {
        top: 586px;
      }
    }
    &:nth-of-type(4) {
      flex: 0 0 320px;
      background-image: url(${imgsrc["P4"]});
      .loops {
        position: absolute;
        width: 100%;
        height: 160px;
        display: grid;
        .textname {
            width: 50px;
          }
      }

      .loops1 {
        top: 106px;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 80px;
        .loop1 {
          padding-left: 8px;
          padding-right: 12px;
          display: flex;
          flex-direction: column;
        
          .loopcontent {
            flex: 1;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            .loopbashou {
              align-self: center;
              
            }
            .state4 {
              transform: translateY(-8px);
            }
            .nums {
              transform: translateY(-8px);
            }
          }
        }
      }
      .loops2 {
        top: 266px;
        grid-template-columns: 1fr;
        grid-auto-rows: 80px;
        height: 240px;
        padding-left: 8px;
        padding-right: 35px;
        .loop2 {
          display: flex;
          justify-content: space-between;
          align-items: center; 
          .textname {
            align-self: flex-start;
            
          }
          .state42 {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 94px;
            cursor: pointer;
          }
        }
      }
      .loops3 {
         top:506px;
         padding-left: 8px;
         padding-right: 35px;
         height: 320px;
         grid-template-columns: 1fr;
         grid-template-rows: 1fr 1fr;
         .loop3 {
           display: flex;
           justify-content: space-between;
           padding-bottom: 20px;
          .nums{
            align-self: flex-end;
          }
         }
      }
    }

    .title {
      height: 22px;
      background-color: ${(props) => props.theme.primaryColor};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1px 16px;
      width: 100%;
      .ant-typography {
        color: #fff;
        display: inline-flex;
        align-items: center;
        img {
          padding-right: 0.5em;
        }
      }
    }
  }
`;
const Extrea = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.ist ? "space-between" : "flex-end")};
  flex: 1;
  .close {
    color: #d6d6d6;
    font-size: 22px;
    transition: all 0.3s;
    &:hover {
      color: #333;
    }
  }
`;
const options = [
  {
    label: i18t("comm", "month"),
    value: 1,
  },
  {
    label: i18t("comm", "year"),
    value: 2,
  },
];

/* 月，年。没有日 */
export default function Index() {
  const { laptop } = useSelector(adaptation);
  const [open, setOpen] = useState(false);
  const [copen, setCopen] = useState(false);
  const [iopen, setIopen] = useState(false);
  const [elopen, setElopen] = useState(false);
  const [title, setTitle] = useState("变压器柜温度趋势");
  const [ctitle, setCtitle] = useState("有源滤波回路");
  const [ititle, setititle] = useState("告警详情");
  const [eltitle, setEltitle] = useState(""); // 遥测 图表的标题
  const [state, setState] = useState(1); // 1 分闸2故障3正常
  const [form] = Form.useForm();
  const onOpen = () => {
    setOpen(true);
  };
  const onCopen = () => {
    setCopen(true);
  };

  const vdata = [
    Array.from({ length: 24 }, (_, index) =>
      index > 9 ? `${index}:00` : `0${index}:00`
    ),
    Array.from({ length: 24 }, (_, index) => (Math.random() * 100)?.toFixed(2)),
    Array.from({ length: 24 }, (_, index) => (Math.random() * 100)?.toFixed(2)),
  ];
  const eldata = [
    Array.from({ length: 24 }, (_, index) =>
      index > 9 ? `${index}:00` : `0${index}:00`
    ),
    Array.from({ length: 24 }, (_, index) => (Math.random() * 100)?.toFixed(2)),
    Array.from({ length: 24 }, (_, index) => (Math.random() * 100)?.toFixed(2)),
    Array.from({ length: 24 }, (_, index) => (Math.random() * 100)?.toFixed(2)),
  ];
  const vstate = [
    { title: "断路器状态", state: "合闸" },
    { title: "故障脱口次数", state: 0 },
    { title: "开关操作次数", state: 4 },
  ];
  const vedata = [
    { title: "A相电压", num: "400.00V" },
    { title: "B相电压", num: "400.00V" },
    { title: "C相电压", num: "400.00V" },
    { title: "AB线电压", num: "400.00V" },
    { title: "BC线电压", num: "400.00V" },
    { title: "CA线电压", num: "400.00V" },
    { title: "A相电流", num: "400.00A" },
    { title: "B相电流", num: "400.00A" },
    { title: "C相电流", num: "400.00A" },
    { title: "零线电流", num: "400.00A" },
    { title: "剩余电流", num: "400.00A" },
    { title: "电网频率", num: "50.00Hz" },
  ];

  const columns = [
    {
      title: "等级",
      dataIndex: "level",
      key: "level",
      render: (text) => {
        return text == 1 ? <Text type="danger">高危</Text> : null;
      },
    },
    {
      title: "发生时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "报警类型",
      dataIndex: "alarmType",
      key: "alarmType",
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      render: (text) => {
        // 1确认2未确认
        return (
          <Space>
            {text == 1 ? (
              <ConfirmBtn
                state={2}
                text="noconfirm"
                opac={0.2}
                onClick={() => setIopen(true)}
              />
            ) : (
              <ConfirmBtn state={1} text="confirm" opac={0.2} />
            )}
          </Space>
        );
      },
    },
  ];
  const dataSource = [
    {
      level: 1,
      startTime: moment().subtract(7, "days").format("yyyy-MM-DD HH:mm:ss"),
      alarmType: "温度超限",
      state: 1,
    },
    {
      level: 1,
      startTime: moment().subtract(27, "days").format("yyyy-MM-DD HH:mm:ss"),
      alarmType: "设备离线",
      state: 2,
    },
  ];
  let moption = {
    // color: ["#ff7345","#6a6e88"],
    series: [
      { type: "line", seriesLayoutBy: "row", yAxisIndex: 0, name: "温度" },
      { type: "line", seriesLayoutBy: "row", yAxisIndex: 1, name: "湿度" },
    ],
    grid: {
      right: "32px",
      left: 0,
      top: "32px",
      bottom: 0,
      containLabel: true,
    },
    legend: {
      top: "0px",
      left: "32px",
    },
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}°C",
        },
      },
      {
        name: "环境湿度",
        nameLocation: "center",
        nameGap: 64,
        position: "right",
        axisLabel: {
          formatter: "{value}%HR",
        },
      },
    ],
    dataset: {
      dimensions: [
        { name: "时间", type: "time" },
        { name: "温度" },
        { name: "湿度" },
      ],
      source: vdata,
      sourceHeader: false,
    },
  };
  let eloption = {
    // color: ["#ff7345","#6a6e88"],
    series: [
      { type: "line", seriesLayoutBy: "row" },
      { type: "line", seriesLayoutBy: "row" },
    ],
    grid: {
      right: 0,
      left: 0,
      top: "32px",
      bottom: 0,
      containLabel: true,
    },
    legend: {
      top: "0px",
      left: "16px",
    },
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}V",
        },
      },
    ],
    dataset: {
      dimensions: [
        { name: "时间", type: "time" },
        { name: "相电压VAB" },
        { name: "相电压VAC" },
        { name: "相电压VCA" },
      ],
      source: eldata,
      sourceHeader: false,
    },
  };

  // 自定义告警详情描述类别样式
  const descsty = {
    backgroundColor: "#e1f3e7",
    padding: "8px 16px",
  };
  // 表单项宽度

  const itemsty = {
    width: "160px",
  };
  const toptions = [
    { label: 15, value: 15 },
    { label: 30, value: 30 },
    { label: 60, value: 60 },
    { label: 120, value: 120 },
    { label: 240, value: 240 },
    { label: 480, value: 480 },
  ];
  const loptions = [
    { label: "12t", value: 12 },
    { label: "1t", value: 1 },
    { label: "24t", value: 24 },
    { label: "定时限", value: 0 },
  ];
  const options3 = [
    { label: 100, value: 100 },
    { label: 200, value: 200 },
    { label: 300, value: 300 },
    { label: 400, value: 400 },
  ];
  const options4 = [
    { label: "反是限", value: 1 },
    { label: "定时限", value: 0 },
  ];
  const Extra = ({ ist, title, fn }) => {
    return (
      <Extrea ist={ist}>
        {ist && <RangePicker />}
        <CloseOutlined onClick={fn} className="close" />
      </Extrea>
    );
  };
  const onelchart = (title) => {
    setEltitle(title);
    setElopen(true);
  };
  const [rState, setRstate] = useState(1);
  const modal = useRef();
  const onControl = () => {
    modal.current.onOpen();
  };
  const onOk = () => {
    if (rState == 1) {
      setRstate(2);
    }
  };
  return (
    <Pagecount>
      <Mainbox>
        <div className="part">
          <div className="title">
            <Link onClick={onOpen}>
              <img src={temp} alt="" />
              温度：28.1
            </Link>
            <Link onClick={onOpen}>
              <img src={imgsrc["smoke"]} alt="" />
              烟感：无烟
            </Link>
            <CustLink
              text="details"
              underline={false}
              onClick={onOpen}
            ></CustLink>
          </div>
          <div className="h3d" onClick={null}>
            <div className="textname">进线柜</div>
            <div className="detail" onClick={onCopen}>
              <div className="state">
                <img src={imgsrc["red"]}></img>
                <img src={imgsrc["close"]}></img>
              </div>
            </div>
          </div>
        </div>
        <div className="part">
          <div className="title">
            <Link onClick={onOpen}>
              <img src={temp} alt="" />
              温度：28.1
            </Link>
            <Link onClick={onOpen}>
              <img src={imgsrc["smoke"]} alt="" />
              烟感：无烟
            </Link>
            <CustLink text="details" underline={false}></CustLink>
          </div>
          <div className="bashou" onClick={() => onCopen()}>
            <img
              src={
                state == 1
                  ? imgsrc[`A分闸`]
                  : state == 2
                  ? imgsrc["A故障"]
                  : imgsrc["A正常"]
              }
            ></img>
          </div>
          <div className="h3d" onClick={null}>
            <div className="textname">有源滤波柜</div>
            <div className="detail" onClick={onCopen}>
              <div className="state">
                <img src={imgsrc["red"]}></img>
                <img src={imgsrc["close"]}></img>
              </div>
            </div>
          </div>
          <div className="guis" onClick={onCopen}></div>
        </div>
        <div className="part">
          <div className="title">
            <Link onClick={onOpen}>
              <img src={temp} alt="" />
              温度：28.1
            </Link>
            <Link onClick={onOpen}>
              <img src={imgsrc["smoke"]} alt="" />
              烟感：无烟
            </Link>
            <CustLink text="details" underline={false}></CustLink>
          </div>
          <div className="values first" onClick={onCopen}>
            <div className="nums">
              <span className="type">1a</span>
              <Text>25.3A</Text>
              <Text>48.2°C</Text>
            </div>
            <div className="state">
              <img src={imgsrc["red"]}></img>
              <img src={imgsrc["close"]}></img>
            </div>
          </div>
          <div className="values second" onClick={onCopen}>
            <div className="nums">
              <span className="type">1a</span>
              <Text>252.3A</Text>
              <Text>482.2°C</Text>
            </div>
            <div className="state">
              <img src={imgsrc["red"]}></img>
              <img src={imgsrc["close"]}></img>
            </div>
          </div>
          <div className="values thirdly" onClick={onCopen}>
            <div className="nums">
              <span className="type">1a</span>
              <Text>253.3A</Text>
              <Text>483.2°C</Text>
            </div>
            <div className="state">
              <img src={imgsrc["red"]}></img>
              <img src={imgsrc["close"]}></img>
            </div>
          </div>
          <div className="guizhi first" onClick={onCopen}>
            <div className="textname">柜线1</div>
            <div className="guiti"></div>
          </div>
          <div className="guizhi second" onClick={onCopen}>
            <div className="textname">柜线2</div>
            <div className="guiti"></div>
          </div>
          <div className="guizhi thirdly" onClick={onCopen}>
            <div className="textname">柜线3</div>
            <div className="guiti"></div>
          </div>
        </div>
        <div className="part">
          <div className="title">
            <Link onClick={onOpen}>
              <img src={temp} alt="" />
              温度：28.1
            </Link>
            <Link onClick={onOpen}>
              <img src={imgsrc["smoke"]} alt="" />
              烟感：无烟
            </Link>
            <CustLink text="details" underline={false}></CustLink>
          </div>
          <div className="loops loops1">
            <div className="loop1">
              <div className="textname">回路1</div>
              <div className="loopcontent">
                <div className="loopbashou" onClick={onCopen}>
                  <img
                    src={
                      state == 1
                        ? imgsrc[`B分闸`]
                        : state == 2
                        ? imgsrc["B故障"]
                        : imgsrc["B正常"]
                    }
                  ></img>
                </div>

                <img
                  className="state4"
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>

                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>253.3A</Text>
                  <Text>483.2°C</Text>
                </div>
              </div>
            </div>
            <div className="loop1">
              <div className="textname">回路2</div>
              <div className="loopcontent">
                <div className="loopbashou" onClick={onCopen}>
                  <img
                    src={
                      state == 1
                        ? imgsrc[`B分闸`]
                        : state == 2
                        ? imgsrc["B故障"]
                        : imgsrc["B正常"]
                    }
                  ></img>
                </div>

                <img
                  className="state4"
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>

                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div>
            <div className="loop1">
              <div className="textname">回路2</div>
              <div className="loopcontent">
                <div className="loopbashou" onClick={onCopen}>
                  <img
                    src={
                      state == 1
                        ? imgsrc[`B分闸`]
                        : state == 2
                        ? imgsrc["B故障"]
                        : imgsrc["B正常"]
                    }
                  ></img>
                </div>

                <img
                  className="state4"
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>

                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div>
            <div className="loop1">
              <div className="textname">回路2</div>
              <div className="loopcontent">
                <div className="loopbashou" onClick={onCopen}>
                  <img
                    src={
                      state == 1
                        ? imgsrc[`B分闸`]
                        : state == 2
                        ? imgsrc["B故障"]
                        : imgsrc["B正常"]
                    }
                  ></img>
                </div>

                <img
                  className="state4"
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>

                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div>
          </div>
          <div className="loops loops2">
            <div className="loop2">
              <div className="textname">回路5</div>
              <div className="loopbashou" onClick={onCopen}>
                <img
                  src={
                    state == 1
                      ? imgsrc[`B正常`]
                      : state == 2
                      ? imgsrc["B故障"]
                      : imgsrc["B正常"]
                  }
                ></img>
              </div>
              <div className="state42">
                <img
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>
                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div>
            <div className="loop2">
              <div className="textname">回路6</div>
              <div className="loopbashou" onClick={onCopen}>
                <img
                  src={
                    state == 1
                      ? imgsrc[`B正常`]
                      : state == 2
                      ? imgsrc["B故障"]
                      : imgsrc["B正常"]
                  }
                ></img>
              </div>
              <div className="state42">
                <img
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>
                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div>
            <div className="loop2">
              <div className="textname">回路7</div>
              <div className="loopbashou" onClick={onCopen}>
                <img
                  src={
                    state == 1
                      ? imgsrc[`B正常`]
                      : state == 2
                      ? imgsrc["B故障"]
                      : imgsrc["B正常"]
                  }
                ></img>
              </div>
              <div className="state42">
                <img
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>
                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div>
          </div>
          <div className="loops loops3">
              <div className="loop3">
                <div className="textname">
                  回路8
                </div>
                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
              <div className="loop3">
                <div className="textname">
                  回路9
                </div>
                <div className="nums" onClick={onCopen}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
          </div>


        </div>
      </Mainbox>
      <CDrawer
        title={title}
        open={open}
        bodyStyle={{
          backgroundColor: "#fff",
        }}
        headerStyle={{
          backgroundColor: "#f2f2f2",
          padding: "16px 32px",
          borderBottom: "none",
          display: "flex",
        }}
        closable={false}
        extra={<Extra ist={true} fn={() => setOpen(false)} />}
      >
        <div style={{ flex: 1, backgroundColor: "#fff" }}>
          <Ichart {...moption} />
        </div>
      </CDrawer>
      <DDrawer
        // title={ctitle}
        //  ref={refdd}

        open={copen}
        bodyStyle={{
          padding: "0px",
        }}
        headerStyle={{
          backgroundColor: "#f2f2f2",
          padding: "16px",
          borderBottom: "none",
          display: "flex",
        }}
        closable={false}
        //    extra={<Extra  fn={() => setCopen(false)} />}
      >
        <div className="left">
          <DDrawer
            title="告警详情"
            inner={true}
            wh="524px"
            open={iopen}
            bodyStyle={{
              backgroundColor: "#fff",
              padding: "16px 24px 16px 16px",
            }}
            headerStyle={{
              backgroundColor: "#fff",
              padding: "16px 24px 16px 16px",
              borderBottom: "none",
              display: "flex",
            }}
            placement="right"
            mask={false}
            closable={false}
            getContainer={false}
            extra={<Extra fn={() => setIopen(false)} />}
            footerStyle={{
              display: "flex",
              backgroundColor: "#fff",
              justifyContent: "flex-end",
            }}
            footer={
              <Space>
                <CustButtonT
                  text="cancel"
                  ghost
                  onClick={() => setIopen(false)}
                ></CustButtonT>
                <CustButtonT text="ok"></CustButtonT>
              </Space>
            }
          >
            <div className="leftmain">
              <Descriptions
                column={1}
                colon={null}
                bordered
                contentStyle={descsty}
                labelStyle={descsty}
              >
                <Item label="报警类别">温度超限报警</Item>
                <Item label="变电站">1#变电站</Item>
                <Item label="柜体">p2</Item>
                <Item label="回路名称">/</Item>
                <Item label="报警设备">B相温度传感器</Item>
                <Item
                  label="通信地址"
                  contentStyle={{ backgroundColor: "#fff" }}
                  labelStyle={{ backgroundColor: "#fff" }}
                >
                  215084530
                </Item>
              </Descriptions>
              <div>
                <Title level={4}>告警等级</Title>
                <CustButton danger>高风险</CustButton>
              </div>
              <div className="alarm">
                <div>
                  <Text>告警状态</Text>
                </div>
                <Timeline>
                  <Timeline.Item dot={<Dot state={1} />}>
                    <Space size={laptop ? 16 : 32}>
                      <Text type="danger">告警发生</Text>{" "}
                      <Text>
                        {moment()
                          .subtract(7, "hours")
                          .format("yyyy-MM-DD HH:mm:ss")}
                      </Text>
                    </Space>
                  </Timeline.Item>
                  <Timeline.Item dot={<Dot state={2} />}>
                    <Space size={laptop ? 16 : 32}>
                      <Link>告警确认</Link>{" "}
                      <Link>
                        {moment()
                          .subtract(1, "hours")
                          .format("yyyy-MM-DD HH:mm:ss")}
                      </Link>
                    </Space>
                  </Timeline.Item>
                  <Timeline.Item dot={<Dot state={3} />}>
                    <Space size={laptop ? 16 : 32}>
                      <Text type="success">报警解除</Text>{" "}
                      <Text>{moment().format("yyyy-MM-DD HH:mm:ss")}</Text>
                    </Space>
                  </Timeline.Item>
                </Timeline>
              </div>
              <div>
                <Title level={4}>告警记录</Title>
                <TextArea row={6} autoSize={false}></TextArea>
              </div>
            </div>
          </DDrawer>
          <DDrawer
            title={eltitle}
            wh="840px"
            open={elopen}
            inner={true}
            bodyStyle={{
              backgroundColor: "#fff",
              padding: "16px 24px 16px 16px",
            }}
            headerStyle={{
              backgroundColor: "#fff",
              padding: "16px 24px 16px 16px",
              borderBottom: "none",
              display: "flex",
            }}
            placement="right"
            mask={false}
            closable={false}
            getContainer={false}
            extra={<Extra ist={true} fn={() => setElopen(false)} />}
            zIndex={1001}
          >
            <div className="leftmain">
              <Ichart {...eloption} />
            </div>
          </DDrawer>
        </div>
        <div className="mainbox">
          <div className="ctitle">
            <div className="text">框架断路器</div>
            <CloseOutlined onClick={() => setCopen(false)} className="close" />
          </div>
          <div className="htitle">
            <span>设备快照</span>
            <span>{moment().format("yyyy-MM-DD HH:mm:ss")}</span>
          </div>
          <Info vstate={vstate} />
          <div className="htitle">
            <span>报警信息</span>
          </div>
          <div>
            <Usetable hbg="#0066cc" columns={columns} dataSource={dataSource} />
          </div>

          <div className="htitle">
            <span>遥测</span>
            <span>{moment().format("yyyy-MM-DD HH:mm:ss")}</span>
          </div>
          <Electric datas={vedata} onClick={onelchart} />
          <div className="htitle">
            <span>遥调</span>
            <CustButton style={{ marginRight: "-16px" }}>保存参数</CustButton>
          </div>
          <Form form={form} layout="vertical">
            <Title level={5}>长延时保护</Title>
            <Space size={laptop ? "small" : "large"}>
              <Form.Item label="长延时电流整定值" name="a">
                <InputNumber
                  placeholder="0.4-1.0"
                  min={0.4}
                  max={1.0}
                  step={0.1}
                  style={itemsty}
                />
              </Form.Item>
              <Form.Item label="长延时时间整定值" name="b">
                <Select options={toptions} style={itemsty}></Select>
              </Form.Item>
              <Form.Item label="长延时曲线类型" name="c">
                <Select options={loptions} style={itemsty}></Select>
              </Form.Item>
            </Space>
            <Title level={5}>短延时保护</Title>
            <Space size={laptop ? "small" : "large"}>
              <Form.Item label="短延时电流整定值" name="d">
                <InputNumber
                  placeholder="1.5-15"
                  min={1.5}
                  max={15}
                  step={0.1}
                  style={itemsty}
                />
              </Form.Item>
              <Form.Item label="短延时时间整定值" name="e">
                <Select options={options3} style={itemsty}></Select>
              </Form.Item>
              <Form.Item label="短延时曲线类型" name="f">
                <Select options={options4} style={itemsty}></Select>
              </Form.Item>
            </Space>
            <Title level={5}>瞬动保护</Title>
            <Space size={laptop ? "small" : "large"}>
              <Form.Item label="瞬动电流整定值" name="g">
                <InputNumber
                  placeholder="1.5-15"
                  min={1.5}
                  max={15}
                  step={0.1}
                  style={itemsty}
                />
              </Form.Item>
              <Form.Item label="瞬时电流动作方式" name="h">
                <Input></Input>
              </Form.Item>
            </Space>
            <Title level={5}>接地保护</Title>
            <Space size={laptop ? "small" : "large"}>
              <Form.Item label="接地保护电流整定值" name="i">
                <InputNumber min={0} style={itemsty} />
              </Form.Item>
              <Form.Item label="接地保护电流曲线类型" name="j">
                <Select options={options4} style={itemsty}></Select>
              </Form.Item>
              <Form.Item label="接地保护电流动作时间" name="k">
                <Input></Input>
              </Form.Item>
            </Space>
            <Title level={5}>剩余电流保护</Title>
            <Space size={laptop ? "small" : "large"}>
              <Form.Item label="剩余电流保护阀值" name="l">
                <InputNumber min={0} style={itemsty} addonAfter="A" />
              </Form.Item>
              <Form.Item label="剩余电流保护延迟" name="m">
                <InputNumber min={0} style={itemsty} addonAfter="ms" />
              </Form.Item>
            </Space>
            <Title level={5}>欠压保护</Title>
            <Space size={laptop ? "small" : "large"}>
              <Form.Item label="欠电压动作阀值整定值" name="n">
                <InputNumber min={0} style={itemsty} addonAfter="A" />
              </Form.Item>
              <Form.Item label="欠电压动作延时时间整定值" name="o">
                <InputNumber min={0} style={itemsty} addonAfter="S" />
              </Form.Item>
              <Form.Item label="欠电压返回阀值整定值" name="p">
                <InputNumber min={0} style={itemsty} addonAfter="A" />
              </Form.Item>
              <Form.Item label="欠电压返回延时时间整定值" name="q">
                <InputNumber min={0} style={itemsty} addonAfter="A" />
              </Form.Item>
            </Space>
            <Title level={5}>过压保护</Title>
            <Space size={laptop ? "small" : "large"}>
              <Form.Item label="过电压动作阀值整定值" name="r">
                <InputNumber min={0} style={itemsty} addonAfter="A" />
              </Form.Item>
              <Form.Item label="过电压动作延时时间整定值" name="s">
                <InputNumber min={0} style={itemsty} addonAfter="S" />
              </Form.Item>
              <Form.Item label="过电压返回阀值整定值" name="t">
                <InputNumber min={0} style={itemsty} addonAfter="A" />
              </Form.Item>
              <Form.Item label="过电压返回延时时间整定值" name="u">
                <InputNumber min={0} style={itemsty} addonAfter="A" />
              </Form.Item>
            </Space>
          </Form>
          <div className="htitle">
            <span>遥控</span>
          </div>
          <div
            style={{ display: "flex", columnGap: "64px", alignItems: "center" }}
          >
            <div>
              当前状态：<span>合闸</span>
            </div>
            <Button
              type="primary"
              danger
              className="remote"
              onClick={onControl}
            >
              <img src={imgsrc["remote"]} width={32} height={32}></img>远程分闸
            </Button>
          </div>
        </div>
        <Custmodal
          title="远程控制"
          ref={modal}
          mold="cust"
          width="592px"
          onOk={onOk}
        >
          <Okt>
            {rState == 1 ? (
              <div className="ok">
                <img src={imgsrc["ok"]}></img>{" "}
                当前状态为合闸，确认要进线远程分闸操作？
              </div>
            ) : (
              <div className="pwd">
                <div>请输入安全码</div>
                <div className="ipt">
                  <Input></Input>
                </div>
              </div>
            )}
          </Okt>
        </Custmodal>
      </DDrawer>
    </Pagecount>
  );
}
