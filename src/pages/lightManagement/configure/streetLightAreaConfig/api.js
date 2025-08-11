import {Apimethod} from "@api/api.js"
export const { useListUnBindLight } = new Apimethod( //查询   区域未绑定路灯列表
  "post",
  "Light/StreetLightConfig/ListUnBindLight"
);
export const { useListBindLight } = new Apimethod( //查询   区域绑定路灯列表
    "post",
    "Light/StreetLightConfig/ListBindLight"
  );

  export const { useAddConfig } = new Apimethod( // 添加  区域设置
    "post",
    "Light/StreetLightConfig/AddConfig"
  );

  export const { useRemoveConfig } = new Apimethod( // 移除区域设置
    "post",
    "Light/StreetLightConfig/RemoveConfig"
  );