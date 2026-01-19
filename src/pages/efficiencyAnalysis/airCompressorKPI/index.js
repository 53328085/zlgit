import React, { useRef, useState, useEffect,useMemo } from "react";
import { Space, Form, Select, Input, Radio, List, Typography } from "antd";
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";

import Titlelayout from "@com/titlelayout";
import Ichart from '@com/useEcharts/Ichart'
import { useList, useDetail,useQuerySNFReportData } from "./api.js";

import { Mainwrap, TitleBox } from "./style";

import { useAntdTable, useRequest } from "ahooks";
import { mock,chartdata } from "./data";
 
import Cform,{useGauge} from "../common";
 
export default function Index() {
  const projectId = useSelector(selectProjectId);

  const [schemeId, setSchemeId] = useState(null);
  const [alike, setAlike] = useState("");
  const [explains, setExplains] = useState([]);
  const goption = useGauge({data:54});
  console.log(goption)
  const setexparams = (params) => {
    console.log("params");
    console.log(params);
  };

  const props = {
    config: { isdate: true, shiftNo: true },
    setexparams,

    //setAreaName,
  };
  const getDetail = async ({ current, pageSize }) => {
    try {
      if (!(Number.isInteger(projectId) && Number.isInteger(schemeId))) {
        return {
          list: [],
          total: 0,
        };
      }
      let { data, success, total } = await useDetail(
        {},
        { projectId, schemeId, pageNum: current, pageSize }
      );
      if (success && Array.isArray(data) && data.length) {
        setExplains(Array.isArray(data[0].senceDes) ? data[0].senceDes : []);
        return {
          list: Array.isArray(data[0].streetLightInfo)
            ? data[0].streetLightInfo
            : [],
          total,
        };
      } else {
        setExplains([]);
        return {
          list: [],
          total,
        };
      }
    } catch (error) {}
  };

  const { tableProps } = useAntdTable(getDetail, {
    pageSize: 14,
    refreshDeps: [projectId, schemeId],
  });

  const getData = async () => {
    try {
      let { success, data, errMsg } = await useQuerySNFReportData({
        projectId,
        alike,
      });
      if (success && Array.isArray(data) && data.length) {
        //  setOptions(data)
        setSchemeId(data[0]?.id);
        return data;
      } else {
        // setOptions([])
        setSchemeId(null);
        if (!success) {
          return Promise.reject(errMsg);
        } else {
          return [];
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const { data: options } = useRequest(getData, {
    refreshDeps: [projectId, alike],
  });

  const onChange = (v) => {
    setSchemeId(v.target.value);
  };
  const onSearch = (v) => {
    setAlike(v);
  };
 const lineopt=useMemo(()=>{
     return{ 
         series: [{ 
           type: "line", 
           seriesLayoutBy: 'row', 
           smooth:0.2,
          }],
         grid: {
           left: "0px",
           right: "0px",
           top: "0px",
           bottom: "0px",
           containLabel: true,
         },
         legend: {
           show:false
           // itemHeight: 4,
           // itemWidth: 16,
         },
         yAxis:{
          show:true,
          axisLabel:{
             show:false
          }
         },
         xAxis: {
          axisLabel: {
             color: "#909399",
             fontSize: 12,
             align: "left"
           },
           axisTick: {
             show: false
           },
           axisLine: {
              lineStyle: {
                 color: 'rgba(144, 147, 153, 0.30)',
               },
           },
         },
         dataset: {
             dimensions: [
                 { name: 'time', type: 'time' },
                 { name: 'value' },
     
               ],
               source: [chartdata?.x, chartdata?.y],
               sourceHeader: false,
         },
     }
 }, [chartdata])
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Cform {...props} />
        <div className="contentwrap">
          <Titlelayout
            layout="flex"
            title={<TitleBox>Air-Conditioner KPI</TitleBox>}
            dr="column"
          >
            <div className="innerlayout">
              <div className="sublayout">
                <div className="sub list">
                  <List
                    dataSource={mock}
                    split={false}
                    renderItem={(item) => (
                      <List.Item>
                        {item} <Typography.Link type="success">{parseInt(Math.random()*1000)}</Typography.Link>
                      </List.Item>
                    )}
                  />
                </div>
                <div className="sub text">
                    <div className="title">
                       <Typography.Text strong>KPI</Typography.Text>
                       <span>Wh/Nm³</span>
                    </div>
                    <div className="num">
                      35.5
                    </div>
                </div>
                <div className="sub">
                  <Ichart {...lineopt} /> 
                </div>
                <div className="sub chart">
                   <Ichart custoption={goption} />
                </div>
              </div>
              <div className="line">
                <Typography.Link>Formulate：｜</Typography.Link>
                <Typography.Text>compressor-D_TotalPositiveActivePower_Increment   compressor-D TotalPositiveA…</Typography.Text>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout
            layout="flex"
            title={<TitleBox>Air-Conditioner KPI</TitleBox>}
            dr="column"
          >
            <div className="innerlayout">
              <div className="sublayout">
                <div className="sub list">
                  <List
                    dataSource={mock}
                    split={false}
                    renderItem={(item) => (
                      <List.Item>
                        {item} <Typography.Link type="success">{parseInt(Math.random()*1000)}</Typography.Link>
                      </List.Item>
                    )}
                  />
                </div>
                <div className="sub text">
                    <div className="title">
                       <Typography.Text strong>KPI</Typography.Text>
                       <span>Wh/Nm³</span>
                    </div>
                    <div className="num">
                      35.5
                    </div>
                </div>
                <div className="sub">
                  <Ichart {...lineopt} /> 
                </div>
                <div className="sub chart">
                   <Ichart custoption={goption} />
                </div>
              </div>
              <div className="line">
                <Typography.Link>Formulate：｜</Typography.Link>
                <Typography.Text>compressor-D_TotalPositiveActivePower_Increment   compressor-D TotalPositiveA…</Typography.Text>
              </div>
            </div>
          </Titlelayout>   <Titlelayout
            layout="flex"
            title={<TitleBox>Air-Conditioner KPI</TitleBox>}
            dr="column"
          >
            <div className="innerlayout">
              <div className="sublayout">
                <div className="sub list">
                  <List
                    dataSource={mock}
                    split={false}
                    renderItem={(item) => (
                      <List.Item>
                        {item} <Typography.Link type="success">{parseInt(Math.random()*1000)}</Typography.Link>
                      </List.Item>
                    )}
                  />
                </div>
                <div className="sub text">
                    <div className="title">
                       <Typography.Text strong>KPI</Typography.Text>
                       <span>Wh/Nm³</span>
                    </div>
                    <div className="num">
                      35.5
                    </div>
                </div>
                <div className="sub">
                  <Ichart {...lineopt} /> 
                </div>
                <div className="sub chart">
                   <Ichart custoption={goption} />
                </div>
              </div>
              <div className="line">
                <Typography.Link>Formulate：｜</Typography.Link>
                <Typography.Text>compressor-D_TotalPositiveActivePower_Increment   compressor-D TotalPositiveA…</Typography.Text>
              </div>
            </div>
          </Titlelayout>   <Titlelayout
            layout="flex"
            title={<TitleBox>Air-Conditioner KPI</TitleBox>}
            dr="column"
          >
            <div className="innerlayout">
              <div className="sublayout">
                <div className="sub list">
                  <List
                    dataSource={mock}
                    split={false}
                    renderItem={(item) => (
                      <List.Item>
                        {item} <Typography.Link type="success">{parseInt(Math.random()*1000)}</Typography.Link>
                      </List.Item>
                    )}
                  />
                </div>
                <div className="sub text">
                    <div className="title">
                       <Typography.Text strong>KPI</Typography.Text>
                       <span>Wh/Nm³</span>
                    </div>
                    <div className="num">
                      35.5
                    </div>
                </div>
                <div className="sub">
                  <Ichart {...lineopt} /> 
                </div>
                <div className="sub chart">
                   <Ichart custoption={goption} />
                </div>
              </div>
              <div className="line">
                <Typography.Link>Formulate：｜</Typography.Link>
                <Typography.Text>compressor-D_TotalPositiveActivePower_Increment   compressor-D TotalPositiveA…</Typography.Text>
              </div>
            </div>
          </Titlelayout>
        </div>
      </Mainwrap>
    </Pagecount>
  );
}
