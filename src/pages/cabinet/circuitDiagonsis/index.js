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
import img from "./u542.svg"
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
const Right = styled.div`
  width: 1422px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
`;
const RightTop = styled.div`
  width: 100%;
  height: 128px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
`;
const TopBox = styled.div`
  width: 344px;
  height: 128px;
  background-color: #fff;
  border:1px solid #d7d7d7;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;
const TopRight = styled.div`
  width: 240px;
  
`;
const RightBox = styled.div`
  width: 1422px;
  height: 720px;
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
justify-content:flex-start;
margin-bottom:16px;
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
  const columns = [
    { title: '回路名称', dataIndex: 'name', align: "center", },
    { title: '容量', dataIndex: 'name', align: "center", },
    { title: '断路器型号', dataIndex: 'name', align: "center", },
    { title: '额定电流', dataIndex: 'name', align: "center", },
    {
      title: '长延时', align: "center", children: [
        { title: '电流', dataIndex: 'companyName', key: 'companyName', },
        { title: '时间', dataIndex: 'companyName', key: 'companyName', },
      ]
    }, {
      title: '短延时', align: "center", children: [
        { title: '电流', dataIndex: 'companyName', key: 'companyName', },
        { title: '时间', dataIndex: 'companyName', key: 'companyName', },
      ]
    }, { title: '瞬动电流', dataIndex: 'name', align: "center", },
    {
        title: '最大值', align: "center", children: [
          { title: '电流', dataIndex: 'companyName', key: 'companyName', },
          { title: '电压', dataIndex: 'companyName', key: 'companyName', },
          { title: '剩余电流', dataIndex: 'companyName', key: 'companyName', },
        ]
      },
    { title: '分合次数', dataIndex: 'name', align: "center", },
    { title: '当前状态', dataIndex: 'name', align: "center", },
    { title: '诊断结果', dataIndex: 'name', align: "center", },
  ]
  const getTableData = ({ current, pageSize }) => {

  }
  const { tableProps, refresh, run, search } = useAntdTable(getTableData, {
    defaultPageSize: 14,
  })
  const { submit } = search
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
      <Right>
        <RightTop>
            <TopBox>
            <div style={{ width: 115, height: 66 ,display:'flex',alignItems:'center',justifyContent:'center'}}><img src={img} width={48} height={48}></img></div>
            <TopRight>
                <p style={{fontSize: '16px', color: '#515151',textAlign:'center'}}>断路器数量</p>
                <p style={{fontSize: '16px', color: '#999999',textAlign:'center'}}>
                    <span style={{fontSize: '48px', color: '#515151',textAlign:'center'}}>12</span>台</p>
            </TopRight>
            </TopBox>
            <TopBox>
            <div style={{ width: 115, height: 66 ,display:'flex',alignItems:'center',justifyContent:'center'}}><img src={img} width={48} height={48}></img></div>
            <TopRight>
                <p style={{fontSize: '16px', color: '#515151',textAlign:'center'}}>断路器数量</p>
                <p style={{fontSize: '16px', color: '#999999',textAlign:'center'}}>
                    <span style={{fontSize: '48px', color: '#515151',textAlign:'center'}}>12</span>台</p>
            </TopRight>
            </TopBox><TopBox>
            <div style={{ width: 115, height: 66 ,display:'flex',alignItems:'center',justifyContent:'center'}}><img src={img} width={48} height={48}></img></div>
            <TopRight>
                <p style={{fontSize: '16px', color: '#515151',textAlign:'center'}}>断路器数量</p>
                <p style={{fontSize: '16px', color: '#999999',textAlign:'center'}}>
                    <span style={{fontSize: '48px', color: '#515151',textAlign:'center'}}>12</span>台</p>
            </TopRight>
            </TopBox><TopBox>
            <div style={{ width: 115, height: 66 ,display:'flex',alignItems:'center',justifyContent:'center'}}><img src={img} width={48} height={48}></img></div>
            <TopRight>
                <p style={{fontSize: '16px', color: '#515151',textAlign:'center'}}>断路器数量</p>
                <p style={{fontSize: '16px', color: '#999999',textAlign:'center'}}>
                    <span style={{fontSize: '48px', color: '#515151',textAlign:'center'}}>12</span>台</p>
            </TopRight>
            </TopBox>
        </RightTop>
      <RightBox>
        <Header>
          <div>
            <span style={{ marginRight: "10px" }}>时间查询</span>
            <Select defaultValue="1" style={{ width: 96,marginRight:16 }} onChange={changeTime}
              options={[
                { value: '1', label: '日', },
                { value: '2', label: '月', },
                { value: '3', label: '年' },
                { value: '4', label: '自定义' },
              ]}
            />
            {reportTypeTime == 1 ? <DatePicker onChange={onChangeDate} defaultValue={moment(today)} /> :
             reportTypeTime == 2 ? <DatePicker onChange={onChangeDate} defaultValue={moment(tmonth)} picker='month' /> : 
             reportTypeTime == 3 ?<DatePicker onChange={onChangeDate} picker='year' />:<RangePicker />
            }
            <Button type="primary" style={{ marginLeft: 32, width: 96 }}  onClick={submit}>开始诊断</Button>
          </div>
          {/* <ExportExcel tb={tbref} /> */}
        </Header>
        <Table columns={columns} ref={tbref}   {...tableProps} ></Table>
      </RightBox>
      </Right>
      
    </div>
  );
}
