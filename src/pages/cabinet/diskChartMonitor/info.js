import React from 'react'
import styled from 'styled-components'
const Mainbox = styled.div`
    height: 96px;
    display: flex;
    column-gap: 16px;
    .box{
    width: 188px;
    height: 96px; 
    background-color: rgba(0, 102, 204, 1); 
    border-radius: 4px;  
    font-size: 14px;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .title {
        height: 28px;
        background-color: #003366;
        padding: 0 8px;
        display: flex;
        align-items: center;
    }
    .center {
        flex:1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
    }
    }
`
const Block = ({title,state}) => {
    return (
            <div className='box'>
            <div className="title">{title}</div>
            <div className="center">
                {state}
            </div>
        </div>
    )
}
export default function Index({vstate=[]}) {
    console.log(vstate)
  if(Array.isArray(vstate) && vstate.length > 0) {
    return (
        <Mainbox>
            {
                vstate.map( v => <Block {...v} />)
            }
        </Mainbox>
      )

  }else {
    return null
  }
 
}

