import {Apimethod} from "@api/api.js"

export const { useQuerySpaceTrees } = new Apimethod( //自动控制
    "get",
    "/Energy/EnergyQuotaDesigner/QuerySpaceTrees"
  );