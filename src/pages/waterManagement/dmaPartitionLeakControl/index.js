import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectProjectId, adaptation } from "@redux/systemconfig.js";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Container } from "./style";
import { Tabs, Leakage, LeakageTrend, PartAlarm } from "./comps";
import { DMAPartition } from "@api/api";
import { Form ,message } from "antd";
import moment from "moment";
export default function Index() {
  const [treeId, setTreeId] = useState();
  const [tabId, setTabId] = useState("1");
  const formval = useRef({ StartTime: moment().format("YYYY-MM-DD"), EndTime: moment().format("YYYY-MM-DD"),TimeType:"1" });
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();

  const getLeakageChart=async()=>{
    try {
      let parmas ={
        projectId,
        PartitionId:treeId?treeId[0]:0,
        TimeType:formval.current.TimeType,
        StartTime:formval.current.StartTime,
        EndTime:formval.current.EndTime,
      }
      console.log(parmas)
      const res = await DMAPartition.LeakageChart(parmas)
      if(res.success){
        console.log(res)
      }else{
        message.error(res.errMsg)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const onValuesChange = (values, allValues) => {
    let StartTime, EndTime;
    if (allValues.dtype == "1") {
      StartTime = allValues.date.format("YYYY-MM-DD");
      EndTime = allValues.date.format("YYYY-MM-DD");
    } else if (allValues.dtype == "2") {
      StartTime = allValues.date.format("YYYY-MM-01");
      EndTime = allValues.date.endOf("month").format("YYYY-MM-DD");
    } else if (allValues.dtype == "3") {
      StartTime = allValues.date.format("YYYY-01-01");
      EndTime = allValues.date.format("YYYY-12-31");
    }
    formval.current = {
      StartTime,
      EndTime,
      TimeType:allValues.dtype
    };
  };
  useEffect(() => {
    getLeakageChart()
  }, [treeId,projectId,JSON.stringify(formval.current)]);
  return (
    <Pagecount bgcolor="transparent" pd="0 0 0 0">
      <Container>
        <div className="tree-box">
          <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => {}}
            showline={false}
            datatype={3}
            energytype={1}
            multiple={false}
            allselect={false}
          />
        </div>
        <div className="right-box">
          <Tabs
            setTabId={setTabId}
            onValuesChange={onValuesChange}
            form={form}
          ></Tabs>
          {tabId == "1" ? (
            <>
              <div className="card1">
                <Leakage />
              </div>
              <div className="card2">
                <LeakageTrend />
              </div>
            </>
          ) : (
            <>
              <div>
                <PartAlarm></PartAlarm>
              </div>
            </>
          )}
        </div>
      </Container>
    </Pagecount>
  );
}
