import axios from 'axios'
import { message } from 'antd'
import store from '../redux/store'
import {Navigate} from 'react-router-dom'
//const token = store.getState().user.token
//console.log(token)

const server = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? '/V1' :  '/api/V1',
    timeout: 5000,
    headers: {      
        'Content-Type': "application/json"
    }
})
server.interceptors.request.use(
    config => {     
       //const token = window.sessionStorage.getItem('token');
      
       const token = store.getState()?.user?.token
       config.headers['token'] = token
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
      const data = response.data || {}
      return data
    },
    error => {       
        let msg = error?.response?.statusText
        let state = error?.response?.status
       
        if (state >= 400 && state < 500 && state != 401 )  {
            console.info(msg)
        }
        if (state == 401)  {
          message.warning({
          
            content: '登录状态发生改变,请重新登录',
            onClose: () => (<Navigate to='/' replace={true} />)
           
        })
        }
        if (state >= 500)   message.error(msg)
        return Promise.reject(error)
    })
export default server
