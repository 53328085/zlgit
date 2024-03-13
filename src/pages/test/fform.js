import React from 'react'
import styled from 'styled-components'
import logo from './logo.png'
const Mainbox = styled.div` 
   .wrapper {
    display: flex;
    width: 320px;
    input[type="text"] {
      flex: 1 1 auto;
    }
    label {
      background-color: tan;
      color: #fff;
      text-align: center;
     
      display: inline-block;
    }
   }
  
`
 
export default function fform() {
  let data =   Array.from({length:4}, (x,i) => i+1)
  return (
    <Mainbox>
        <div className="wrapper">
            <label for="age">年龄</label>
            <input type="text" id="age"></input>
            <button type='submit'>提交</button>
        </div>
    </Mainbox>
  )
}
