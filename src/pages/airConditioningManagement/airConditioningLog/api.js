import { Apimethod } from "@api/api.js"

export const { usePage } = new Apimethod( //控制日志-分页查询
  "post",
  "Conditioner/AirConditionerAnalysis/Page"
);
export const { useDetail } = new Apimethod( //控制日志-空调方案
  "post",
  "Conditioner/AirConditionerAutoControl/Detail"
);
export const { useList } = new Apimethod( ///控制日志-获取空调方案
  "get",
  "Conditioner/AirConditionerAutoControl/List"
);
export const { useSetReControl } = new Apimethod( //控制日志--重新控制
  "post",
  "Conditioner/AirConditionerAnalysis/SetReControl"
);