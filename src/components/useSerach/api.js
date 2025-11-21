import {Apimethod} from "@api/api.js"
 
export const { useAllLevel } = new Apimethod( // 查询区域等级
  "get",
  "General/Area/AllLevel"
);
export const { useQueryAll } = new Apimethod( // 查询等级区域列表
  "get",
  "General/Area/QueryAll"
);
 
export const { useQuerySpaceTrees } = new Apimethod( // 查询一级区域下面的树
  "get",
  "Energy/EnergyQuotaDesigner/QuerySpaceTrees"
);