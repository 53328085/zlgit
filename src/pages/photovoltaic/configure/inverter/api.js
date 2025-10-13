import { Apimethod } from "@api/api.js"
export const { useOverview } = new Apimethod( // 获取电表设备
  "post",
  "Monitor/RuntimeDevice/Overview"
);
export const { useQueryStationList } = new Apimethod( // 查询站点列表
  "get",
  "Solar/RuntimeOverview/QueryStationList"
);

export const { useGetGridTiedCabinetList } = new Apimethod( // 查询并网柜列表
  "get",
  "Solar/PVGridTiedCabinetManager/GetGridTiedCabinetList"
);
export const { useGetInverterList } = new Apimethod( // 查询并网柜下逆变器列表
  "get",
  "Solar/PVGridTiedCabinetManager/GetInverterList"
);
export const { useGetAreaInverterList } = new Apimethod( // 查询区域下所有逆变器列表
  "get",
  "Solar/PVGridTiedCabinetManager/GetAreaInverterList"
);

export const { useAddGridTiedCabinet } = new Apimethod( // 添加并网柜
  "post",
  "Solar/PVGridTiedCabinetManager/AddGridTiedCabinet"
);
export const { useUpdateGridTiedCabinet } = new Apimethod( // 更新并网柜
  "post",
  "Solar/PVGridTiedCabinetManager/UpdateGridTiedCabinet"
);
export const { useDeleteGridTiedCabinet } = new Apimethod( // 删除并网柜
  "post",
  "Solar/PVGridTiedCabinetManager/DeleteGridTiedCabinet"
);