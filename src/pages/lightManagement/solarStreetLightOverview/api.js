import {Apimethod} from "@api/api.js"

export const { useOverview } = new Apimethod( //概览
    "get",
    "Light/StreetLightSolarOverview/Overview"
  );
  export const { useDetail } = new Apimethod( //点位
    "get",
    "Light/StreetLightSolarOverview/Detail"
  );

  export const { useDetails } = new Apimethod( //卡片
    "get",
    "Light/StreetLightSolarOverview/Details"
  );

  export const { useEuDetail } = new Apimethod( //用电量明细
    "get",
    "Light/StreetLightSolarOverview/EuDetail"
  );

  export const { useEcDetail } = new Apimethod( //发电量明细
    "get",
    "Light/StreetLightSolarOverview/EcDetail"
  );

  export const { useEiDetail } = new Apimethod( //发电折算收益明细
    "get",
    "Light/StreetLightSolarOverview/EiDetail"
  );
  export const { useEeDetail } = new Apimethod( //发电折算收益明细
    "get",
    "Light/StreetLightSolarOverview/EeDetail"
  );