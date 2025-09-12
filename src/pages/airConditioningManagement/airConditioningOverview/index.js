import React, { useState, useRef, useEffect } from "react";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Container, Header } from "./style";
import { Form, Select, DatePicker, Button } from "antd";
import { Init_Value, Date_Value } from "./data";
import { DetailComp, FooterChartComp } from "./comp";
import { AirConditioningManagement } from "@api/api.js";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import { useReactive } from "ahooks";
export default function Index() {
  const projectId = useSelector(selectProjectId);
  const [treeId, setTreeId] = useState([]);
  const { Item } = Form;
  const [form] = Form.useForm();
  const [type, setType] = useState("date");

  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [overData, setOverData] = useState(null);

  const getAPiFunc = () => {
    const values = form.getFieldsValue();
    const params = {
      projectId,
      areaIds: treeId,
      type: values.dtype,
      date: values.date,
    };
    getOverview(params);
    getQueryElectricTrendChart(params);
    getQueryElectricTrendTable(params);
    QueryEnergyConsumptionRanking(params)
  };

  //获取空调纵览数据
  const getOverview = async (params) => {
    try {
      const res = await AirConditioningManagement.QueryEnergyOverview(params);
      if (res.success && res.data) {
        setOverData(res.data);
      } else {
        setOverData({});
      }
    } catch (e) {
      console.log(e);
    }
  };
  //获取空调能耗趋势图表
  const getQueryElectricTrendChart = async (params) => {
    try {
      const res = await AirConditioningManagement.QueryElectricTrendChart(
        params
      );
      if (res.success && res.data) {
        setChartData(res.data);
      } else {
        setChartData(null);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //获取空调能耗趋势列表
  const getQueryElectricTrendTable = async (params) => {
    try {
      const res = await AirConditioningManagement.QueryElectricTrendTable(
        params
      );
      if (res.success) {
        const arr = res.data.map((item, index) => ({
          ...item,
          periodUseE: parseFloat(item.periodUseE) + index,
          yoy: item.yoy,
          lastPeriodUseE: parseFloat(item.lastPeriodUseE) + index,
          lastYearPeriodUseE: parseFloat(item.lastYearPeriodUseE) + index,
          mom: item.mom,
        }));
        setTableData(arr || res.data);
      } else {
        setTableData(null);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //获取能耗排名
  const QueryEnergyConsumptionRanking = async (params) => {
    try {
      const res = await AirConditioningManagement.QueryEnergyConsumptionRanking(params)
      if(res.success){
        
      }
    } catch (e) {}
  };
  const onFinish = (values) => {
    getAPiFunc();
  };
  useEffect(() => {
    if (Array.isArray(treeId)) {
      getAPiFunc();
    }
  }, [treeId]);
  return (
    <Pagecount bgcolor="#eeeff4" pd={0}>
      <Container>
        <div className="tree-box">
          <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => {}}
            showline={false}
            datatype={5}
            energytype={1}
            allselect={true}
            showSearch={true}
            treeName="空调设备列表"
          />
        </div>
        <div className="right-box">
          <Header>
            <Form
              form={form}
              layout="inline"
              onFinish={onFinish}
              initialValues={Init_Value}
            >
              <Item name="dtype">
                <Select
                  size="default"
                  options={Date_Value}
                  style={{ width: 80, marginRight: 16 }}
                  onChange={(e) => {
                    if (e == "1") {
                      setType("date");
                    } else if (e == "2") {
                      setType("month");
                    } else {
                      setType("year");
                    }
                  }}
                ></Select>
              </Item>
              <Item name="date">
                <DatePicker
                  size="default"
                  style={{ width: 160 }}
                  picker={type}
                ></DatePicker>
              </Item>
              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: 16 }}
                >
                  查询
                </Button>
              </Item>
            </Form>
          </Header>
          {overData ? <DetailComp overData={overData}></DetailComp> : null}
          {chartData ? (
            <FooterChartComp
              chartData={chartData}
              tableData={tableData}
            ></FooterChartComp>
          ) : null}
        </div>
      </Container>
    </Pagecount>
  );
}
