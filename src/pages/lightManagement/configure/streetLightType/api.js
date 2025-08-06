import {Apimethod} from "@api/api.js"

export const { useList } = new Apimethod( //查询   
    "get",
    "Light/StreetLightModel/List"
  );
  export const { useAdd } = new Apimethod( //新增 路灯型号
    "post",
    "Light/StreetLightModel/Add"
  );
  export const { useUpdate } = new Apimethod( //修改  路灯型号
    "post",
    "Light/StreetLightModel/Update"
  );

  export const { useDelete } = new Apimethod( //删除  路灯型号
    "delete",
    "Light/StreetLightModel/Delete"
  );