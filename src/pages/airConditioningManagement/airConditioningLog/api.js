import { Apimethod } from "@api/api.js"

export const { useList } = new Apimethod( //控制日志
  "get",
  "Conditioner/AirConditionerAutoControl/List"
);
export const { useDetail } = new Apimethod( //控制日志-空调方案
  "post",
  "Conditioner/AirConditionerAutoControl/Detail"
);