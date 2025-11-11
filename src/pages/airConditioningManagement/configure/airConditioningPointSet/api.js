import {Apimethod} from "@api/api.js"
export const { useQuerySpaceTrees } = new Apimethod( // 获取区域
  "get",
  "/Energy/EnergyQuotaDesigner/QuerySpaceTrees"
);
export const { useAreas } = new Apimethod( // 获取总览图Tab页
  "get",
  "Conditioner/AirConditionerPicture/Areas"
);
export const { useList } = new Apimethod( // 获取 选择区域信息
  "get",
  "Conditioner/AirConditionerPicture/List"
);
export const { useSetAirConditionerImageLocation } = new Apimethod( // 设置总览图及点位
    "post",
    "Conditioner/AirConditionerPicture/SetAirConditionerImageLocation"
  );
  //Conditioner/AirConditionerPicture/List?projectId=1