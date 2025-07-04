import {Apimethod} from "@api/api.js"

 
  export const { usePage } = new Apimethod( //自动控制
    "post",
    "Light/StreetLightControlLog/Page"
  );