import {Apimethod} from "@api/api.js"

export const { useOverview } = new Apimethod( //查询 路灯总览
    "get",
    "Light/StreetLightOverview/Overview"
  );
  export const { useDetail } = new Apimethod( //查询 路灯点位
    "get",
    "Light/StreetLightOverview/Detail"
  );
 