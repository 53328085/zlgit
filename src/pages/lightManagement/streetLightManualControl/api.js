import {Apimethod} from "@api/api.js"

export const { useList } = new Apimethod( //手动控制
    "post",
    "Light/StreetLightManualControl/List"
  );
 