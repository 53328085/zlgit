import React from 'react'
import Titlelayout from '@com/titlelayout';
import flower from '@imgs/flower.png'
import styled, {css} from 'styled-components'
import {useSelector} from "react-redux"
import {CustTransO} from "@com/useButton"
import { themeColor,adaptation } from '@redux/systemconfig.js'

const sty=css`
  column-gap:16px ;
  padding: 0px;
  img {
    height: 36px;
    width: 36px;
  }
  .content {
    .number {
      font-size: 16px;
    }
    .title {
      font-size: 12px;
    }
  }
`
const Mainbox = styled.div`
display: flex;
flex: 1;

align-items: center;
padding: 0 8px;
color: ${props=> props.theme.bgcolorfont};
column-gap: 34px;
overflow: hidden;
img {
  height: 42px;
  width: 42px;
}
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
    color: ${props=> props.theme.bgcolorfont};
  }
  .number {
    font-size: 28px;
    font-weight: bold;
  }
}
${props=> props.laptop ? sty : null}
`
export default function card({title,bgcolor='#043665',numberval=0.00}) {

let {primaryderived,bgcolorfont} = useSelector(themeColor)
let {laptop} = useSelector(adaptation)
  
  return (
  
     <Titlelayout   bgcolor={primaryderived} layout="flex" hv="24px" bg="transparent" bl="4px solid #fff" fc="#fff" style={{height: '92px'}} pv={laptop ? "8px" : "16px"}>
       <Mainbox laptop={laptop}>
          <img src={flower} alt="" />
          <div className='content'>
             <p className='title'>{title}</p>
             <p className='number'><CustTransO ns="comm" text="intlNumberWithOptions" val={numberval} /></p>  
           </div> 
       </Mainbox>
 </Titlelayout>
  )
}
