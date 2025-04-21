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
import { CustTransO, i18t, i18warning,ExportExcel, RadioT,CustButtonT,CustButton } from "@com/useButton"
import Modal from "@com/useModal"
import Table from "@com/useTable"
import warn from "./warn.png"
import Pagecount from "@com/pagecontent";
const BtnWrap = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    min-width: 113px;
    text-align: center;
  }
`;
const Charts = styled.div`
  height: ${props=> props.len > 1 ? "400px" : "100%"};
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
  data: [],
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
  const [radioVal, setRadioVal] = useState(1);
  const [dates, setDates] = useState([]);
  const state = useReactive({
    devices: [],
    snGroup: [],
    timeType: 1,
    chartsOpts: {
      type: 5,
      ...option,
    },
    xAxis: [],
    alltableData: [],
    detailtableData: [],
    tableData: [],
    current: 1,
    pageSize: 10,
    disabled: false,
    groupName: ''
  });


  
  const markLineList=useReactive([])
  const [params, setParams] = useState([])
  const changeBtn = (e, index) => {
    setRadioVal(e.target.value-0);
    params[index].type = e.target.value
    setParams(params)
    HistoryCompares()
  };
  const changeDate = (dates, dateStrings, index) => {
 
    params[index].start = dateStrings[0]+' 00:00:00'
    params[index].end = dateStrings[1]+' 23:59:59'
    setParams(params)
    setDates(dateStrings);
    HistoryCompares()
  };
  
  const [dataList, setDataList] = useState([])
  const len = dataList.length
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
       

        let list = []
        mergedData.map((item,index) => {
          let param = {
            projectId, planId: 0, type: 1, groupName: '', sNs: [], start: '', end: ''
          }
          param.groupName = item.groupName
          param.sNs = item.snGroup
          param.planId = item.planId
          let startTime = []
          startTime = getDefaultValue(item.timeType)
          param.start = startTime[0].format('YYYY-MM-DD')+" 00:00:00"
          param.end = startTime[1].format('YYYY-MM-DD')+' 23:59:59'
          list.push(param)
          markLineList.push([])
          item.items.map((it,i)=>{
            
            markLineList[index].push(it.lineValue)
          })
        })
        
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
      message.error(i18t("monitor","info3"));
    }
  };
  const getMaxArr = (matrix) => {
    if (matrix.length === 0 || matrix?.[0].length === 0) {
      return []; // 如果矩阵为空，返回空数组  
    }

    const rowCount = matrix.length;
    const colCount = matrix?.[0]?.length;
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
    if (matrix.length === 0 || matrix?.[0].length === 0) {
      return []; // 如果矩阵为空，返回空数组  
    }

    const rowCount = matrix.length;
    const colCount = matrix?.[0]?.length;
    const minValues = new Array(colCount).fill(Number.POSITIVE_INFINITY); // 初始化辅助数组为正无穷大  
    // const minValSn = new Array(colCount).fill(Number.POSITIVE_INFINITY);
    
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
       
        state.chartsOpts.series = []

        
        let compareArr = []
        resp.data.forEach((a, b) => {
          state.chartsOpts.series[b] = []
          state.xAxis[b] = []
          a.snData.forEach((item, index) => {
             let unit = item?.unit??""
            if (item?.data?.length > 0) {
              item.data.forEach(it => {              
                state.xAxis[b] = it["data"].map(it => it.time)
                state.chartsOpts.series[b].push({
                  data: it.data.map(i => (i["value"]+unit)), 
                  type: "line",                                 
                  smooth: true, 
                  name: item["name"] + "-" + it["point"],
                  markLine:dataList[b].items[params[b].type-1].line!=0?{
                    symbol: ['none', 'none'],
                    label: {
                      show: true,
                      position: 'insideMiddle',
                      formatter: '基准线:{c}'
                    },
                    data: [
                      {
                        yAxis: markLineList[b][params[b].type-1], // 这里设置基准线的值，可以根据实际情况调整
                        name: '基准线' ,  //'基准线'
                      }
                    ],
                    lineStyle: {
                      color: '#f00'
                    }
                  }:{},
                

                })
              })
            }
          })
        })
        
        state.detailtableData = resp.data

      } else {
       
      }

    } else {
      i18warning(resp.errMsg)
     // message.error(resp.errMsg || "数据出错");
    }
  };

  const warnDetail = (index) => {
   
    ModalRef.current.onOpen()
    //setIndexBtn(index)
    state.alltableData = state.detailtableData[index]?.compareDeviation
    state.tableData = state.alltableData?.length > 0 ? state.alltableData.slice(0, state.pageSize) : []
  }
  const changePage = (val) => {
   
    state.current = val
    state.tableData = state.alltableData.slice((val - 1) * state.pageSize, (val - 1) * state.pageSize + state.pageSize)
  }
  const onShowSizeChange = async (current, size) => {
   
    state.current = current
    state.pageSize = size
  }
  useEffect(() => {
    GetSns();
  }, []);
  useEffect(() => {
    params.length > 0 && HistoryCompares();
  }, [params]);
 
  const [dateList, setDateList] = useState([])
  const getDefaultValue = (type) => {
    const today = moment();
    const oneDayAgo = moment().subtract(1, 'days');
    const oneWeekAgo = moment().subtract(7, 'days');
    const oneMonthAgo = moment().subtract(1, 'months');
    let List = [today, today, oneWeekAgo, oneMonthAgo]
    setDateList(List)
    switch (type) {
      case 1:
        return [today, today];
      case 2:
        return [oneWeekAgo, today];
      case 3:
        return [oneMonthAgo, today];
    }
  };
  const disabledDate = (current, type) => {
    const today = moment();
    const oneDayAgo = moment().subtract(1, 'days');
    const oneWeekAgo = moment().subtract(7, 'days');
    const oneMonthAgo = moment().subtract(1, 'months');
    if (!current) {
      return false; // 显式处理 current 为 null 或 undefined 的情况
    }

    switch (type) {
      case 1:
        return current > today || current < today;
      case 2:
        return current > today || current < oneWeekAgo;
      case 3:
        return current > today || current < oneMonthAgo;
      default:
        return false;
    }
  };

  return (
   /*  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}> */
   <Pagecount bgcolor="transparent" pd="0">
      {dataList.length > 0 && dataList.map((item, index) => {
        return (
          <Titlelayout title={item.groupName} style={{ height: len== 1 ? "100%" : 500, marginBottom: 16 }} extra={
            <Space>
              
                <BtnWrap
                  defaultValue="1"
                  buttonStyle="solid"
                  size="middle"
                  
                  onChange={(e) => { changeBtn(e, index) }}
                >
                  <Radio.Button value="1" disabled={item?.items[0].state == 0}>{i18t("comm","electricquantity",{text:"对比"})}</Radio.Button>
                  <Radio.Button value="2" disabled={item?.items[1].state == 0}>{i18t("comm","power",{text:"对比"})}</Radio.Button>
                  <Radio.Button value="3" disabled={item?.items[2].state == 0}>{i18t("comm","voltage",{text:"对比"})}</Radio.Button>
                  <Radio.Button value="4" disabled={item?.items[3].state == 0}>{i18t("comm","electricity",{text:"对比"})}</Radio.Button>
                </BtnWrap>
                {state.detailtableData[index]?.compareDeviation == null ? '' : <CustButtonT style={{ marginRight: 16 }} onClick={() => warnDetail(index)} ns="comm" text="alarm" param={{text:"偏差", text2: "明细"}} /> } 
                <div>
                <span style={{paddingRight:"0.5em"}}>{i18t("monitor","datarang")}</span>
                <RangePicker
                  defaultValue={[dateList[item.timeType], dateList[0]]}
                  disabledDate={(current) => disabledDate(current, item.timeType)}
                  onChange={(dates, dateStrings) => changeDate(dates, dateStrings, index)}
                />
                </div>
            </Space>}> 
            <Charts len={len}>
              {state.chartsOpts.series.length > 0&&item?.items[params[index].type-1].state != 0 ?
                <Icharts custoption={{
                  ...state.chartsOpts,
                  series: state.chartsOpts.series[index],
                  xAxis: { data: state.xAxis[index] }
                }}></Icharts> : <Cempty   />}
            </Charts> 
          </Titlelayout>
        );
      })

      }
      <Modal ref={ModalRef} mold='cust' title={i18t("comm","alarm",{text:"偏差"})} onOk={() => { ModalRef.current.onCancel() }} width={800}>
        <Table dataSource={state.tableData} columns={columns} pagination={{ pageSize: state.pageSize, current: state.current, total: state.alltableData.length, onChange: changePage, onShowSizeChange: onShowSizeChange }}  ></Table>
      </Modal>
      </Pagecount>
     /*  </div> */
  );
}
