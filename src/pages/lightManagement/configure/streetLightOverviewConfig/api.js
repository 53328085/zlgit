import {Apimethod} from "@api/api.js"
export const { useList } = new Apimethod( // 获取总览图及点位
  "get",
  "Light/StreetLightPicture/List"
);
export const { useSetStreetLightImageLocation } = new Apimethod( // 获取总览图及点位
    "post",
    "Light/StreetLightPicture/SetStreetLightImageLocation"
  );