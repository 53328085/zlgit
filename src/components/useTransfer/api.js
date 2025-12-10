import {Apimethod} from "@api/api.js"
export const { useQueryEnergyConfigedDevicesInfo } = new Apimethod( // 能耗定额分类获取
  "get",
  "/Energy/EnergyClassifyDesigner/QueryEnergyConfigedDevicesInfo"
);
