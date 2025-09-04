import {Apimethod} from "@api/api.js"
export const { useList } = new Apimethod( //查询   路灯型号
  "get",
  "Light/StreetLightModel/List"
);
export const { usePage } = new Apimethod( //查询  路灯档案
    "post",
    "Light/StreetLight/Page"
  );
  export const { useAdd} = new Apimethod( //新增  路灯档案
    "post",
    "Light/StreetLight/Add"
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

  export const { useQuerySelectList} = new Apimethod( //上传  路灯档案
    "get",
    "Light/StreetLight/QuerySelectList"
  );