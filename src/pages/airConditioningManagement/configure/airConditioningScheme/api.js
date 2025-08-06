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
    "Conditioner/AirConditionerScheme/Delete"
  );
  export const { useUnBindConditioner} = new Apimethod( // 方案解除绑定路灯
    "post",
    "Conditioner/AirConditionerScheme/UnBindConditioner"
  );
  export const { useBindConditioner} = new Apimethod( // 方案绑定空调
    "post",
    "Conditioner/AirConditionerScheme/BindConditioner"
  );
  export const { usePageUnBind} = new Apimethod( //方案 未绑定空调列表
    "post",
    "Conditioner/AirConditionerScheme/PageUnBind"
  );
  export const { usePageBind} = new Apimethod( //方案绑定空调列表
    "post",
    "Conditioner/AirConditionerScheme/PageBind"
  );
  export const { useClone} = new Apimethod( //克隆 控制方案
    "get",
    "Light/StreetLightScheme/Clone"
  );