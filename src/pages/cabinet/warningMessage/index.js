import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Input, Radio, Divider, Select, Tree, Button, Tag, Drawer, Steps } from "antd";
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
    details: {},
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
    {
      title: '告警等级', dataIndex: 'name', align: "center",
      render: (text, record, index) => {
        return text == '高' ? <span style={{ backgroundColor: '#ff3366', color: '#fff', width: '100%', height: '100%', display: 'block' }}>{record}</span> :
          text == '中' ? <span style={{ backgroundColor: '#ffcc66', color: '#fff', width: '100%', height: '100%', display: 'block' }}>{text}</span> :
            <span style={{ backgroundColor: '#9933cc', color: '#fff', width: '100%', height: '100%', display: 'block' }}>{record}</span>
      }
    },
    { title: '最新告警时间', dataIndex: 'name', align: "center", },
    { title: '告警详情', dataIndex: 'name', align: "center", },
    { title: '设备类型', dataIndex: 'name', align: "center", },
    { title: '报警位置', dataIndex: 'name', align: "center", },
    {
      title: '状态', dataIndex: 'name', align: "center", render: (text, record, index) => {
        return text == '已确认' ? <Tag color="success">已确认</Tag> : <Tag color="error" onClick={() => { gotoSure(record) }}>未确认</Tag>
      }
    },
  ]
  const gotoSure = (record) => {
    console.log(record)
    setOpen(true);
  }
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const getTableData = ({ current, pageSize }) => {
    return {
      list: [1, 2, 3],
      total: 3,
    }
  }
  const { tableProps, refresh, run, search } = useAntdTable(getTableData, {
    defaultPageSize: 14,
  })
  const { submit } = search
  const options = [
    {
      label: '全部',
      value: '0',
    },
    {
      label: '高',
      value: '1',
    },
    {
      label: '中',
      value: '2',
    },
    {
      label: '低',
      value: '3',
    },
  ];
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
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={img} width={48} height={48}></img></div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>连续无告警运行时间</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#515151', textAlign: 'center', marginRight: '16px' }}>12</span>天</p>
            </TopRight>
          </TopBox>
          <TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={img} width={48} height={48}></img></div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>当前未确认报警总数</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#ff0000', textAlign: 'center', marginRight: '16px' }}>12</span>条</p>
            </TopRight>
          </TopBox><TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={img} width={48} height={48}></img></div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>当前跳闸断路器数</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#ff0000', textAlign: 'center', marginRight: '16px' }}>12</span>台</p>
            </TopRight>
          </TopBox><TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={img} width={48} height={48}></img></div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>当前离线设备数</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#515151', textAlign: 'center', marginRight: '16px' }}>12</span>台</p>
            </TopRight>
          </TopBox><TopBox>
            <div style={{ width: 115, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={img} width={48} height={48}></img></div>
            <TopRight>
              <p style={{ fontSize: '16px', color: '#515151', textAlign: 'center' }}>频繁离线设备数</p>
              <p style={{ fontSize: '16px', color: '#999999', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#515151', textAlign: 'center', marginRight: '16px' }}>12</span>台</p>
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
              {reportTypeTime == 1 ? <DatePicker onChange={onChangeDate} defaultValue={moment(today)} /> :
                reportTypeTime == 2 ? <DatePicker onChange={onChangeDate} defaultValue={moment(tmonth)} picker='month' /> :
                  reportTypeTime == 3 ? <DatePicker onChange={onChangeDate} picker='year' /> : <RangePicker />
              }
              {/* <Button type="primary" style={{ marginLeft: 32, width: 96 }}  onClick={submit}>开始诊断</Button> */}
            </div>
            <div>
              <span style={{ marginRight: "10px" }}>告警等级查询</span>
              <Radio.Group
                block
                options={options}
                defaultValue="0"
                optionType="button"
                buttonStyle="solid"
              />
            </div>
            {/* <ExportExcel tb={tbref} /> */}
          </Header>
          <Table columns={columns} ref={tbref}   {...tableProps} ></Table>
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
              <DetailsRight>温度超限告警</DetailsRight>
            </Details>
            <Details>
              <DetailsLeft>变电站</DetailsLeft>
              <DetailsRight>1#配电站</DetailsRight>
            </Details>
            <Details>
              <DetailsLeft>柜体</DetailsLeft>
              <DetailsRight>BB2</DetailsRight>
            </Details>
            <Details>
              <DetailsLeft>回路名称</DetailsLeft>
              <DetailsRight>/</DetailsRight>
            </Details>
            <Details>
              <DetailsLeft>报警设备</DetailsLeft>
              <DetailsRight>B相温度传感器</DetailsRight>
            </Details>
            <Details style={{ borderBottom: '1px solid #d7d7d7' }}>
              <DetailsLeft>通信地址</DetailsLeft>
              <DetailsRight>215085845013</DetailsRight>
            </Details>
          </div>
        </div>
        <Title title='告警等级'> </Title>
        <div style={{ height: '80px', padding: '16px' }}>
          {
            state.details?.level == 1 ? <Tag color="red" style={{ width: 128, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>高风险</Tag> :
              state.details?.level == 1 ? <Tag color="yellow" style={{ width: 128, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>中风险</Tag> :
                <Tag color="green" style={{ width: 128, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>低风险</Tag>
          }
        </div>
        <Title title='告警状态'></Title>
        <div style={{ height: '200px',padding: '16px' }}>
          <Steps
            direction="vertical"
            size="small"
            current={1}
            items={[
              {
                title: '告警发生',
                description: '2016-12-12 12:50:00',
              },
              {
                title: '告警确认',
                description: '2016-12-12 12:50:00',
              },
              {
                title: '报警解除',
                description: '',
              },
            ]}
          />
        </div>
        <Title title='告警记录'></Title>
        <div style={{ height: '200px',padding: '16px' }}>
        <TextArea rows={4} />
        </div>
        <div>
          <Button style={{ marginRight: 16, width: 96 }} onClick={onClose}>取消</Button>
          <Button type="primary" style={{ marginLeft: 32, width: 96 }} >确认</Button>
        </div>
      </Drawer>
    </div>
  );
}
