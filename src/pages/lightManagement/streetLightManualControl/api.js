import {Apimethod} from "@api/api.js"

export const { useMonitor } = new Apimethod( //手动控制
    "get",
    "Light/StreetLightEnergyMonitor/Monitor"
  );
 