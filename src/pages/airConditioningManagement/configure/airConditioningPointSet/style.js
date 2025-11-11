import styled from "styled-components"
import {Tag} from 'antd'
import imgurl from "@imgs/index"
 

export const Main = styled.div`
   display: grid;
   grid-template-rows: 58px 48px 364px auto  1fr;
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
   .tags {
     display: flex;
     align-items: center;
     gap: 10px;
      .ant-tag{
      min-width: 114px;
      height: 41px;
    //  background: #F0F2F5;
      border-radius: 4px 4px 0px 0px;
     // border: 1px solid #DCDFE6;
      font-size: 14px;
     // color: #303133;
      display: flex;
      align-items: center;
      justify-content: center;
      margin:0;
      cursor: pointer;
       .ant-tag-close-icon {
           padding-left: 12px;
       }
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
  
      flex:0 0 1294px;
      height: 800px;
      overflow: auto;
      background-color: ${props=>props.theme.primaryderived || "#fffffff"};
      .img{
         position: absolute;
      }
    }
    .point {
      flex: 0 0 370px;
      overflow: auto;
      height: 800px;
      .desc {
        padding-left: 88px;
        display: grid;
        grid-template-columns: 80px 80px 68px;
        column-gap: 10px;
        color:#909399;
        font-size: 12px;
      }
      .ant-form-item-label-wrap {
        word-break: break-all;
      }
    }
  }
`