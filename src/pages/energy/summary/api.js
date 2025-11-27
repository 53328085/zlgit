import {Apimethod} from "@api/api.js"
 
export const { useQueryEnergyInfoOverview } = new Apimethod( // 获取区域能耗数据
  "post",
  "Energy/EnergyOverViewRuntime/QueryEnergyInfoOverview"
);
 