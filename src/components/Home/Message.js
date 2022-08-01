import React, {useState} from 'react'
import {NavLink, Outlet, useNavigate, useInRouterContext, useNavigationType} from 'react-router-dom'
const messageType = {
      text: '浙江省',
      code: '0571'
}
const msgContext = React.createContext(messageType)
export default function Message() {
  const [msg] = useState([
    {id: 1, title: '消息1',content: '消息1'},
    {id: 2, title: '消息2',content: '消息2'},
    {id: 3, title: '消息3',content: '消息3'}
  ])
  const navgate = useNavigate() // 编程式导航
  console.log(useInRouterContext())
  console.log(useNavigationType()) // 进入页面的方式
  const showDtl = (m) => {
    navgate('wkl', {
      state: {
        id: m.id,
        title: m.title,
        content: m.content
      }
    })
  }
  return (
      <div>
        <div>Message</div>
 
        <div>
            {
              msg.map(item =>{return (
                <li key={item.id}>
                   {/*  <NavLink  title={item.title} to={`wkl?id=${item.id}&title=${item.title}&content=${item.content}`}>{item.content}</NavLink>  query方式传参*/}
                    <NavLink  title={item.title} 
                    to='wkl'
                    state={{
                      id: item.id,
                      title: item.title,
                      content: item.content
                    }}
                    >{item.content}</NavLink> 
                    {/* state 方式传参 */}
                   <button onClick={() => showDtl(item)}>showDtl</button>
                </li>
              )})
            }
        </div>
        <div>
        
          <Outlet/>
       
        </div>
    </div>
  )
}
