import React from 'react'
import styled from 'styled-components'
const Divbox = styled.div`  
    width: 456px;
    height: ${props => props.height || '200px'}; 
    background-color: #fff;
    border: none;
    border-radius: 4px;    
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.34);
    padding: 16px;
    .title{
        height: 24px;
        border-left: 4px solid #237ae4;
        display: flex;
        align-items: center;
        padding-left: 16px;
        color: #333;
        font-size: 14px;
    }
`
export default function Icard({height, custTitle}) {
  return (
     <Divbox height={height}  >
        <h4 className='title'>{custTitle}</h4> 
     </Divbox>
  )
}
