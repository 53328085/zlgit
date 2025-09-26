import {Apimethod} from "@api/api.js"

export const { usePage } = new Apimethod( //查询  路灯控制方案
    "post",
    "Light/StreetLightScheme/Page"
  );
  export const { useAdd} = new Apimethod( //新增  控制方案
    "post",
    "Light/StreetLightScheme/Add"
  );
  export const { useUpdate} = new Apimethod( //编辑  控制方案
    "post",
    "Light/StreetLightScheme/Update"
  );
  export const { useDelete} = new Apimethod( //删除  控制方案
    "delete",
    "Light/StreetLightScheme/Delete"
  );
  export const { useUnBindLight} = new Apimethod( // 方案解除绑定路灯
    "post",
    "Light/StreetLightScheme/UnBindLight"
  );
  export const { useBindLight} = new Apimethod( // 方案绑定路灯
    "post",
    "Light/StreetLightScheme/BindLight"
  );

  export const { useClone} = new Apimethod( //克隆 控制方案
    "get",
    "Light/StreetLightScheme/Clone"
  );

  export const { usePageUnBind} = new Apimethod( //方案 未绑定路灯列表
    "post",
    "Light/StreetLightScheme/PageUnBind"
  );
  export const { usePageBind} = new Apimethod( //方案绑定路灯列表
    "post",
    "Light/StreetLightScheme/PageBind"
  );

  // 线路
  export const { useLineUnBind} = new Apimethod( //方案 未绑定线路列表
    "post",
    "Light/StreetLightScheme/LineUnBind"
  );
  export const { useLineBind} = new Apimethod( //方案绑定线路灯列表
    "post",
    "Light/StreetLightScheme/LineBind"
  );

  export const { useUnBindLine} = new Apimethod( // 方案解除绑定线路
    "post",
    "Light/StreetLightScheme/UnBindLine"
  );
  export const { useBindLine} = new Apimethod( // 线路绑定路灯
    "post",
    "Light/StreetLightScheme/BindLine"
  );
  export const { useSchemeBatchSend} = new Apimethod( // 档案下发
    "get",
    "Light/StreetLightScheme/SchemeBatchSend"
  );