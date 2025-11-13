import styled from "styled-components"
import {Tag} from 'antd'
import imgurl from "@imgs/index"
 

export const Main = styled.div`
    flex:1;
    position: relative;
    
   .title { 
       display: flex;
       align-items: center; 
       padding: 24px;
       position: static;
      
       .text,.ant-badge-status-text {
        color:#fff;
       }
       .text {
         position: relative;
       //  z-index: 1;
       }
   }
   .img {
     position: absolute;
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
`
export const Content =styled.div` 
&&{
    .ant-radio-group-large {
        .ant-radio-button-wrapper{
            width: 80px;
            height: 64px;
        }
    }
    .ant-radio-group-small {
        .ant-radio-button-wrapper-in-form-item{
            width:50px;
            text-align: center;
        }
    }
    .ant-radio-button-wrapper.ant-radio-button-wrapper-checked {
      background-color: ${props=>props.theme.primaryColor};
      g>path:first-child{
        fill:#fff;
      }
      .iconwrap {
        .txt{
        color: #fff;
      }
      }
     
    }
    .ant-radio-button-wrapper {
        background-color: #EEF3FA;
        .iconwrap {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            .txt{
                line-height:1;
                font-size: 13px;
                color: #606266;
            }
        }
    }
}
`