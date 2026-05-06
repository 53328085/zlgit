import React from 'react'  
import  {ReactComponent as Notfout } from './404.svg'
import {Typography, Empty} from 'antd' 
import {useNavigate,useLocation} from 'react-router-dom'
export default function Index() {
  const {Link, Text, Paragraph} = Typography
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const style = {
     flex: 1,
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     flexDirection: 'column',
  }
  return (
    <Empty image={<Notfout />}
         styles={{
          image: { width: '200px', height: '180px' }
         }} 
         style={style}
         description={<Paragraph><Text strong type="warning">抱歉！页面没找到</Text>
         <Link  onClick={() => window.location.reload(true)}>试下刷新</Link>
         {
          pathname.includes('/index')|| pathname.includes('/config')?null:<>
          或者<Link  onClick={() => navigate('/')}>返回首页</Link>
          </>
         }
         </Paragraph>
        }
      />
  )
}
