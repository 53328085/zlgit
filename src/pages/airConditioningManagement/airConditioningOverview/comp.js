import React,{ useState, useRef, useEffect,useLayoutEffect  } from 'react'
import { Detail ,FooterChart} from "./style.js";
import { EnergyData,AirChartData,Radio_Options ,Chart_Options,TbHeader} from "./data.js";
import {drawEcharts} from "@com/useEcharts/index"
import BlueColumn from "@com/bluecolumn/index.jsx"
import {Radio,Button} from"antd"
import { DownloadOutlined} from "@ant-design/icons";
import UseTable from "@com/useTable"
import i18 from '../../../i18n'
import air from "./imgs/air.png"
const CusCard = ({
  title = "能耗情况(kWh)",
  secTitle = "当日累计用电量",
  thrTitle = "上一日累计用电量",
  value1="",
  value2="",
  value3="",
  imgurl=""
}) => {
  return (
    <div className="card">
      <div className="head">
        <img src={imgurl} alt="" style={{width:23,height:23,marginRight:6}}/>
        <span>{title}<span style={{color:"#999"}}> (kWh)</span></span>
      </div>
      <div className="body"> 
        <div>{secTitle}</div>
        <div style={{color:"#3d94ff"}}>{value1}</div>
        <div className={`small ${value2>0?'rise':'down'}`}>环比昨日：<span>{value2}</span></div>
      </div>
      <div className="footer">
        <div>{thrTitle}</div>
        <div className={`small ${value2>0?'rise':'down'}`} style={{color:"#3d94ff"}}>{value3}</div>
      </div>
    </div>
  );
};
export const DetailComp = ({}) => {
  const chartRef = useRef();
  useEffect (() => {
    const chart =  drawEcharts(chartRef.current,AirChartData);
    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Detail>
      {EnergyData.map((item) => (
        <CusCard {...item} />
      ))}

      <div className="chart">
        <div className="head"><img src={air} alt=""  style={{width:23,height:23,marginRight:6}}/><span>空调用能排名</span></div>
        <div className="chart-box" ref={chartRef}></div>
      </div>
    </Detail>
  );
};

export const FooterChartComp = ({}) => { 
  const chartDomRef =useRef()
  const  tableRef =useRef()
  const [tabId,setTabId] =useState("1")
 
  useEffect(()=>{
    drawEcharts(chartDomRef.current,Chart_Options)
  },[])
  return(<FooterChart>
    <BlueColumn name="空调能耗趋势" bg={{borderRadius:'4px'}} styled={{marginBottom:16}}>
      <div style={{ marginLeft: "auto",display: "flex",alignItems: "center" }}>
      <Button  icon={<DownloadOutlined />} style={{borderRadius: "2px",width: "96px",display:tabId=="1"?"none":"block"}} onClick={()=>{tableRef.current.downloadAll()}} >
      {i18.t('export', {ns: "button"})}</Button>
      <Radio.Group
          block
          options={Radio_Options}
          defaultValue="1"
          optionType="button"
          buttonStyle="solid"
          size="large"
          style={{marginLeft:16}}
          onChange={(e) => {
            setTabId(e.target.value);
          }}
        />
      </div>
     
    </BlueColumn>
    {
      tabId=="1"? <div ref={chartDomRef} className="chartdom"></div>: <UseTable ref={tableRef} columns={TbHeader}></UseTable>
    }
   
  </FooterChart>)
};
