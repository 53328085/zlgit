import {Apimethod} from "@api/api.js"
export const { useQueryData} = new Apimethod( // 获取区域能耗数据
  "get",
  "/LargeScreen/LargeScreenSaNoFi/QueryData"
);
export const { useQueryOverview } = new Apimethod( // 获取区域能耗数据
  "post",
  "Energy/EnergyComprehensiveRuntime/QueryOverview"
);
 
export const { useQueryEnergyRankByArea } = new Apimethod( // 区域能耗排名
    "get",
    "Energy/EnergyRankingRuntime/QueryEnergyRankByArea"
  );
export  const body={  // 参数先写死
    "projectId": 20,
    "dayMonthYear": 1,
    "date": "2025-12-31",
    "areaIds": [
        638,
        627,
        677,
        678,
        680,
        681,
        639,
        640,
        664,
        665,
        666,
        667,
        668,
        669,
        670,
        641,
        671,
        672,
        673,
        674,
        675,
        676,
        661,
        662
    ],
    "type": 1,
    "name": "E厂房用电",
    "areaId": 0,
    "group": 1
}
  export const { useQueryEnergyDetail } = new Apimethod( // 区域能耗排名
    "post",
    "/Energy/EnergyClassifyRuntime/QueryEnergyDetail"
  );
