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
 import { DiskChart } from "@api/api.js";
import Titlelayout from "@com/titlelayout";
import Custmodal from "@com/useModal";
import imgsrc from "./imgs";
import Ichart from "@com/useEcharts/Ichart";

import Usetable from "@com/useTable";
import GouIcon from "@imgs/gou.png";
import temp from "./imgs/temp.png";
import Info from "./info";
import Electric from "./electric";
import RomoteRegulatin from './romoteRegulating' // 遥调 框架断路器  NA8-2500-2500H
import RomoteRegulatinB from './romoteRegulatingb'
import {
  Okt,
  Extrea,
  Mainbox, 
  DDrawer,
  Dot,
  CDrawer,
  
} from './comstyle'
 
const { Link, Text, Title } = Typography;
const { Item } = Descriptions;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

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
const {QueryDeviceDataAll} =DiskChart
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
  
  
  const [deviceData, setDeviceData] = useState([])
 
  const [deviceInfo, setDeviceInfo] =useState({
    deviceName: "",
    breakerType: 1, // 1: 框架断路器 2：塑壳断路器
  })
  
  const onCopen = () => {
    setCopen(true);
  };
  const queryDeviceDataAll =async ({deviceName, devSn="NTCJ00122401", breakerType}) => {
      try {
       const {success, data, message} = await QueryDeviceDataAll(devSn)
       if(success && Array.isArray(data)) {
          setDeviceInfo({
            deviceName,
            breakerType
          })
          setDeviceData(data)
          onCopen()
         
       }else {
          !success && i18warning(message)
       }
       
      } catch (error) {
         console.log(error)
      }
  }
 

  const onOpen = () => {
    setOpen(true);
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
            <div className="detail" onClick={()=>queryDeviceDataAll({name:"框架断路器  NA8-2500-2500H", type: 1})}>
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
          <div className="values first" onClick={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", type: 2})}>
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
            <div className="textname">馈线1</div>
            <div className="guiti"></div>
          </div>
          <div className="guizhi second" onClick={onCopen}>
            <div className="textname">馈线2</div>
            <div className="guiti"></div>
          </div>
          <div className="guizhi thirdly" onClick={onCopen}>
            <div className="textname">馈线3</div>
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
            <div className="text">{deviceInfo?.deviceName}</div>
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
          <Electric datas={deviceData} onClick={onelchart} />
          {deviceInfo?.breakerType === 1 ? <RomoteRegulatin laptop={laptop} /> : deviceInfo?.breakerType === 2 ? <RomoteRegulatinB laptop={laptop} /> : null} 
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
