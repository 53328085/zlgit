import {Apimethod} from "@api/api.js"
 
export const { useTree } = new Apimethod( // 公共树
  "post",
  "Common/CommonTree/Tree"
);