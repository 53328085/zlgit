import React from 'react'
import Titlelayout from '@com/titlelayout';
import flower from '@imgs/flower.png'
import styled from 'styled-components'
import {useSelector} from "react-redux"
import {CustTransO} from "@com/useButton"
import { themeColor } from '@redux/systemconfig.js'
import { Progress } from 'antd';
const Progressdiv =styled.progress`

   border-radius: 10px;
   border:  1px solid #d7d7d7;
   height: 8px;
   width: 160px;
   margin-left: 5px;
   padding: 1px;
    &::-webkit-progress-value {
        background: #ffff99;
        border-radius:10px;
    }
    &::-webkit-progress-bar{
     background-color:transparent;
     border-radius:10px;
}

`
const Mainbox = styled.div`
display: flex;
flex: 1;

align-items: center;
padding: 0 8px;
color: #fff;
column-gap: 34px;
overflow: hidden;
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 16px;
  p {
    line-height: 1;
  }
  .title {
    color: #f2f2f2;
  }
  .number {
    font-size: 28px;
    font-weight: bold;
  }
}
`
export default function card({title,bgcolor='#043665',numberval=0.00}) {

let {primaryderived} = useSelector(themeColor)
  return (
  
     <Titlelayout   bgcolor={primaryderived} layout="flex" hv="24px" bg="transparent" bl="4px solid #fff" fc="#fff" style={{height: '92px', width: '324px'}}>
       <Mainbox>
          <img src={flower} alt="" style={{width:42,height:42}}/>
          <div className='content'>
             <p className='title'>{title}</p>
             <p className='number'><CustTransO ns="comm" text="intlNumberWithOptions" val={numberval} /></p>  
           </div> 
       </Mainbox>
 </Titlelayout>
  )
}
