import {Drawer} from "antd";
import styled, {css} from "styled-components";
import imgsrc from "./imgs";
import GouIcon from "@imgs/gou.png";
  const titlesty = css`
  padding-left: 16px;
  border-left: 4px solid ${(props) => props.theme.primaryColor};
  font-size: ${(props) => (props.theme.laptop ? "14px" : "16px")};
`;
const Okt = styled.div`
  padding-left: 32px;
  font-size: 16px;
  color: #515151;
  .ok {
    display: flex;
    align-items: center;

    img {
      margin-right: 16px;
    }
  }
  .tip {
    flex:1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
    margin-left: -32px;
  }
  .pwd {
    display: flex;
    align-items: center;
    column-gap: 16px;
    .ipt {
      flex: 1;
      flex-direction: column;
    }
  }
  .suc{
    display: flex;
    flex-direction: column;
    row-gap: 32px;
    align-items: center;
  }
`;
const CDrawer = styled(Drawer)`
  && {
    .ant-drawer-content-wrapper {
     // min-width: 928px;
    //  width: calc(100% - 400px) !important;
      top: 0;
      height: 100%;
    }
    .ant-drawer-body {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      .mainbox{
        flex:1;
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        background-color: #fff;

        .stats {
          display: flex;
          column-gap: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #d7d7d7;
          .btn {
            color: #fff;
            width: 240px;
            height: 52px; 
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 51, 51, 1); 
            border: 1px solid rgba(215, 215, 215, 1);
            border-radius: 6px;  
            background-repeat: no-repeat;
            background-position: 16px center;
            &:nth-of-type(1){
               background-image: url(${imgsrc["water"]});
            }  
            &:nth-of-type(2){
               background-image: url(${imgsrc["smook"]});
            } 
            &:nth-of-type(3){
               background-image: url(${imgsrc["langy"]});
            } 
          }
        }
        .time{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 16px;
          position: sticky;
        }
       
        .charts {
          height: 248px;
          display: flex;
          justify-content: space-between;
          column-gap: 32px;
          .temperature {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            .btntitle {
              .title{
                line-height: 2;
              }
              .btn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 128px;
                height: 40px;
                background: inherit;
                background-color: rgba(0, 51, 51, 1);
                border: 1px solid rgba(215, 215, 215, 1);
                border-radius: 6px;
                color: #33FF00;
   
              }
            }
          }
          .chart{
            flex:1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .ant-drawer-header {
      .ant-drawer-header-title{
      .ant-drawer-title {
        ${titlesty}
      }
      .ant-drawer-close{
        flex: 1;
     
    order: 2;
    text-align: right;
    font-size: 22px;
    color: #333;
      } 
    }
    }
  }
`;
const Dot = styled.div`
  && {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid
      ${(props) =>
        props.state == 1
          ? props.theme.primaryColor
          : props.theme.successColor}; // 1 告警确认
    background-color: ${(props) =>
      props.state == 3
        ? "transparent"
        : props.state == 2
        ? props.theme.primaryColor
        : props.theme.successColor};
    background-image: url(${(props) => (props.state == 1 ? GouIcon : null)});
    background-position: center;
    background-size: 8px;
    background-repeat: no-repeat;
  }
`;
const DDrawer = styled(Drawer)`
  && {
    .ant-drawer-content-wrapper {
      //  min-width: 1036px;
      width: 100% !important;
      top: 0;
      height: 100%;
      transform: translateX(0px) !important;
      .ant-drawer-content {
        background-color: transparent;
      }
    }
    .ant-drawer-extra {
      flex: 2;
      display: flex;
    }
    .ant-drawer-body {
      // display: flex;
      //  column-gap: 8px;
      display: grid;
      grid-template-columns: 1fr 1036px;
      grid-template-rows: 1fr;
      column-gap: 8px;
      .left {
        height: 100%;
        position: relative;
        display:  flex; 
        .leftmain {
          display: flex;
          flex-direction: column;
          row-gap: 16px;
          .alarm {
            padding-left: 16px;
            display: flex;
            row-gap: 32px;
            flex-direction: column;
          }
        }
      }
      .mainbox {
        height: 100%;
        display: flex;
        flex-basis: 1036px;
        flex-direction: column;
        row-gap: 16px;
        background-color: #fff;
        padding: 0 16px;
        .ctitle {
          display: flex;
          justify-content: space-between;
          background-color: #f2f2f2;
          padding: 16px;
          margin: 0 -16px;
          .text {
            ${titlesty}
          }
          .close { 
            font-size: 22px;
            transition: all 0.3s;
            &:hover {
              color: #333;
            }
          }
        }
        .htitle {
          height: 32px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: rgb(215, 215, 215);
        }
        .remote {
          height: 40px;
          font-size: 16px;
          width: 144px;
          text-align: left;
          padding: 0 8px;
          img {
            margin-right: 8px;
          }
        }
      }
    }

    .ant-drawer-header {
      .ant-drawer-title {
        padding-left: 16px;
        border-left: 4px solid ${(props) => props.theme.primaryColor};
        font-size: ${(props) => (props.theme.laptop ? "14px" : "16px")};
      }
    }
  }
`;
const IDrawer =styled(DDrawer)`
&& {
  .ant-drawer-body{
  display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr; 
    column-gap: 8px;
}
}

`
const Mainbox = styled.div`
 // flex: 1;
  display: flex;
  background-image: url(${imgsrc["fullbg"]});
  background-repeat: no-repeat;
  width: 1635px;
  height: 1000px;
 // column-gap: 32px;
 // transform: scaleX(1.12);
 // transform-origin: 0px 0px;
  .part {
    position: relative;
    flex: 0 0 448px;
    height: 1000px; 
    padding: 31px 1px 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .nums {
      width: 71px;
      height: 77px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 2px;
      color: #0f0;
      white-space: nowrap;
      cursor: pointer;
      background-color: #000;
      .ant-typography {
        color: #0f0;
      }
      .type {
        display: inline-block;
        border-bottom: 1px dotted;
        align-self: stretch;
        text-align: center;
        margin: 0 4px;
        line-height: 1;
        padding-bottom: 4px;
      }
    }
    .textname {
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .loopbashou {
      cursor: pointer;
    }
    .h3d {
      // 默认  P1
      position: absolute;
      width: 254px;
      height: 300px;
      left: 96px;
      bottom: 124px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .detail {
        height: inherit;
        cursor: pointer;
        .state {
          display: flex;
          justify-content: center;
          img + img {
            padding-left: 8px;
          }
        }
      }
    }
    &:nth-of-type(1) {
   //   background-image: url(${imgsrc["P1"]});
    }
    &:nth-of-type(2) {
    //  background-image: url(${imgsrc["P2"]});
      .bashou {
        height: 257px;
        width: 448px;
        padding-top: 72px;
        display: flex;
        align-items: center;
        justify-content: center; 
        .imgbox {
         // cursor: pointer;
        }
      }
      .yylb { 
        height: 147px;
        width: 138px;
        padding-top: 50px;
        display: flex;
        .yylbimg {
           flex: 1;
        }
      }
      .guis {
        cursor: pointer;
        padding: 46px 69px 0;
        
        align-self: stretch;
        display: flex;
        flex:1;
        .guisimg{
          flex:1;
        }
      }
    }
    &:nth-of-type(3) {
      flex: 0 0 369px;
    // background-image: url(${imgsrc["P3"]});
     .kuixians{
        flex: 1;
        align-self: stretch;
        padding: 72px 16px 0 16px;
        .kuixian {
          height: 277px;
          display: flex;
          padding-top: 18px;
          column-gap: 30px;
          .values {
        color: #0f0; 
       height: 96px;
        width: 71px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer; 
        .nums {
           padding: 16px 0;
        }
        .state {
          display: flex;
          justify-content: center;
          img + img {
            padding-left: 8px;
          }
        }
      }
      .guizhi {
        width: 136px;
        padding-top: 38px; 
        cursor: pointer;
        height: 226px;
      }
        }
     }
   
      
    }
    &:nth-of-type(4) {
      flex: 0 0 368px; 
      .breaker{
        
        flex: 1;
        align-self: stretch;
        padding-top: 72px;
       //padding: 72px 8px 0 12px;
       .loops { 
        display: grid; 
      }
       .loops1 { 
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 92px 92px;
        .loop1 {
          padding-left: 8px;
          padding-right: 12px;
          padding-top: 18px;
          display: flex;
            align-items: flex-start;
            justify-content: space-between;
            cursor: pointer;
            .loopbashou {
              align-self: center;
              
            }
            .state4 {
              transform: translateY(-8px);
            }
            .nums {
              width: 67px;
              height: 70px;
              transform: translateY(-8px);
            }
        
        /*   .loopcontent {
            flex: 1;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            .loopbashou {
              align-self: center;
              
            }
            .state4 {
              transform: translateY(-8px);
            }
            .nums {
              transform: translateY(-8px);
            }
          } */
        }
      }
      }
  

   
      .loops2 {
       
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3,92px);
      //  height: 240px;
        padding-left: 8px;
        padding-right: 35px;
        .loop2 {
          display: flex;
          justify-content: flex-end;
          align-items: center; 
          column-gap: 64px;
          cursor: pointer;
          .state42 {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 94px;
            cursor: pointer;
          }
        }
      }
      .loops3 {
         
         padding-left: 8px;
         padding-right: 35px;
         height: 368px;
         grid-template-columns: 1fr;
         grid-template-rows: 1fr 1fr;
         .loop3 {
           display: flex;
           justify-content: flex-end;
           align-items: flex-end;
           padding-bottom: 20px;
           .loop3left {
            flex:1;
            align-self: stretch;
           }
           .state42 {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 94px;
            cursor: pointer;
            
          }
         }
      }
    }

    .title {
      height: 22px;
      background-color: ${(props) => props.theme.primaryColor};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1px 16px;
      width: 100%;
      cursor: pointer;
      .ant-typography {
        color: #fff;
        display: inline-flex;
        align-items: center;
        img {
          padding-right: 0.5em;
        }
      }
    }
  }
`;
const Extrea = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.ist ? "space-between" : "flex-end")};
  flex: 1;
  .close {
  //  color: #d6d6d6;
    font-size: 22px;
    transition: all 0.3s;
    &:hover {
      color: #333;
    }
  }
`;
export {
    Okt,
    Extrea,
    Mainbox, 
    DDrawer,
    Dot,
    CDrawer,
    IDrawer,
} // 导出变量列表