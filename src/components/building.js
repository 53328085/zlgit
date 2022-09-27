import React from 'react'
import {Image} from 'antd'
import styled from 'styled-components'
import Titlelayout from './titlelayout'
import imgurl from '../assets/image'
export default function Building() {
  return (
       <Titlelayout>
          <Image src={imgurl.building} width={160} height={160}></Image>
           <span>项目建设中……</span>
       </Titlelayout>
  )
}
