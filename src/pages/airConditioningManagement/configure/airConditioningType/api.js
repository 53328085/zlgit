import {Apimethod} from "@api/api.js"

export const { useQueryACModels} = new Apimethod( //查询   空调型号
    "get",
    "AirConditioner/AirConditionerManage/QueryACModels"
  );
  export const { useInsertOrUpdateACModel } = new Apimethod( //新增/编辑 空调型号
    "post",
    "AirConditioner/AirConditionerManage/InsertOrUpdateACModel"
  );
 

  export const { useDeleteACModel } = new Apimethod( //删除  路灯型号
    "delete",
    "AirConditioner/AirConditionerManage/DeleteACModel"
  );