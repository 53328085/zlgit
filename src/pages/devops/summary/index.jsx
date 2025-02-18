import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Titlelayout from "@com/titlelayout";
import styled, { css } from "styled-components";
import Pagecount from "@com/pagecontent";
import { useOutletContext } from "react-router-dom";
import { message, Modal, Button } from "antd";
import Mapcom from "@com/useMapAlarm";
import BlueColumn from "@com/bluecolumn";
import first from "./imgs/first.png";
import second from "./imgs/second.png";
import third from "./imgs/third.png";
import total from "./imgs/total.png";
import { operation } from "@api/api";
import UserTable from "@com/useTable";
import Ichart from "@com/useEcharts/Ichart";
import Bluecolumn from "@com/bluecolumn";
import { themeColor, adaptation } from "@redux/systemconfig.js";
const sty = css`
  grid-template-columns: 680px 1fr;
  column-gap: 8px;
  .right {
    gap: 8px;
  }
  .content {
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    row-gap: 4px;

    .cl {
      padding-left: 0px;
      font-size: 14px;
      line-height: 1.5;
      justify-self: center;
    }
    .list {
      font-size: 12px;
      div {
        .value {
          font-size: 12px;
        }
      }
    }
  }
`;
const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-columns: 880px 1fr;
  column-gap: 16px;
  justify-content: flex-end;
  flex: 1;
  .left {
    display: grid;
    grid-template-rows: 60px 1fr;
    .title {
    }
    .map {
    }
    overflow: hidden;
    border: 1px solid #d7d7d7;
  }
  .rigth {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 160px 320px 1fr;
    gap: 16px;
    .mc {
      grid-area: 2 / 1 / 3 /4;
      display: grid;
      grid-template-rows: 20px 270px;
      .chart {
        flex:1;
      //  display: grid;
      //  grid-template-columns: 742px;
       // grid-template-rows: minmax(270px, auto);
       // justify-content: space-between;
      }
    }
    .down {
      grid-area: 3 / 1 / 4 /4;
      display: grid;
      grid-template-rows: 20px 1fr;
      .chart {
        flex: 1;
        display: flex;
      }
    }
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    .cl {
      display: flex;
      align-items: center;
      padding-left: 20px;
      color: #515151;
      font-size: 24px;
      font-weight: bold;
    }
  }
  .list {
    display: grid;
    grid-auto-rows: 26px;
    align-items: flex-start;
    align-content: flex-end;
    div {
      display: flex;
      justify-content: space-between;
      .value {
        font-size: 18px;
      }
      &:nth-of-type(1) span:first-child {
        color: ${(props) => props.theme.errorColor};
      }
      &:nth-of-type(2) span:first-child {
        color: ${(props) => props.theme.warningColor};
      }
      &:nth-of-type(3) span:first-child {
        color: ${(props) => props.theme.successColor};
      }
    }
  }
  ${(props) => (props.laptop ? sty : null)}
`;

export default function Index() {
  let { exparams } = useOutletContext();

  let { areaId, projectId } = exparams;
  const { laptop } = useSelector(adaptation);
  const { errorColor } = useSelector(themeColor);
  const condition = Number.isInteger(areaId) && Number.isInteger(projectId);
  let params = {
    projectId,
    areaId,
  };

  const [warn, setWarn] = useState(); //当前告警
  const [allwarn, setAllwarn] = useState(); //本月告警
  const [order, setOrder] = useState(); //工单
  const [task, setTask] = useState(); //巡检任务
  const [datasetMonth, setDatasetMonth] = useState(); //派单

  const [datasetMonthl, setDatasetMonthl] = useState(); //告警事件
  const [alarmPosition, setAlarmPosition] = useState(null);

  const imgcss = {
    width: 32,
    height: 32,
  };
  const grid = {
    // 图表 grid
    left: "0px",
    right: "0",
    top: "50px",
    bottom: "0px",
    containLabel: true,
  };

  //获取当前告警
  const getAlarmCurrent = async () => {
    try {
      const {
        data: { all, one, two, three, alarmPosition },
        errMsg,
        success,
      } = await operation.AlarmCurrent(params);
      if (success) {
        setWarn({ all, one, two, three });
        const alarmlist = alarmPosition.map((message) => {
          return {
            ...message,
            lnglat: message.lngLat,
            text: `<div style="
            border-radius:2px;
            padding:12px;
            display:grid;
            grid-template-rows:repeat(5,1fr);
            ">
            <p style="
              display:flex;
              justify-content:space-between;
              font-size:12px;
              white-space:nowrap;
              margin:0px;
              margin-bottom:12px;
            ">
            <span>告警坐标</span>
            <span style="margin-left:24px">${message?.lngLat}</span>
        </p>
        <p style="
        display:flex;
        justify-content:space-between;
        font-size:12px;
        white-space:nowrap;
        margin:0px;
        margin-bottom:12px;
      ">
            <span>设备编号</span>
            <span style="margin-left:24px">${message?.sn}</span>
        </p>
        <p style="
        display:flex;
        justify-content:space-between;
        font-size:12px;
        white-space:nowrap;
        margin:0px;
        margin-bottom:12px;
      ">
            <span>设备类型</span>
            <span style="margin-left:24px">${message?.category}</span>
        </p>
        <p style="
        display:flex;
        justify-content:space-between;
        font-size:12px;
        white-space:nowrap;
        margin:0px;
        margin-bottom:12px;
      ">
            <span>告警等级</span>
            <span style="margin-left:24px">${message?.level}级</span>
        </p>
        <p style="
        display:flex;
        justify-content:space-between;
        font-size:12px;
        white-space:nowrap;
        margin:0px;
        margin-bottom:12px;
      ">
            <span>告警详情</span>
            <span style="margin-left:24px">${message?.content}</span>
        </p>
        <p style="
        display:flex;
        justify-content:space-between;
        font-size:12px;
        white-space:nowrap;
        margin:0px;
        margin-bottom:12px;
      ">
            <span>告警地址</span>
            <span style="margin-left:24px">${message.address}</span>
        </p>
            </div>`,
          };
        });

        setAlarmPosition(alarmlist);
      } else {
        message.error(errMsg);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //获取当月告警
  const getAlarmMonth = async () => {
    try {
      const {
        data: { all, one, two, three, alarmPosition },
        errMsg,
        success,
      } = await operation.AlarmMonth(params);
      if (success) {
        setAllwarn({ all, one, two, three });
      } else {
        message.error(errMsg);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //获取本月工单
  const getMonthOrderStatistics = async () => {
    try {
      const {
        data: { all, wait, process, finish },
        errMsg,
        success,
      } = await operation.MonthOrderStatistics(params);
      if (success) {
        setOrder({ all, wait, process, finish });
      } else {
        message.error(errMsg);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //获取巡检任务
  const getInspectionStatistics = async () => {
    try {
      if (!condition) return;
      const {
        data: { all, wait, process, finish },
        errMsg,
        success,
      } = await operation.InspectionStatistics(params);
      if (success) {
        setTask({ all, wait, process, finish });
      } else {
        message.error(errMsg);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //获取本月派单

  const boption = {
    dataset: datasetMonth,
    series: [{ type: "bar" }, { type: "bar" }],
    grid,
    legend: {
      icon: "rect",
      itemHeight: 8,
      itemWidth: 8,
      itemGap: 20,
      padding: [15, 0, 0, 0],
    },
  };
  const getMonthOrderTrend = async () => {
    const res = await operation.MonthOrderTrend(params);
    if (res.success) {
      const { all, finish } = res.data || {};

      let data = all.map((item, index) => {
        return {
          x: item.x,
          派单数: item.y,
          完成: finish[index].y,
        };
      });
      setDatasetMonth({
        dimensions: ["x", "派单数", "完成"],
        source: [...data],
      });
    } else {
      message.error(res.errMsg);
    }
  };
  //本月告警

  const loption = {
    dataset: datasetMonthl,
    series: [{ type: "line" }, { type: "line" }],
    grid: {
      top: "20px",
      left: 0,
      right: 0,
      bottom: "30px",
      containLabel: true,
    },
    legend: {
      top: "auto",
      bottom: 0,
      icon: "rect",
      itemHeight: 2,
      itemWidth: 12,
      itemGap: 20,
    },
  };
  const getMonthAlarmTrend = async () => {
    const res = await operation.MonthAlarmTrend(params);
    if (res.success) {
      const { currentMonth = [], lastMonth = [] } = res.data || {};
      let arr = [];
      let arr1 = [];
      let curmonth = "本月";
      let data;
      if (currentMonth.length - lastMonth.length > 0) {
        curmonth = "本月";
        arr = [...currentMonth];
        arr1 = [...lastMonth];
      } else {
        curmonth = "上月";
        arr = [...lastMonth];
        arr1 = [...currentMonth];
      }
      if (curmonth === "本月") {
        data = arr.map((item, index) => {
          return {
            x: item.x,
            本月: item.y,
            上月: arr1[index]?.y,
          };
        });
      } else {
        data = arr.map((item, index) => {
          return {
            x: item.x,
            本月: arr1[index]?.y,
            上月: item.y,
          };
        });
      }

      setDatasetMonthl({
        dimensions: ["x", "本月", "上月"],
        source: [...data],
      });
    } else {
      message.error(res.errMsg);
    }
  };

  const [openAlarm, setOpenAlarm] = useState(false); //分闸弹窗显示
  const tableRef = useRef();
  const columns = [
    {
      title: "最新告警时间",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "设备编号",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "设备型号",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "告警详情",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "设备地址",
      dataIndex: "address",
      key: "address",
    },
  ];
  const [alarmData, setAlarmData] = useState([]); //当前告警
  const getAlarmPage = () => {
    if (!condition) return;
    params.current = {
      projectId,
      areaId,
    };
    return operation.AlarmPage(params.current).then((res) => {
      let { success, data, total } = res;
      let f = Array.isArray(data);
      if (success) {
        let alarmDataInfo = data.filter((item) => item.status === 1);
        if (alarmDataInfo.length < 1) return;
        setAlarmData(alarmDataInfo);
        setOpenAlarm(true);
        console.log(alarmDataInfo, f, alarmData);
      } else {
        message.error(res.errMsg || "数据出错");
        setAlarmData([]);
      }
    });
  };

  const onOk = async () => {
    setOpenAlarm(false);
  };
  useEffect(() => {
    if (condition) {
      getAlarmPage();
      getAlarmCurrent();
      getAlarmMonth();
      getMonthOrderStatistics();
      getInspectionStatistics();
      getMonthOrderTrend();
      getMonthAlarmTrend();
    }
  }, [areaId, projectId]);

  const pv = {};
  return (
    <Pagecount bgcolor="#eeeff3" pd={0}>
      <Mainbox laptop={laptop}>
        <Modal
          mold="cust"
          title={<Bluecolumn name="告警信息" bac={errorColor} />}
          closable={false}
          open={openAlarm}
          footer={[
            <Button
              key="submit"
              style={{
                backgroundColor: errorColor,
                border: "none",
                color: "#fff",
                width: 96,
                height: 32,
              }}
              onClick={onOk}
            >
              确定
            </Button>,
          ]}
          width={980}
        >
          <UserTable
            columns={columns}
            dataSource={alarmData}
            rowKey="id"
            scroll={{ y: 320 }}
          />
        </Modal>
        <div className="left">
          <div
            style={{
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              background: "#fff",
            }}
          >
            <BlueColumn name="当前告警" />
            <div
              style={{
                marginLeft: "auto",
                padding: "0 8px",
                width: 600,
                height: 42,
                border: "1px solid #d7d7d7",
                borderRadius: 21,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <img src={total} alt="" style={imgcss} />
              <span>告警总数</span>
              <span style={{ fontWeight: "bold" }}>{warn?.all}</span>
              <img src={first} alt="" style={imgcss} />
              <span>一级告警</span>
              <span style={{ fontWeight: "bold" }}>{warn?.one}</span>
              <img src={second} alt="" style={imgcss} />
              <span>二级告警</span>
              <span style={{ fontWeight: "bold" }}>{warn?.two}</span>
              <img src={third} alt="" style={imgcss} />
              <span>三级告警</span>
              <span style={{ fontWeight: "bold" }}>{warn?.three}</span>
            </div>
          </div>
          {/* {alarmPosition&&alarmPosition.length>0?<Mapcom lngLat = {alarmPosition} isck={true}></Mapcom>:<EmptyMap></EmptyMap>} */}
          {alarmPosition && alarmPosition.length > 0 ? (
            <Mapcom
              lngLat={alarmPosition}
              isck={true}
              key={1}
              infoconfig={{ minWidth: 350 }}
            ></Mapcom>
          ) : (
            <Mapcom key={2} isck={true} />
          )}
        </div>

        <div className="rigth">
          <Titlelayout
            title="本月所有告警"
            pl="0px"
            bl="none"
         //   hv="20px"
            pv={laptop ? "2px" : "16px"}
          >
            <div className="content">
              <div className="cl">{allwarn?.all}</div>
              <div className="list">
                <div>
                  <span>一级告警</span>
                  <span className="value">{allwarn?.one}</span>
                </div>
                <div>
                  <span>二级告警</span>
                  <span className="value">{allwarn?.two}</span>
                </div>
                <div>
                  <span>三级告警</span>
                  <span className="value">{allwarn?.three}</span>
                </div>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout
            title="本月所有工单"
            pl="0px"
            bl="none"
         //   hv="20px"
            pv={laptop ? "2px" : "16px"}
          >
            <div className="content">
              <div className="cl">{order?.all}</div>
              <div className="list">
                <div>
                  <span>待处理</span>
                  <span className="value">{order?.wait}</span>
                </div>
                <div>
                  <span>处理中</span>
                  <span className="value">{order?.process}</span>
                </div>
                <div>
                  <span>已完成</span>
                  <span className="value">{order?.finish}</span>
                </div>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout
            title="巡检任务"
            pl="0px"
            bl="none"
         //   hv="20px"
            pv={laptop ? "2px" : "16px"}
          >
            <div className="content">
              <div className="cl">{task?.all}</div>
              <div className="list">
                <div>
                  <span>待处理</span>
                  <span className="value">{task?.wait}</span>
                </div>
                <div>
                  <span>处理中</span>
                  <span className="value">{task?.process}</span>
                </div>
                <div>
                  <span>已完成</span>
                  <span className="value">{task?.finish}</span>
                </div>
              </div>
            </div>
          </Titlelayout>

          <Titlelayout
            className="mc"
            title="本月派单情况"
            pl="0px"
            bl="none"
       //     hv="20px"
            layout="flex"
          >
            <div className="chart">
              <Ichart {...boption} tip="本月派单情况" />
            </div>
          </Titlelayout>

          <Titlelayout
            className="down"
            title="本月告警事件"
            pl="0px"
            bl="none"
       //     hv="20px"
            layout="flex"
          >
            <div className="chart">
              <Ichart {...loption} tip="本月告警事件" />
            </div>
          </Titlelayout>
        </div>
      </Mainbox>
    </Pagecount>
  );
}
