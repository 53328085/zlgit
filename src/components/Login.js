import { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {loginByName, test, selectLoading, selectUser} from '../redux/user'
export default  function Login() {
   const [name, userSet] = useState('admin')
   const [pwd, pwdSet] = useState('chint_123456')
   let loading = useSelector(selectLoading)
   let userinfo = useSelector(selectUser)
   console.log(loading)
   const dispatch = useDispatch()
   const submit = async () => {
     let data = await dispatch(loginByName({name, pwd})).unwrap()
     console.log(data)
   }
   const Wait = <h1>等待中……</h1>
   const finsh = <h1>请求完成</h1>
   return (

    <div>
       <p><label>用户名</label><input value={name} onChange={e => userSet(e.target.value)}></input></p>
       <p><label>用户名</label><input value={pwd} onChange={e => pwdSet(e.target.value)}></input></p>
       <p><button onClick={submit}>提交</button></p>
       <div>
         <p> 用户姓名： {userinfo.loginName} </p>
         <p> 用户电话： {userinfo.mobile} </p>
       </div>
    </div>

   )
}