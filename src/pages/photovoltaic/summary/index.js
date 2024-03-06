import React, { useEffect, useState, useRef } from "react";

import { nanoid } from "@reduxjs/toolkit";
import Titlelayout from "@com/titlelayout";
import styled from "styled-components";
import Pagecount from "@com/pagecontent";
import CustContext from "@com/content.js";
import { Form, Image, Typography } from "antd";

import { drawEcharts } from "@com/useEcharts";
import imgurl from "./icon";
const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-rows: 184px 280px 304px;
  row-gap: 16px;
  flex: 1;
  .upper {
    display: grid;
    grid-template-columns: 332px 1348px;
    column-gap: 16px;
    .list {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      height: 100%;
      color:#515151;
      .listItem{
        height: 100%;
        display: flex;
        flex-direction:column;
        align-items: center;
        justify-content: center;      
        strong {         
          font-size: 24px;
        }
      }
      .listItem+.listItem {
        border-left: 1px dotted #dedede;
      }
    }
  }
  .middle {
    display: grid;
    grid-template-columns: 400px 200px 200px 832px;
    column-gap: 16px;
    #he-plugin-standard {
      .wv-lt-refresh {
        display: none;
      }
    }
    .item {
      flex: 1;
      display: grid;
      grid-template-rows: 1fr 1fr;
      width: 100%;
      height: 100%;
      color: #333;
      > div:first-of-type {
        border-bottom: 1px dotted #dedede;
      }
      .content {
        display: flex;
        flex-direction: column;
        padding-bottom: 16px;
        justify-content: space-between;
        &:last-of-type {
          padding-top: 16px;
        }
        .ant-typography {
          align-self: center;
        }
        strong {
          font-size: 28px;
          color: #666;
        }
        .num {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  .lower {
    display: grid;
    grid-template-columns: repeat(2, 832px);
    column-gap: 16px;
  }
  .rigth {
    display: grid;
    grid-template-rows: 96px 690px;
    row-gap: 16px;

    .upper {
      display: grid;
      grid-template-columns: repeat(4, 290px);
      grid-template-rows: 96px;
      column-gap: 16px;
      > div {
        background-color: #fff;
        border: 1px solid #dedede;
        border-radius: 4px;
        padding: 16px;
        display: grid;
        grid-template-columns: 48px 1fr;
        column-gap: 32px;
        grid-template-rows: 1fr;
        align-items: center;
        .content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          line-height: 1;
          span:first-of-type {
            color: #999;
            font-size: 16px;
          }
          span:last-of-type {
            color: #515151;
            font-size: 26px;
          }
        }
      }
    }
    .lower {
      display: grid;
      grid-template-rows: 32px 658px;
      grid-template-columns: 1206px;
      .control {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
      }
    }
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    .cl {
      display: flex;
      align-items: center;
      color: #515151;
      font-size: 32px;
      font-weight: bold;
    }
  }
`;

export default function Index() {
  const [form] = Form.useForm();
  const { Text } = Typography;
  const bref = useRef(null);
  const plref = useRef(null);
  const lref = useRef(null)
  const stref = useRef(null)
  const wref = useRef(null)
  const grid = {
    // 图表 grid
    left: "0px",
    right: "40px",
    top: "60px",
    bottom: "0px",
    containLabel: true,
  };
  const datasetT1 = {
    dimensions: ["time", "收益", "发电量"],
    source: [
      { time: "1", 收益: 96, 发电量: 96 },
      { time: "2", 收益: 46, 发电量: 36 },
      { time: "3", 收益: 36, 发电量: 46 },
      { time: "4", 收益: 56, 发电量: 96 },
      { time: "5", 收益: 56, 发电量: 36 },
      { time: "6", 收益: 46, 发电量: 36 },
      { time: "7", 收益: 36, 发电量: 46 },
      { time: "8", 收益: 50, 发电量: 26 },
      { time: "9", 收益: 66, 发电量: 26 },
      { time: "10", 收益: 58, 发电量: 56 },
      { time: "11", 收益: 46, 发电量: 76 },
      { time: "12", 收益: 18, 发电量: 26 },
    ],
  };
  const datasetT2 = {
    dimensions: ["time", "实时辐射", "实时功率"],
    source: [
      { time: "1", "实时辐射": 5600, "实时功率": 9600 },
      { time: "2", "实时辐射": 4600, "实时功率": 3644 },
      { time: "3", "实时辐射": 3600, "实时功率": 4644 },
      { time: "4", "实时辐射": 5611, "实时功率": 9655 },
      { time: "5", "实时辐射": 5644, "实时功率": 3677 },
      { time: "6", "实时辐射": 4677, "实时功率": 3633 },
      { time: "7", "实时辐射": 3688, "实时功率": 4655 },
      { time: "8", "实时辐射": 5088, "实时功率": 2644 },
      { time: "9", "实时辐射": 6677, "实时功率": 2641 },
      { time: "10", "实时辐射": 5866, "实时功率": 5641 },
      { time: "11", "实时辐射": 4677, "实时功率": 7645 },
      { time: "12", "实时辐射": 1877, "实时功率": 2645 },
    ],
  };
  const datasetT3 = {
    dimensions: ["time", "累计发电量", "累计节能减排"],
    source: [
      { time: "jan", "累计发电量": 8600, "累计节能减排": 9600 },
      { time: "feb", "累计发电量": 4600, "累计节能减排": 3644 },
      { time: "mar", "累计发电量": 3600, "累计节能减排": 4644 },
      { time: "apr", "累计发电量": 5611, "累计节能减排": 9655 },
      { time: "may", "累计发电量": 5644, "累计节能减排": 3677 },
      { time: "jum", "累计发电量": 4677, "累计节能减排": 3633 },
      { time: "jul", "累计发电量": 3688, "累计节能减排": 4655 },
      { time: "aug", "累计发电量": 5088, "累计节能减排": 2644 },
      { time: "sep", "累计发电量": 6677, "累计节能减排": 2641 },
      { time: "oct", "累计发电量": 5866, "累计节能减排": 5641 },
      { time: "now", "累计发电量": 4677, "累计节能减排": 7645 },
      { time: "dec", "累计发电量": 1877, "累计节能减排": 2645 },
    ],
  };

  const weather = () => {
    window.WIDGET = {
      CONFIG: {
        layout: "1",
        width: "400",
        height: "280",
        background: "3",
        dataColor: "FFFFFF",
        key: "1a59003a160c4614b88500e1acb22bef",
      },
    };
    const script = document.createElement("script");
    script.src ="https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0";
    script.type = "text/javascript";   
    document.head.append(script);
    
    
  };
  useEffect(() => {
    weather();
    drawEcharts(plref.current, {
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '收益',
          interval: 20,
        },
        {
          type: 'value',
          name: '发电量',  
          interval: 20,       
          axisLabel: {
            formatter: '{value}kwh'
          }
        }
      ],
      dataset: datasetT1,
      series: [{ type: "bar"  }, { 
        type: "line",  
        yAxisIndex: 1,
        }],
      grid,
      legend: {
        show: false,
      },
    });
    drawEcharts(lref.current, {     
     
      dataset: datasetT2,
      series: [{ type: "line"  }, {type: "line"}],
      grid,
      legend: {
        top: 10,
      },
    });
    drawEcharts(stref.current, {     
     
      dataset: datasetT3,
      series: [{ type: "bar", barGap: 0  }, {type: "bar", barGap: 0}],
      grid,
      legend: {
        top: 10,
      },
    });
   
    
  }, []);
  useEffect(() => {

  })
  const fs = {
    hv: "24px",
    fc: "#333",
  };
  return (
    <CustContext.Provider value={{ form }}>
      <Pagecount bgcolor="#eeeff3" pd="0px">
        <Mainbox>
          <div className="upper">
            <Image src={imgurl.pv} preview={false} size={332} height={184}></Image>
             <Titlelayout bgcolor="#eef6fd">
               <div className="list">
                   <div className="listItem">
                       <Image src={imgurl.p1} width={80} height={80}></Image>
                       <span>当前功率(kw)</span>
                       <Text strong ellipsis>125896.300</Text>
                   </div>
                   <div className="listItem">
                       <Image src={imgurl.p2} width={80} height={80}></Image>
                       <span>当日发电量(kwh)</span>
                       <Text strong ellipsis>321.21</Text>
                   </div>
                   <div className="listItem">
                       <Image src={imgurl.p3} width={80} height={80}></Image>
                       <span>当前辐照度(w/m&#178;)</span>
                       <Text strong ellipsis>745896.300</Text>
                   </div>
                   <div className="listItem">
                       <Image src={imgurl.p4} width={80} height={80}></Image>
                       <span>累计发电量(kwh)</span>
                       <Text strong ellipsis>5896.300</Text>
                   </div>
                   <div className="listItem">
                       <Image src={imgurl.p5} width={80} height={80}></Image>
                       <span>累计收益(元)</span>
                       <Text strong ellipsis>496.300</Text>
                   </div>
                   <div className="listItem">
                       <Image src={imgurl.p6} width={80} height={80}></Image>
                       <span>co2减排(kwh)</span>
                       <Text strong ellipsis>85896.300</Text>
                   </div>
                   <div className="listItem">
                       <Image src={imgurl.p7} width={80} height={80}></Image>
                       <span>日转换效率</span>
                       <Text strong ellipsis>56%</Text>
                   </div>
               </div>
             </Titlelayout>
          </div>
          <div className="middle">
            <div id="he-plugin-standard" ref={wref} ></div>
            <Titlelayout>
              <div className="item">
                <div className="content">
                  <span>昨日能源金额 (元)</span>
                  <Text strong ellipsis>
                    125896.300
                  </Text>
                  <div className="num">
                    <span>相比昨日</span>
                    <span>
                      <b style={{ color: "#f00" }}>&#9650;</b>&nbsp;24.21%
                    </span>
                  </div>
                </div>
                <div className="content">
                  <span>昨日收益(元)</span>
                  <Text strong ellipsis>
                    1969.300
                  </Text>
                </div>
              </div>
            </Titlelayout>
            <Titlelayout>
              <div className="item">
                <div className="content">
                  <span>今日发电 (kwh)</span>
                  <Text strong ellipsis>
                    2415.22.300
                  </Text>
                  <div className="num">
                    <span>相比昨日</span>
                    <span>
                      <b style={{ color: "#f00" }}>&#9650;</b>&nbsp;24.21%
                    </span>
                  </div>
                </div>
                <div className="content">
                  <span>昨日收益(kwh)</span>
                  <Text strong ellipsis>
                    2014.65
                  </Text>
                </div>
              </div>
            </Titlelayout>
            <Titlelayout title={"日发电量及收益"} fc="#333" bl="none" pl="0px" hv="24px">
              <div ref={plref} style={{ width: "100%", height: "100%" }}></div>
            </Titlelayout>
          </div>
          <div className="lower">
          <Titlelayout title={"实时辐射与功率曲线"} fc="#333" bl="none" pl="0px" hv="24px">
              <div ref={lref} style={{ width: "100%", height: "100%" }}></div>
          </Titlelayout>
          <Titlelayout title={"累计发电量及节能减排"} fc="#333" bl="none" pl="0px" hv="24px">
              <div ref={stref} style={{ width: "100%", height: "100%" }}></div>
          </Titlelayout>
         
          </div>
        </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  );
}
