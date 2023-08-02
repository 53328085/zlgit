import React from 'react'
import {Upload, Typography } from 'antd'
import upCloud from '@imgs/upload.png'
 const {Dragger} = Upload
 const {Paragraph, Link} = Typography
export default function Drag({link='/deviceExcel/gateway.xlsx'}) {
  let files = []
  const uploadprops = {
        maxCount: 1,
        beforeUpload: (file,fileList)=> {
            console.log(file,fileList)
            files=[...fileList]
            return false
          }
     }
  return (
     <Dragger {...uploadprops}>
          <img src={upCloud}></img>
          <p style={{ margin: '32px 0', fontSize: '16px' }}>将文件拖到此处，或<Link style={{ color: '#237ae4'}} underline>点击上传</Link></p>
          <Link style={{ color: '#237ae4', fontSize: '16px'}} underline onClick={(e) => e.stopPropagation()}  href={link}>下载模板</Link>
     </Dragger>
  )
}
