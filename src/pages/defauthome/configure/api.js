import {Apimethod} from "@api/api"
export const {useSetDefaultParam} =new Apimethod("post", 
    "/UISummary/UISummary/SetDefaultParam"
  )
export  const {useQueryParam} =new Apimethod("get", 
    "/UISummary/UISummary/QueryParam"
  )