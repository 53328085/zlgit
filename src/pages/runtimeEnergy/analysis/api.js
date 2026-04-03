import {Apimethod} from "@api/api.js"
export const { useQueryByLine } = new Apimethod( // 线路损耗
  "post",
  "Energy/EnergyLossRuntime/QueryByLine"
);