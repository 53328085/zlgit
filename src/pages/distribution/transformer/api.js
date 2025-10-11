import {Apimethod} from "@api/api.js"
export const { useTransformerLoadRate} = new Apimethod( // 负载率
  "post",
  "/Distribution/DistributionRoomRuntime/TransformerLoadRate"
);
 