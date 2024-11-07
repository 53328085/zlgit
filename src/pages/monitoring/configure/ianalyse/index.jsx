import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Titlelayout from "@com/titlelayout";
import {
  Input,
  Space,
  Radio,
  Divider,
  Button,
  Select,
  Checkbox,
  message,
} from "antd";
import styled from "styled-components";
import { useReactive } from "ahooks";
import UseTransfer from "./transfer.js";
import Mask from "@com/mask.jsx";
import { Monitoring } from "@api/api.js";
import { CustButton } from "@com/useButton";
const WrapDiv = styled.div`
  width: 740px;
  display: flex;
  justify-content: space-between;
`;
const SetDiv = styled.div`
  width: 740px;
  .line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 32px;
  }
`;
const options = [
  { value: 1, label: "当天" },
  { value: 2, label: "最近7天" },
  { value: 3, label: "最近30天" },
];
const styobj = { width: 140 };
const titleList = ["电量对比", "功率对比", "电流对比", "电压对比"];
const columns = [
  {
    align: "center",
    title: "设备编号",
    dataIndex: "sn",
    key: "sn",
  },
  {
    align: "center",
    title: "设备名称",
    dataIndex: "name",
    key: "name",
  },
  {
    align: "center",
    title: "安装地址",
    dataIndex: "address",
    key: "address",
  },
];
const {
  ComparativeAnalysis: { QueryCompareDevice, HistoryCompare },
  IAnalyse: { Configure, CompareQuery },
} = Monitoring;

export default function Index() {
  const state = useReactive({
    lines: Array(4)
      .fill(null)
      .map(() => ({
        checkedName: false,
        checkBaseLine: false,
        baseLineVal: "",
        checkWarnVal: false,
        warnVal: "",
      })),
    devices: [],
    snGroup: [],
    timeType: 1,
  });
  const projectId = useSelector((state) => state.system.menus.projectId);
  const [subTable, setSubTable] = useState([]);
  const [transferTitle, setTransferTitle] = useState({});
  const [unknownTable, setUnknownTable] = useState([]);
  const [Sns, setSns] = useState([]);
  const [transTag, setTransTag] = useState(false);
  const [timeType, setTimetype] = useState(1);

  const onSetDevices = async () => {
    setTransferTitle({
      subTitle: "选择需要对比的设备",
      unknownTitle: "所有设备",
    });
    const resp = await QueryCompareDevice(projectId, 0, "");
    console.log("执行啦");
    if (resp.success && Array.isArray(resp.data)) {
      if (state.snGroup.length > 0) {
        const subData = resp.data.filter((item) =>
          state.snGroup.includes(item.sn)
        );
        const unknownTable = resp.data.filter(
          (item) => !state.snGroup.includes(item.sn)
        );
        setSubTable(subData);
        setUnknownTable(unknownTable);
      } else {
        setUnknownTable(resp.data || []);
      }
    } else {
      message.error(resp.errMsg);
    }
    setTransTag(true);
  };
  const getSaveValue = (values) => {
    let snData = [];
    console.log(values);

    values.subData.map((item) => {
      snData.push(item.sn);
    });
    setSns(snData);
  };
  const getCloseValue = (params) => {
    setTransTag(false);
  };
  const selectDate = (v) => {
    setTimetype(v);
  };
  const GetSns = async () => {
    const resp = await CompareQuery(projectId);
    if (resp.success) {
      if (resp.data) {
        let items = resp.data.items;
        state.lines.forEach((item, index) => {
          if (index + 1 == items[index]["compareType"]) {
            item.checkedName = items[index]["state"] ? true : false;
            item.checkBaseLine = items[index]["line"] ? true : false;
            item.baseLineVal = items[index]["lineValue"];
            item.checkWarnVal = items[index]["deviation"] ? true : false;
            item.warnVal = items[index]["deviationValue"];
          }
        });
        setTimetype(resp.data.timeType);
        // state.devices = resp.data.items;
        state.snGroup = resp.data.snGroup;
        setSns(resp.data.snGroup);
        // state.timeType = resp.data.timeType;
        // HistoryCompares(state.snGroup)
      } else {
        state.devices = [];
        state.snGroup = [];
        state.timeType = 1;
      }
    } else {
      message.error("获取设备信息失败!");
    }
  };
  const save = async () => {
    if (Sns.length == 0) {
      message.error("请选择对比设备!");
      return;
    }

    const items = state.lines.map((item, index) => {
      return {
        compareType: index + 1,
        state: item.checkedName ? 1 : 0,
        line: item.checkBaseLine ? 1 : 0,
        lineValue: item.baseLineVal ? item.baseLineVal : 0,
        deviation: item.checkWarnVal ? 1 : 0,
        deviationValue: item.warnVal ? item.warnVal : 0,
      };
    });

    const params = {
      projectId,
      timeType,
      snGroup: Sns,
      items,
    };
    const resp = await Configure(params);
    if (resp.success) {
      // (state.lines = Array(4)
      //   .fill(null)
      //   .map(() => ({
      //     checkedName: false,
      //     checkBaseLine: false,
      //     baseLineVal: "",
      //     checkWarnVal: false,
      //     warnVal: "",
      //   }))),
      //   setTimetype(1);
      // setSns([]);
      message.success("配置成功!");
      GetSns();
    } else {
      message.error(resp.errMsg);
    }
  };
  const unit=["kWh","W","A","V"]
  const SetLine = titleList.map((item, index) => {
    return (
      <SetDiv>
        <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
        <div className="line">
          <Checkbox
            checked={state.lines[index]["checkedName"]}
            onChange={(e) => {
              state.lines[index]["checkedName"] = e.target.checked;
              if (!e.target.checked) {
                state.lines[index] = {
                  checkedName: false,
                  checkBaseLine: false,
                  baseLineVal: "",
                  checkWarnVal: false,
                  warnVal: "",
                };
              }
            }}
          >
            {item}
          </Checkbox>
          {state.lines[index]["checkedName"] ? (
            <>
              <Space size={45}>
                <Checkbox
                  checked={state.lines[index]["checkBaseLine"]}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      state.lines[index]["baseLineVal"] = "";
                    }
                    state.lines[index]["checkBaseLine"] = e.target.checked;
                  }}
                >
                  基准线
                </Checkbox>
                <Input
                  type="number"
                  addonAfter={unit[index]}
                  style={styobj}
                  value={state.lines[index]["baseLineVal"]}
                  onChange={(e) => {
                    if (state.lines[index]["checkBaseLine"]) {
                      state.lines[index]["baseLineVal"] = e.target.value;
                    } else {
                      message.warning("请先勾选基准线");
                    }
                  }}
                />
              </Space>
              <Space size={20}>
                <Checkbox
                  checked={state.lines[index]["checkWarnVal"]}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      state.lines[index]["warnVal"] = "";
                    }
                    state.lines[index]["checkWarnVal"] = e.target.checked;
                  }}
                >
                  偏差告警≥
                </Checkbox>
                <Input
                  type="number"
                  addonAfter="%"
                  style={styobj}
                  value={state.lines[index]["warnVal"]}
                  onChange={(e) => {
                    if (state.lines[index]["checkWarnVal"]) {
                      state.lines[index]["warnVal"] = e.target.value;
                    } else {
                      message.warning("请先勾偏差告警!");
                    }
                  }}
                />
              </Space>
            </>
          ) : null}
        </div>
      </SetDiv>
    );
  });
  useEffect(() => {
    GetSns();
  }, []);
  return (
    <Titlelayout title="智能分析配置">
      <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
      <WrapDiv>
        <Space>
          <span>选择对比设备</span>
          <Button type="primary" onClick={onSetDevices}>
            请选择要对比的设备
          </Button>
        </Space>
        <Space>
          <span>选择对比周期</span>
          <Select
            options={options}
            style={{ width: 160 }}
            onChange={selectDate}
            value={timeType}
          ></Select>
        </Space>
      </WrapDiv>
      {SetLine}
      <WrapDiv>
        {" "}
        <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
      </WrapDiv>
      <WrapDiv style={{ justifyContent: "end" }}>
        <CustButton onClick={save}>保存</CustButton>
      </WrapDiv>
      <Mask task={transTag}>
        <UseTransfer
          transferTitle={transferTitle}
          columns={columns}
          subTable={subTable}
          unknownTable={unknownTable}
          saveValue={getSaveValue}
          closeValue={getCloseValue}
        ></UseTransfer>
      </Mask>
    </Titlelayout>
  );
}
