import {Apimethod} from "@api/api.js"
 
export const { useNodeTree } = new Apimethod( // 公共树
  "post",
  "Common/CommonTree/NodeTree"
);