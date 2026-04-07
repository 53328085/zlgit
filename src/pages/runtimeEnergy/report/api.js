import {Apimethod} from "@api/api.js"
 
export const { useQueryConsumeRegion } = new Apimethod( // 实时抄表
  "post",
  "Energy/DataReportRuntime/QueryConsumeRegion"
);

export const { useQueryConsumeHourTime } = new Apimethod( // 能耗抄表
  "post",
  "Energy/DataReportRuntime/QueryConsumeHourTime"
);

export const { useQueryConsumeByTime } = new Apimethod( // 分时能耗
  "post",
  "Energy/DataReportRuntime/QueryConsumeByTime"
);

export const { useQueryConsumeClassify } = new Apimethod( // 分类能耗
  "post",
  "Energy/DataReportRuntime/QueryConsumeClassify"
);

export const { useQueryConsumeFromIot } = new Apimethod( // 电能报表
  "post",
  "Energy/DataReportRuntime/QueryConsumeFromIot"
);

export const { useQueryConsumeDeviceShit } = new Apimethod( // 班次能耗
  "post",
  "Energy/DataReportRuntime/QueryConsumeDeviceShit"
);