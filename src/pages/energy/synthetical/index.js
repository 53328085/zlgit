import React, { useState, useRef, useEffect, useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio, Button, Progress, Image, Space, DatePicker, Select, Tabs} from "antd";
import styled from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import Pagecontent from "@com/pagecontent/maincontent";
import { drawEcharts } from "@com/useEcharts";
import {EnergyComprehensive} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useRequest } from 'ahooks';
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import moment from 'moment';
import imgurl from "./icon";
import { queries } from "@testing-library/dom";
const { Group, Button: Rbutton } = Radio;


const Laybox = styled.div`
  display: grid;
 // grid-template-columns: 1264px 400px;
  grid-template-rows: 512px 1fr;
  row-gap: 16px;
  flex: 1;
  .left {
    display: grid;
    grid-template-columns: 1256px 1fr;
    column-gap: 16px; 
  }
  .right {
    display: grid;
     grid-template-columns: repeat(11, 196px);
    row-gap: 16px; 
  }
`;
const Custspan = styled.span`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: ${(props) => (props.jc ? "flex-start" : "space-between")};
  span {
    color: #999;
    padding-left: 1em;
  }
`;
const Ebutton = styled(Button)`
  &,
  &:hover {
    height: 32px;
    border: 1px solid #80cc80;
    background-color: #ccffb3;
    color: #339900;
    line-height: 32px;
    font-size: 14px;
    padding-top: 0;
    padding-bottom: 0;
    width: 96px;
  }
`;
const Divbox = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  column-gap: 16px;
  margin: 8px 0 8px 0;
  align-items: center;
  .list {
    display: grid;
    grid-auto-rows: 30px;
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      span:first-child {
        color: #999;
        font-size: 14px;
      }
      span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`;
const Tabsbox = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 41px;
        width: 114px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;  
        transition: none;
        &:hover {
            background-color: var(--ant-primary-color);
            color: #fff;
            transition: all 0.3s;
        }
        .ant-tabs-tab-btn{
            transition: none;
        }
        .ant-tabs-tab-btn:active {
            color:#fff
        }
    }
    .ant-tabs-tab.ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: none;
        }
    }
   }  
 
}
`
const UDbox = styled.div`
  display: grid;
  grid-template-rows: 64px 1fr;
  row-gap: 8px;
  margin-top: 8px;
  justify-items: center;
  .list {
    display: grid;
    grid-auto-rows: 30px;
    justify-self: stretch;
    align-content: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:first-child {
        color: #999;
        font-size: 14px;
      }
      span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`;
const UDboxbord = styled(Divbox)`  
  border-top: 1px dotted #d7d7d7;
`
const Echartbox = styled.div`
   height: 100%;
   width: 100%;
   background-color: #fff;
   padding: 16px;
`
export default function Index() {
  const ref = useRef()
  const elref = useRef(null)
  const pieref = useRef();
  const projectId = useSelector(selectProjectId);
  
  const [form] = Form.useForm();
  const {Item} = Form
  const [value, setvalue] = useState("1");
  const [qverview, setOverview] = useState({})
  const [timetype, setTimetype] = useState(1) // 日、月、年 1， 2， 3
  const picker= ['', 'date', 'month', 'year'][timetype];
  const detail = queries['detail'];
  const Chartbox = (data) => {

    useEffect(() => {

    })
    return (
      <Echartbox ref={ref}>
 
      </Echartbox>
    )
  
}
  const tabs = [
    { label: "综合能耗", key: "1", children: <Chartbox   /> },
    { label: "电", key: "2" },
    { label: "冷水", key: "3" },
    { label: "热水", key: "4" },
    { label: "燃气", key: "5" },
    { label: "煤炭", key: "6" },
    { label: "燃油", key: "7" },
    { label: "其他", key: "8" },
  ];


  const getData = async () => {
    const {area, date, type} = form.getFieldsValue()
    let time;
    if (type == 1)  {
      time = date.format('YYYY-MM-DD')
    } else if(type == 2) {
      time = date.format('YYYY-MM') + '-01'

    } else if(type == 3) {
       time = date.format('YYYY')+ '-01-01'
    }
    const querys = {
      type,
      projectId,
      date: time
   }
    const param = [area]
    try {
     let {success, data} =  await EnergyComprehensive.EnergyOverViewRuntime(querys, param)
     if(success) {
      setOverview({...qverview, data})
     }else {
       return {}
     }
    } catch (e) {
      console.log(e)
    }
  }
  const ontabChange = (e) => {

  }
  useEffect(() => {
    getData()
  }, [])


  const datasetDay = {
    dimensions: ["time", "今日能耗(吨标煤)", "昨日能耗(吨标煤)"],
    source: [
      { time: "00:00", "今日能耗(吨标煤)": 56, "昨日能耗(吨标煤)": 96 },
      { time: "00:01", "今日能耗(吨标煤)": 46, "昨日能耗(吨标煤)": 36 },
      { time: "00:02", "今日能耗(吨标煤)": 36, "昨日能耗(吨标煤)": 46 },
      { time: "00:03", "今日能耗(吨标煤)": 56, "昨日能耗(吨标煤)": 96 },
      { time: "00:04", "今日能耗(吨标煤)": 56, "昨日能耗(吨标煤)": 36 },
      { time: "00:05", "今日能耗(吨标煤)": 46, "昨日能耗(吨标煤)": 36 },
      { time: "00:06", "今日能耗(吨标煤)": 36, "昨日能耗(吨标煤)": 46 },
      { time: "00:07", "今日能耗(吨标煤)": 50, "昨日能耗(吨标煤)": 26 },
      { time: "00:08", "今日能耗(吨标煤)": 66, "昨日能耗(吨标煤)": 26 },
      { time: "00:09", "今日能耗(吨标煤)": 58, "昨日能耗(吨标煤)": 56 },
      { time: "00:10", "今日能耗(吨标煤)": 46, "昨日能耗(吨标煤)": 76 },
      { time: "00:11", "今日能耗(吨标煤)": 18, "昨日能耗(吨标煤)": 26 },
      { time: "00:12", "今日能耗(吨标煤)": 13, "昨日能耗(吨标煤)": 16 },
    ],
  };
  const datasetMonth = {
    dimensions: ["time", "本月费用(万元)", "上月费用(万元)"],
    source: [
      { time: "9-1", "本月费用(万元)": 5600, "上月费用(万元)": 9600 },
      { time: "9-2", "本月费用(万元)": 4600, "上月费用(万元)": 3644 },
      { time: "9-3", "本月费用(万元)": 3600, "上月费用(万元)": 4644 },
      { time: "9-4", "本月费用(万元)": 5611, "上月费用(万元)": 9655 },
      { time: "9-5", "本月费用(万元)": 5644, "上月费用(万元)": 3677 },
      { time: "9-6", "本月费用(万元)": 4677, "上月费用(万元)": 3633 },
      { time: "9-7", "本月费用(万元)": 3688, "上月费用(万元)": 4655 },
      { time: "9-8", "本月费用(万元)": 5088, "上月费用(万元)": 2644 },
      { time: "9-9", "本月费用(万元)": 6677, "上月费用(万元)": 2641 },
      { time: "9-10", "本月费用(万元)": 5866, "上月费用(万元)": 5641 },
      { time: "9-11", "本月费用(万元)": 4677, "上月费用(万元)": 7645 },
      { time: "9-12", "本月费用(万元)": 1877, "上月费用(万元)": 2645 },
    ],
  };
  const datasetYear = {
    dimensions: ["time", "本年费用(万元)", "上年费用(万元)"],
    source: [
      { time: "1月", "本年费用(万元)": 56000, "上年费用(万元)": 96000 },
      { time: "2月", "本年费用(万元)": 46000, "上年费用(万元)": 36000 },
      { time: "3月", "本年费用(万元)": 36000, "上年费用(万元)": 46000 },
      { time: "4月", "本年费用(万元)": 56000, "上年费用(万元)": 96000 },
      { time: "5月", "本年费用(万元)": 56000, "上年费用(万元)": 36000 },
      { time: "6月", "本年费用(万元)": 46000, "上年费用(万元)": 36000 },
      { time: "7月", "本年费用(万元)": 36000, "上年费用(万元)": 46000 },
      { time: "8月", "本年费用(万元)": 50000, "上年费用(万元)": 26000 },
      { time: "9月", "本年费用(万元)": 66000, "上年费用(万元)": 26000 },
      { time: "10月", "本年费用(万元)": 58000, "上年费用(万元)": 56000 },
      { time: "11月", "本年费用(万元)": 46000, "上年费用(万元)": 76000 },
      { time: "12月", "本年费用(万元)": 18000, "上年费用(万元)": 26000 },
    ],
  };

  const [dataset, setDataset] = useState(datasetDay);
  const pieData = [
    { value: 30, name: "电" },
    { value: 25, name: "水" },
    { value: 25, name: "燃气" },
    { value: 20, name: "煤炭" },
  ];

  useEffect(() => {
     
   value == '1' ? drawEcharts(ref.current, {
      dataset,
      series: [{ type: "bar" }, { type: "bar" }],
    }) : drawEcharts(elref.current, {
      dataset,
      series: [{ type: "bar" }, { type: "bar" }],
    });
 
   if(value == '1') drawEcharts(pieref.current, {
      pieData: { data: pieData, total: 100 },
      type: 3,
    });
  }, [dataset, pieData, value]);
  const changeTime = ({ target: { value } }) => {
    if (value === "day") setDataset((data) => ({ ...data, ...datasetDay }));
    if (value == "month") setDataset((data) => ({ ...data, ...datasetMonth }));
    if (value == "year") setDataset((data) => ({ ...data, ...datasetYear }));
  };
  const Title = ({ title, subtitle, jc }) => {
    return (
      <Custspan className="t" jc={jc}>
        {title}
        <span>{subtitle}</span>
      </Custspan>
    );
  };
 
  const Arrow = ({num}) => {
    if (Number.isNaN(num)) return
    return num > 0  ? ( <ArrowUpOutlined style={{ color: "#f00" }} />) :  (<ArrowDownOutlined style={{ color: "#06f" }} />)
  }

  const timechange = (e) => {
     setTimetype(e);
     getData()
  }
  const CustView = () => {
   const viewstyle = {
      display: 'flex',
       justifyContent: "space-between",
       flex: 1
    }
    return (
      <div style={viewstyle}>
       <Item nostyle name="view">
        <Radio.Group
        options={[
          {
            label: '能耗',
            value: 'Apple',
          },
          {
            label: '费用',
            value: 'Pear',
          }]}
        optionType="button"
        buttonStyle="solid"
         />
        </Item>
      <Space size={16}>
        <Item label="日期选择" name="type" initialValue={1}>
           <Select style={{width: '80px'}}   options={[
            {value: 1, label: '日'},
            {value: 2, label: '月'},
            {value: 3, label: '年'},
           ]}
           onChange={timechange}
           ></Select>
        </Item>
        <Item nostyle name="date"  initialValue={moment(new Date(), 'YYYY-MM-DD')}>
          <DatePicker placeholder="请选择日期" picker={picker} onChange={getData} />
        </Item>
      </Space>
      </div>
    )
  }
  return (
    <CustContext.Provider
      value={{
        form,
        custview: <CustView />,
       // tabs,
        handler: getData,
        value,
        setvalue,
      }}
    >

      <div style={{display: 'grid', gridTemplateRows: '48px 1fr', rowGap: '16px'}}>
      <UserSearch></UserSearch>
      <Laybox value={value}>
        <div className="left">
          
          <Tabsbox items={tabs} onChange={ontabChange}>
            
             
          </Tabsbox>
          <Titlelayout title={<Title title="能耗总量" />}>
            <Divbox>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Image
                  src={imgurl.z08}
                  preview={false}
                  width={80}
                  height={80}
                />
                <span style={{ color: "#999", marginTop: "10px" }}>
                  (吨标煤)
                </span>
              </div>

              <div className="list">
                <div className="item">
                  <span>今日能耗：</span>
                  <span>1.23</span>
                </div>
                <div className="item">
                  <span>昨日能耗：</span>
                  <span>1.54</span>
                </div>
                <div className="item">
                  <span>同比</span>
                  <span>
                    -1.54%
                    <ArrowDownOutlined style={{ color: "#f00" }} />
                  </span>
                </div>
                <div className="item">
                  <span>环比</span>
                  <span>
                    +1.54%
                    <ArrowUpOutlined style={{ color: "#f00" }} />
                  </span>
                </div>
              </div>
            </Divbox>
            <Titlelayout
              type="inner"
              title={<Title title="能耗占比" />}
              style={{ padding: "0px", border: "none" }}
            >
              <div
                style={{ width: "368px", height: "284px" }}
                ref={pieref}
              ></div>
            </Titlelayout>
          </Titlelayout>
          
          
        </div>
        <div className="right">
      
        </div>
     
      </Laybox>
      </div>
    </CustContext.Provider>
  );
}
