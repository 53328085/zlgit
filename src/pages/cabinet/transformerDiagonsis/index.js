import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Space, Radio, Divider, Select, Tree, Button, message } from "antd";
import moment from "moment";
import styled from "styled-components";
import { DistributionCabinet } from "@api/api.js";
import { useSelector } from "react-redux";
import { useReactive } from "ahooks";
import Icharts from "@com/useEcharts/Ichart";
import Cempty from '@com/useEmpty'
import { drawEcharts } from "@com/useEcharts"
import dayjs from 'dayjs';
import Modal from "@com/useModal"
import Table from "@com/useTable"
import { ExportExcel } from '@com/useButton'
import { useAntdTable } from 'ahooks'
const { RangePicker } = DatePicker;
const LeftBox = styled.div`
  width: 240px;
  height: 864px;
  overflow-y: auto;
  background-color: #fff;
  border:1px solid #d7d7d7;
  padding:  16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;
const ChooseBtn = styled.div`
  width: 206px;
  height: 40px;
  color: #fff;
  background-color: ${props => props.theme.primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;
const NoChooseBtn = styled.div`
  width: 206px;
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
  height: 864px;
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
  width: 100%;
  height: 360px;
  display: flex;
`;
const Tbh = styled.div`
  width: 100px;
  height: 36px;
  display: flex;
  color:${props => props.islight ? '#333' : '#fff'};
  background-color: ${props => props.theme.primaryColor};
  justify-content: center;
  align-items: center;
  border-right:1px solid #d7d7d7;
`;
const Tbb = styled.div`
  width: 88px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right:1px solid #d7d7d7;
`;
const {
  QueryTransformerInformation, QueryTransformerLoadRateRealtime, QueryTransformerUnbalanceRateRealtime, QueryTransformerList
} = DistributionCabinet;


export default function index() {
  const projectId = useSelector((state) => state.system.menus.projectId);
  const state = useReactive({
    devices: [],
    snGroup: [],
    timeType: 1,
    xAxis: [],
    alltableData: [],
    alltableData1: [],
    detailData: {},
    tableData: [],
    current: 1,
    pageSize: 10,
    disabled: false,
    groupName: '',
    btnLength: [],
    active: 0,
    chartsOpts: {
      type: 1,
    },
  });
  const today = moment().startOf('day');
  const tmonth = moment().startOf('month')
  const tbref = useRef()
  const params = useReactive({
    siteId: 1,
    transformerId: 1,
    type: 1,//不平衡率时间选择
    startDate: moment(today).format('YYYY-MM-DD'),
    endDate: moment(today).format('YYYY-MM-DD'),
  });
  const params1 = useReactive({
    siteId: 1,
    transformerId: 1,
    type: 1,//不平衡率时间选择
    startDate: moment(today).format('YYYY-MM-DD'),
    endDate: moment(today).format('YYYY-MM-DD'),
  });
  const [option, setOption] = useState({
    type: 5,
    tooltip: {
      formatter: '{b} : {c}%'
    },
    series: [{
      name: '实时负载率',
      type: 'gauge',
      min: 0.00,
      max: 200.00,
      axisLine: {
        lineStyle: {
          width: 5,
          color: [
            [0.3, '#3bc27f'],
            [0.7, '#fab120'],
            [1, '#e96c5b']
          ]
        }
      },
      detail: {
        formatter: '{value}%',
        fontSize: 20
      },
      data: [{
        value: '',
        name: '实时负载率'
      }]
    }]
  })
  const [option1, setOption1] = useState({
    type: 5,
    tooltip: {
      formatter: '{b} : {c}%'
    },
    series: [{
      name: '实时不平衡率',
      type: 'gauge',
      min: 0.00,
      max: 100.00,
      axisLine: {
        lineStyle: {
          width: 5,
          color: [
            [0.3, '#3bc27f'],
            [0.7, '#fab120'],
            [1, '#e96c5b']
          ]
        }
      },
      detail: {
        formatter: '{value}%',
        fontSize: 20
      },
      data: [{
        value: '',
        name: '实时不平衡率'
      }]
    }]
  })
  const [eoptions, setEptions] = useState({   //
    series: [{ type: "line" }],
    dataset: {}
  })
  const [aoptions, setAptions] = useState({   //
    series: [{ type: "line" }],
    dataset: {}
  })
  const GetSns = async () => {
    try {
      const resp = await QueryTransformerList(params.siteId);
      if (resp.success) {
        if (resp.data) {
          state.btnLength = resp.data
        } else {
          state.btnLength = []
        }
      } else {
        message.error("获取信息失败!");
      }
    } catch (err) { }
  };

  useEffect(() => {
    GetSns();
  }, []);
  const GetInformation = async () => {
    try {
      const resp = await QueryTransformerInformation(params.siteId, params.transformerId);
      if (resp.success) {
        if (resp.data) {
          state.detailData = resp.data
        } else {
          state.detailData = {}
        }
      } else {
        message.error("获取设备信息失败!");
      }
    } catch (err) { }
  };




  useEffect(() => {
    GetInformation();
  }, [params.transformerId]);
  const chooseBtn = (item, index) => {
    console.log(item, index)
    state.active = index
    params.transformerId = item.id
    params1.transformerId = item.id
  }


  const changeTime = (e, index) => {
    console.log(e, index)
    if (index == 1) {
      params.type = parseInt(e)
    } else {
      params1.type = parseInt(e)
    }

  }//切换日月年

  const onChangeDate = (date, dateString, index) => {
    console.log(date, dateString, index);
    if (!dateString) return;
    if (index == 1) {
      if (params.type == 1) {
        params.startDate = dateString
        params.endDate = dateString
      } else if (params.type == 2) {
        params.startDate = dateString + '-01'
        params.endDate = dateString + '-01'
      } else if (params.type == 3) {
        params.startDate = dateString + '-01-01'
        params.endDate = dateString + '-01-01'
      } else {
        params.startDate = dateString[0]
        params.endDate = dateString[1]
      }
    } else {
      if (params1.type == 1) {
        params1.startDate = dateString
        params1.endDate = dateString
      } else if (params1.type == 2) {
        params1.startDate = dateString + '-01'
        params1.endDate = dateString + '-01'
      } else if (params1.type == 3) {
        params1.startDate = dateString + '-01-01'
        params1.endDate = dateString + '-01-01'
      } else {
        params1.startDate = dateString[0]
        params1.endDate = dateString[1]
      }
    }
  };
  const disabledDate = (current) => {
    return current > dayjs().endOf('day');
  };
  const cref = useRef(null)
  

  const getData = async () => {
    try {
      const resp = await QueryTransformerLoadRateRealtime(params);
      if (resp.success) {
        if (resp.data) {
          state.alltableData=resp.data.loadRateTimeRatios
          let edataset = {
            dimensions: [
              { name: 'x', type: 'time' },
              { name: "y", displayName: '变压器实时负载率' },
            ],
            source: resp.data.trend,
          }
          setOption({ ...option, series: [{ ...option.series[0], data: [{ value: resp.data?.loadRateRealtime,name: '实时负载率' }] }] })
          setEptions({ ...eoptions, dataset: edataset, xAxis: { axisLabel: { interval: 'auto' } } })
        } else {
          //setDataList([])
        }
      } else {
        message.error("获取设备信息失败!");
      }
    } catch (err) { }
  }
  const getData1 = async () => {
    try {
      const resp = await QueryTransformerUnbalanceRateRealtime(params1);
      if (resp.success) {
        if (resp.data) {
          state.alltableData1=resp.data.unbalanceRateTimeRatios
          let edataset = {
            dimensions: [
              { name: 'x', type: 'time' },
              { name: "y", displayName: '变压器实时不平衡率' },
            ],
            source: resp.data.trend,
          }
          //setDataList(resp.data)
          setOption1({ ...option1, series: [{ ...option1.series[0], data: [{ value: resp.data?.unbalanceRateRealtime,name: '实时不平衡率' }] }] })
          setAptions({ ...aoptions, dataset: edataset, xAxis: { axisLabel: { interval: 'auto' } } })
        } else {
          //setDataList([])
        }
      } else {
        message.error("获取设备信息失败!");
      }
    } catch (err) { }
  }
  
  useEffect(() => {
    getData();
  }, [JSON.stringify(params)]);
  useEffect(() => {
    getData1();
  }, [JSON.stringify(params1)]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
      <LeftBox>
        {/* <div style={{ width: "100%", height: "20px", display: "flex", flexDirection: "row", alignItems: 'center', marginBottom: '16px' }}>
          <Circle></Circle>
          <Title>变电站选择</Title>
        </div>
        {state.btnLength.length > 0 && state.btnLength.map((item, index) => {
          return index == state.active ? (<ChooseBtn key={index} onClick={() => chooseBtn(item, index)}>1#物联变电站</ChooseBtn>) :
            (<NoChooseBtn onClick={() => chooseBtn(item, index)}>2#物联变电站</NoChooseBtn>)
        })}
        <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider> */}
        <div style={{ width: "100%", height: "20px", display: "flex", flexDirection: "row", alignItems: 'center', marginBottom: '16px' }}>
          <Circle></Circle>
          <Title>变压器选择</Title>
        </div>
        {state.btnLength.length > 0 && state.btnLength.map((item, index) => {
          return index == state.active ? (<ChooseBtn key={index} onClick={() => chooseBtn(item, index)}>{item.name}</ChooseBtn>) :
            (<NoChooseBtn onClick={() => chooseBtn(item, index)}>{item.name}</NoChooseBtn>)
        })}
        <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider>
        <div style={{ width: "100%", height: "20px", display: "flex", flexDirection: "row", alignItems: 'center', marginBottom: '16px' }}>
          <Circle></Circle>
          <Title>变压器信息</Title>
        </div>
        <div style={{ width: 206, height: 240, display: "flex", flexDirection: "column" }}>
          <div style={{ width: 206, height: 40, display: "flex", flexDirection: "row", border: '1px solid #d7d7d7', borderBottom: 'none' }}>
            <div style={{ width: 88, height: 40, backgroundColor: '#e5effc', textAlign: 'center', borderRight: '1px solid #d7d7d7', display: "flex", alignItems: 'center', justifyContent: 'center' }}>名称</div>
            <div style={{ width: 120, height: 40, backgroundColor: '#e5effc', textAlign: 'center', display: "flex", alignItems: 'center', justifyContent: 'center' }}>{state.detailData?.name}</div>
          </div>
          <div style={{ width: 206, height: 40, display: "flex", flexDirection: "row", border: '1px solid #d7d7d7', borderBottom: 'none' }}>
            <div style={{ width: 88, height: 40, textAlign: 'center', borderRight: '1px solid #d7d7d7', display: "flex", alignItems: 'center', justifyContent: 'center' }}>型号</div>
            <div style={{ width: 120, height: 40, textAlign: 'center', display: "flex", alignItems: 'center', justifyContent: 'center' }}>{state.detailData?.category}</div>
          </div><div style={{ width: 206, height: 40, display: "flex", flexDirection: "row", border: '1px solid #d7d7d7', borderBottom: 'none' }}>
            <div style={{ width: 88, height: 40, textAlign: 'center', borderRight: '1px solid #d7d7d7', display: "flex", alignItems: 'center', justifyContent: 'center' }}>额定容量</div>
            <div style={{ width: 120, height: 40, textAlign: 'center', display: "flex", alignItems: 'center', justifyContent: 'center' }}>{state.detailData?.ratedCapacity}</div>
          </div><div style={{ width: 206, height: 40, display: "flex", flexDirection: "row", border: '1px solid #d7d7d7', borderBottom: 'none' }}>
            <div style={{ width: 88, height: 40, textAlign: 'center', borderRight: '1px solid #d7d7d7', display: "flex", alignItems: 'center', justifyContent: 'center' }}>额度电压</div>
            <div style={{ width: 120, height: 40, textAlign: 'center', display: "flex", alignItems: 'center', justifyContent: 'center' }}>{state.detailData?.limitVoltage}</div>
          </div><div style={{ width: 206, height: 40, display: "flex", flexDirection: "row", border: '1px solid #d7d7d7', borderBottom: 'none' }}>
            <div style={{ width: 88, height: 40, textAlign: 'center', borderRight: '1px solid #d7d7d7', display: "flex", alignItems: 'center', justifyContent: 'center' }}>额度频率</div>
            <div style={{ width: 120, height: 40, textAlign: 'center', display: "flex", alignItems: 'center', justifyContent: 'center' }}>{state.detailData?.limitFrequency}</div>
          </div><div style={{ width: 206, height: 40, display: "flex", flexDirection: "row", border: '1px solid #d7d7d7' }}>
            <div style={{ width: 88, height: 40, textAlign: 'center', borderRight: '1px solid #d7d7d7', display: "flex", alignItems: 'center', justifyContent: 'center' }}>接线联结</div>
            <div style={{ width: 120, height: 40, textAlign: 'center', display: "flex", alignItems: 'center', justifyContent: 'center' }}>{state.detailData?.wiringConnection}</div>
          </div>
        </div>
      </LeftBox>
      <RightBox>
        <Titlelayout title='变压器实时负载率' style={{ width: 1422, height: '50%', marginBottom: 16 }} extra={
          <Header>
            <div>
              <span style={{ marginRight: "10px" }}>时间查询</span>
              <Select defaultValue="1" style={{ width: 96, marginRight: 16 }} onChange={(e) => changeTime(e, 1)}
                options={[
                  { value: '1', label: '日', },
                  { value: '2', label: '月', },
                  { value: '3', label: '年' },
                  { value: '4', label: '自定义' },
                ]}
              />
              {params.type == 1 ? <DatePicker onChange={(date, dateString) => onChangeDate(date, dateString, 1)} defaultValue={moment(today)} disabledDate={disabledDate} /> :
                params.type == 2 ? <DatePicker onChange={(date, dateString) => onChangeDate(date, dateString, 1)} defaultValue={moment(tmonth)} picker='month' disabledDate={disabledDate} /> :
                  params.type == 3 ? <DatePicker onChange={(date, dateString) => onChangeDate(date, dateString, 1)} picker='year' disabledDate={disabledDate} /> :
                    <RangePicker onChange={(date, dateString) => onChangeDate(date, dateString, 1)} defaultValue={[moment(today), moment(today)]} disabledDate={disabledDate} />
              }
            </div>
          </Header>
        }>
          <Charts>
            <div style={{ width: 500, height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              {/* {state.alltableData.length > 0 ?
                <Icharts custoption={option}></Icharts> : <Cempty tip="暂无数据" />} */}
                <div style={{ width: 500, height: 278 }}>
                <Icharts custoption={option} />
                </div>
              <div style={{ height: 72, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: 36, display: 'flex', flexDirection: 'row', border: '1px solid #d7d7d7', borderBottom: 'none' }}>
                  <Tbh>负载率</Tbh>
                  <Tbb>{'<30%'}</Tbb>
                  <Tbb>30%~85%</Tbb>
                  <Tbb>{'85%~100%'}</Tbb>
                  <Tbb style={{ borderRight: 'none' }}>{'>=100%'}</Tbb>
                </div>
                <div style={{ width: '100%', height: 36, display: 'flex', flexDirection: 'row', border: '1px solid #d7d7d7' }}>
                  <Tbh>时间占比</Tbh>
                  <Tbb>{state.alltableData[0]?.timeRatio}</Tbb>
                  <Tbb>{state.alltableData[1]?.timeRatio}</Tbb>
                  <Tbb>{state.alltableData[2]?.timeRatio}</Tbb>
                  <Tbb style={{ borderRight: 'none' }}>{state.alltableData[3]?.timeRatio}</Tbb>
                </div>
              </div>
            </div>
            <div style={{ height: 350, width: 872, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* {state.alltableData.length > 0 ?
                <Icharts custoption={{
                  ...state.chartsOpts
                }}></Icharts> : <Cempty tip="暂无数据" />} */}
                <div style={{ width: 872, height: 350 }}>
                <Icharts {...eoptions} />
                </div>
            </div>

          </Charts>
        </Titlelayout>
        <Titlelayout title='实时不平衡率' style={{ width: 1422, height: '50%' }} extra={
          <Header>
            <div>
              <span style={{ marginRight: "10px" }}>时间查询</span>
              <Select defaultValue="1" style={{ width: 96, marginRight: 16 }} onChange={(e) => changeTime(e, 2)}
                options={[
                  { value: '1', label: '日', },
                  { value: '2', label: '月', },
                  { value: '3', label: '年' },
                  { value: '4', label: '自定义' },
                ]}
              />
              {params1.type == 1 ? <DatePicker style={{ marginRight: '16px' }} onChange={(date, dateString) => onChangeDate(date, dateString, 2)} defaultValue={moment(today)} disabledDate={disabledDate} /> :
                params1.type == 2 ? <DatePicker style={{ marginRight: '16px' }} onChange={(date, dateString) => onChangeDate(date, dateString, 2)} defaultValue={moment(tmonth)} picker='month' disabledDate={disabledDate} /> :
                  params1.type == 3 ? <DatePicker style={{ marginRight: '16px' }} onChange={(date, dateString) => onChangeDate(date, dateString, 2)} picker='year' disabledDate={disabledDate} /> :
                    <RangePicker style={{ marginRight: '16px' }} disabledDate={disabledDate} onChange={(date, dateString) => onChangeDate(date, dateString, 2)} defaultValue={[moment(today), moment(today)]} />
              }
            </div>
          </Header>
        }>
          <Charts>
            <div style={{ width: 500, height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              {/* {state.xAxis.length > 0 ?
                <Icharts custoption={{
                  ...state.chartsOpts
                }}></Icharts> : <Cempty tip="暂无数据" />} */}
                <div style={{ width: 500, height: 278 }}>
                <Icharts custoption={option1} />
                </div>
              <div style={{ height: 72, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: 36, display: 'flex', flexDirection: 'row', border: '1px solid #d7d7d7', borderBottom: 'none' }}>
                  <Tbh>不平衡率</Tbh>
                  <Tbb style={{ width: 176 }}>安全</Tbb>
                  <Tbb style={{ borderRight: 'none', width: 176 }}>不安全</Tbb>
                </div>
                <div style={{ width: '100%', height: 36, display: 'flex', flexDirection: 'row', border: '1px solid #d7d7d7' }}>
                  <Tbh >时间占比</Tbh>
                  <Tbb style={{ width: 176 }}>{state.alltableData1[0]?.safeState==0?state.alltableData1[0]?.timeRatio:state.alltableData1[1]?.timeRatio}</Tbb>
                  <Tbb style={{ borderRight: 'none', width: 176 }}>{state.alltableData1[1]?.safeState==1?state.alltableData1[1]?.timeRatio:state.alltableData1[0]?.timeRatio}</Tbb>
                </div>
              </div>
            </div>
            <div style={{ height: 350, width: 872, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* {state.xAxis.length > 0 ?
                <Icharts custoption={{
                  ...state.chartsOpts
                }}></Icharts> : <Cempty tip="暂无数据" />} */}
                <div style={{ width: 872, height: 350 }}>
                <Icharts {...aoptions} />
                </div>
            </div>
          </Charts>
        </Titlelayout>
      </RightBox>
    </div>
  );
}
