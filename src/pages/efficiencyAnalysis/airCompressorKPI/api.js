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