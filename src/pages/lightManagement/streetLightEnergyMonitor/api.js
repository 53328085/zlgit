import {Apimethod} from "@api/api.js"

export const { useMonitor } = new Apimethod( //能耗监测 图表
    "get",
    "Light/StreetLightEnergyMonitor/Monitor"
  );
  export const { usePage } = new Apimethod( //能耗监测 表格
    "post",
    "Light/StreetLightEnergyMonitor/Page"
  );