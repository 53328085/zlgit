import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Space, Radio, Divider } from "antd";
import moment from "moment";
import styled from "styled-components";
import { Monitoring } from "@api/api.js";
import { useSelector } from "react-redux";
import { useReactive } from "ahooks";
import Icharts from "@com/useEcharts/Ichart.js";
import Cempty from '@com/useEmpty'
import { CustButton } from "@com/useButton"
import Modal from "@com/useModal"
import Table from "@com/useTable"
import warn from "./warn.png"
const BtnWrap = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    width: 113px;
    text-align: center;
  }
`;
const Charts = styled.div`
  height: 400px;
  display: flex;
`;
const {
  IAnalyse: { CompareQuery, HistoryCompare },
} = Monitoring;
const option = {
  legend: {
    top: '3%',
    left: "2%"
  },
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
  },
  tooltip: {
    show: true, // 是否显示提示框组件，默认为true  
    trigger: 'axis' // 触发类型，'item'表示数据项图形触发，'axis'表示坐标轴触发  
  },
  dataZoom: [
    {
      type: 'inside', // 内置缩放  
      xAxisIndex: 0, // 指定x轴索引  
      start: 0, // 起始位置（可以根据需要调整）  
      end: 100 // 结束位置（可以根据需要调整）  
    }
  ],
  grid: {
    top: "10%",
    left: "5%",
  },
  series: [

  ],
};
let markLine = {
  symbol: ['none', 'none'], // 去掉箭头
  label: {
    show: true,
    position: 'insideMiddle',
    formatter: '{c}'
  },
  data: [
    {
      name: '阈值',

    }
  ],
  lineStyle: {
    color: '#f00'
  }
}
const columns = [{
  title: '时间',
  dataIndex: 'time',
  key: 'time',
},
{
  title: '最大测点',
  dataIndex: 'maxSNPointValue',
  key: 'maxSNPointValue',
},
{
  title: '最小测点',
  dataIndex: 'minSNPointValue',
  key: 'minSNPointValue',
},
{
  title: '实际偏差',
  dataIndex: 'curDeviation',
  key: 'curDeviation',
}, {
  title: "偏差告警",
  dataIndex: "setDeviation",
  key: "setDeviation"
}]
export default function index() {
  const projectId = useSelector((state) => state.system.menus.projectId);
  const { RangePicker } = DatePicker;
  const currentDate = moment();
  const oneWeekAgo = moment().subtract(1, "weeks");
  const dateFormat = "YYYY-MM-DD";
  const ModalRef = useRef(null)
  const [indexBtn, setIndexBtn] = useState(0)
  const [radioVal, setRadioVal] = useState("1");
  const [dates, setDates] = useState([
    moment(oneWeekAgo, dateFormat),
    moment(currentDate, dateFormat),
  ]);
  const state = useReactive({
    devices: [],
    snGroup: [],
    timeType: 1,
    chartsOpts: {
      type: 5,
      ...option,
    },
    alltableData: [],
    detailtableData:[],
    tableData: [],
    current: 1,
    pageSize: 10,
    disabled: false,
    groupName: ''
  });
  const [params, setParams] = useState([])
  const changeBtn = (e, index) => {
    //setRadioVal(e.target.value);
    params[index].type = e.target.value
    setParams(params)
    HistoryCompares()
  };
  const changeDate = (dates, dateStrings, index) => {
    console.log(dates, dateStrings, index)
    console.log(params)
    params[index].start = dateStrings[0]
    params[index].end = dateStrings[1]
    setParams(params)
    setDates(dateStrings);
    HistoryCompares()
  };
  console.log(state.disabled)
  const [dataList, setDataList] = useState([])
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
        setDataList(mergedData)
        console.log(mergedData)

        let list = []
        mergedData.map(item => {
          let param = {
            projectId, type: 1, groupName: '', sNs: [], start: dates[0].format('YYYY-MM-DD'), end: dates[1].format('YYYY-MM-DD')
          }
          param.groupName = item.groupName
          param.sNs = item.snGroup
          list.push(param)
        })
        console.log(list)
        setParams(list)
        HistoryCompares()
        // state.devices = mergedData[0].items;
        // state.snGroup = mergedData[0].snGroup;
        // state.timeType = mergedData[0].timeType
        // state.groupName = mergedData[0].groupName
        // state.disabled = false
        // HistoryCompares(state.snGroup)
      } else {
        setDataList([])
        // state.devices = [];
        // state.snGroup = [];
        // state.timeType = 1
        // state.disabled = true
      }
    } else {
      state.disabled = true
      message.error("获取设备信息失败!");
    }
  };
  const getMaxArr = (matrix) => {
    if (matrix.length === 0 || matrix[0].length === 0) {
      return []; // 如果矩阵为空，返回空数组  
    }

    const rowCount = matrix.length;
    const colCount = matrix[0].length;
    const maxValues = new Array(colCount).fill(Number.NEGATIVE_INFINITY); // 初始化辅助数组  
    // const maxValSn = new Array(colCount).fill(Number.NEGATIVE_INFINITY);
    // 遍历二维数组  
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        if (matrix[i][j] > maxValues[j]) {
          maxValues[j] = matrix[i][j]; // 更新最大值 
          // maxValSn[j] =  matrix[i][colCount+1]
        }
      }
    }
    // console.log(maxValSn)
    return maxValues;
  }
  const getMinArr = (matrix) => {
    if (matrix.length === 0 || matrix[0].length === 0) {
      return []; // 如果矩阵为空，返回空数组  
    }

    const rowCount = matrix.length;
    const colCount = matrix[0].length;
    const minValues = new Array(colCount).fill(Number.POSITIVE_INFINITY); // 初始化辅助数组为正无穷大  
    // const minValSn = new Array(colCount).fill(Number.POSITIVE_INFINITY);
    console.log(matrix, colCount)
    // 遍历二维数组  
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        if (matrix[i][j] < minValues[j]) {
          minValues[j] = matrix[i][j]; // 更新最小值 
          // minValSn[j] =  matrix[i][colCount+1]

        }
      }
    }
    // console.log(minValSn)
    return minValues;
  }
  const getTime = () => {

    if (state.timeType == 1) {
      let date = moment().format('YYYY-MM-DD ')
      return { start: date + "00:00:00", end: date + "23:59:59" }
    } else if (state.timeType == 2) {
      let date = moment().subtract(7, 'days').format('YYYY-MM-DD ')
      return { start: date + "00:00:00", end: moment().format('YYYY-MM-DD ') + "23:59:59" }
    } else if (state.timeType == 3) {
      let date = moment().subtract(31, 'days').format('YYYY-MM-DD ');
      return { start: date + "00:00:00", end: moment().format('YYYY-MM-DD ') + "23:59:59" }
    }
    return null
  }
  const HistoryCompares = async () => {
    //const timer = getTime()
    // console.log(timer, dates)
    console.log(params)
    // const params = [{
    //   projectId,
    //   type: radioVal,
    //   groupName: state.groupName,
    //   sNs: state.snGroup,
    //   start: dates[0],
    //   end: dates[1],
    // }];
    if (params.length == 0) return
    const resp = await HistoryCompare(params);
    if (resp.success) {
      if (resp.data) {
        console.log(1111)
        state.chartsOpts.series = []
        state.chartsOpts.xAxis.data = resp.data[0].snData[0]["data"][0]["data"].map(it => it.time)
        console.log(state.chartsOpts)
        let compareArr = []
        resp.data.forEach((a, b) => {
          state.chartsOpts.series[b] = []
          a.snData.forEach((item, index) => {
            if (item?.data?.length > 0) {
              item.data.forEach(it => {
                console.log(it, b)
                state.chartsOpts.series[b].push({
                  data: it.data.map(i => (i["value"])), type: "line", smooth: true, name: item["name"] + "-" + it["point"],
                })
              })
            }
          })
        })
        console.log(state.chartsOpts.series)
        state.detailtableData = resp.data
        // if (resp.data[indexBtn].compareDeviation) {
          // state.alltableData = resp.data[indexBtn].compareDeviation
          // console.log(state.alltableData)
          // state.tableData = state.alltableData?.slice(0, state.pageSize)
        // }







        // markLine.data[0]["yAxis"] = ""
        // markLine.label = {}
        // state.chartsOpts.series = []
        // state.chartsOpts.xAxis.data = resp.data.snData[0]["data"][0]["data"].map(it => it.time)

        // if (radioVal == "1" && state.devices[0]["line"] == 1) {

        //   markLine.data[0]["yAxis"] = state.devices[0]["lineValue"]
        //   markLine.label.formatter = (params) => `${params.value}kWh`
        // } else if (radioVal == "2" && state.devices[1]["line"] == 1) {
        //   console.log(markLine)

        //   markLine.data[0]["yAxis"] = state.devices[1]["lineValue"]
        //   markLine.label.formatter = (params) => `${params.value}W`
        // } else if (radioVal == "3" && state.devices[2]["line"] == 1) {

        //   markLine.data[0]["yAxis"] = state.devices[2]["lineValue"]
        //   markLine.label.formatter = (params) => `${params.value}A`
        // } else if (radioVal == "4" && state.devices[3]["line"] == 1) {

        //   markLine.data[0]["yAxis"] = state.devices[3]["lineValue"]
        //   markLine.label.formatter = (params) => `${params.value}V`
        // }

        // let compareArr = []
        // resp.data.snData.forEach((item, index) => {
        //   if (item?.data?.length > 1) {
        //     item.data.forEach(it => {
        //       state.chartsOpts.series.push({
        //         data: it.data.map(i => (i["value"])), type: "line", smooth: true, name: item["name"] + "-" + it["point"], markLine
        //       })
        //     })
        //   } else {
        //     state.chartsOpts.series.push({ data: item.data[0]["data"].map(it => it.value), type: "line", smooth: true, name: item["name"] + "-" + item.data[0]["point"], markLine })
        //   }

        //   compareArr.push(item.data[0]["data"].map(it => (it.value)))
        //   console.log(state.chartsOpts.series)
        // })

        // const maxarr = getMaxArr(compareArr)
        // const minarr = getMinArr(compareArr)
        // console.log(maxarr,minarr,radioVal)
        // state.alltableData=[]
        // state.tableData =[]

        //   maxarr.forEach((item,index)=>{
        //    const gap =  (((item-minarr[index])/item)*100).toFixed(2)
        //    console.log(gap)
        //    if(radioVal=="1"){
        //     if(gap-state.devices[0].deviationValue>0){
        //       state.alltableData.push({
        //         ...resp.data[0].data[0].data[index],
        //         point:resp.data[0].data[0].point,
        //         gap,
        //         deviationValue:state.devices[0].deviationValue,
        //         maxval:item,
        //         minval:minarr[index]
        //       })
        //     }
        //    }else if(radioVal=="2"){
        //     if(gap-state.devices[1].deviationValue>0){
        //       state.alltableData.push({
        //         ...resp.data[0].data[0].data[index],
        //         point:resp.data[0].data[0].point,
        //         gap,
        //         deviationValue:state.devices[1].deviationValue,
        //         maxval:item,
        //         minval:minarr[index]
        //       })
        //     }
        //    }else if(radioVal=="3"){
        //     if(gap-state.devices[2].deviationValue>0){
        //       state.alltableData.push({
        //         ...resp.data[0].data[0].data[index],
        //         point:resp.data[0].data[0].point,
        //         gap,
        //         deviationValue:state.devices[2].deviationValue,
        //         maxval:item,
        //         minval:minarr[index]
        //       })
        //     }
        //    }else if(radioVal=="4"){
        //     if(gap-state.devices[3].deviationValue>0){
        //       state.alltableData.push({
        //         ...resp.data[0].data[0].data[index],
        //         point:resp.data[0].data[0].point,
        //         gap,
        //         deviationValue:state.devices[3].deviationValue,
        //         maxval:item,
        //         minval:minarr[index]
        //       })
        //     }
        //    }
        //   })

        // if (resp.data.compareDeviation) {
        //   state.alltableData = resp.data.compareDeviation
        //   console.log(state.alltableData)
        //   state.tableData = state.alltableData.slice(0, state.pageSize)
        // }




      } else {
        //state.chartsOpts.series = [{ data: [], type: "line", smooth: true }];
      }

    } else {
      message.error(resp.errMsg || "数据出错");
    }
  };

  const warnDetail = (index) => {
    console.log(index)
    ModalRef.current.onOpen()
    //setIndexBtn(index)
    state.alltableData=state.detailtableData[index].compareDeviation
    state.tableData = state.alltableData?.slice(0, state.pageSize)
  }
  const changePage = (val) => {
    console.log(val)
    state.current = val
    state.tableData = state.alltableData.slice((val - 1) * state.pageSize, (val - 1) * state.pageSize + state.pageSize)
  }
  const onShowSizeChange = async (current, size) => {
    console.log("current,size", current, size)
    state.current = current
    state.pageSize = size
  }
  useEffect(() => {
    GetSns();
  }, []);
  useEffect(() => {
    params.length > 0 && HistoryCompares();
  }, [params]);
  const DatePick = (
    <Space>
      <CustButton onClick={warnDetail}>偏差告警明细</CustButton>
      <Space>
        <span>选择日期范围</span>
        <RangePicker
          defaultValue={[
            moment(oneWeekAgo, dateFormat),
            moment(currentDate, dateFormat),
          ]}
          onChange={changeDate}
        />
      </Space>
    </Space>

  );
  const Warn = () => {
    if (radioVal == 1 && state.devices?.[0]?.deviation == 0) {
      return null
    } else if (radioVal == 2 && state.devices?.[1]?.deviation == 0) {
      return null
    } else if (radioVal == 3 && state.devices?.[2]?.deviation == 0) {
      return null
    } else if (radioVal == 4 && state.devices?.[3]?.deviation == 0) {
      return null
    } else if (!state.alltableData || state.alltableData?.length == 0) {
      return null
    }
    return (<img src={warn} onClick={warnDetail}></img>)
  }
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {dataList.length > 0 && dataList.map((item, index) => {
        return (
          <Titlelayout title={item.groupName} style={{ height: 500, marginBottom: 16 }} extra={
            <Space>
              <Space>
                <BtnWrap
                  defaultValue="1"
                  buttonStyle="solid"
                  size="middle"
                  style={{ width: 452, marginRight: 250 }}
                  onChange={(e) => { changeBtn(e, index) }}
                >
                  <Radio.Button value="1" disabled={item?.items[0].state == 0}>用电量对比</Radio.Button>
                  <Radio.Button value="2" disabled={item?.items[1].state == 0}>功率对比</Radio.Button>
                  <Radio.Button value="3" disabled={item?.items[2].state == 0}>电流对比</Radio.Button>
                  <Radio.Button value="4" disabled={item?.items[3].state == 0}>电压对比</Radio.Button>
                </BtnWrap>
              </Space>
              <Space>
                <CustButton style={{ marginRight: 16 }} onClick={()=>warnDetail(index)}>偏差告警明细</CustButton>
              </Space>
              <Space>
                <span>选择日期范围</span>
                <RangePicker
                  defaultValue={[
                    moment(oneWeekAgo, dateFormat),
                    moment(currentDate, dateFormat),
                  ]}
                  onChange={(dates, dateStrings) => changeDate(dates, dateStrings, index)}
                />
              </Space>
            </Space>}>
            <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
            <Charts>
              {state.chartsOpts.series.length > 0 ? <Icharts custoption={{ ...state.chartsOpts, series: state.chartsOpts.series[index] }}></Icharts> : <Cempty tip="暂无数据" />}
            </Charts>

            {/* <BtnWrap
        defaultValue="a"
        buttonStyle="solid"
        size="middle"
        style={{ width: 452 }}
        onChange={changeBtn}
        value={radioVal}
        disabled={state.disabled}
      >
        <Radio.Button value="1" disabled={state.devices?.[0]?.state == 0}>用电量对比</Radio.Button>
        <Radio.Button value="2" disabled={state.devices?.[1]?.state == 0}>功率对比</Radio.Button>
        <Radio.Button value="3" disabled={state.devices?.[2]?.state == 0}>电流对比</Radio.Button>
        <Radio.Button value="4" disabled={state.devices?.[3]?.state == 0}>电压对比</Radio.Button>
      </BtnWrap>
      <Charts>
        {state.chartsOpts.series.length > 0 ? <Icharts custoption={state.chartsOpts}></Icharts> : null}
      </Charts>
      <Modal ref={ModalRef} mold='cust' title="偏差告警" onOk={() => { ModalRef.current.onCancel() }} width={800}>
        <Table dataSource={state.tableData} columns={columns} pagination={{ pageSize: state.pageSize, current: state.current, total: state.alltableData.length, onChange: changePage, onShowSizeChange: onShowSizeChange }}  ></Table>
      </Modal> */}
          </Titlelayout>
        );
      })

      }
      <Modal ref={ModalRef} mold='cust' title="偏差告警" onOk={() => { ModalRef.current.onCancel() }} width={800}>
        <Table dataSource={state.tableData} columns={columns} pagination={{ pageSize: state.pageSize, current: state.current, total: state.alltableData.length, onChange: changePage, onShowSizeChange: onShowSizeChange }}  ></Table>
      </Modal></div>
  );
}
