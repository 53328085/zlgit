import React, { useState, useRef, useEffect } from "react";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Container, Header } from "./style";
import { Form, Select, DatePicker, Button } from "antd";
import { Init_Value, Date_Value } from "./data";
import { DetailComp ,FooterChartComp} from "./comp";
export default function Index() {
  const [treeId, setTreeId] = useState();
  const { Item } = Form;
  const [form] = Form.useForm();
  const [type, setType] = useState("date");

  const onFinish = () => {};
  return (
    <Pagecount bgcolor="#eeeff4">
      <Container>
        <div className="tree-box">
          <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => {}}
            showline={false}
            datatype={3}
            energytype={1}
            allselect={false}
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
          <DetailComp></DetailComp>
          <FooterChartComp ></FooterChartComp>
        </div>
      </Container>
    </Pagecount>
  );
}
