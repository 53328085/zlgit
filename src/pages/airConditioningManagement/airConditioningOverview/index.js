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
import moment from "moment";
export default function Index() {
  const projectId = useSelector(selectProjectId);
  const [treeId, setTreeId] = useState([]);
  const { Item } = Form;
  const [form] = Form.useForm();
  const [type, setType] = useState("date");
  console.log("type", type)
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [overData, setOverData] = useState(null);

  const getAPiFunc = () => {
    const values = form.getFieldsValue();
    const date =
      values.dtype == 1
        ? moment(values.date).format("YYYY-MM-DD")
        : values.dtype == 2
        ? moment().format("YYYY-MM-01")
        : moment().format("YYYY-01-01");
    const params = {
      projectId,
      ids: treeId,
      dayMonthYear: values.dtype,
      date,
    };
    AirConditionerOverview(params);
  };
  const AirConditionerOverview = async (params) => {
    try {
      const res = await AirConditioningManagement.AirConditionerOverview(
        params
      );
      if (res.success) {
        const propsToRemove = [ "table", "trend"];
        let filteredObj;
        if (res.data) {
          filteredObj = Object.fromEntries(
            Object.entries(res.data).filter(
              ([key]) => !propsToRemove.includes(key)
            )
          );
          //空调纵览数据
          setOverData(filteredObj ?? {});
          //获取空调能耗趋势列表
          setTableData(res.data.table)
          //获取空调能耗趋势图表
          setChartData(res.data.trend)
        }
       
      }
    } catch (error) {
      throw error;
    }
  };
  const onFinish = (values) => {
    getAPiFunc();
  };
  useEffect(() => {
    if (Array.isArray(treeId) && Number.isInteger(projectId)) {
      getAPiFunc();
    }
  }, [treeId, projectId]);
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
            title="空调设备列表"
            sty = {{bordered: '', pv: '16px'}  }
            hv="40px"
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
                  style={{ width: 88, marginRight: 16 }}
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
                  style={{ marginLeft: 16,minWidth:72 }}
                >
                  查询
                </Button>
              </Item>
            </Form>
          </Header>
          <DetailComp overData={overData} type={type}></DetailComp>
          <FooterChartComp
              chartData={chartData}
              tableData={tableData}
              type={type}
            ></FooterChartComp>
          {/* {chartData ? (
            
          ) : null} */}
        </div>
      </Container>
    </Pagecount>
  );
}
