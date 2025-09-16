import {Apimethod} from "@api/api.js"
export const { useQueryACsUnConfigByPage} = new Apimethod( //查询   区域未绑定路灯列表
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