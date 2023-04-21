import React from 'react' 
import notfound from './404.png'
import {Typography, Empty} from 'antd' 
export default function Index() {
  const {Link, Text, Paragraph} = Typography
  const style = {
     flex: 1,
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     flexDirection: 'column',
  }
  return (
    <Empty image={notfound}
         imageStyle={{width: '200px', height: '180px'}}
         style={style}
         description={<Paragraph><Text strong type="warning">抱歉！页面没找到</Text><Link  onClick={() => window.location.reload(true)}>刷新页面</Link>或<Link type='primary' ghost onClick={() => window.history.back()}>返回上一页</Link></Paragraph>}
      />
  )
}
