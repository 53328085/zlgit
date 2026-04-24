import {Apimethod} from "@api/api.js"
 
export const { useQueryRealtimeReadingList } = new Apimethod( // 实时抄表
  "post",
  "Energy/RealtimeReading/QueryRealtimeReadingList"
);