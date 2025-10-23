import styled from "styled-components";
import coolBackground from "./icon/coolBackground.svg";
import heatBackground from "./icon/heatBackground.svg";
import dryBackground from "./icon/dryBackground.svg";
import fanBackground from "./icon/fanBackground.svg";
export const Container = styled.div`
  display: flex;
  .tree-box {
    height: 864px;
    flex-shrink: 0;
    max-width: 210px;
    display: flex;
    flex-direction: column;
  }
  .right-box {
    flex: 1;
    margin-left: 18px;
    display: grid;
    grid-template-rows: 48px 1fr;
    row-gap: 16px;
    .lightData {
      margin-top: 16px;
      width: 100%;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  background-color: #fff;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dedede;
  padding-right: 18px;
  overflow: hidden;
  border-radius: 4px;
  
`;
export const CardBox = styled.div`
  border: 1px solid #d7d7d7;
  padding: 14px;
  background-color: #fff;
  .watchNum{
   display: flex;
   justify-content: space-between;
   margin: 16px 0px;
  }
   .airContainer{
    height: 670px; /* 占满父容器Cspin的高度 */
    overflow-y: scroll; /* 垂直溢出时显示滚动条 */
    scrollbar-width: thin; 
   }
   .airBox{    
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, 185px);
    grid-auto-rows: 215px;
    justify-content: space-between;
    gap: 16px;
    padding-right: 10px;
        .airIcon{
          width: 25px;
          height: 25px;
          margin-top: 5px;
        }
       .cardCommon{
        width: 185px;
        padding: 8px;
        overflow: hidden;
        cursor: pointer;
        height: 215px;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        border: 1px solid #ececec;
        .top{
        display: flex;
        align-items: baseline;
        .topInfo{
        .name{
        margin-right: 5px;
        font-size: 16px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100px;
        overflow: hidden;
        cursor:pointer;
        }
        .value{
        font-size: 12px;
        }
        }
        }
        .content{
        font-size: 36px;
        margin: 10px 0px;
        text-align: center;
        .temperature{
        margin-right: 5px;
        }
        }
        .air-Offline,.air-Alarm{
      font-size: 28px;
      text-align: center;
      color: #909399;
      font-weight: 500;
        }
        }
        
    .airInfo .fields:nth-child(3){
      margin-top: 20px;
      }
     
        .fields{
       display: flex;
       justify-content: space-between;
       align-items: center;
       .open{
       color: #05C06E;
       font-weight: 600;
       }
       .close{
       font-weight: 600;
       }
        }
       }
        .airOffline{
       background: #e8e9e9;
       background: #ECF3FD;
       .name{
            width: 120px !important;
        }
        }
         .airAlarm{
            background: #ec5050;
            background: linear-gradient(131deg, #f14d4d -13%, rgb(250 248 248) 80%, rgb(232 78 78) 100%);
        }
      .airCardCold{
        background: linear-gradient(180deg, rgb(113 146 241) 0%, rgb(77 158 236) 0%, rgb(219 227 241) 100%);
        background: url(${coolBackground})  no-repeat;
        background-position: bottom;
       }
   .airCardHot{
          background: linear-gradient(180deg, rgb(228 231 239) 0%, rgb(235 146 66) 0%, rgb(230 206 79) 81%, rgb(249 238 166) 100%);
           background: url(${heatBackground})  no-repeat;
        background-position: bottom;
   }
   .airCardWindy{ 
         background: linear-gradient(180deg, #72e4a2 0%, rgb(152 240 169) 81%, rgb(190 255 220) 95%);
          background: url(${fanBackground})  no-repeat;
        background-position: bottom;
   }
   .airCardDehumidification{
       background: linear-gradient(180deg, rgb(115 137 148) 0%, rgb(222 221 221) 100%);
        background: url(${dryBackground})  no-repeat;
        background-position: bottom;
   }
    .closeAir{
     background: #c2c2c2;
     background: #ECF3FD;
   }
    
`;
