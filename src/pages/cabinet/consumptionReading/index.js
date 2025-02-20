import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Space, Radio, Divider, Select, Tree, Button ,message} from "antd";
import moment from "moment";
import styled from "styled-components";
import { DistributionCabinet } from "@api/api.js";
import { useSelector } from "react-redux";
import { useReactive } from "ahooks";
import dayjs from 'dayjs';
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
justify-content:space-between;
margin-bottom:16px;
`;
const {
  QuerySiteList, QuerySiteStructure,QueryLineMeterReading
} = DistributionCabinet;


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
  });
  const [dataList, setDataList] = useState([])
  const today = moment().startOf('day');
  const tmonth = moment().startOf('month')
  const tbref = useRef()
  const params = useReactive({
    siteId: 1,
    structureIds: [],
    type: 1,
    startDate: moment(today).format('YYYY-MM-DD'),
    endDate:  moment(today).format('YYYY-MM-DD'),
  });
  const GetSns = async () => {
    try {
      const resp = await QuerySiteList(projectId);
      if (resp.success) {
        if (resp.data) {
          setDataList(resp.data)
          //params.siteId = resp.data[0]?.id
        } else {
          setDataList([])
        }
      } else {
        message.error("获取设备信息失败!");
      }
    } catch (err) { }

  };




  useEffect(() => {
    GetSns();
  }, []);
  const chooseBtn = (item, index) => {
    console.log(item, index)
    state.active = index
    params.siteId = item.id
  }
  const [treeData, setTreeData] = useState([])
  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState([1]);
  const getTreeData = async () => {
    try {
      const resp = await QuerySiteStructure(params.siteId);
      if (resp.success) {
        if (resp.data.id != 0) {
          let data = []
          data.push(resp.data)
          setTreeData(data)
          // 生成 defaultCheckedKeys
        const keys = [];
        const traverse = (nodes) => {
          nodes.forEach(node => {
            keys.push(node.id);
            if (node.nodes) {
              traverse(node.nodes);
            }
          });
        };
        traverse(data);
        setDefaultCheckedKeys(keys);
        params.structureIds =keys
        } else {
          setTreeData([])
        }
      } else {
        message.error("获取设备信息失败!");
      }
    } catch (err) { }
  }
  useEffect(() => {
    getTreeData();
  }, [params.siteId]);
  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setDefaultCheckedKeys(checkedKeysValue)
    params.structureIds = checkedKeysValue
  };
  const disabledDate = (current) => {
    return  current > dayjs().endOf('day');
  };
  const changeTime = (e) => {
    console.log(e)
    params.type = parseInt(e)
    if (params.type == 1) {
      params.startDate = moment(today).format('YYYY-MM-DD')
      params.endDate = moment(today).format('YYYY-MM-DD')
    } else if (params.type == 2) {
      params.startDate = moment(tmonth).format('YYYY-MM') + '-01'
      params.endDate = moment(tmonth).format('YYYY-MM') + '-01'
    } else if (params.type == 3) {
      params.startDate = moment(today).format('YYYY') + '-01-01'
      params.endDate = moment(today).format('YYYY') + '-01-01'
    } else {
      params.startDate = moment(today).format('YYYY-MM-DD')
      params.endDate = moment(today).format('YYYY-MM-DD')
    }
  }//切换日月年

 
  const onChangeDate = (date, dateString) => {
    console.log(date, dateString)
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
    console.log(params.startDate);
  };



  const columns = [
    { title: '线路名称', dataIndex: 'lineName', align: "center", },
    {
      title: '正向有功电能 kWh', align: "center", children: [
        { title: '开始', dataIndex: 'forwardEStart', key: 'companyName', },
        { title: '截止', dataIndex: 'forwardEEnd', key: 'companyName', },
        { title: '用能', dataIndex: 'forwardE', key: 'companyName', },
      ]
    }, {
      title: '反向有功电能 kWh', align: "center", children: [
        { title: '开始', dataIndex: 'reverseEStart', key: 'companyName', },
        { title: '截止', dataIndex: 'reverseEEnd', key: 'companyName', },
        { title: '用能', dataIndex: 'reverseE', key: 'companyName', },
      ]
    }, { title: '考核功率因数', dataIndex: 'evaluatedPowerFactor', align: "center", },
    { title: '正向有功最大需量 kW', dataIndex: 'forwardActiveMaxDemand', align: "center", },
  ]
  const getData = async({ current, pageSize }) => {
    try {
      const resp = await QueryLineMeterReading(params);
      if (resp.success) {
        if (resp.data) {
          return {
            list: resp.data,
            total: resp.data.total,
          }
          } else {
          return {
            list: [],
            total: 0,
          }
        }
      } else {
        message.error("获取设备信息失败!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  const { tableProps, refresh, run, search } = useAntdTable(getData, {
    defaultPageSize: 14,
  })
  const { submit } = search

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
      <LeftBox>
        {/* <div style={{ width: "100%", height: "20px", display: "flex", flexDirection: "row", alignItems: 'center', marginBottom: '16px' }}>
          <Circle></Circle>
          <Title>变电站选择</Title>
        </div>
        {dataList.length > 0 && dataList.map((item, index) => {
          return index == state.active ? (<ChooseBtn key={index} onClick={() => chooseBtn(item, index)}>{item.name}</ChooseBtn>) :
            (<NoChooseBtn onClick={() => chooseBtn(item, index)}>{item.name}</NoChooseBtn>)
        })}
        <Divider dashed style={{ borderColor: "#d7d7d7" }}></Divider> */}
        <Tree
          checkable
          checkedKeys={defaultCheckedKeys}
          defaultExpandAll={true}
          onCheck={onCheck}
          treeData={treeData}
          fieldNames={{ title: 'name', key: 'id', children: 'nodes' }}
        />
      </LeftBox>
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
            {params.type == 1 ? <DatePicker onChange={onChangeDate} defaultValue={moment(today)} disabledDate={disabledDate}/> :
              params.type == 2 ? <DatePicker onChange={onChangeDate} defaultValue={moment(tmonth)} picker='month' disabledDate={disabledDate}/> :
                params.type == 3 ? <DatePicker onChange={onChangeDate} picker='year' disabledDate={disabledDate}/> : 
                <RangePicker onChange={onChangeDate} defaultValue={[moment(today),moment(today)]} disabledDate={disabledDate}/>
            }
            <Button type="primary" style={{ marginLeft: 32, width: 96 }} onClick={submit}>查询</Button>
          </div>
          <ExportExcel tb={tbref} />
        </Header>
        <Table columns={columns} ref={tbref}   {...tableProps} ></Table>
      </RightBox>
    </div>
  );
}
