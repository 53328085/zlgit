import { Apimethod } from "@api/api.js"

export const { useQueryGirdCabinetInfo } = new Apimethod( //并网详情
  "get",
  "Solar/RuntimeCabientMonitor/QueryGirdCabinetInfo"
);
export const { useQueryInverterList } = new Apimethod( //逆变器列表
  "get",
  "Solar/RuntimeCabientMonitor/QueryInverterList"
);
export const { useQueryEnergyTrend } = new Apimethod( //光伏发电趋势
    "post",
    "Solar/RuntimeCabientMonitor/QueryEnergyTrend"
  );