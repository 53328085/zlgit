import {Apimethod} from "@api/api.js"
 
export const { useQueryExteriorACsByPage } = new Apimethod( //查询空调 档案
  "post",
  "AirConditioner/AirConditionerManage/QueryExteriorACsByPage"
);

export const { useQueryCSnsList } = new Apimethod( //查询空调控制器列表
  "get",
  "AirConditioner/AirConditionerManage/QueryCSnsList"
);

export const { useQueryMSnsList } = new Apimethod( //查询空调控制器列表
  "get",
  "AirConditioner/AirConditionerManage/QueryMSnsList"
);

export const { useQueryMSns } = new Apimethod( // 查询空调计量设备列表
  "get",
  "AirConditioner/AirConditionerManage/QueryMSns"
);

export const { useQueryModelsList } = new Apimethod( // 查询空调型号列表
  "get",
  "AirConditioner/AirConditionerManage/QueryModelsList"
)


 
  export const { useInsertOrUpdateExteriorAC} = new Apimethod( //新增/编辑  空调外机
    "post",
    "AirConditioner/AirConditionerManage/InsertOrUpdateExteriorAC"
  );

  export const { useDeleteAC} = new Apimethod( // 删除空调 档案
    "delete",
    "AirConditioner/AirConditionerManage/DeleteAC"
  );

  export const { useUpdate} = new Apimethod( //编辑  路灯档案
    "post",
    "Light/StreetLight/Update"
  );
  export const { useDelete} = new Apimethod( //编辑  路灯档案
    "delete",
    "Light/StreetLight/Delete"
  );
  export const { useImport} = new Apimethod( //上传  路灯档案
    "post",
    "Light/StreetLight/Import"
  );