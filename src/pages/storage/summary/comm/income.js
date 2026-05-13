import React, { useContext, useEffect, useState } from "react";
import { Flex, Form, DatePicker, Badge, Select } from "antd";
import dayjs from "dayjs";
import { Paramscontext } from "../context";
import { isObject, disabledDate } from "@com/usehandler";
import { useIncomeTotal, useIncomeDetail } from "../api";
import { useBar, optionMY } from "../data";
import Titlelayout from "@com/titlelayout";
import Ichart from "@com/useEcharts/Ichart";
import { IncomeContainer } from "../style";
import imgurl from "../imgs";
export default function Index() {
  const [form] = Form.useForm();
   const datetype = Form.useWatch('type', form)
  const { areaId, stationName, projectId } = useContext(Paramscontext);
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([])
  const [typevalue, setTypevalue] =useState({
    type:2,
    date: dayjs()
  })
 
  const onValuesChange = (_, b)=>{ 
    setTypevalue(b)
  };

  const getTotalData = async (params) => {
    try {
      const { data, success } = await useIncomeTotal(params,{},  {timeout: 3000000});
      if (success && isObject(data)) {
        setData(data);
      } else {
        setData({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const getChartData = async (params) => {
    try {
      const { data, success } = await useIncomeDetail(params,{},  {timeout: 3000000});
      if (success && isObject(data)) {
        setChartData(data);
      } else {
        setChartData({});
      }
    } catch (error) {
      console.log(error);
    }
  };
   let baropt = useBar({ data:chartData  });
  useEffect(() => {
    
    if (
      [areaId, projectId].every((id) => Number.isInteger(parseInt(id))) && isObject(stationName) ) {
     
      let params = {
        areaId,
        siteId: stationName.value,
        projectId,
        
      };
      getTotalData(params);
    }
  }, [areaId, stationName, projectId]);

    useEffect(() => {
    
    if (
      [areaId, projectId].every((id) => Number.isInteger(parseInt(id))) && isObject(stationName) ) {
      const {type, date} = typevalue 
      let params = {
        areaId,
        siteId: stationName.value,
        projectId,
        dayMonthYear:type,
        date: type==2 ? date.startOf("month").format('YYYY-MM-DD') : date.startOf('year').format("YYYY-MM-DD"),
      };
      getChartData(params);
    }
  }, [areaId, stationName, projectId, typevalue]);
 
  const props = {
    bg: "transparent",
    bordered: "no",
    layout: "flex",
    bl: "none",
    pv: "0 16px 16px 16px"
  };
  return (
    <Titlelayout
      title={<Badge status="processing" text="收益数据总览" />}
      {...props}
    >
      <IncomeContainer>
        <div className="total">
          <div className="item">
            <div className="imgbox">
              <img src={imgurl["incomeDay"]} alt="incomeDay" className="img" />
            </div>
            <div className="content">
              <div className="value">{data?.incomeDay}</div>
              <div className="desc">系统日收益(元)</div>
            </div>
          </div>
          <div className="item">
            <div className="imgbox">
              <img
                src={imgurl["incomeMonth"]}
                alt="incomeMonth"
                className="img"
              />
            </div>
            <div className="content">
              <div className="value">{data?.incomeMonth}</div>
              <div className="desc">系统月收益(元)</div>
            </div>
          </div>
          <div className="item">
            <div className="imgbox">
              <img
                src={imgurl["incomeYear"]}
                alt="incomeYear"
                className="img"
              />
            </div>
            <div className="content">
              <div className="value">{data?.incomeYear}</div>
              <div className="desc">系统年收益(元)</div>
            </div>
          </div>
          <div className="item">
            <div className="imgbox">
              <img
                src={imgurl["incomeTotal"]}
                alt="incomeTotal"
                className="img"
              />
            </div>
            <div className="content">
              <div className="value">{data?.incomeTotal}</div>
              <div className="desc">系统累计收益(元)</div>
            </div>
          </div>
        </div>
        <Flex justify="space-between">
      <span>收益曲线</span>
        <Form form={form}
        layout="inline"
     onValuesChange={onValuesChange}
   > 
   <Flex gap={16}>
      <Form.Item name="type" style={{marginBottom:0}} initialValue={typevalue.type}  >
         <Select options={optionMY} style={{width: "120px"}} />
       </Form.Item> 
       <Form.Item name="date" style={{marginBottom:0}} initialValue={typevalue.date} >
         <DatePicker picker={["","",'month',"year"][datetype]} style={{width: "120px"}} disabledDate={disabledDate} allowClear={false}  />
       </Form.Item>
       </Flex>
        </Form>
        </Flex>
        <Ichart {...baropt}  />
      </IncomeContainer>
    </Titlelayout>
  );
}
