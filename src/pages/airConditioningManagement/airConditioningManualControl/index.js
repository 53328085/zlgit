import React, { useState, useRef, useEffect } from "react";
import Pagecount from '@com/pagecontent'
import UseTree from "@com/useTree";
import { Container, Card } from "./style";
import { Tabs, Tabs2 } from "./searchHead"
import { Form, message } from "antd";
import BlueColumn from '@com/bluecolumn'
export default function Index() {
  const [form] = Form.useForm();
  const [treeId, setTreeId] = useState();
  const getAirData = () => {

  }
  const onValuesChange = () => {

  }
  return (
    <Pagecount bgcolor="transparent" pd="0 0 0 0">
      <Container>
        <div className="tree-box">
          <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => { }}
            showline={false}
            multiple={true}
            allselect={false}
          />
        </div>
        <div className="right-box">
          <Tabs
            onValuesChange={onValuesChange}
            getAirData={getAirData}
            form={form}>

          </Tabs>
          <Card>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
              <BlueColumn bg={{ height: 13, width: 3 }}
                className="lightData" name='空调列表'></BlueColumn>
              <Tabs2 /></div>
          </Card>
        </div>
      </Container>
    </Pagecount>
  )
}

