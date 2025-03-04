import {Drawer} from "antd";
import styled, {css} from "styled-components";
import imgsrc from "./imgs";
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
  .pwd {
    display: flex;
    align-items: center;
    column-gap: 16px;
    .ipt {
      flex: 1;
      flex-direction: column;
    }
  }
`;
const CDrawer = styled(Drawer)`
  && {
    .ant-drawer-content-wrapper {
      min-width: 928px;
      width: calc(100% - 400px) !important;
      top: 0;
      height: 100%;
    }
    .ant-drawer-body {
      display: flex;
      flex-direction: column;
    }
    .ant-drawer-header {
      .ant-drawer-title {
        ${titlesty}
      }
      .ant-drawer-extra {
        flex: 2;
        display: flex;
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
      width: ${(props) => props.wh || "100%"} !important;
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
      grid-template-columns: ${(props) => (props.inner ? "1fr" : "1fr 1036px")};
      grid-template-rows: 1fr;
      column-gap: 8px;
      .left {
        height: 100%;
        position: relative;
        display: flex;

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
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  column-gap: 32px;
  transform: scaleX(1.12);
  transform-origin: 0px 0px;
  .part {
    position: relative;
    flex: 0 0 360px;
    height: 866px;
    background-repeat: no-repeat; 
    
    padding: 26px 1px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .nums {
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 2px;
      color: #0f0;
      white-space: nowrap;
      cursor: pointer;
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
      width: 142px;
      height: 220px;
      left: 109px;
      bottom: 218px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .detail {
        height: 160px;
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
      background-image: url(${imgsrc["P1"]});
    }
    &:nth-of-type(2) {
      background-image: url(${imgsrc["P2"]});
      .bashou {
        transform: translateY(110px);
        cursor: pointer;
      }
      .h3d {
        bottom: 443px;
        height: 156px;
        .detail {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
      }
      .guis {
        cursor: pointer;
        width: 266px;
        height: 374px;
        bottom: 55px;
        position: absolute;
      }
    }
    &:nth-of-type(3) {
      flex: 0 0 320px;
      background-image: url(${imgsrc["P3"]});
      .values {
        color: #0f0;
        position: absolute;
        left: 13px;

        height: 80px;
        width: 62px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;

        .state {
          display: flex;
          justify-content: center;
          img + img {
            padding-left: 8px;
          }
        }
      }
      .values.first {
        top: 118px;
      }
      .values.second {
        top: 358px;
      }
      .values.thirdly {
        top: 600px;
      }
      .guizhi {
        width: 120px;
        height: 213px;
        position: absolute;
        left: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        .gtitle {
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .guiti {
          height: 160px;
        }
      }
      .guizhi.first {
        top: 105px;
      }
      .guizhi.second {
        top: 345px;
      }
      .guizhi.thirdly {
        top: 586px;
      }
    }
    &:nth-of-type(4) {
      flex: 0 0 320px;
      background-image: url(${imgsrc["P4"]});
      .loops {
        position: absolute;
        width: 100%;
        height: 160px;
        display: grid;
        .textname {
            width: 50px;
          }
      }

      .loops1 {
        top: 106px;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 80px;
        .loop1 {
          padding-left: 8px;
          padding-right: 12px;
          display: flex;
          flex-direction: column;
        
          .loopcontent {
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
          }
        }
      }
      .loops2 {
        top: 266px;
        grid-template-columns: 1fr;
        grid-auto-rows: 80px;
        height: 240px;
        padding-left: 8px;
        padding-right: 35px;
        .loop2 {
          display: flex;
          justify-content: space-between;
          align-items: center; 
          .textname {
            align-self: flex-start;
            
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
      .loops3 {
         top:506px;
         padding-left: 8px;
         padding-right: 35px;
         height: 320px;
         grid-template-columns: 1fr;
         grid-template-rows: 1fr 1fr;
         .loop3 {
           display: flex;
           justify-content: space-between;
           padding-bottom: 20px;
          .nums{
            align-self: flex-end;
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
    color: #d6d6d6;
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
    
} // 导出变量列表