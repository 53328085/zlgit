import {Apimethod} from "@api/api"
export const { useTransformerList } = new Apimethod( //查询   区域未绑定路灯列表
    "get",
    "/Distribution/DistributionRoomRuntime/TransformerList"
  );