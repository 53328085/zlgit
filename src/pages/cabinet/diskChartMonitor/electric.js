import React from 'react'
import styled from 'styled-components'
import {Typography} from 'antd'
import arrow from './imgs/arrow.svg'
const {Text} = Typography
const Elects = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 128px);
  row-gap: 16px;
  column-gap: 32px;
  .box{
   width: 128px;
   display: flex;
   flex-direction: column;

   .btn {
     height: 40px;
     display: flex;
     align-items: center;
     padding-left: 16px;
     padding-right: 8px;
     background-color: #033;
     color: #3F0;
     position: relative;
     justify-content: space-between;
     cursor: pointer;
      
   }
}
`
const Elect = ({title, num})=> {
    return (
      <div className='box'>
          <Text ellipsis={{tooltip:title}}>{title}</Text>
          <div className="btn">{num}
            <img src={arrow} width={12} /> 
          </div>
      </div>  
    )
  }
export default function Index({datas}) {
  if(Array.isArray(datas) && datas.length > 0) {
    return (
        <Elects>
            {
                datas.map(d => <Elect {...d} />)
            }
        </Elects>
      )
  }else {
    return null
  }

}
