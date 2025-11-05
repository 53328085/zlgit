import {Apimethod} from "@api/api.js"

export const { useQueryEnergy } = new Apimethod( //查询 分类能耗总览
    "post",
    "Energy/EnergyClassifyRuntime/QueryEnergy"
  );
  export const { useQueryEnergyDetail } = new Apimethod( //查询 分类能耗明细
    "post",
    "Energy/EnergyClassifyRuntime/QueryEnergyDetail"
  );
 
  export const { useQueryEnergyCost } = new Apimethod( //查询 分类能耗费用
    "post",
    "Energy/EnergyClassifyRuntime/QueryEnergyCost"
  );