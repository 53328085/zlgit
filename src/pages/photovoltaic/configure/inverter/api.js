import { Apimethod } from "@api/api.js"
export const { useOverview } = new Apimethod( // 获取电表设备
  "post",
  "Monitor/RuntimeDevice/Overview"
);
export const { useQueryStationList } = new Apimethod( // 查询站点列表
  "get",
  "Solar/RuntimeOverview/QueryStationList"
);
export const { useQueryACsUnConfigByPage } = new Apimethod( //查询   区域未绑定路灯列表
  "post",
  "AirConditioner/AirConditionerConfig/QueryACsUnConfigByPage"
);
export const { useQueryACsConfigByPage } = new Apimethod( //查询   区域绑定空调列表
  "post",
  "AirConditioner/AirConditionerConfig/QueryACsConfigByPage"
);

export const { useAddACsConfig } = new Apimethod( // 添加  区域设置
  "post",
  "AirConditioner/AirConditionerConfig/AddACsConfig"
);

export const { useRemoveACsConfig } = new Apimethod( // 移除区域设置
  "post",
  "AirConditioner/AirConditionerConfig/RemoveACsConfig"
);
export const { useGetGridTiedCabinetList } = new Apimethod( // 查询并网柜列表
  "get",
  "Solar/PVGridTiedCabinetManager/GetGridTiedCabinetList"
);
export const { useGetInverterList } = new Apimethod( // 查询并网柜下逆变器列表
  "get",
  "Solar/PVGridTiedCabinetManager/GetInverterList"
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