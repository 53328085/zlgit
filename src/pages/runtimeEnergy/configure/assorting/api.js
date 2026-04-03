import {Apimethod} from "@api/api.js"
export const { useGetPublicConsumeCategoryQuotas } = new Apimethod( // 能耗定额分类获取
  "get",
  "Energy/EnergyClassifyDesigner/GetPublicConsumeCategoryQuotas"
);
export const { useSetPublicConsumeCategoryQuotas } = new Apimethod( //查询   能耗定额分类设置
    "post",
    "Energy/EnergyClassifyDesigner/SetPublicConsumeCategoryQuotas"
  );
 