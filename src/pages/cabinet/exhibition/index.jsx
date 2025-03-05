import React from 'react'
import styled from 'styled-components'
import exbg from './exbg.jpg'
const Mainbox=styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  .head {
    height: 48px;
    display: flex;
    background-color: rgba(0, 51, 153, 1);
    font-family: '微软雅黑';
    font-weight: 400;
    font-size: 24px;
    color: #FFFFFF;
  }
  .content {
    flex:1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(${exbg});
    background-repeat: no-repeat;
    background-size: cover;
  }
`
export default function Index() {
  return (
    <Mainbox>
      <div className="head"></div>
      <div className="content"></div>
    </Mainbox>
  )
}

