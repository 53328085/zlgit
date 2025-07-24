import {Apimethod} from "@api/api.js"

export const { useList } = new Apimethod( //查询列表
    "post",
    "Light/StreetLightManualControl/List"
  );
  export const { useSetControl } = new Apimethod( //手动控制
    "post",
    "Light/StreetLightManualControl/SetControl"
  );
 