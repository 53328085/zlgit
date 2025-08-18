import styled from "styled-components"
import {Tag} from 'antd'

export const Ctag = styled(Tag)`
  &&{
    position: absolute;
    left: ${props => props.left+'px'};
    top: ${props=> props.top+'px'};
    transform: translate(-50%, -50%);
  }
`
export const Main = styled.div`
   display: grid;
   grid-template-rows: 64px 364px auto  1fr;
   row-gap: 16px;
   .title {
      padding: 16px;
      border: 1px solid #d7d7d7;
      border-radius: 4px;
       background-color: #fff;
       display: flex;
       align-items: center;
       justify-content: space-between;
      .text {
        padding-left: 16px;
        border-left: 4px solid ${props=> props.theme.primaryColor};
        display: flex;
        align-items: center;
        height: 32px;
      }
   }
   .set {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    justify-content: flex-start;
   .imgbox {
    display: flex;
     background-color: #fff;
     width: 432px;
    height: 264px;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215, 215, 215, 1);
    border-radius: 4px;
    padding: 16px;
   }
   .tip {
     color: #999;
     text-align: center;
     width: 432px;
     margin-top: 16px;
   }
  }
   .setwrap {
     display: flex;
     column-gap: 16px;
    .set {
      position: relative;
      padding: 0;
  
      flex:0 0 1368px;
      height: 800px;
      background-color: ${props=>props.theme.primaryderived || "#fffffff"};
      .img{
         position: absolute;
      }
    }
    .point {
      flex: 1 0 294px;
      overflow: auto;
      height: 800px;
    }
  }
`