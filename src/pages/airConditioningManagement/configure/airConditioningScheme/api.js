import {Apimethod} from "@api/api.js"

export const { usePage } = new Apimethod( //查询  空调控制方案
    "post",
    "Conditioner/AirConditionerScheme/Page"
  );
  export const { useAdd} = new Apimethod( //新增  空调控制方案
    "post",
    "Conditioner/AirConditionerScheme/Add"
  );
  export const { useUpdate} = new Apimethod( //编辑  控制方案
    "post",
    "Conditioner/AirConditionerScheme/Update"
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
  export const { usePageUnBind} = new Apimethod( //方案 未绑定路灯列表
    "post",
    "Light/StreetLightScheme/PageUnBind"
  );
  export const { usePageBind} = new Apimethod( //方案绑定路灯列表
    "post",
    "Light/StreetLightScheme/PageBind"
  );
  export const { useClone} = new Apimethod( //克隆 控制方案
    "get",
    "Light/StreetLightScheme/Clone"
  );