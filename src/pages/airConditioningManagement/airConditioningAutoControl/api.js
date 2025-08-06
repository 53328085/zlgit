import { Apimethod } from "@api/api.js"

export const { useList } = new Apimethod( //自动控制
  "get",
  "Conditioner/AirConditionerAutoControl/List"
);
export const { useDetail } = new Apimethod( //自动控制
  "post",
  "Conditioner/AirConditionerAutoControl/Detail"
);