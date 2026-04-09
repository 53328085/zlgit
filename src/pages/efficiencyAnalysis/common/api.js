import {Apimethod} from "@api/api.js"

export const { useList } = new Apimethod( //自动控制
    "get",
    "Light/StreetLightAutoControl/List"
  );
  export const { useDetail } = new Apimethod( //自动控制
    "post",
    "Light/StreetLightAutoControl/Detail"
  );
  export const { useQuerySNFReportData } = new Apimethod( //自动控制
    "post",
    "Energy/EnergyEfficiencyRuntime/QuerySNFReportData"
  );
// 废水监测页面
  export const { useQueryCurrent } = new Apimethod( // 实时监测数据
      "get",
      "Energy/EnergySewageRuntime/QueryCurrent"
    );
    export const { useQueryHistoryTable } = new Apimethod( //历史监测数据
      "post",
      "Energy/EnergySewageRuntime/QueryHistoryTable"
    );