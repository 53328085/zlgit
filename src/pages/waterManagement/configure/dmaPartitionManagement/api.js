import {Apimethod} from "@api/api.js"

export const { useetDetail } = new Apimethod( //获取分区详情
    "get",
    "/DMA/DMAPartition/GetDetail"
  );
  export const { useGetListPaged } = new Apimethod( // 获取分区列表
    "get",
    "/DMA/DMAPartition/GetListPaged"
  );
  export const { useGetTree} = new Apimethod( // 获取分区列表
    "get",
    "/DMA/DMAPartition/GetTree"
  );

  export const { useInsert} = new Apimethod( // 新建分区
    "post",
    "DMA/DMAPartition/Insert"
  );

  export const { useGetAlarmSettings} = new Apimethod( // 新建分区
    "get",
    "/DMA/DMAPartition/GetAlarmSettings"
  );
