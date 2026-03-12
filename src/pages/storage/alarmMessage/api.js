import { Apimethod } from "@api/api.js"

export const { useQueryStorageType } = new Apimethod( //查询存储类型
  "get",
  "Storage/StorageAlarmRuntime/QueryStorageType"
);
 