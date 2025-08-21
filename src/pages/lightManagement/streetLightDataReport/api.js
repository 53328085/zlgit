import {Apimethod} from "@api/api.js"

 
  export const { useQueryConsumeTime } = new Apimethod( //自动控制
    "post",
    "Light/StreetLightReport/QueryConsumeTime"
  );