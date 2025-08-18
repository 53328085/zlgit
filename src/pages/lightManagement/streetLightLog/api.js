import {Apimethod} from "@api/api.js"

 
  export const { usePageAuto } = new Apimethod( //自动控制
    "post",
    "Light/StreetLightAnalysis/PageAuto"
  );

  export const { usePageAutoDetails } = new Apimethod( //自动控制 详情
    "post",
    "Light/StreetLightAnalysis/PageAutoDetails"
  );

  export const { usePageManual } = new Apimethod( //手动控制
    "post",
    "Light/StreetLightAnalysis/PageManual"
  );

  export const { useSetReControl } = new Apimethod( // 重新控制
    "post",
    "Light/StreetLightAnalysis/SetReControl"
  );