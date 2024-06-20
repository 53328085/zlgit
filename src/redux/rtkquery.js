import {message} from 'antd'
 
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
const baseQuery = fetchBaseQuery({
   baseUrl: process.env.NODE_ENV === "production" ? '/V1' :  '/api/V1', 
   prepareHeaders: (headers, {getState}) => {    
    
     const Token = getState().user?.token 
     headers.set('Token', Token)
     headers.set('content-type', 'application/json')
     return headers;
  },
  timeout: 50000,
  paramsSerializer:(params) =>{
     console.log(params)
     let getlang = localStorage.getItem("i18nextLng")?.slice(0,2)?.toLowerCase()
     let lang = getlang??'zh'
     console.log(lang)
     return  params.append('culture', lang)
  }

})
const baseQueryWithReauth = async(args, api, extraOptions) =>{
   const lang =  api.getState().system.intl?.locale?.slice(0,2)?.toLowerCase()?? 'zh'
 
   let {url} =args
   if(url.includes("?")) {
      url=url+`&culture=${lang}`
  }else {
      url = url+`?culture=${lang}`
  }
  args.url = url
   
   let result = await baseQuery(args,api, extraOptions)  
   
   if(result.error ) {
     const {originalStatus: status, data} = result.error
     const {response} = result.meta
     if(status == 200) {
      console.log(response.statusText)
     }
     if (status >= 400 && status < 500 && status != 401 )  {
      console.log(response.statusText)
      return  message.warning({          
          content:  data || '请求参数出错',
          duration: 2,
         
      })
  }
     if(status==401) {
      console.log(response.statusText)
      return  message.warning({          
         content:  data || '登录状态发生改变,请重新登录',
         onClose: () => {
             window.location.href="/"
         },
         duration: 0.5,
       })
     }
     if(status >=500) {
       console.log(response.statusText)
       return    // message.warning(response.statusText)   // message.warning(response.statusText || '数据出错')
     }
  
   }
   return result
}
export const apiSlice = createApi({
    reducerPath: 'NESapi',  
    baseQuery: baseQueryWithReauth,
    tagTypes: ['carbon'],   
    endpoints: build => ({
       
        
    })
 

})
