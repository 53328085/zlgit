import {Apimethod} from "@api/api.js"

export const { useList } = new Apimethod( //查询 线路树  
    "get",
    "Light/StreetLightLine/List"
  );
  export const { useAddConfig } = new Apimethod( // 添加线路设置
    "post",
    "Light/StreetLightConfig/AddConfig"
  );
  export const { useRemoveConfig } = new Apimethod( // 移除线路配置
    "post",
    "Light/StreetLightConfig/RemoveConfig"
  );

  export const { usePageBind } = new Apimethod( // 线路绑定路灯列表
    "Light/StreetLightScheme/PageBind"
  );