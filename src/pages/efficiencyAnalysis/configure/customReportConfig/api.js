import {Apimethod} from "@api/api.js"

export const { useList } = new Apimethod( //自动控制
    "get",
    "Light/StreetLightAutoControl/List"
  );
  export const { useDetail } = new Apimethod( //自动控制
    "post",
    "Light/StreetLightAutoControl/Detail"
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