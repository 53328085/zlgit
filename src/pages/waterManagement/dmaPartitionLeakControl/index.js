import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectProjectId, adaptation } from "@redux/systemconfig.js";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Container } from "./style";
import { Tabs, Leakage, LeakageTrend, PartAlarm } from "./comps";
import { DMAPartition } from "@api/api";
import { Form, message } from "antd";
import dayjs from 'dayjs';
import CustContext from "@com/content";
export default function Index() {
  const [treeId, setTreeId] = useState();
  const [tabId, setTabId] = useState("1");
  const [formState, setFormState] = useState({
    StartTime: dayjs().format("YYYY-MM-DD"),
    EndTime: dayjs().format("YYYY-MM-DD"),
    TimeType: "1",
  });
  const [alarmForm, setAlarmForm] = useState({
    type: null,
  });
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  let parmas = {
    projectId,
    PartitionId: treeId ? treeId[0] : 0,
    TimeType: formState.TimeType,
    StartTime: formState.StartTime,
    EndTime: formState.EndTime,
  };
  const [pageInfo, setPageInfo] = useState({ pageSize: 10, current: 1 });

  const onChangeTbValues = (values, allValues) => {
    console.log(allValues);
    setAlarmForm({
      type: allValues.type,
    });
  };
  const [alarmData,setAlarmData] = useState([])
  //获取DMA分区报警列表
  const GetListPartitionAlarmPaged = async () => {
    try {
      let data = {
        ...parmas,
        PageNum: pageInfo.current,
        PageSize: pageInfo.pageSize,
        Level: alarmForm.type,
        Sorting:null
      };
      const res = await DMAPartition.GetListPartitionAlarmPaged(data);
      if (res.success) {
        setAlarmData(res.data)
      }else{
        setAlarmData([])
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const [analysisData, setAnalysisData] =useState({})
  //获取漏损分析
  const getLeakageAnalysis = async () => {
    try {
      const res = await DMAPartition.LeakageInfo(parmas);
      if(res.success){
        setAnalysisData(res.data)
      }else{
        setAnalysisData({})
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const [trendData, setTrendData] =useState([])
  //获取漏损趋势
  const getLeakageChart = async () => {
    try {
      const res = await DMAPartition.LeakageChart(parmas);
      if (res.success) {
        setTrendData(res.data)
        return {
          list:res.data??[],
          total:res.data?res.data.length:0
        }
      } else {
        message.error(res.errMsg);
        return {
          list:[],
          total:0
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };
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
    setFormState({
      StartTime,
      EndTime,
      TimeType: allValues.dtype,
    });
  };
  useEffect(() => {
  
      if (treeId && tabId=="1") {
        getLeakageChart();
        getLeakageAnalysis();
      }

  }, [tabId,treeId, JSON.stringify(formState)]);
  useEffect(()=>{
    if(tabId=="2"){
      treeId&&GetListPartitionAlarmPaged()
    }
    

  },[tabId,treeId,JSON.stringify(formState),alarmForm.type,JSON.stringify(pageInfo)])
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
            {/* <CustContext.Provider value={analysisData}> */}
              <div className="card1">
                <Leakage analysisData={analysisData}/>
                
              </div>
            {/* </CustContext.Provider> */}
              <div className="card2">
              <LeakageTrend trendData={trendData}   getLeakageChart={getLeakageChart}/>
              </div>
            </>
          ) : (
            <>
              <div>
                <PartAlarm
                  pageInfo={pageInfo}
                  onChangeTbValues={onChangeTbValues}
                  alarmData={alarmData}
                ></PartAlarm>
              </div>
            </>
          )
          }


        </div>
      </Container>
    </Pagecount>
  );
}
