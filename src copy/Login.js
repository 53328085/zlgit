import Profile from "./Profile"
import TodoList from "./components/Todo"
import {Button, Divider} from 'antd'
import App from "./Counter.js"
import React, {PureComponent, useState} from "react"
// 高阶组件共享context
const Publickjob = React.createContext({
 company: '浙江正泰物联技术有限公司',
 address: '杭州市滨江区'
})
function ShareContextHOC(WrapperCpn) {
  return (props) => {
    return (
      <Publickjob.Consumer>
        {(value) => {
          return <WrapperCpn {...props} {...value} />
        }}
      </Publickjob.Consumer>
    )
  }
}
function Hrjob(props) {
   let {company, address, name} = props
   return (
      <div>
        <p>工作地址： {address}</p>
        <p>公司名称： {company}</p>
        <p>员工姓名： {name}</p>
      </div>
   )
}
const HrjobPer = ShareContextHOC(Hrjob)
 function Hr() {
   return (
     <div>
       <Publickjob.Provider value={{address: '杭州市钱塘区', company: '杭州正泰新能源'}}>
        <HrjobPer name="朱正林"></HrjobPer>
       </Publickjob.Provider>
     </div>
   )
}
// 鉴权页面
function Login() { 
  return (
    <h1>登录页面</h1>
  )
}
function Home() {
  return (
    <h2>首页</h2>
  )
}
function Authoer() {
 return (props) => {
    if (props.pass) {
      return <Home />
    }else {
      return <Login />
    }
 }
}
 function Log() {
  const Longin = Authoer()
  return (
    <Longin pass={true}></Longin>
  )
}


const Toggle = props => {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);
  return (
    <div>
      {on && <h1>{props.children}</h1>}
      <button onClick={toggle}>Show/Hide</button>
    </div>
  );
  }
  
  export default  function Tog () {
    return (
      <Toggle>哈喽</Toggle>
    )
  }
/* export default class Person extends PureComponent {
  render() {
    return (
      <div>
        <XhsRookies name="zhuzl" age={45}></XhsRookies>
      </div>
    )
  }
} */
/* function enhanceProps(WrapperComponent, newProps) {
  return (props) => <WrapperComponent {...props} {...newProps} />
}
const EnhanceHeader = enhanceProps(XhsRookies, { height: 1.75 })  */
/* export default function Person() {
  return (
    <> 
      <h2>高价函数</h2>
      <EnhanceHeader name="朱正林" age={42}></EnhanceHeader>
    </>
  )
} */
//export default Itjob