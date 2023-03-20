import React, { useState, useEffect } from "react";
import style from "./style.module.less";
import Runreportleft from "./runreportLeft";
import Runreportright from "./runreportRight";
import { energyDesigner } from "@api/api.js";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
import { useRequest } from "ahooks";
import { message } from "antd";
export default function Index() {
  const { querOverview } = energyDesigner;
  const [messageApi] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };
  const [reportInfo, setReportInfo] = useState(false);
  const [electricityDate, setElectricityDate] = useState(true);
  const projectId = useSelector(selectProjectId);
  const [dataInfo, setDataInfo] = useState({});
  // Child2中的组件事件的回调更改Child1中的数据
  const getReport = (data) => {
    console.log(data);
    setReportInfo(data.rightInfo);
    return querOverview(projectId, data.type, data.areaId, data.date).then(
      (res) => {
        let { success, data } = res;
        if (success && data) {
          console.log(data);
          setDataInfo(data);
        } else {
          messageContent("error", res.errMsg);
          setReportInfo(false);
        }
      }
    );
  };
  const useElectricityDate = (val) => {
    setElectricityDate(val);
  };
  const reportExport = () => {
    console.log("点击完了");
  };
  return (
    <div className={style.box}>
      <div className={style.boxLeft}>
        <Runreportleft
          reportInfoGive={getReport}
          electricityDateGive={useElectricityDate}
          reportExportGive={reportExport}
        ></Runreportleft>
      </div>
      <div className={style.boxRight}>
        <Runreportright
          getReportInfo={reportInfo}
          getElectricityDate={electricityDate}
          dataInfoAll={dataInfo}
        ></Runreportright>
      </div>
    </div>
  );
}
