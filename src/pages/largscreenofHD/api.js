import {Apimethod} from "@api/api.js"
export const { useGetHuaDongTodyEnergyInfo} = new Apimethod( //  今日能耗统计
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongTodyEnergyInfo"
);
export const { useGetHuaDongCarbonInfo} = new Apimethod( //  碳排管理
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongCarbonInfo"
);
export const { useGetHuaDongDeviceRunInfo} = new Apimethod( //  设备运行工况
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongDeviceRunInfo"
);

export const { useGetHuaDongMapInfo} = new Apimethod( //  地图
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongMapInfo"
);

export const { useGetHuaDongAreaEnergyInfo} = new Apimethod( //  区域能耗趋势
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongAreaEnergyInfo"
);
export const { useGetHuaDongDistributionInfo} = new Apimethod( //  变配电情况
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongDistributionInfo"
);
 
export const { useGetHuaDongAirConditionerRunInfo} = new Apimethod( //  空调运行情况
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongAirConditionerRunInfo"
);
 
 
 export const { useGetHuaDongStreetLightRunInfo} = new Apimethod( //  路灯运行情况
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongStreetLightRunInfo"
);

 export const { useGetHuaDongAlarmInfo} = new Apimethod( //  告警信息
  "get",
  "LargeScreen/LargeScreenChintHuaDong/GetHuaDongAlarmInfo"
);