import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Usetable from '@com/useTable'
import CModal from "@com/useModal"
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
import { use } from "i18next";
const WrapDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const SetDiv = styled.div`
  width: 100%;
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
  { value: 3, label: "最近一个月" },
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
  IAnalyse: { Configure, CompareQuery, DeleteComparePlan, UpdateComparePlan },
} = Monitoring;

export default function Index() {
  const projectId = useSelector((state) => state.system.menus.projectId);
  const state = useReactive({
    items: Array(4)
      .fill(null)
      .map((index) => ({
        compareType: 0,
        state: 0,
        line: 0,
        lineValue: 0,
        deviation: 0,
        deviationValue: 0,
      })),
    snGroup: [],
    timeType: 1,
    projectId: projectId,
    groupName: ''
  });

  const [subTable, setSubTable] = useState([]);
  const [transferTitle, setTransferTitle] = useState({});
  const [unknownTable, setUnknownTable] = useState([]);
  //const [Sns, setSns] = useState([]);
  const [transTag, setTransTag] = useState(false);
  //const [timeType, setTimetype] = useState(1);
  const [tabledata, setTabledata] = useState([])
  const [title, settitle] = useState('新增对比分析')
  const ref = useRef()
  const wref = useRef()
  const [planId, setPlanId] = useState()
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const changePage = (page, pageSize) => {
    setPageInfo(page)
  }
  const openModal = () => {
    settitle('新增对比分析')
    ref.current.onOpen()
    state.groupName = `第${tabledata.length + 1}组`
    state.items.forEach((item, index) => {
      item.compareType = index + 1
    })
    console.log(state)
  }
  const onOk = async () => {
    console.log(state)
    if (state.snGroup.length == 0) return message.error('请选择对比设备')
    if (title == '新增对比分析') {
      const res = await Configure(state)
      if (res.success) {


        (state.items = Array(4)
          .fill(null)
          .map(() => ({
            state: 0,
            line: 0,
            lineValue: 0,
            deviation: 0,
            deviationValue: 0,
          }))),
          state.snGroup = []
        state.timeType = 1
        message.success('新增成功')
        ref.current.onCancel()
        GetSns()
      } else {
        message.error(res.errMsg)
      }
    } else {
      let params = { ...state, planId }
      const res = await UpdateComparePlan(params)
      if (res.success) {
        (state.items = Array(4)
          .fill(null)
          .map(() => ({
            state: 0,
            line: 0,
            lineValue: 0,
            deviation: 0,
            deviationValue: 0,
          }))),
          state.snGroup = []
        state.timeType = 1
        GetSns()
        message.success('修改成功')
        ref.current.onCancel()
      } else {
        message.error(res.errMsg)
      }
    }
  }
  const handleCancel = () => {
    (state.items = Array(4)
      .fill(null)
      .map(() => ({
        state: 0,
        line: 0,
        lineValue: 0,
        deviation: 0,
        deviationValue: 0,
      }))),
      state.snGroup = []
    state.timeType = 1
    setSubTable([])
    ref.current.onCancel()
  }
  const onSetDevices = async () => {
    setTransferTitle({
      subTitle: "选择需要对比的设备",
      unknownTitle: "未选中的设备",
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
    state.snGroup = snData;
    //setSns(snData);
    ref.current.onOpen()
  };
  const getCloseValue = (params) => {
    setTransTag(false);
    ref.current.onOpen()
  };
  // const selectDate = (v) => {
  //   setTimetype(v);
  // };

  const GetSns = async () => {
    const resp = await CompareQuery(projectId);
    if (resp.success) {
      if (resp.data) {
        const mergedData = resp.data.reduce((acc, curr) => {
          const existingIndex = acc.findIndex(item => item.planId === curr.planId);
          if (existingIndex !== -1) {
            acc[existingIndex].items = [...acc[existingIndex].items, ...curr.items];
            acc[existingIndex].snGroup = [...new Set([...acc[existingIndex].snGroup, ...curr.snGroup])];
          } else {
            acc.push(curr);
          }
          return acc;
        }, []);
        setPageInfo({ ...pageInfo, total: mergedData.length })
        console.log(mergedData, 189)
        setTabledata(mergedData)
        // let items = mergedData.items;
        // state.items.forEach((item, index) => {
        //   if (index + 1 == items[index]["compareType"]) {
        //     item.state = items[index]["state"] ? 1 : 0;
        //     item.line = items[index]["line"] ? 1 : 0;
        //     item.lineValue = items[index]["lineValue"];
        //     item.deviation = items[index]["deviation"] ? 1 : 0;
        //     item.deviationValue = items[index]["deviationValue"];
        //   }
        // });
        //setTimetype(resp.data.timeType);
        //state.snGroup = resp.data.snGroup;
        //setSns(resp.data.snGroup);
        // state.timeType = resp.data.timeType;
        // HistoryCompares(state.snGroup)
      }
      //  else {
      //   state.snGroup = [];
      //   state.timeType = 1;
      // }
    } else {
      message.error(resp.errMsg || "数据出错");
    }
  };
  // const save = async () => {
  //   if (Sns.length == 0) {
  //     message.error("请选择对比设备!");
  //     return;
  //   }

  //   const items = state.items.map((item, index) => {
  //     return {
  //       compareType: index + 1,
  //       state: item.state ? 1 : 0,
  //       line: item.line ? 1 : 0,
  //       lineValue: item.lineValue ? item.lineValue : 0,
  //       deviation: item.deviation ? 1 : 0,
  //       deviationValue: item.deviationValue ? item.deviationValue : 0,
  //     };
  //   });

  //   const params = {
  //     projectId,
  //     timeType,
  //     snGroup: Sns,
  //     items,
  //   };
  //   const resp = await Configure(params);
  //   if (resp.success) {
  //     // (state.items = Array(4)
  //     //   .fill(null)
  //     //   .map(() => ({
  //     //     state: false,
  //     //     line: false,
  //     //     lineValue: "",
  //     //     deviation: false,
  //     //     deviationValue: "",
  //     //   }))),
  //     //   setTimetype(1);
  //     // setSns([]);
  //     message.success("配置成功!");
  //     GetSns();
  //   } else {
  //     message.error(resp.errMsg);
  //   }
  // };
  const unit = ["kWh", "W", "A", "V"]
  const SetLine = titleList.map((item, index) => {
    return (
      <SetDiv>
        <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
        <div className="line">
          <Checkbox
            checked={state.items[index]["state"]}
            onChange={(e) => {
              state.items[index]["state"] = e.target.checked ? 1 : 0;
              if (!e.target.checked) {
                state.items[index] = {
                  state: 0,
                  line: 0,
                  lineValue: 0,
                  deviation: 0,
                  deviationValue: 0,
                };
              }
            }}
          >
            {item}
          </Checkbox>
          {state.items[index]["state"] ? (
            <>
              <Space size={45}>
                <Checkbox
                  checked={state.items[index]["line"]}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      state.items[index]["lineValue"] = 0;
                    }
                    state.items[index]["line"] = e.target.checked ? 1 : 0;
                  }}
                >
                  基准线
                </Checkbox>
                <Input
                  type="number"
                  addonAfter={unit[index]}
                  style={styobj}
                  value={state.items[index]["lineValue"]}
                  onChange={(e) => {
                    if (state.items[index]["line"]) {
                      state.items[index]["lineValue"] = e.target.value;
                    } else {
                      message.warning("请先勾选基准线");
                    }
                  }}
                />
              </Space>
              <Space size={20}>
                <Checkbox
                  checked={state.items[index]["deviation"]}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      state.items[index]["deviationValue"] = 0;
                    }
                    state.items[index]["deviation"] = e.target.checked ? 1 : 0;
                  }}
                >
                  偏差告警≥
                </Checkbox>
                <Input
                  type="number"
                  addonAfter="%"
                  style={styobj}
                  value={state.items[index]["deviationValue"]}
                  onChange={(e) => {
                    if (state.items[index]["deviation"]) {
                      state.items[index]["deviationValue"] = e.target.value;
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
  const columnsList = [
    {
      title: '',
      render: (_, record, index) => (
        <Space size="middle">
          {index + 1}
        </Space>
      ),
      key: 'index',
      align: 'center'
    },
    {
      title: '组合名称',
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' ghost onClick={() => editPlan(record)}>编辑</Button>
          <Button type='danger' ghost onClick={() => deletePlan(record)}>删除</Button>
        </Space>
      ),
    },
  ]

  const deletePlan = (record) => {
    console.log(record)
    setPlanId(record.planId)
    wref.current.onOpen()
  }
  const onDelOK = async () => {
    const res = await DeleteComparePlan(projectId, planId)
    if (res.success) {
      message.success("删除成功")
      wref.current.onCancel()
      GetSns()
    } else {
      message.error(res.errMsg)
    }
  }
  const editPlan = (record) => {
    console.log(record)
    setPlanId(record.planId)
    ref.current.onOpen()
    settitle("编辑对比分析")
    state.items = record.items
    state.groupName = record.groupName
    state.snGroup = record.snGroup
    state.timeType = record.timeType
    console.log(state)
  }
  return (
    <Titlelayout title="智能分析配置">
      <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
      <WrapDiv>
        <Space>
          {/* onSetDevices选择设备 */}
          <Button type="primary" onClick={openModal}>
            新增对比组合
          </Button>
        </Space>
      </WrapDiv>
      <WrapDiv>
        {" "}
        <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
      </WrapDiv>
      <WrapDiv style={{ justifyContent: "end" }}>
        <Usetable
          columns={columnsList}
          dataSource={tabledata}
          pagination={pageInfo}
          onChange={changePage}
        />
      </WrapDiv>
      <CModal title={title} ref={ref} mold="cust" onOk={onOk} onCancel={handleCancel} width={780}>
        <div style={{ width: "100%", display: "flex", alignItems: "center", marginBottom: "16px", flexDirection: "row" }}>
          <span style={{ marginRight: "11px" }}>对比组合名称</span>
          <Input
            style={{ width: "621px" }}
            value={state.groupName}
            onChange={(e) => {
              state.groupName = e.target.value;
            }}
          />
        </div>
        <div>
          <div style={{ width: '100%', display: "flex", alignItems: "center", marginBottom: "16px", flexDirection: "row", justifyContent: 'space-between' }}>
            <div>
              <span style={{ marginRight: "11px" }}>选择对比设备</span>
              <Button type="primary" ghost style={{ width: '200px' }} onClick={() => {
                setTransTag(true); ref.current.onCancel(); onSetDevices()
              }}>请选择要对比的设备</Button>
            </div>
            <div>
              <span style={{ marginRight: "11px" }}>选择对比周期</span>
              <Select
                style={{ width: "160px" }} options={options}
                value={state.timeType}
                onChange={(e) => {
                  state.timeType = e;
                }}
              >
              </Select>
            </div>
          </div>
        </div>
        {SetLine}
      </CModal>
      <CModal title="删除提示" onOk={onDelOK} mold="cust" type="warn" ref={wref}>
        是否要删除该对比组合？
      </CModal>
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
