import { Apimethod } from "@api/api.js"

export const { useGetStationImage } = new Apimethod( //查询 站点图片
  "get",
  "Solar/PVAreaImageManager/GetStationImage"
);
export const { useGetStationHots } = new Apimethod( //查询 站点热点
  "get",
  "Solar/PVAreaImageManager/GetStationHots"
);

export const { useUpdateStationImageAndHot } = new Apimethod( //更新 站点图片和热点
  "post",
  "Solar/PVAreaImageManager/UpdateStationImageAndHot"
);
export const { useQueryStationList } = new Apimethod( // 查询站点列表
  "get",
  "Solar/RuntimeOverview/QueryStationList"
);