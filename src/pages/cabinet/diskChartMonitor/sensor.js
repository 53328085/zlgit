import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { DatePicker, Typography, Form, Select, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { CDrawer, Extrea } from "./comstyle";
import Ichart from "@com/useEcharts/Ichart";
import { DiskChart } from "@api/api.js";
import {nanoid} from "@reduxjs/toolkit"
import {Cspin} from "@com/comstyled"
const { Text } = Typography;
const { RangePicker } = DatePicker;
const post = {
  1: [
    "NTD30S119328",
    "NTD30S119329",
    "NTD30S119330",
    "NTD30S119331",
    "NTD30S119332",
    "NTD30S119333",
    "NTD30S119334",
    "NTD30S119335",
    "NTD30S119336",
    "202411010011",
  ], //  温度传感器，烟感，浪涌，水浸（202411010011） 仅p1有
  2: ["NTD30S119325", "NTD30S119326", "NTD30S119327"],
  3: Array.from({ length: 21 }, (_, index) =>
    index > 9 ? `NTD30S1193${index + 1}` : `NTD30S11930${index + 1}`
  ),
  4: ["NTD30S119322", "NTD30S119323", "NTD30S119324"],
};
const titles = {
  1: "P1传感器信息",
  2: "P2温度传感器信息",
  3: "P3温度传感器信息",
  4: "P4温度传感器信息",
};

 
const { QueryDevicesDataAll, QueryDevicePointTrend } = DiskChart;

const temparr = [
    [
        [
            {NTD30S119328:  "水平排 A相温度"},
            {NTD30S119329:  "水平排 B相温度"},
            {NTD30S119330:  "水平排 C相温度"},
        ],
        [
            {NTD30S119331:  "上口 A相温度"},
            {NTD30S119332:  "上口 B相温度"},
            {NTD30S119333:  "上口 C相温度"},
        ],
        [
            {NTD30S119334:  "下口 A相温度"},
            {NTD30S119335:  "下口 B相温度"},
            {NTD30S119336:  "下口 C相温度"},
        ],
    ],
    [
        [
            {NTD30S119325:  "水平排 A相温度"},
            {NTD30S119326:  "水平排 B相温度"},
            {NTD30S119327:  "水平排 C相温度"},
        ], 
    ],
    [
    [
        {NTD30S119301:  "水平排 A相温度"},
        {NTD30S119302:  "水平排 B相温度"},
        {NTD30S119303:  "水平排 C相温度"},
    ],
    [
        {NTD30S119304:  "馈线1 进线A相温度"},
        {NTD30S119305:  "馈线1 进线B相温度"},
        {NTD30S119306:  "馈线1 进线C相温度"},
    ],
    [
        {NTD30S119307:  "馈线1 出线A相温度"},
        {NTD30S119308:  "馈线1 出线B相温度"},
        {NTD30S119309:  "馈线1 出线C相温度"},
    ],
    [
        {NTD30S119310:  "馈线2 进线A相温度"},
        {NTD30S119311:  "馈线2 进线B相温度"},
        {NTD30S119312:  "馈线2 进线C相温度"},
    ],
    [
        {NTD30S119313:  "馈线2 出线A相温度"},
        {NTD30S119314:  "馈线2 出线B相温度"},
        {NTD30S119315:  "馈线2 出线C相温度"},
    ],
    [
        {NTD30S119316:  "馈线3 进线A相温度"},
        {NTD30S119317:  "馈线3 进线B相温度"},
        {NTD30S119318:  "馈线3 进线C相温度"},
    ],
    [
        {NTD30S119319:  "馈线3 出线A相温度"},
        {NTD30S119320:  "馈线3 出线B相温度"},
        {NTD30S119321:  "馈线3 出线C相温度"},
    ]
    ],
    [
        [
            {NTD30S119322:  "水平排 A相温度"},
            {NTD30S119323:  "水平排 B相温度"},
            {NTD30S119324:  "水平排 C相温度"},
        ], 
    ]
]
const disabledDate = (current) => { 
    return current && current > dayjs().endOf('day');
  };
const Chart = ({temps, TempData, moption}) => {
    return (
        <div className="charts">
        <div className="temperature">
            {
                temps.map(t => ( <div className="btntitle">
                    <div className="title">{Object.values(t)?.[0]}</div>
                    <div className="btn">{TempData?.[Object.keys(t)?.[0]] }</div>
                  </div>))
            }
         
        
        </div>
        <div className="chart">
          {moption ? <Ichart {...moption} /> : <Cspin  tip="数据加载中……"/> }    
        </div>
      </div>
    )
}
const Temppart = ({ temptype, moptions=[], TempData}) => {
  let arrt=temparr[temptype] || []
  console.log(moptions)
  return(
    <>
    {
       arrt.map((arr,i)=> <Chart temps={arr} TempData={TempData} moption={moptions[i]} key={nanoid()} /> )
    }
    </> 
  )
 
};
let moption = {
    series: [
      { type: "line", seriesLayoutBy: "row" },
      { type: "line", seriesLayoutBy: "row"},
      { type: "line", seriesLayoutBy: "row"},
    ],
    grid: {
      right: "32px",
      left: 0,
      top: "32px",
      bottom: 0,
      containLabel: true,
    },
    legend: {
      top: "0px",
      left: "32px",
    },
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}°C",
        },
      } 
    ],
    
  };
function Index(props, ref) {
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [temptype, setTemptype] = useState();
  const [TempData, setTempData] = useState({});
   
  const format = "YYYY-MM-DD";
  const formatTime = "YYYY-MM-DD HH:mm:ss";
  const [moptions, setMoptions] = useState([])
   
  const getPointTrend = async (type) => {
    try {
      
      let values = form.getFieldsValue(true);
      
      let { dateType = "date", time= dayjs() } = values || {};
      
      let start, end;
      if (dateType !== "cust") { 
          start = time.startOf(dateType).format(format) + " 00:00:00";
          end = time.endOf(dateType).format(formatTime); 
      } else if (dateType == "cust") {
        start = time?.[0]?.format(format) + " 00:00:00";
        end = time?.[1]?.format(formatTime);
      }
      let  ids = type==1  ? post[type].slice(0, 9) : post[type]; 
      
      let params = ids.map((p) => ({
        devSn: p,
        point: "Temp",
        start,
        end,
      }));
      let promises = params.map((p) => QueryDevicePointTrend(p));
      const allData = await Promise.allSettled(promises);
      const len = allData.length / 3;
      const split = []
      let i=0;
      for(i; i<len; i++){
         split.push(allData.slice(i*3, (i+1)*3))
      }
      let options=[]
      split.forEach((arr, idx)=>{
        let x, source=[];
        arr.forEach((datas, index)=> {
           let {status, value} = datas
           let {success, data} = value || {}
           
           if(status=="fulfilled" && success && Array.isArray(data)&& data?.length > 0) {
              if(!x) {
                 x=data.map(d => d.x)
                 source[0] =x;
              }
              source[index+1] = data.map(d=>d.y)
           }else {
               source[index+1] = [];
           }
       }) 
       
       options[idx] = {...moption, dataset: {
        dimensions: ["time","A相温度","B相温度", "C相温度"],
        source: source,
        sourceHeader: false,
      },}
     }) 
     
     setMoptions([...options])
   
    } catch (error) {
      console.log(error);
    }
  };
  const queryDevicesDataAll = async (type) => {
    // 批量获取设备所有属性值
    const body = post[type];
    const mtitle = titles[type];
    setTemptype(type);
    try {
      let datas = await QueryDevicesDataAll(body);
      if (Array.isArray(datas) && datas.length > 0) {
        let tempdata = {};
        datas.forEach((d) => {
          let { devSn, response } = d;
          let { success, data } = response || {};
          if (success && Array.isArray(data) && data?.length > 0) {
            if (devSn == "202411010011") {
              let DI1 = data.find((d) => d.name == "DI1");
              let DI2 = data.find((d) => d.name == "DI2");
              let DI3 = data.find((d) => d.name == "DI3");
              tempdata.DI1 = DI1.value;
              tempdata.DI2 = DI2.value;
              tempdata.DI3 = DI3.value;
            } else {
              let temp = data.find((t) => t.name == "Temp");
              tempdata[devSn] = temp?.value
                ? temp.value == "-50"
                  ? "——"
                  : temp.value + temp.unit
                : "";
            }
          } else {
            tempdata[devSn] = "";
          }
        });

        setTempData(tempdata);
        getPointTrend(type)
        setTitle(mtitle);       
        setOpen(true);
      } else {
        setTitle(mtitle);
        setOpen(true);
        setTempData({});
      }
    } catch (error) {}
  };

  const onValuesChange = ()=> { 
    setMoptions([])
     getPointTrend(temptype)
  }
  const changeType = (v) => {
    if (v !="cust") {
      form.setFieldValue("time", dayjs());
    } else  {
      form.setFieldValue("time", [dayjs().subtract(1, "day"), dayjs()]);
    }
  };
  useImperativeHandle(ref, () => ({
    onOpen: (type) => queryDevicesDataAll(type),
  }));
  return (
    <CDrawer
      title={title}
      open={open}
      styles={{
        body:{
          backgroundColor: "#fff",
        },
        header:{
          backgroundColor: "#f2f2f2",
        padding: "10px 16px",
        borderBottom: "none",
        display: "flex",
        }
      }}
      width={1036}
  
      // closable={false}
      onClose={() => setOpen(false)}
    >
      <div className="mainbox">
        {temptype == 1 && (
          <div className="stats">
            <div className="btn">
              水浸传感器：
              <Text type={TempData?.DI1 == 0 ? "success" : "danger"}>
                {TempData?.DI1 == 0 ? "正常" : TempData?.DI1 == 1 ? "报警" : ""}
              </Text>
            </div>
            <div className="btn">
              烟感传感器：
              <Text type={TempData?.DI2 == 0 ? "success" : "danger"}>
                {TempData?.DI2 == 0 ? "正常" : TempData?.DI2 == 1 ? "报警" : ""}
              </Text>
            </div>
            <div className="btn">
              浪涌保护器：
              <Text type={TempData?.DI3 == 0 ? "success" : "danger"}>
                {TempData?.DI3 == 0 ? "正常" : TempData?.DI3 == 1 ? "报警" : ""}
              </Text>
            </div>
          </div>
        )}
        <div className="time">
          <span>温度传感器</span>
          <Form form={form} onValuesChange={onValuesChange} preserve={false}>
            <Space size={16}>
              <Form.Item
                label="时间查询"
                name="dateType"
                labelCol={{ flex: "5em" }}
                initialValue="date"
              ><Select style={{ width: "100px" }} onChange={changeType} options={[
                    {value: "date", label:"日"},
                    {value: "month", label:"月"},
                    {value: "year", label:"年"},
                    {value: "cust", label:"自定义"}

                ]} />
                </Form.Item>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  let picker = getFieldValue("dateType");
                  return (
                    <Form.Item name="time" initialValue={dayjs()}>
                      {picker != "cust" ? (
                        <DatePicker
                          picker={picker}
                          style={{ width: "288px" }}
                          key="date"
                          disabledDate={disabledDate}
                        ></DatePicker>
                      ) : (
                        <RangePicker
                          style={{ width: "288px" }}
                          format="YYYY-MM-DD"
                          disabledDate={disabledDate}
                          key="rangedate"
                        ></RangePicker>
                      )}
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Space>
          </Form>
        </div> 
        <Temppart temptype={parseInt(temptype) - 1}  TempData={TempData} moptions={moptions} /> 
      </div>
    </CDrawer>
  );
}
export default forwardRef(Index);
