import {Apimethod} from "@api/api.js"
export const { useQueryStackList } = new Apimethod( //查询储能柜列表
  "get",
  "Storage/StorageMonitorRuntime/QueryStackList"
);
export const { useQueryStorageContainerInfo } = new Apimethod( //查询储能柜信息
    "get",
    "Storage/StorageMonitorRuntime/QueryStorageContainerInfo"
  );

  export const { useQueryContainerCapacity } = new Apimethod( //  查询储能柜充放电量
    "get",
    "Storage/StorageMonitorRuntime/QueryContainerCapacity"
  );

  export const { useQueryChargeAndDischargePower } = new Apimethod( // 查询储能柜充放电功率
    "get",
    "Storage/SiteSummaryRuntime/QueryChargeAndDischargePower"
  );

  export const { useQueryContainerTopologyInfo } = new Apimethod( // 查询储能柜充放电功率
    "get",
    "Storage/StorageMonitorRuntime/QueryContainerTopologyInfo"
  );