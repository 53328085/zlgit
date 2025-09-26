import { Apimethod } from "@api/api.js"

export const { useQueryOverview } = new Apimethod( //查询 电站拓扑图
  "get",
  "Solar/RuntimeOverview/QueryOverview"
);
