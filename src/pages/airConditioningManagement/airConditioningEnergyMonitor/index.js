import React, { useState, useRef, useEffect } from "react";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Form, Select, DatePicker, Button, Radio } from "antd";
import { Radio_Options, Init_Value, Date_Value, Table_Option } from "./data";
import { AirTable, AirChart, AirEnergyDetail, Frequency } from "./comp";
import { Container, Header, Main } from "./style";
import { DownloadOutlined } from "@ant-design/icons";
import BlueColumn from "@com/bluecolumn/index.jsx";
import i18 from "../../../i18n";
import CusContext from "@com/content";
import { ExportData } from "./util";
export default function Index() {
  const [treeId, setTreeId] = useState();
  const [tabId, setTabId] = useState("1"); //1：空调用能；2：空调节能
  const [tbmodel, setTbmodel] = useState(1); //1：列表模式；2：图表模式
  const tableRef = useRef();
  const [type, setType] = useState("date");
  const { Item } = Form;
  const [form] = Form.useForm();
  const energyRef = useRef(); //空调用能明细弹框
  const enableRef = useRef(); //开启频次
  const closeRef = useRef(); //关闭频次

  //打开空调用能明细弹框
  const openEnergyModal = () => {
    energyRef.current?.onOpen();
  };
  const openFrModal = () => {
    enableRef.current?.onOpen();
  };
  const openFreModal = () => {
    closeRef.current?.onOpen();
  };
  const onFinish = () => {};

  const [enableVal, setEnableVal] = useState(0);
  const enableChange = (e) => {
    setEnableVal(e.target.value);
  };

  const [offVal, setOffVal] = useState(0);
  const offChange = (e) => {
    setOffVal(e.target.value);
  };

  const exportExcel = () => {};
  return (
    <Pagecount bgcolor="#eeeff4" pd={0}>
      <Container>
        <Header>
          <Radio.Group
            block
            options={Radio_Options}
            defaultValue="1"
            optionType="button"
            buttonStyle="solid"
            size="large"
            onChange={(e) => {
              setTabId(e.target.value);
            }}
          />
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
        <Main>
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
            <BlueColumn
              name={tabId == 1 ? "空调能耗分析" : "空调节能分析"}
              bg={{ borderRadius: "4px" }}
              styled={{ marginBottom: 16, width: "100%" }}
            >
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  icon={<DownloadOutlined />}
                  style={{
                    borderRadius: "2px",
                    width: "96px",
                    display: tbmodel == 2 ? "none" : "block",
                  }}
                  onClick={() => {
                    const { datasource, columns, tablechartRef } =
                      tableRef.current;
                    console.log(datasource, columns, tablechartRef);
                    ExportData(datasource, columns, tablechartRef);
                  }}
                >
                  {i18.t("export", { ns: "button" })}
                </Button>
                <Radio.Group
                  block
                  options={Table_Option}
                  defaultValue="1"
                  optionType="button"
                  buttonStyle="solid"
                  size="large"
                  style={{ marginLeft: 16 }}
                  onChange={(e) => {
                    setTbmodel(e.target.value);
                  }}
                />
              </div>
            </BlueColumn>
            <div
              style={{
                width: "100%",
                flex: 1,
                overflow: "hidden",
                display: "flex",
              }}
            >
              {tbmodel == 1 ? (
                <CusContext.Provider>
                  <AirTable
                    tabId={tabId}
                    openEnergyModal={openEnergyModal}
                    openFrModal={openFrModal}
                    openFreModal={openFreModal}
                    ref={tableRef}
                    key={tabId}
                  ></AirTable>
                </CusContext.Provider>
              ) : (
                <AirChart tabId={tabId} key={tabId}></AirChart>
              )}
            </div>
          </div>
        </Main>
        <AirEnergyDetail energyRef={energyRef}></AirEnergyDetail>
        <Frequency
          domRef={enableRef}
          onChange={enableChange}
          value={enableVal}
        ></Frequency>
        <Frequency
          domRef={closeRef}
          onChange={offChange}
          value={offVal}
        ></Frequency>
      </Container>
    </Pagecount>
  );
}
