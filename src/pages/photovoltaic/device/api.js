import { Apimethod } from "@api/api.js"

export const { useQueryInverterInfo } = new Apimethod( // 逆变器详情
  "get",
  "Solar/RuntimeInverterMonitor/QueryInverterInfo"
);
 
export const { useQueryInverterEnergyTrend } = new Apimethod( //光伏发电趋势
    "post",
    "Solar/RuntimeInverterMonitor/QueryInverterEnergyTrend"
  );