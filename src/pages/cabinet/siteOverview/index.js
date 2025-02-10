import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Space, Radio, Divider, theme } from "antd";
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
import warn from "./u160.jpg"
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
const BoxStyle = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
  background-color: #fff;
  border:1px solid #d7d7d7;
  padding: 0px 16px;
  &:hover {
    border-width: 2px;
    border-color: ${props => props.theme.primaryColor}; 
  }
`;

const {
  IAnalyse: { CompareQuery },
} = Monitoring;


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
    groupName: ''
  });

  const [dataList, setDataList] = useState([])
  const GetSns = async () => {
    try {
      if (!projectId) {
        throw new Error("projectId 未定义");
      }
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
        } else {
          setDataList([])
        }
      } else {
        state.disabled = true
        message.error("获取设备信息失败!");
      }
    } catch (error) {
      console.error("GetSns 函数执行出错:", error);
      state.disabled = true;
      message.error("获取设备信息时发生错误，请稍后再试或联系管理员！");
    }

  };




  useEffect(() => {
    GetSns();
  }, []);



  const [boxData, setBoxData] = useState({
    value: '91.31',
    name: 'T2 变压器负载率（%）'
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setBoxData((prevData) =>
        prevData.name === 'T2 变压器负载率（%）'
          ? { value: '81.33', name: 'T1 变压器负载率（%）' }
          : { value: '91.31', name: 'T2 变压器负载率（%）' }
      );
    }, 2000);

    // 清除定时器以避免内存泄漏
    return () => clearInterval(interval);
  }, []);
  const Box = ({ img, value, name }) => {
    return (
      <div style={{
        width: 180, height: 166, border: '1px solid #d7d7d7', padding: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column'
      }}>
        <img src={img} width={48} height={48}></img>
        <p style={{ fontSize: 32, color: '#333333' }}>{value}</p>
        <p style={{ fontSize: 14, color: '#515151' }}>{name}</p>
      </div>

    )
  };
  const gotoDetails = (index) => {
    console.log(index)
    //navigate('/carbon/examining/details')
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {dataList.length > 0 && dataList.map((item, index) => {
        return (
          <BoxStyle onClick={() => gotoDetails(index)}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: '4px' }}>
              <img src={warn} width={253} height={166}></img>
              <div style={{ width: 380, height: '100%', padding: '16px 0' }}>
                <p style={{ fontSize: 24, color: '#515151', marginBottom: 48 }}>1#正泰物联变电站</p>
                <p style={{ fontSize: 16, color: '#515151', marginBottom: 24 }}>设备：变压器2台</p>
                <p style={{ fontSize: 16, color: '#515151' }}>浙江省杭州市滨江区月明路56号</p>
              </div>
              <Box img={warn} value={'2541.32'} name={'当日能耗（kWh）'} />
              <Box img={warn} value={'0.95'} name={'功率因数'} />
              <Box img={warn} value={boxData.value} name={boxData.name} />
              <Box img={warn} value={'543.48'} name={'T2当日能耗（kWh）'} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: 180, height: 166 }}>
                <div style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0px 16px',
                  justifyContent: 'space-between', width: 180, height: 74, border: '1px solid #d7d7d7'
                }}>
                  <img src={warn} width={32} height={32}></img>
                  <div>
                    <p style={{ fontSize: 14, color: '#515151' }}>正常通信设备数</p>
                    <p style={{ fontSize: 28, color: '#333333', textAlign: 'center' }}>15</p>
                  </div>
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0px 16px',
                  justifyContent: 'space-between', width: 180, height: 74, border: '1px solid #d7d7d7'
                }}>
                  <img src={warn} width={32} height={32}></img>
                  <div>
                    <p style={{ fontSize: 14, color: '#515151' }}>正常通信设备数</p>
                    <p style={{ fontSize: 28, color: '#ff3333', textAlign: 'center' }}>15</p>
                  </div>
                </div>
              </div>
            </div>

          </BoxStyle>
        );
      })

      }
    </div>
  );
}
