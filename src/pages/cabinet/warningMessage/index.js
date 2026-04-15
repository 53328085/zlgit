import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Input, Radio, Divider, Select, message, Button, Tag, Drawer, Steps } from "antd";
import dayjs from 'dayjs';

import styled from "styled-components";
import { DistributionCabinet } from "@api/api.js";
import { useSelector } from "react-redux";
import { useReactive } from "ahooks";
import Icharts from "@com/useEcharts/Ichart.js";
import Cempty from '@com/useEmpty'
import { CustButton } from "@com/useButton"
import Modal from "@com/useModal"
import Table from "@com/useTable"
import img3 from "./u252.svg"
import img1 from "./u255.svg"
import img2 from "./u258.svg"
import img4 from "./u544.svg"
import img5 from "./u545.svg"
import { ExportExcel } from '@com/useButton'
import { useAntdTable } from 'ahooks'
const { RangePicker } = DatePicker;
const { TextArea } = Input;
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
const Line = styled.div`
width:4px;
height:32px;
margin-right:16px;
background-color: ${props => props.theme.primaryColor};
`;
const Right = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 16px;
`;
const RightTop = styled.div`
  width: 100%;
  height: 128px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
`;
const TopBox = styled.div`
  width: 320px;
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
  width: 100%;
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
justify-content:space-between;
margin-bottom:16px;
`;
const Charts = styled.div`
  height: 784px;
  display: flex;
`;
const Details = styled.div`
  width:486px;
  height: 221px;
  display: flex;
  flex-direction: row;
  border:1px solid #d7d7d7;
  border-bottom: none
`;
const DetailsLeft = styled.div`
  width:174px;
  height: 40px;
  text-align: center;
  display: flex;
  border-right:1px solid #d7d7d7;
  align-items: center;
  justify-content: center;
`;
const DetailsRight = styled.div`
  width:312px;
  height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const {
  QueryAlarmOverview, QueryAlarmInformation, QueryAlarmDetail, ConfirmAlarmState
} = DistributionCabinet;
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
    overview: {},
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
  const today = dayjs().startOf('day');
  const tmonth = dayjs().startOf('month')
  const tyear = dayjs().startOf('year')
  const tbref = useRef()
  const params = useReactive({
    siteId: 1,
    alarmLevel: 0,
    type: 1,
    startDate: dayjs(today).format('YYYY-MM-DD'),
    endDate: dayjs(today).format('YYYY-MM-DD'),
  });
  const GetSns = async () => {
    try {
      const resp = await QueryAlarmOverview(params.siteId);
      if (resp.success) {
        if (resp.data) {
          state.overview = resp.data
        } else {
          state.overview = {}
        }
      } else {
        message.error("获取信息失败!");
      }
    } catch (err) { }
  };

  useEffect(() => {
    GetSns();
  }, []);

  const changeTime = (e) => {
    console.log(e)
    params.type = parseInt(e)
    if (params.type == 1) {
      params.startDate = dayjs(today).format('YYYY-MM-DD')
      params.endDate = dayjs(today).format('YYYY-MM-DD')
    } else if (params.type == 2) {
      params.startDate = dayjs(tmonth).format('YYYY-MM') + '-01'
      params.endDate = dayjs(tmonth).format('YYYY-MM') + '-01'
    } else if (params.type == 3) {
      params.startDate = dayjs(today).format('YYYY') + '-01-01'
      params.endDate = dayjs(today).format('YYYY') + '-01-01'
    } else {
      params.startDate = dayjs(today).format('YYYY-MM-DD')
      params.endDate = dayjs(today).format('YYYY-MM-DD')
    }
    run(1, 14)
  }//切换日月年


  const onChangeDate = (date, dateString) => {
    if (!dateString) return;
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
      params.endDate = dateString[0]
    }
    run(1, 14)
  };
  const disabledDate = (current) => {
    return current > dayjs().endOf('day');
  };
  const columns = [
    {
      title: '告警等级', dataIndex: 'alarmLevel', align: "center", width: '78px',
      render: (text, record, index) => {
        return text == 3 ? <span style={{ backgroundColor: '#ff3366', color: '#fff', width: '100%', height: '100%', display: 'block' }}>高</span> :
          text == 2 ? <span style={{ backgroundColor: '#ffcc66', color: '#fff', width: '100%', height: '100%', display: 'block' }}>中</span> :
            <span style={{ backgroundColor: '#9933cc', color: '#fff', width: '100%', height: '100%', display: 'block' }}>低</span>
      }
    },
    { title: '最新告警时间', dataIndex: 'lastAlarmTime', align: "center", },
    { title: '告警详情', dataIndex: 'alarmDetail', align: "center", },
    { title: '设备类型', dataIndex: 'deviceCategory', align: "center", },
    { title: '报警位置', dataIndex: 'alarmLocation', align: "center", },
    {
      title: '状态', dataIndex: 'alarmState', align: "center", render: (text, record, index) => {
        return text == 0 ? <Tag color="processing">已解除</Tag> : text == 1 ? <Tag color="success" onClick={() => { gotoSure(record) }}>已确认</Tag> :
          <Tag color="error" onClick={() => { gotoSure(record) }}>未确认</Tag>
      }
    },
  ]
  const details = useReactive({
    // alarmClearTime:'',
    // alarmConfirmTime:'',
    // alarmLevel:'',
    // alarmLocation:'',
    // alarmOccurTime:'',
    alarmRecord: '',
    // alarmState:'',
    // alarmType:'',
    // cabinetName:'',
    // deviceName:'',
    // lineName:'',
    // siteName:''
  });
  const gotoSure = async (record) => {
    console.log(record)
    details.alarmId = record.alarmId
    try {
      const resp = await QueryAlarmDetail(record.alarmId);
      if (resp.success) {
        if (resp.data) {
          Object.assign(details, resp.data)
          setOpen(true);
        } else {

        }
      } else {
        message.error("获取信息失败!");
      }
    } catch (error) {
      console.log(error)
    }

  }
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const getTableData = async ({ current, pageSize }) => {
    try {
      const resp = await QueryAlarmInformation(params);
      if (resp.success) {
        if (resp.data) {
          return {
            list: resp.data,
            total: resp.data.length,
          }
        } else {
          return {
            list: [],
            total: 0,
          }
        }
      } else {
        message.error("获取信息失败!");
      }
    } catch (err) { }
  }
  const { tableProps, refresh, run, search } = useAntdTable(getTableData, {
    defaultPageSize: 14,
  })
  const options = [
    {
      label: '全部',
      value: 0,
    },
    {
      label: '高',
      value: 3,
    },
    {
      label: '中',
      value: 2,
    },
    {
      label: '低',
      value: 1,
    },
  ];
  const levelChange = (e) => {
    console.log(e)
    params.alarmLevel = e.target.value
    run(1, 14)
  }
  const onChangeInput = (e) => {
    details.alarmRecord = e.target.value
  }
  const comfirmAlarm = async () => {
    try {
      if (details.alarmRecord == '') return message.warning("告警记录不能为空!");
      const resp = await ConfirmAlarmState(details.alarmId, details.alarmRecord);
      if (resp.success) {
        message.success("确认告警信息成功!");
        setOpen(false);
        run(1, 14)
      } else {
        message.error("确认告警信息失败!");
      }
    } catch (error) {

    }
  }
  const Title = ({ title }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', flexDirection: 'row' }}>
        <Line></Line>
        <div>{title}</div>
      </div>
    )
  }
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
      <Right>
        <RightTop>
          <TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={img1} width={48} height={48}></img>
            </div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>连续无告警运行时间</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#515151', textAlign: 'center', marginRight: '16px' }}>{state.overview?.continuousNoAlarmTime}</span>天</p>
            </TopRight>
          </TopBox>
          <TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={img2} width={48} height={48}></img>
            </div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>当前未确认报警总数</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#ff0000', textAlign: 'center', marginRight: '16px' }}>{state.overview?.curUnconfirmedAlarmNum}</span>条</p>
            </TopRight>
          </TopBox><TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={img3} width={48} height={48}></img>
            </div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>当前跳闸断路器数</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#ff0000', textAlign: 'center', marginRight: '16px' }}>{state.overview?.circuitBreakerTripNum}</span>台</p>
            </TopRight>
          </TopBox><TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={img4} width={48} height={48}></img>
            </div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>当前离线设备数</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#515151', textAlign: 'center', marginRight: '16px' }}>{state.overview?.deviceOfflineNum}</span>台</p>
            </TopRight>
          </TopBox><TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={img5} width={48} height={48}></img>
            </div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>频繁离线设备数</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#515151', textAlign: 'center', marginRight: '16px' }}>{state.overview?.deviceFrequentOfflineNum}</span>台</p>
            </TopRight>
          </TopBox>
        </RightTop>
        <RightBox>
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
              {params.type == 1 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={dayjs(today)} disabledDate={disabledDate} /> :
                params.type == 2 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={dayjs(tmonth)} picker='month' disabledDate={disabledDate} /> :
                  params.type == 3 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} picker='year' defaultValue={dayjs(tyear)} disabledDate={disabledDate} /> :
                    <RangePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={[dayjs(today), dayjs(today)]} disabledDate={disabledDate} />
              }
              {/* <Button type="primary" style={{ marginLeft: 32, width: 96 }}  onClick={submit}>开始诊断</Button> */}
            </div>
            <div>
              <span style={{ marginRight: "10px" }}>告警等级查询</span>
              <Radio.Group
                block
                options={options}
                defaultValue={0}
                optionType="button"
                buttonStyle="solid"
                onChange={levelChange}
              />
            </div>
            {/* <ExportExcel tb={tbref} /> */}
          </Header>
          <Table columns={columns} ref={tbref}   {...tableProps} scroll={{
            y: 55 * 5,
          }}></Table>
        </RightBox>
      </Right>
      <Drawer
        title=''
        closable={true}
        width={570}
        onClose={onClose}
        open={open}
      >
        <Title title='告警详情'></Title>
        <div style={{ height: '288px', padding: '16px' }}>
          <div style={{ width: 486, height: 221, display: "flex", flexDirection: "column" }}>
            <Details>
              <DetailsLeft>报警类别</DetailsLeft>
              <DetailsRight>{details?.alarmType}</DetailsRight>
            </Details>
            <Details>
              <DetailsLeft>变电站</DetailsLeft>
              <DetailsRight>{details?.siteName}</DetailsRight>
            </Details>
            <Details>
              <DetailsLeft>柜体</DetailsLeft>
              <DetailsRight>{details?.cabinetName}</DetailsRight>
            </Details>
            <Details>
              <DetailsLeft>回路名称</DetailsLeft>
              <DetailsRight>{details?.lineName}</DetailsRight>
            </Details>
            <Details>
              <DetailsLeft>报警设备</DetailsLeft>
              <DetailsRight>{details?.deviceName}</DetailsRight>
            </Details>
            <Details style={{ borderBottom: '1px solid #d7d7d7' }}>
              <DetailsLeft>通信地址</DetailsLeft>
              <DetailsRight>{details?.alarmLocation}</DetailsRight>
            </Details>
          </div>
        </div>
        <Title title='告警等级'> </Title>
        <div style={{ height: '80px', padding: '16px' }}>
          {
            details?.alarmLevel == 3 ? <Tag color="red" style={{ width: 128, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>高风险</Tag> :
              details?.alarmLevel == 2 ? <Tag color="yellow" style={{ width: 128, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>中风险</Tag> :
                <Tag color="green" style={{ width: 128, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>低风险</Tag>
          }
        </div>
        <Title title='告警状态'></Title>
        <div style={{ height: '200px', padding: '16px' }}>
          <Steps
            direction="vertical"
            size="small"
            current={details?.alarmState == 2 ? 1 : details?.alarmState == 1 ? 2 : 3}
            items={[
              {
                title: '告警发生',
                description: details?.alarmOccurTime,
              },
              {
                title: '告警确认',
                description: details?.alarmConfirmTime,
              },
              {
                title: '报警解除',
                description: details?.alarmClearTime,
              },
            ]}
          />
        </div>
        <Title title='告警记录'></Title>
        <div style={{ height: '200px', padding: '16px' }}>
          <TextArea rows={4} value={details?.alarmRecord} onChange={(e) => onChangeInput(e)} />
        </div>
        <div>
          <Button style={{ marginRight: 16, width: 96 }} onClick={onClose}>取消</Button>
          <Button type="primary" style={{ marginLeft: 32, width: 96 }} disabled={details?.alarmState != 2} onClick={comfirmAlarm}>确认</Button>
        </div>
      </Drawer>
    </div>
  );
}
