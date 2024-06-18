import axios from 'axios'
import { message } from 'antd'
import store from '../redux/store'

const server = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? '/V1' :  '/api/V1',
    timeout: 50000,
    headers: {      
        'Content-Type': "application/json",
        'Cache-Control': 'no-cache',
    }
})
server.interceptors.request.use(
    config => {     
       //const token = window.sessionStorage.getItem('token');
       let {url} = config
       let getlang = localStorage.getItem("i18nextLng")?.slice(0,2)?.toLowerCase()
       let lang =(getlang=='zh' || !getlang) ? 'zh' : getlang

       const token = store.getState()?.user?.token
       config.headers['token'] = token
        if(url.includes("?")) {
            url=url+`&culture=${lang}`
        }else {
            url = url+`?culture=${lang}`
        }
        config.url = url;
        return config
    },
    error => {
        let msg = error.message || '请求出错'
        return  message.error({
            content: msg,
        })
    }
)
server.interceptors.response.use(
    response => { 
      if(response.config.responseType ==='blob') {
        return Promise.resolve(response)
      }
      const data = response.data || {}
      return data
    },
    error => {       
        let msg = error?.response?.statusText
        let state = error?.response?.status       
        if (state >= 400 && state < 500 && state != 401 )  {
            return  message.warning({          
                content: '请求参数出错',
                duration: 2,
               
            })
        }
        if (state == 401)  {
           console.log(401)
           message.warning({          
            content: '登录状态发生改变,请重新登录',
            onClose: () => {
                window.location.href="/"
            },
            duration: 0.5,
          })
          
         // message.destroy()
        }
        if (state >= 500)   {
            console.log(msg)
            message.error(msg || '数据出错')
        }
        return Promise.reject(error)
    })
export default server
