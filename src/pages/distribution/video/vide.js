import React, {forwardRef} from 'react'
import styled from 'styled-components'
import play from './z3.png'
const Box =styled.div`
  &&{
     display: flex;
     flex-direction: column;
     row-gap: 16px;
    
     .vide {
        width: 400px;
        height: 300px;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #dedede;
        border-radius: 2px;
        background-color: ${props => props.theme.primaryColor};
        .img {
            cursor: pointer;
        }
     }
     .videInfo {
       width: 400px;
       height: 50px;
       display: flex;
       flex-direction: column;
       border: 1px solid #dedede;
        border-radius: 2px;
       align-items: center;
       justify-content: center;
     }
 
}
`
export default function Vide(props) {
  console.log(props)
  return (
    <Box>
        <div className='vide'>
            <img src={play} className='img'  onClick={() => props.onClick()} /> 
        </div>
        <div className='videInfo'>
            <p>{props.name}</p>
            <p>{props.address}</p>
        </div>
    </Box>
  )
}
