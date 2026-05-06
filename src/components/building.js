import React from 'react' 

import {Typography, Empty} from 'antd' 
import imgurl from '../assets/image'
export default function Index({pagename=''}) {
  const {Link, Text, Paragraph} = Typography
  const style = {
     flex: 1,
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     flexDirection: 'column',
  }
  return (
    <Empty image={imgurl.empty}
         styles={{
          image:{width: '200px', height: '180px'}
         }}
         style={style}
         description={<Paragraph><Text strong type="warning">{pagename}页面建设中……</Text></Paragraph>}
      />
  )
}
