import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Space, Radio, Divider } from "antd";
import moment from "moment";
import styled from "styled-components";
import { Monitoring } from "@api/api.js";
import { useSelector } from "react-redux";
import { useReactive } from "ahooks";
import Icharts from "@com/useEcharts/Ichart.js";
import {CustButton} from "@com/useButton"
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
  height: 720px;
  display: flex;
`;
const {
  IAnalyse: { CompareQuery, HistoryCompare },
} = Monitoring;
const option = {
  legend:{
     top: '3%',
     left:"2%"
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
      end: 50 // 结束位置（可以根据需要调整）  
  }  
],
  grid: {
    top:"10%",
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
      yAxis:300
    }
  ],
  lineStyle: {
    color: '#f00'
  }
}
const columns=[{
  title: '时间',
  dataIndex: 'time',
  key: 'time',
},
{title: '测点',
dataIndex: 'point',
key: 'point',
},
{title: '实际偏差值',
dataIndex: 'gap',
key: 'gap',
},{
  title:"偏差告警值",
  dataIndex:"deviationValue",
  key:"deviationValue"
},{
  title:"最大值",
  dataIndex:"maxval",
  key:"maxval"
},{
  title:"最小值",
  dataIndex:"minval",
  key:"minval"
}]
export default function index() {
  const projectId = useSelector((state) => state.system.menus.projectId);
  const { RangePicker } = DatePicker;
  const currentDate = moment();
  const oneWeekAgo = moment().subtract(1, "weeks");
  const dateFormat = "YYYY-MM-DD";
  const ModalRef =useRef()
  const [radioVal, setRadioVal] = useState("1");
  const [dates, setDates] = useState([
    moment(oneWeekAgo, dateFormat),
    moment(currentDate, dateFormat),
  ]);
  const state = useReactive({
    devices: [],
    snGroup: [],
    timeType:1,
    chartsOpts: {
      type: 5,
      ...option,
    },
    alltableData:[],
    tableData:[],
    current:1,
    pageSize:10,
    disabled: false
  });
  const changeBtn = (e) => {
    setRadioVal(e.target.value);
  };
  const changeDate = (dates, dateStrings) => {
    setDates(dateStrings);
  };

  const GetSns = async () => {
    const resp = await CompareQuery(projectId);
    if (resp.success) {
      if (resp.data) {
        state.devices = resp.data.items;
        state.snGroup = resp.data.snGroup;
        state.timeType = resp.data.timeType
        state.disabled = false
        // HistoryCompares(state.snGroup)
      } else {
        state.devices = [];
        state.snGroup = [];
        state.timeType =1
        state.disabled = true
      }
    } else {
      state.disabled = true
      message.error("获取设备信息失败!");
    }
  };
  const getMaxArr=(matrix)=>{
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
  const getMinArr=(matrix)=> {  
    if (matrix.length === 0 || matrix[0].length === 0) {  
        return []; // 如果矩阵为空，返回空数组  
    }  
  
    const rowCount = matrix.length;  
    const colCount = matrix[0].length;  
    const minValues = new Array(colCount).fill(Number.POSITIVE_INFINITY); // 初始化辅助数组为正无穷大  
    // const minValSn = new Array(colCount).fill(Number.POSITIVE_INFINITY);
    console.log(matrix,colCount)
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
  const getTime =()=>{
     
      if(state.timeType==1){
       let date =   moment().format('YYYY-MM-DD ')
        return {start:date+"00:00:00",end:date+"23:59:59"}
      }else if(state.timeType==2){
        let date = moment().subtract(7, 'days').format('YYYY-MM-DD ')
        return {start:date+"00:00:00",end:moment().format('YYYY-MM-DD ')+"23:59:59"}
      }else if(state.timeType==3){
        let date = moment().subtract(31, 'days').format('YYYY-MM-DD ');
        return {start:date+"00:00:00",end:moment().format('YYYY-MM-DD ')+"23:59:59"}
      }
      return null
  }
  const HistoryCompares = async () => {
    const timer =  getTime()
    console.log(timer)
    const params = {
      projectId,
      type: radioVal,
      sNs: state.snGroup,
      start:  timer.start,
      end: timer.end,
    };
    console.log(params);
    const resp = await HistoryCompare(params);
    if (resp.success) {
      if (resp.data) {
        state.chartsOpts.series=[]
        state.chartsOpts.xAxis.data=resp.data[0]["data"][0]["data"].map(it=>it.time)
        if(radioVal=="1"){
          markLine.data[0]["yAxis"]= state.devices[0]["lineValue"]
          markLine.label.formatter=(params)=>`${params.value}kWh`
        }else if(radioVal=="2"){
          markLine.data[0]["yAxis"]= state.devices[1]["lineValue"]
           markLine.label.formatter=(params)=>`${params.value}W`
        }else if(radioVal=="3"){
          markLine.data[0]["yAxis"]= state.devices[2]["lineValue"]
           markLine.label.formatter=(params)=>`${params.value}A`
        }else if(radioVal=="4"){
          markLine.data[0]["yAxis"]= state.devices[3]["lineValue"]
           markLine.label.formatter=(params)=>`${params.value}V`
        }
        let compareArr=[] 
        resp.data.forEach((item,index)=>{
          if(item.data.length>1){
           item.data.forEach(it=>{
              state.chartsOpts.series.push({
                data:it.data.map(i=> (i["value"])), type: "line", smooth: true,name:item["sn"]+it["point"],markLine
              } )
          })
          }else{
            state.chartsOpts.series.push({data:item.data[0]["data"].map(it=>it.value),type: "line", smooth: true,name:item["sn"],markLine}) 
          }
         //item.data.forEach(it=>{ compareArr.push(it.data.map(i=>i.value))})
         compareArr.push(item.data[0]["data"].map(it=>(it.value))) 
        //  compareArr[index].push(item.sn)
        })
        // console.log(compareArr)
        const maxarr = getMaxArr(compareArr)
        const minarr = getMinArr(compareArr)
        console.log(maxarr,minarr,radioVal)
        state.alltableData=[]
        state.tableData =[]
 
          maxarr.forEach((item,index)=>{
           const gap =  (((item-minarr[index])/item)*100).toFixed(2)
           console.log(gap)
           if(radioVal=="1"){
            if(gap-state.devices[0].deviationValue>0){
              state.alltableData.push({
                ...resp.data[0].data[0].data[index],
                point:resp.data[0].data[0].point,
                gap,
                deviationValue:state.devices[0].deviationValue,
                maxval:item,
                minval:minarr[index]
              })
            }
           }else if(radioVal=="2"){
            if(gap-state.devices[1].deviationValue>0){
              state.alltableData.push({
                ...resp.data[0].data[0].data[index],
                point:resp.data[0].data[0].point,
                gap,
                deviationValue:state.devices[1].deviationValue,
                maxval:item,
                minval:minarr[index]
              })
            }
           }else if(radioVal=="3"){
            if(gap-state.devices[2].deviationValue>0){
              state.alltableData.push({
                ...resp.data[0].data[0].data[index],
                point:resp.data[0].data[0].point,
                gap,
                deviationValue:state.devices[2].deviationValue,
                maxval:item,
                minval:minarr[index]
              })
            }
           }else if(radioVal=="4"){
            if(gap-state.devices[3].deviationValue>0){
              state.alltableData.push({
                ...resp.data[0].data[0].data[index],
                point:resp.data[0].data[0].point,
                gap,
                deviationValue:state.devices[3].deviationValue,
                maxval:item,
                minval:minarr[index]
              })
            }
           }
          })
          console.log(state.alltableData)
          state.tableData = state.alltableData.slice(0, state.pageSize)
          console.log(state.tableData)
    
        
      } else {
        state.chartsOpts.series = [{ data: [], type: "line", smooth: true }];
      }
    
    }
  };
  const warnDetail =()=>{
    ModalRef.current.onOpen()
  }
  const changePage=(val)=>{
    console.log(val)
    state.current =val
    state.tableData = state.alltableData.slice((val-1)*state.pageSize, (val-1)*state.pageSize+state.pageSize)
  }
  const onShowSizeChange=async (current,size)=>{
    console.log("current,size",current,size)
    state.current =current
    state.pageSize = size
  }
  useEffect(() => {
    GetSns();
  }, []);
  useEffect(() => {
    state.snGroup.length > 0 && HistoryCompares();
  }, [radioVal, state.snGroup.length, dates]);
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
  const Warn =()=>{
    if(radioVal==1&&state.devices[0]?.deviation==0 ){
      return null
    }else if(radioVal==2&&state.devices[1]?.deviation==0 ){
      return null
    }else if(radioVal==3&&state.devices[2]?.deviation==0 ){
      return null
    }else if(radioVal==4&&state.devices[3]?.deviation==0 ){
      return null
    }
    return (<img src={warn} onClick={warnDetail}></img>)
  }
  return (
    <Titlelayout title="智能分析" extra={!state.disabled ? (<Warn/>) : null}>
      <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
      <BtnWrap
        defaultValue="a"
        buttonStyle="solid"
        size="middle"
        style={{ width: 452 }}
        onChange={changeBtn}
        value={radioVal}
        disabled={state.disabled}
      >
        <Radio.Button value="1" disabled={state.devices[0]?.state==0}>用电量对比</Radio.Button>
        <Radio.Button value="2" disabled={state.devices[1]?.state==0}>功率对比</Radio.Button>
        <Radio.Button value="3" disabled={state.devices[2]?.state==0}>电流对比</Radio.Button>
        <Radio.Button value="4" disabled={state.devices[3]?.state==0}>电压对比</Radio.Button>
      </BtnWrap>
      <Charts>
       {state.chartsOpts.series.length>0?<Icharts custoption={state.chartsOpts}></Icharts>:null} 
      </Charts>
      <Modal ref={ModalRef} mold = 'cust' title="偏差告警" onOk={()=>{ModalRef.current.onCancel()}} width={800}>
      <Table dataSource={state.tableData} columns={columns} pagination={{pageSize:state.pageSize,current:state.current,total:state.alltableData.length,onChange:changePage,onShowSizeChange:onShowSizeChange}}  ></Table>
      </Modal>
    </Titlelayout>
  );
}
