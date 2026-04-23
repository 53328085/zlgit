import {Apimethod} from "@api/api.js"
 
export const { useQueryConsumeRegion } = new Apimethod( // 实时抄表
  "post",
  "Energy/DataReportRuntime/QueryConsumeRegion"
);

export const { useQueryConsumeReport } = new Apimethod( // 能耗抄表
  "post",
  "Energy/DataReportRuntime/QueryConsumeReport"
);

export const { useQueryTimeDivisionEnergy } = new Apimethod( // 分时能耗
  "post",
  "Energy/DataReportRuntime/QueryTimeDivisionEnergy"
);

export const { useQueryClassifyConsumeReport } = new Apimethod( // 分类能耗
  "post",
  "Energy/DataReportRuntime/QueryClassifyConsumeReport"
);

export const { useQueryBillReport } = new Apimethod( // 电能报表(账单报表)
  "post",
  "Energy/DataReportRuntime/QueryBillReport"
);

export const { useQueryShiftEnergy } = new Apimethod( // 班次能耗
  "post",
  "Energy/DataReportRuntime/QueryShiftEnergy"
);

export const { useQueryShifts } = new Apimethod( //获取班次
  "get",
  "Energy/DataReportRuntime/QueryShifts"
);

export const { useQuerysParameterReportTabs } = new Apimethod( //参数报表-Tabs
  "get",
  "Energy/DataReportRuntime/QuerysParameterReportTabs"
);

export const { useQueryParameterReport } = new Apimethod( //参数报表
  "post",
  "Energy/DataReportRuntime/QueryParameterReport"
);

 

export const { useQueryMaxNeedInfo } = new Apimethod( //最大需量
  "post",
  "Energy/DataReportRuntime/QueryMaxNeedInfo"
);