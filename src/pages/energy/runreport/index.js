import React, { useState } from "react";
import style from "./style.module.less";
import Runreportleft from "./runreportLeft";
import Runreportright from "./runreportRight";
export default function Index() {
  const [reportInfo, setReportInfo] = useState(false);
  const [electricityDate, setElectricityDate] = useState(true);
  // Child2中的组件事件的回调更改Child1中的数据
  const getReport = (val) => {
    setReportInfo(val);
  };
  const useElectricityDate = (val) => {
    setElectricityDate(val);
  };
  return (
    <div className={style.box}>
      <div className={style.boxLeft}>
        <Runreportleft
          reportInfoGive={getReport}
          electricityDateGive={useElectricityDate}
        ></Runreportleft>
      </div>
      <div className={style.boxRight}>
        <Runreportright
          getReportInfo={reportInfo}
          getElectricityDate={electricityDate}
        ></Runreportright>
      </div>
    </div>
  );
}
