import {Apimethod} from "@api/api.js"

export const { useGetDetail } = new Apimethod( //获取分区详情
    "get",
    "/DMA/DMAPartition/GetDetail"
  );
  export const { useGetListPaged } = new Apimethod( // 获取分区列表
    "post",
    "/DMA/DMAPartition/GetListPaged"
  );
  export const { useGetTree} = new Apimethod( // 获取分区列表树
    "get",
    "/DMA/DMAPartition/GetTree"
  );

  export const { useInsert} = new Apimethod( // 新建分区
    "post",
    "DMA/DMAPartition/Insert"
  );
  export const { useUpdate} = new Apimethod( // 修改分区
    "post",
    "/DMA/DMAPartition/Update"
  );
  export const { useDelete} = new Apimethod( // 删除分区
    "post",
    "/DMA/DMAPartition/Delete"
  );

  export const {useGetListDeviceCount} = new Apimethod( // 获取分区设备数量
    "get",
    "/DMA/DMAPartition/GetListDeviceCount"
  );

  export const {useGetListDevicePaged }= new Apimethod( // 获取DMA分区设备列表
    "post",
    "/DMA/DMAPartition/GetListDevicePaged"
  );
  export const {useGetListUnboundDevicePaged }= new Apimethod( // 分区表具选择（排除已选）
    "post",
    "/DMA/DMAPartition/GetListUnboundDevicePaged"
  );

  export const {useAddDevices }= new Apimethod( // 添加分区设备
    "post",
    "/DMA/DMAPartition/AddDevices"
  );
  export const { useGetAlarmSettings} = new Apimethod( // 获取分区预警配置
    "get",
    "/DMA/DMAPartition/GetAlarmSettings"
  );
 
  export const { useUpdateAlarmSetting} = new Apimethod( // 获取分区预警配置
    "post",
    "/DMA/DMAPartition/UpdateAlarmSetting"
  );

