import {Apimethod} from "@api/api.js"
export const { useQueryPublicEnergyData } = new Apimethod( // 获取总览图及点位
  "post",
  "Energy/EnergyPublicRuntime/QueryPublicEnergyData"
);