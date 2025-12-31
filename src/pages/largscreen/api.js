import {Apimethod} from "@api/api.js"
 
export const { useQueryOverview } = new Apimethod( // 获取区域能耗数据
  "post",
  "Energy/EnergyComprehensiveRuntime/QueryOverview"
);
 
export const { useQueryEnergyRankByArea } = new Apimethod( // 区域能耗排名
    "get",
    "Energy/EnergyRankingRuntime/QueryEnergyRankByArea"
  );