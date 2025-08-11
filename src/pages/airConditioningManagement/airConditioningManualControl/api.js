import { Apimethod } from "@api/api.js"

export const { useList } = new Apimethod( //手动控制--控制列表
  "post",
  "Conditioner/AirConditionerManualControl/List"
);
export const { useSetControl } = new Apimethod( //手动控制--手动控制操作
  "post",
  "Conditioner/AirConditionerManualControl/SetControl"
);