import { Apimethod } from "@api/api.js"

export const { useGetAllDevice } = new Apimethod( // 获取电表设备
  "get",
  "Solar/PVStationManager/GetAllDevice"
);
export const { useGetPVStationList } = new Apimethod( // 查询站点列表
  "get",
  "Solar/PVStationManager/GetPVStationList"
);
export const { useAddPVStation } = new Apimethod( // 添加站点
  "post",
  "Solar/PVStationManager/AddPVStation"
);
export const { useUpdatePVStation } = new Apimethod( // 更新站点
  "post",
  "Solar/PVStationManager/UpdatePVStation"
);
export const { useDeletePVStation } = new Apimethod( // 删除站点
  "post",
  "Solar/PVStationManager/DeletePVStation"
);