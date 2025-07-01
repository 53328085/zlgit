import {Apimethod} from "@api/api.js"

export const { useOverview } = new Apimethod( //查询 路灯总览
    "get",
    "Light/StreetLightOverview/Overview"
  );
 