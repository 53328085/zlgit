import {Apimethod} from "@api/api.js"

export const { useQueryOverview } = new Apimethod( //查询 获取综合能耗
    "post",
    "Energy/EnergyComprehensiveRuntime/QueryOverview"
  );

  export const { useQueryEnergyType } = new Apimethod( //查询 获取综合能耗
    "get",
    "/General/ProjectSetting/QueryEnergyType"
  );
