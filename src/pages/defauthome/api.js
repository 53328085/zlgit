import {Apimethod} from "@api/api"
export const {useSetDefaultParam} =new Apimethod("post", 
    "/UISummary/UISummary/SetDefaultParam"
  )
export  const {useQueryParam} =new Apimethod("get", 
    "/UISummary/UISummary/QueryParam"
  )

  export  const {useGetTransformersInfo} =new Apimethod("get", 
    "Home/HomeRuntime/GetTransformersInfo"
  )
  export  const {useTransformerList} =new Apimethod("get", 
    "UISummary/UISummary/TransformerList"
  ) 