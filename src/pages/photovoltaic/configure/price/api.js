import { Apimethod } from "@api/api.js"

export const { useGetPVPrice } = new Apimethod( //查询 光伏价格
  "get",
  "Solar/PVPrice/GetPVPrice"
);
export const { useUpdatePVPrice } = new Apimethod( //更新 光伏价格
  "post",
  "Solar/PVPrice/UpdatePVPrice"
);
