import {Apimethod} from "@api/api.js"
export const { useQuerySiteInfo } = new Apimethod( //站点信息
  "get",
  "Storage/SiteSummaryRuntime/QuerySiteInfo"
);
export const { useQueryStorageWarning } = new Apimethod( //最新告警
    "get",
    "Storage/SiteSummaryRuntime/QueryStorageWarning"
  );

  export const { useQueryMeterPower } = new Apimethod( //  查询关口表/充放电/负载表功率
    "get",
    "Storage/SiteSummaryRuntime/QueryMeterPower"   
  );

  export const { useQueryChargeAndDischargePower } = new Apimethod( // 充放电
    "get",
    "Storage/SiteSummaryRuntime/QueryChargeAndDischargePower"
  );

  export const { useQueryLoadSummaryPower } = new Apimethod( // 总表负载总功率
    "get",
    "Storage/SiteSummaryRuntime/QueryLoadSummaryPower"
  );

  export const { useQueryStorageIncome } = new Apimethod( // 储能收益 暂时不做
    "get",
    "Storage/SiteSummaryRuntime/QueryStorageIncome"
  );

  export const { useQueryChargeETrends } = new Apimethod( // 充放电趋势
    "get",
    "Storage/SiteSummaryRuntime/QueryChargeETrends"
  );

  export const { useQuerySOC } = new Apimethod( // SOC趋势
    "get",
    "Storage/SiteSummaryRuntime/QuerySOC"
  );

  export const { useQueryTopologyDiagramInfo } = new Apimethod( // 拓扑图信息
    "get",
    "Storage/SiteSummaryRuntime/QueryTopologyDiagramInfo"
  );

  export const { useQueryMeterList } = new Apimethod( // 查询关口表列表 101-关口表 102-储能表 103-负载表 202-EMU协控
    "get",
    "Storage/SiteSummaryRuntime/QueryMeterList"   
  );

  export const { useQueryPCSList } = new Apimethod( // 充放电下拉列表
    "get",
    "Storage/StorageMonitorPCS/QueryPCSList"   
  );

    export const { useQueryPowerTrends } = new Apimethod( // 充放电下拉列表
    "get",
    "Storage/StorageMonitorPCS/QueryPowerTrends"   
  );
 export const { useRevenues } = new Apimethod( // 收益统计
    "get",
    "Storage/StorageRevenueRuntime/Revenues"   
  );