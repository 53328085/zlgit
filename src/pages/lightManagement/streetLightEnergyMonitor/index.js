import React, { useMemo, useRef, useState, useCallback } from "react";
import { Space  } from "antd";
import moment from "moment";
import Pagecount from "@com/pagecontent";
import { useNavigate, useLocation } from "react-router-dom";
import { useAntdTable, useRequest } from "ahooks";
 
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
 
import {  ExportExcel, ChartList } from "@com/useButton";
import { cols } from "./data";
 
import { useMonitor, usePage } from "./api.js";
import { getTime, isObject } from "@com/usehandler";
import Ichart from "@com/useEcharts/Ichart";
import { Tablewrap, Chartwrap,TitleBox ,Mainwrap} from "./style";
import {Cspin } from "@com/comstyled"
 
import LinghtSearch from "../comm"
export default function Index() {
  
  const [datatype, setDataType] = useState("chart");
 
  
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const tbref = useRef()
  
  const [params, setParams]= useState({})
  const {areaId, type, date, projectId} = params
 // const { exparams } = useOutletContext();
 
 // const { areaId,  type, date } = exparams || {};
  const pageTotal = useRef()

 const columns = useMemo(()=> {
    let time =  {
      title: '时间',
      dataIndex: 'time', 
      key:'time',
      render: (text) => { 
        let format ={
          1: "HH:mm",
          2: "MM-DD",
          3:"YYYY-MM"
        }[type]
        return moment(text, "YYYY-MM-DD HH:mm:ss").format(format)
      },
      sorter: (a, b) => moment(a.time,"YYYY-MM-DD HH:mm:ss").diff(moment(b.time,"YYYY-MM-DD HH:mm:ss"))
    }
    return [time, ...cols]
 }, [type, date])

  const getChart = async()=> {
    try {
    
      let fag = [areaId, projectId, type].some((v) => Number.isInteger(v)) && date;
      if (!fag) return;
      let {success, data, errMsg} =  await useMonitor({areaId, projectId, type, date: getTime(date, type)})
      if(success &&  isObject(data.detail)) { 
         return data.detail
      }else {
         return Promise.reject(errMsg || "数据出错")
      }
    } catch (error) {
      return Promise.reject(error)
    }

  }
  const {data, loading} = useRequest(getChart, {
    refreshDeps: [areaId, projectId, type, date],
   // throttleWait:1000,
  })
 
 const chartoption = useMemo(()=> {
  const {x=[], y=[], y1=[], y2=[]} = data || {}
   return {
    series: [
      { type: "bar", seriesLayoutBy: 'row',yAxisIndex: 0, },
      { type: "bar", seriesLayoutBy: 'row',yAxisIndex: 0,   }, 
      { type: "line", seriesLayoutBy: 'row', name: '亮灯率(%)',  yAxisIndex: 1, }
    ],
    grid: {
      left: "20px",
      right: "20px",
      top: "40px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: "0px", 
    },
    xAxis: {
      axisLabel: {
        showMaxLabel: true,
        hideOverlap: true,
        interval: "auto"
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '电量(kWh)', 
        nameLocation :"center",
        nameGap:30,
        nameTextStyle:{
          padding: [0,0,30,0]
        },
        axisLabel: {
          formatter: '{value} kWh'
        }
      },
      {
        type: 'value',
        name: '亮灯率(%)', 
        nameLocation :"center",
        nameGap:48,
        nameTextStyle:{
          padding: [0,0,-58,0]
        },
        axisLabel: {
          formatter:  (v) => v + "%"
        }
      },
    ],
    dataset: {
      dimensions:[
        {
          name: "时间", type: "time"
        },
        "市电(kWh)",
        "绿电(kWh)",
        "亮灯率"
      ],
      source:[
        x,
        y,
        y1,
        y2,
      ],
      sourceHeader: false,
    },


   }


 }, [data])



  const getData = async ({ current, pageSize }) => {
    let fag =
      [areaId, projectId, type].some((v) => Number.isInteger(v)) && date;
    if (!fag) return;
    try {
      let {success, data, total } = await usePage({},{
        areaId,
        projectId,
        type,
        dateTime: getTime(date, type),
        pageSize,
        pageNum:current,
      });

      if(success && Array.isArray(data)) {
         pageTotal.current = total
         return {
          list:data,
          total,
         }
      }else {
        pageTotal.current = 0;
        return {
          list:[],
          total:0
        }
      }
    } catch (error) {
      pageTotal.current = 0;
    }
  };

  const { tableProps } = useAntdTable(getData, {
    defaultPageSize: 14,
    refreshDeps: [areaId, projectId, type, date],
  });
   const onExport = useCallback(()=> {
     return getData({current:1, pageSize: pageTotal.current})
   }, [areaId, projectId, type, date])
  const onChange = (v) => {
    const type = v.target.value;
    setDataType(type);
    navigate(pathname + "#" + type, { state: state, replace: true });
  };
  const title = (
    <TitleBox>
      <span>路灯能耗趋势</span>
      <Space>
        <ChartList onChange={onChange} />
        <ExportExcel tb={tbref}></ExportExcel>
      </Space>
    </TitleBox>
  );
 
  return (
    <Pagecount pd="0">
      <Mainwrap>
        <LinghtSearch setParams={setParams} />      
      <Titlelayout layout="flex" title={title}>
        {datatype == "list" ? (
          <Tablewrap>
            <div className="inwrap">
              <UserTable columns={columns} {...tableProps} ref={tbref} sheetName="路灯能耗趋势表" onExport={onExport} ></UserTable>
            </div>
          </Tablewrap>
        ) : (
          <Chartwrap>
            <Cspin spinning={loading}>
            <Ichart {...chartoption} />
            </Cspin>
          </Chartwrap>
        )}
      </Titlelayout>
      </Mainwrap>
    </Pagecount>
  );
}
