import { Apimethod } from "@api/api.js"

export const { useGetAreaImage } = new Apimethod( //查询 区域图片
  "get",
  "Solar/PVAreaImageManager/GetAreaImage"
);
export const { useGetAreaHots } = new Apimethod( //查询 区域热点
  "get",
  "Solar/PVAreaImageManager/GetAreaHots"
);

export const { useUpdateAreaImageAndHot } = new Apimethod( //更新 站点图片和热点
  "post",
  "Solar/PVAreaImageManager/UpdateAreaImageAndHot"
);
export const { useQueryStationList } = new Apimethod( // 查询站点列表
  "get",
  "Solar/RuntimeOverview/QueryStationList"
);