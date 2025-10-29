import {Apimethod} from "@api/api.js"

export const { useQueryEnergy } = new Apimethod( //查询 路灯总览
    "post",
    "Energy/EnergyClassifyRuntime/QueryEnergy"
  );
  export const { useDetail } = new Apimethod( //查询 路灯点位
    "get",
    "Light/StreetLightOverview/Detail"
  );
 