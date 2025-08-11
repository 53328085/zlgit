import {Apimethod} from "@api/api.js"

export const { useTree } = new Apimethod( //查询 线路树  
    "get",
    "Light/StreetLightLine/Tree"
  );
  export const { useAdd} = new Apimethod( // 添加线路
    "post",
    "Light/StreetLightLine/Add"
  );
  export const { useUpdate } = new Apimethod( // 编辑线路
    "post",
    "Light/StreetLightLine/Update"
  );

  export const { useDelete } = new Apimethod( //  删除线路
     "get",
    "Light/StreetLightLine/Delete"
  );

  export const { usePageBind } = new Apimethod( //  线路绑定路灯列表
    "post",
    "Light/StreetLightLine/PageBind"
  );

  export const { usePageUnBind } = new Apimethod( //  线路未绑定路灯列表
    "post",
    "Light/StreetLightLine/PageUnBind"
  );

  export const { useLineBindLight} = new Apimethod( //  线路绑定路灯
    "post",
    "Light/StreetLightLine/LineBindLight"
  );
  export const { useLineUnBindLight} = new Apimethod( //  解除线路绑定路灯
    "post",
    "Light/StreetLightLine/LineUnBindLight"
  );

  export const { useLoadSwitch} = new Apimethod( //  获取断路器
    "get",
    "Light/StreetLightLine/LoadSwitch"
  );
  export const { useLineBindSwitch} = new Apimethod( //  线路断路器设置
    "get",
    "Light/StreetLightLine/LineBindSwitch"
  );