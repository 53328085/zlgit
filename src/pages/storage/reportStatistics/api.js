import {Apimethod} from "@api/api.js"
export const { useRevenues } = new Apimethod( //收益统计
  "post",
  "Storage/StorageRevenueRuntime/Revenues"
);
 