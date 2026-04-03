import React, { useState, useRef, useEffect, useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio, Button, Progress, Image, Card, Grid } from "antd";
import styled from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import Pagecontent from "@com/pagecontent/maincontent";
import { drawEcharts } from "@com/useEcharts";

import Titlelayout from "@com/titlelayout";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import imgurl from "./icon";
const { Group, Button: Rbutton } = Radio;
const Groupbox = styled(Group)`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
`;
const RadioBt = styled(Rbutton)`
  width: 64px;
  &:first-of-type {
    border-radius: 16px 0 0 16px;
  }
  &:last-of-type {
    border-radius: 0 16px 16px 0;
  }
`;
const Laybox = styled.div`
  display: grid;
  grid-template-columns: 1264px 400px;
  column-gap: 16px;
  flex: 1;
  .left {
    display: grid;
    grid-template-rows: ${props => props.value === '1' ? '48px 512px 272px' : "48px 1fr"};
    row-gap: 16px;
    .leftdown {
      display: grid;
      grid-template-columns: 368px repeat(4, 208px);
      column-gap: 16px;
    }
  }
  .right {
    display: grid;
    grid-template-rows: ${props =>props.value === '1' ? '656px 192px' : '624px 224px'};
    row-gap: 16px;
    .rightdown {
      display: grid;
      grid-template-columns: 192px 192px;
      column-gap: 16px;
    }
    
  }
`;
const Custspan = styled.span`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: ${(props) => (props.jc ? "space-between" : "flex-start")};
  span {
    color: #999;
    padding-left: 0.25em;
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
  padding: 16px 0;
  margin-top: 16px;
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
const Listbox = styled.div`
  display: grid;
  grid-template-rows: ${props => `repeat(${props.len}, 1fr)`};
  align-items: flex-end; 
  justify-self: stretch;
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
`;
const Spanitem = styled.div`
  font-size: 12px;
  &>span:first-child {
    color:  #515151 
  }
  &>span:last-child {
    color: #237ae4 
  }
`
const UDbox = styled.div`
  display: grid;
  grid-template-rows: 64px 1fr;
  row-gap: 8px; 
  justify-items: center;
  height: 100%;
  padding-top: 16px;
  .down {
    display: grid;
    grid-template-columns: ${props => `repeat(${props.len}, 1fr)`};
    justify-self: stretch;
    column-gap: 8px;
    &>div:last-child {
      padding-left: ${({len}) => len > 1 ? '8px' : '0'  };
      border-left: ${({len}) => len > 1 ? '1px dotted #d7d7d7' : 'none'  };
    }
  } 
`;
const UDboxbord = styled(Divbox)`  
  border-top: 1px dotted #d7d7d7;  
`

export default function Index() {
  const ref = useRef()
  const elref = useRef(null)
  const pieref = useRef();
  
  const [form] = Form.useForm();
  const [value, setvalue] = useState("1");
  const tabs = [
    { label: "综合能耗费用", key: "1" },
    { label: "电费", key: "2" },
    { label: "水费", key: "3" },
    { label: "燃气费", key: "4" },
    { label: "煤炭费", key: "5" },
  ];
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
    return num > 0  ? ( <>+{num}%<ArrowUpOutlined style={{ color: "#f00" }} /></>) :  (<>{num}%<ArrowDownOutlined style={{ color: "#06f" }} /></>)
  }
  const ListItem = ({arr}) => {
   
    return (
      <Listbox len={arr.length || 1}>
         {
         arr.map(item => (
           <div className="item" key={nanoid()}>
              <span>{item.key}</span>
              <span>
                {item.arrow ? <Arrow num={item.value}></Arrow> : item.value}
              </span>
           </div>
         ))
         }
      </Listbox>
    )
  }
  const testDatas = [
    {
      title: "总能耗费用",
      sub: "(万元)",
      data: [ 
        [
        {key: '本年能耗费', value: 200.21},
        {key: '去年能耗费', value: 185.21},
        {key: '环比', value: 8.21, arrow: true},
        {key: '同比', value: 10.21, arrow: true} ,
        ],
        [
          {key: '本月能耗费', value: 2.36},
          {key: '上月能耗费', value: 1.98},
          {key: '环比', value: -8.21, arrow: true},
          {key: '同比', value: 10.21, arrow: true} ,
        ]
      ], 
      icon: "z09",
    },
    {
        title: "用电量",
        sub: "(万元)",
        data: [[
          {key: '本月电费', value: 200.21},
          {key: '上月电费', value: 185.21},
          {key: '环比', value: -8.21, arrow: true},
          {key: '同比', value: 10.21, arrow: true} ,
        ]], 
      icon: "z06",
    },    
    {
      title: "用水量",
      sub: "(万元)",
      data: [[
        {key: '本月水费', value: 200.21},
        {key: '上月水费', value: 185.21},
        {key: '环比', value: 8.21, arrow: true},
        {key: '同比', value: 10.21, arrow: true} ,
      ]], 
      icon: "z05",
    },
    {
        title: '用燃气量',
        sub: '(万元)',
        data: [[
          {key: '本月水费', value: 200.21},
          {key: '上月水费', value: 185.21},
          {key: '环比', value: 8.21, arrow: true},
          {key: '同比', value: 10.21, arrow: true} ,
        ]], 
        icon: 'z04'
      },
      {
        title: '耗煤量',
        sub: '(万元)',
        data: [[
          {key: '本月水费', value: 200.21},
          {key: '上月水费', value: 185.21},
          {key: '环比', value: 8.21, arrow: true},
          {key: '同比', value: 10.21, arrow: true} ,
        ]], 
        icon: 'z01'
      }
  ];
  const testDatas2 = [
    {
      title: "用燃气量",
      sub: "(m3)",
      cmonth: 200.21,
      smonth: 180.52,
      hb: 8.21,
      tb: 10.21,
      icon: "z04",
    },
    {
      title: "耗煤量",
      sub: "(吨)",
      cmonth: 200.21,
      smonth: 180.52,
      hb: 8.21,
      tb: 10.21,
      icon: "z01",
    },
  ];

  const testDatas3 = [
    {
      title: "日用电费用",
      sub: "kWh",
      cmonth: 200.21,
      smonth: 180.52,
      hb: 8.21,
      tb: 10.21,
      icon: "z02",
    },
    {
      title: "月用电费用",
      sub: "kWh",
      cmonth: 200.21,
      smonth: 180.52,
      hb: -8.21,
      tb: 10.21,
      icon: "z02",
    },
    {
      title: "年用电费用",
      sub: "kWh",
      cmonth: 200.21,
      smonth: 180.52,
      hb: -8.21,
      tb: 10.21,
      icon: "z02",
    },
  ];

  return (
    <CustContext.Provider
      value={{
        form,
        names: ["RegioId", "BuildingId", "FloorId"],
        tabs,
        value,
        setvalue,
      }}
    >
      <Laybox value={value}>
        <div className="left">
          <UserSearch></UserSearch>
          <Pagecontent>
            <Groupbox
              defaultValue="day"
              buttonStyle="solid"
              size="middle"
              onChange={changeTime}
            >
              <RadioBt value="day">本日</RadioBt>
              <RadioBt value="month">本月</RadioBt>
              <RadioBt value="year">本年</RadioBt>
            </Groupbox>
            {value === '1' ? (<div ref={ref} style={{ flex: 1, position: "relative" }}>

            </div>) : (
              <div ref={elref} style={{ flex: 1, position: "relative" }}>

              </div>
            )
             }
          </Pagecontent>
          {value === '1' && (<div className="leftdown">       
            {testDatas.map((item) => (
              <Titlelayout
                title={<Title title={item.title} subtitle={item.sub} />}
                key={nanoid()}
              >
                <UDbox len={item?.data?.length}>
                  <Image
                    src={imgurl[item.icon]}
                    preview={false}
                    width={64}
                    height={64}
                  />
                  <div className="down">
                    {
                     Array.isArray(item.data) && item.data.map(items =>(<ListItem arr={items} key={nanoid()} />))
                    }
                  </div>
                </UDbox>
               
              </Titlelayout>
            ))}
          </div>)}
        </div>
        <div className="right">
        { value=== '1' ? 

        (  <>
           <Titlelayout title={<Title title="综合能耗费用统计"  />}  extra={ <Groupbox
              defaultValue="day"
              buttonStyle="solid"
              size="middle"
              onChange={changeTime}
            >
              <RadioBt value="day">本日</RadioBt>
              <RadioBt value="month">本月</RadioBt>
              <RadioBt value="year">本年</RadioBt>
            </Groupbox>}>
            <UDboxbord>
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
                  (万元)
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
                  <Arrow num={-0.54} />
                  </span>
                </div>
                <div className="item">
                  <span>环比</span>
                  <span>                 
                    <Arrow num={1.54} />
                  </span>
                </div>
              </div>
            </UDboxbord>
            <Titlelayout
              type="inner"
              title={<Title title="综合能耗费占比" />}
              style={{ padding: "0px", border: "none",display: 'felx', alignItems: 'center', justifyContent: 'cneter' }}
            >
              <div
                style={{ width: "368px", height: "284px" }}
                ref={pieref}
              ></div>
            </Titlelayout>
          </Titlelayout>
         
          
              <Titlelayout
                title={<Title title='综合能耗费用分析'   />}
                key={nanoid()}
              >
                <div style={{padding: "16px", display: 'grid', gridTemplateColumns: "48px 1fr", columnGap: '16px'}}>
                  <Image
                    src={imgurl.z10}
                    preview={false}
                    width={48}
                    height={48}
                  />
                  <div style={{color:'#515151'}}>近一个月综合能耗费用有上升趋势，请注意节约用能</div>
                </div>
              </Titlelayout>
         
          </>
          )
         : (
          <>
         <Titlelayout title={<Title title="用电费用统计" />}>
          <div style={{display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', height: '100%'}}>
           {
            testDatas3.map((item) => (
              <UDboxbord key={nanoid()}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                 <span style={{ color: "#999", fontSize: '12px' }}>
                 ({item.title})
                </span>
                <Image
                  src={imgurl[item.icon]}
                  preview={false}
                  width={64}
                  height={64}
                />
                <span style={{ color: "#999",  fontSize: '12px' }}>
                 ({item.sub})
                </span>
              </div>

              <div className="list">
                <div className="item">
                  <span>今日能耗：</span>
                  <span>{item.cmonth}</span>
                </div>
                <div className="item">
                  <span>昨日能耗：</span>
                  <span>{item.smonth}</span>
                </div>
                <div className="item">
                  <span>同比</span>
                  <span>
                    <Arrow num={item.hb}/>
                  </span>
                </div>
                <div className="item">
                  <span>环比</span>
                  <span>                  
                    <Arrow num={item.tb}/>
                  </span>
                </div>
              </div>
            </UDboxbord>
            ))
           }
           </div>
        </Titlelayout>


        <Titlelayout
                title={<Title title='综合能耗费用分析'   />}
                key={nanoid()}
              >
                <div style={{padding: "16px", display: 'grid', gridTemplateColumns: "48px 1fr", columnGap: '32px'}}>
                  <Image
                    src={imgurl.z10}
                    preview={false}
                    width={48}
                    height={48}
                  />
                
                  <div className="list">
                    <Spanitem>
                      <span>今日电费比昨日同期节电：</span>
                      <span>10.21%</span>
                    </Spanitem>
                    <Spanitem>
                      <span>尖电费用：</span>
                      <span>-10%</span>
                    </Spanitem>
                    <Spanitem>
                      <span>峰电费用：</span>
                      <span>-10%</span>
                    </Spanitem>
                    <Spanitem>
                      <span>平电费用：</span>
                      <span>-10%</span>
                    </Spanitem>
                    <Spanitem>
                      <span>台电费用</span>
                      <span>-10%</span>
                    </Spanitem>
                  </div>
                 </div>
               
              </Titlelayout>
        
         
       
         </>
         )
         }
        </div>
     
      </Laybox>
    </CustContext.Provider>
  );
}
