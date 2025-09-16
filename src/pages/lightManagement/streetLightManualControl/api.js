import {Apimethod} from "@api/api.js"

export const { useList } = new Apimethod( //查询列表
    "post",
    "Light/StreetLightManualControl/List"
  );
  export const { useSetControl } = new Apimethod( //手动控制
    "post",
    "Light/StreetLightManualControl/SetControl"
  );

  export const { useTree } = new Apimethod( //手动控制
    "get",
    "Light/StreetLightCommon/Tree"
  );
 
  export const { useOneByOneControl } = new Apimethod( // 单灯控制
    "post",
    "Light/StreetLightManualControl/OneByOneControl"
  );
 
  export const { useLineControl } = new Apimethod( // 单灯控制
    "get",
    "Light/StreetLightManualControl/LineControl"
  );