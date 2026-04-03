import {Apimethod} from "@api/api.js"
 
export const { useQueryEnergyArea } = new Apimethod( // 获取区域能耗数据
  "post",
  "Energy/EnergyAreaRuntime/QueryEnergyArea"
);
 