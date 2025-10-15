import { Apimethod } from "@api/api.js"

export const { useQueryInverterInfo } = new Apimethod( // 逆变器详情
  "get",
  "Solar/RuntimeInverterMonitor/QueryInverterInfo"
);
 
export const { useQueryStatisticTable } = new Apimethod( // 发电量统计
    "post",
    "Solar/RuntimeStatistic/QueryStatisticTable"
  );