import {Apimethod} from "@api/api.js"
 
export const { useAreas } = new Apimethod( // 获取总览图Tab页
  "get",
  "Conditioner/AirConditionerPicture/Areas"
);
export const { usePoints } = new Apimethod( // 获取 点位图及点位
  "get",
  "Conditioner/AirConditionerPoints/Points"
);
export const { useList } = new Apimethod( // 获取 空调控制列表
    "post",
    "Conditioner/AirConditionerManualControl/List"
  );
  
  export const { useSetControl } = new Apimethod( // 获取 空调控制列表
    "post",
    "Conditioner/AirConditionerManualControl/SetControl"
  );
// Conditioner/AirConditionerManualControl/List