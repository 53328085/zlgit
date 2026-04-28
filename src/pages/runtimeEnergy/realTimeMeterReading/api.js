import {Apimethod} from "@api/api.js"
 
export const { useQueryRealtimeReadingList } = new Apimethod( // 实时抄表
  "post",
  "Energy/RealtimeReading/QueryRealtimeReadingList"
);
export const { useStartCalling } = new Apimethod( // 开始抄读
  "post",
  "/Monitor/RuntimeRemote/StartCalling"
);
//Energy/RealtimeReading/CallingExResponse

export const { useCallingExResponse } = new Apimethod( //  抄读
  "post",
  "Energy/RealtimeReading/CallingExResponse"
);

export const { useSetResult } = new Apimethod( //  设置结果
  "post",
  "/Monitor/RuntimeRemote/SetResult"
);