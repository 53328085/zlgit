import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Space, Radio, Divider, Select, Tree, Button } from "antd";
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
import { ExportExcel } from '@com/useButton'
import { useAntdTable } from 'ahooks'
const { RangePicker } = DatePicker;
const LeftBox = styled.div`
  width: 240px;
  height: 100%;
  background-color: #fff;
  border:1px solid #d7d7d7;
  padding:  16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  margin-right: 16px;
`;
const ChooseBtn = styled.div`
  width: 208px;
  height: 40px;
  color: #fff;
  background-color: ${props => props.theme.primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;
const NoChooseBtn = styled.div`
  width: 208px;
  height: 40px;
  color: ${props => props.theme.primaryColor};
  background-color: #fff;
  border: 1px solid ${props => props.theme.primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;
const Circle = styled.div`
  width:6px;
  height:6px;
  border-radius:50%;
  background-color:${props => props.theme.primaryColor};
  margin-right:4px;
`;
const Title = styled.p`
  color: ${props => props.theme.primaryColor};
  font-size: 14px;
`;
const RightBox = styled.div`
  width: 1422px;
  height: 100%;
  background-color: #fff;
  border:1px solid #d7d7d7;
  padding:  16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  
`;
const Header = styled.div`
width:100%;
height:32px;
display:flex;
flex-direction:row;
align-items:center;
justify-content:flex-end;
`;
const Charts = styled.div`
  height: 784px;
  display: flex;
`;
const {
  IAnalyse: { CompareQuery },
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

export default function index() {
  const projectId = useSelector((state) => state.system.menus.projectId);
  const state = useReactive({
    devices: [],
    snGroup: [],
    timeType: 1,
    xAxis: [],
    alltableData: [],
    detailtableData: [],
    tableData: [],
    current: 1,
    pageSize: 10,
    disabled: false,
    groupName: '',
    btnLength: [1, 2, 3],
    active: 0,
    chartsOpts: {
      type: 1,
      ...option,
    },
  });

  const [dataList, setDataList] = useState([])
  const GetSns = async () => {
    const resp = await CompareQuery(projectId);
    if (resp.success) {
      if (resp.data) {

        setDataList(resp.data)
      } else {
        setDataList([])
      }
    } else {
      message.error("获取设备信息失败!");
    }
  };




  useEffect(() => {
    //GetSns();
  }, []);
  const chooseBtn = (item, index) => {
    console.log(item, index)
    state.active = index
  }
  const treeData = [
    {
      title: '1#正泰物联配电站',
      key: '0',
      children: [
        {
          title: '变压器T4',
          key: '0-0',
          children: [
            {
              title: '进线1AA-1',
              key: '0-0-0',
              children: [
                {
                  title: '馈线1AA-2',
                  key: '0-0-0-0',
                }, {
                  title: '馈线1AA-3',
                  key: '0-0-0-1',
                },
                {
                  title: '馈线1AA-4',
                  key: '0-0-0-2',
                },
              ],
            },
          ],
        }, {
          title: '变压器T4',
          key: '0-1',
          children: [
            {
              title: '进线1AA-1',
              key: '0-1-0',
              children: [
                {
                  title: '馈线1AA-2',
                  key: '0-1-0-0',
                }, {
                  title: '馈线1AA-3',
                  key: '0-1-0-1',
                },
                {
                  title: '馈线1AA-4',
                  key: '0-1-0-2',
                },
              ],
            },
          ],
        },
      ]
    }
  ];

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  const [reportTypeTime, setreportTypeTime] = useState(1)
  const changeTime = (e) => {
    console.log(e)
    setreportTypeTime(parseInt(e))
  }//切换日月年

  const today = moment().startOf('day');
  const tmonth = moment().startOf('month')
  const tbref = useRef()
  const onChangeDate = (date, dateString) => {
    if (!dateString) return;
    if (reportTypeTime == 1) {
      setdateValue(dateString)
      console.log(dateString);
    } else if (reportTypeTime == 2) {
      setdateValue(dateString + '-01')
      console.log(dateString + '-01');
    } else {
      setdateValue(dateString + '-01-01')
      console.log(dateString + '-01-01');
    }
  };

  const getData = () => {

  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
      <LeftBox>
        <div style={{ width: "100%", height: "20px", display: "flex", flexDirection: "row", alignItems: 'center', marginBottom: '16px' }}>
          <Circle></Circle>
          <Title>变电站选择</Title>
        </div>
        {state.btnLength.length > 0 && state.btnLength.map((item, index) => {
          return index == state.active ? (<ChooseBtn key={index} onClick={() => chooseBtn(item, index)}>1#物联变电站</ChooseBtn>) :
            (<NoChooseBtn onClick={() => chooseBtn(item, index)}>2#物联变电站</NoChooseBtn>)
        })}
        <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
        <Tree
          checkable
          onCheck={onCheck}
          treeData={treeData}
        />
      </LeftBox>
      <Titlelayout title='回路能耗' style={{ width: 1422, height: '100%' }} extra={
        <Header>
          <div>
            <span style={{ marginRight: "10px" }}>时间查询</span>
            <Select defaultValue="1" style={{ width: 96, marginRight: 16 }} onChange={changeTime}
              options={[
                { value: '1', label: '日', },
                { value: '2', label: '月', },
                { value: '3', label: '年' },
                { value: '4', label: '自定义' },
              ]}
            />
            {reportTypeTime == 1 ? <DatePicker style={{ marginRight: '16px' }} onChange={onChangeDate} defaultValue={moment(today)} /> :
              reportTypeTime == 2 ? <DatePicker style={{ marginRight: '16px' }} onChange={onChangeDate} defaultValue={moment(tmonth)} picker='month' /> :
                reportTypeTime == 3 ? <DatePicker style={{ marginRight: '16px' }} onChange={onChangeDate} picker='year' /> : 
                <RangePicker style={{ marginRight: '16px' }}/>
            }
          </div>
          <ExportExcel  tb={tbref} />
        </Header>
      }>
        <Charts>
          {state.chartsOpts.series.length > 0  ?
            <Icharts custoption={{
              ...state.chartsOpts
            }}></Icharts> : <Cempty tip="暂无数据" />}
        </Charts>
      </Titlelayout>
    </div>
  );
}
