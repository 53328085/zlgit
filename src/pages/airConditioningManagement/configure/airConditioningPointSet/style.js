import styled from "styled-components"
import {Tag} from 'antd'
import imgurl from "@imgs/index"
 

export const Main = styled.div`
   display: grid;
   grid-template-rows: 58px 58px 1fr; // 58px 48px 364px auto  1fr; 
   
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
     margin-top: 16px;
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
   .content{
    flex:1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 16px;
    row-gap: 16px;
   .set {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    justify-content: flex-start;
    .tip {
     color: #909399; 
     font-size: 13px; 
     .strong {
      font-weight: 500;
      color: #303133;
     }  
   }
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

  }
   .setoutwrap{
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    .settip{
      height: 28px;
      display: flex;
      font-size: 13px;
      color:#303133;
      align-items: center;
      column-gap: 10px;
      .info{
        background: rgba(70,199,255,0.1);
        border-radius: 2px;
        border: 1px solid #46C7FF;
        color:#46C7FF;
        font-size: 12px;
        display: flex;
        align-items:center;
        padding: 0 8px;
        height: 28px;
      }
    }
   .setwrap {
     display: flex;
     column-gap: 16px;
    .set {
      position: relative;
      padding: 0;
  
      flex:1 1 auto;
      height: 800px;
      overflow: auto;
      background-color: ${props=>props.theme.primaryderived || "#fffffff"};
      .img{
         position: absolute;
      }
    }
    .point {
      flex: 0 0 418px;
      overflow: auto;
      height: 800px;
      .desc {
        padding-left: 88px;
        display: grid;
        grid-template-columns: 80px 60px 60px 68px;
        column-gap: 8px;
        color:#909399;
        font-size: 12px;
      }
      .ant-form-item-label-wrap {
        word-break: break-all;
      }
    }
  }
  }
  }
`