import {Apimethod} from "@api/api.js"
export const { useQuerySiteInfo } = new Apimethod( //站点信息
  "get",
  "Storage/SiteSummaryRuntime/QuerySiteInfo"
);
export const { useQueryStorageWarning } = new Apimethod( //最新告警
    "get",
    "Storage/SiteSummaryRuntime/QueryStorageWarning"
  );

  export const { useQueryMeterPower } = new Apimethod( // 关口表功率
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