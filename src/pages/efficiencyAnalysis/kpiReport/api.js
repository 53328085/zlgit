import {Apimethod} from "@api/api.js"

export const { useQueryEquipmentType } = new Apimethod( //列表及表头数据
    "get",
    "Energy/EnergyEfficiencyDesigner/QueryEquipmentType"
  );
  export const { useQueryCustomReport } = new Apimethod( //自动控制
    "post",
    "Energy/EnergyEfficiencyRuntime/QueryCustomReport"
  );