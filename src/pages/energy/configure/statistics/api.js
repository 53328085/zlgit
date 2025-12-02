import {Apimethod} from "@api/api.js"
export const { useAddSubDeviceOrder } = new Apimethod( // 添加区域分表 //  排序
  "post",
  "General/Area/AddSubDeviceOrder"
);
export const { useAddSummaryDeviceOrder } = new Apimethod( // 添加区域总表 //  排序
    "post",
    "General/Area/AddSummaryDeviceOrder"
  );
 