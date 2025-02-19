import React, { useState, useRef, useEffect, useCallback } from "react";
import Titlelayout from "@com/titlelayout";
import { DatePicker, Space, Radio, Divider, message } from "antd";
import moment from "moment";
import styled from "styled-components";
import { DistributionCabinet } from "@api/api.js";
import { useSelector } from "react-redux";
import { useReactive } from "ahooks";
import { useNavigate,} from "react-router-dom"; 
import Cempty from '@com/useEmpty'
import { CustButton } from "@com/useButton"
import Modal from "@com/useModal"
import Table from "@com/useTable"
import warn from "./u160.jpg"
import img1 from "./energy.svg"
import img2 from "./p.svg"
import img3 from "./v.svg"
import img4 from "./today.svg"
import normal from "./right.svg"
import abnormal from "./false.svg"
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
  Overview,
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
    groupName: ''
  });
  const navigate = useNavigate();
  const [dataList, setDataList] = useState([])
  const GetSns = async () => {
    try {
      if (!projectId) {
        throw new Error("projectId 未定义");
      }
      const resp = await Overview(projectId);
      if (resp.success) {
        if (resp.data) {
          setDataList(resp.data)
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
    loadRate: '91.31',
    name: 'T2 变压器负载率（%）'
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setBoxData((prevData) =>
        prevData.name === 'T2 变压器负载率（%）'
          ? { loadRate: '81.33', name: 'T1 变压器负载率（%）' }
          : { loadRate: '91.31', name: 'T2 变压器负载率（%）' }
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState();

  const SiteOverview = ({ item, name, num }) => {
    setCurrentItem(item)
    const currentTransformer = item.transformers[currentIndex];
    return (
      <Box
        img={num == 1 ?img3:img4}
        value={num == 1 ? currentTransformer.loadRate : currentTransformer.dayEnergy}
        name={num == 1 ? `${currentTransformer.name + name}` : `${currentTransformer.name.slice(0, 2) + name}`}
      />
    );
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentItem.transformers.length);
    }, 2000);

    // 清除定时器以防止内存泄漏
    return () => clearInterval(intervalId);
  }, [currentItem?.transformers.length]);
  const gotoDetails = (item) => {
    navigate(`/index/cabinets/diskchart?id=${item.siteId}`, {state: {title: '盘面图监控', nested: 'diskchart', primary: 'cabinets'}})
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {dataList.length > 0 && dataList.map((item, index) => {
        return (
          <BoxStyle onClick={() => gotoDetails(item)} key={index}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: '4px' }}>
              <img src={warn} width={253} height={166}></img>
              <div style={{ width: 380, height: '100%', padding: '16px 0' }}>
                <p style={{ fontSize: 24, color: '#515151', marginBottom: 48 }}>{item.siteName}</p>
                <p style={{ fontSize: 16, color: '#515151', marginBottom: 24 }}>设备：变压器{item.transformerNum}台</p>
                <p style={{ fontSize: 16, color: '#515151' }}>{item.siteAddress}</p>
              </div>
              <Box img={img1} value={item.dayEnergy} name={'当日能耗（kWh）'} />
              <Box img={img2} value={item.powerFactor} name={'功率因数'} />
              <SiteOverview item={item} name='负载率(%)' num={1} />
              <SiteOverview item={item} name='当日能耗(kWh)' num={2} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: 180, height: 166 }}>
                <div style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0px 16px',
                  justifyContent: 'space-between', width: 180, height: 74, border: '1px solid #d7d7d7'
                }}>
                  <img src={normal} width={32} height={32}></img>
                  <div>
                    <p style={{ fontSize: 14, color: '#515151' }}>正常通信设备数</p>
                    <p style={{ fontSize: 28, color: '#333333', textAlign: 'center' }}>{item.communicationNormalNum}</p>
                  </div>
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0px 16px',
                  justifyContent: 'space-between', width: 180, height: 74, border: '1px solid #d7d7d7'
                }}>
                  <img src={abnormal} width={32} height={32}></img>
                  <div>
                    <p style={{ fontSize: 14, color: '#515151' }}>异常通信设备数</p>
                    <p style={{ fontSize: 28, color: '#ff3333', textAlign: 'center' }}>{item.communicationAbnormalNum}</p>
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
