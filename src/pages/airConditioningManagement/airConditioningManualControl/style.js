import styled from "styled-components";
import coolBackground from "./icon/coolBackground.svg";
import heatBackground from "./icon/heatBackground.svg";
import dryBackground from "./icon/dryBackground.svg";
import fanBackground from "./icon/fanBackground.svg";
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;
export const Container = styled.div`
  display: flex;
  .tree-box {
    height: 864px;
    width: 288px;
    flex-shrink: 0;
    max-width: 288px;
    display: flex;
    flex-direction: column;
  }
  .right-box {
    flex: 1;
    margin-left: 16px;
    display: grid;
    grid-template-rows: 48px 1fr;
    row-gap: 16px;
    .lightData {
      margin-top: 16px;
      width: 100%;
    }
  }
    .aircontent {
       flex:1;
       display: flex;
       flex-direction: column;
}
     .watchNum{
      display: flex;
      justify-content: space-between;
      margin: 0px 0px 16px 0px;
  }
   .airContainer{
    height: 670px; /* 占满父容器Cspin的高度 */
    overflow-y: scroll; /* 垂直溢出时显示滚动条 */
    scrollbar-width: thin; 
   }
   .airBox{    
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(212px, 1fr));
    gap: 16px;
        .airIcon{
          width: 25px;
          height: 25px;
          margin-top: 5px;
        }
       .cardCommon{
        padding: 8px;
        overflow: hidden;
        cursor: pointer;
        border-radius: 16px;
        // display: flex;
        // justify-content: center;
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
        margin: 10px 0px;
        text-align: center;
        .temperature{
        margin-right: 5px;
        font-size: 36px;
        }
        .Offline{
      font-size: 28px;
      text-align: center;
      color: #909399;
      font-weight: 500;
        }
      .lastSampleTime{
      font-size: 14px;
      }
        }
        .OfflineBox{
        color: #909399;
        font-size: 16px;
        font-weight: 600;
       margin-top: 20px;
        .offlineBoxItem{
        display: flex;
        align-items: center;
        justify-content: space-between;
}
        }
        .air-Offline,.air-Alarm{
      font-size: 28px;
      text-align: center;
      color: #909399;
      font-weight: 500;
        }
        }
         .airInfo{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 290px));
        padding-right: 16px;
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
        }
         .airAlarm{
            background: #ec5050;
            background: linear-gradient(131deg, #f14d4d -13%, rgb(250 248 248) 80%, rgb(232 78 78) 100%);
            background: linear-gradient(180deg, #ecf3fd 30%, rgb(236 243 253) 25%, rgb(244 198 198) 80%, rgb(255 146 146) 100%);
            }
      .airCardCold{
        // background: linear-gradient(180deg, rgb(113 146 241) 0%, rgb(77 158 236) 0%, rgb(219 227 241) 100%);
        background: url(${coolBackground})  no-repeat;
        background-position: bottom;
        background-size: cover;
       }
   .airCardHot{
          // background: linear-gradient(180deg, rgb(228 231 239) 0%, rgb(235 146 66) 0%, rgb(230 206 79) 81%, rgb(249 238 166) 100%);
           background: url(${heatBackground})  no-repeat;
           background-position: bottom;
           background-size: cover;
   }
   .airCardWindy{ 
          // background: linear-gradient(180deg, #72e4a2 0%, rgb(152 240 169) 81%, rgb(190 255 220) 95%);
          background: url(${fanBackground})  no-repeat;
          background-position: bottom;
          background-size: cover;
   }
   .airCardDehumidification{
      //  background: linear-gradient(180deg, rgb(115 137 148) 0%, rgb(222 221 221) 100%);
        background: url(${dryBackground})  no-repeat;
        background-position: bottom;
        background-size: cover;
   }
    .closeAir{
     background: #c2c2c2;
     background: #ECF3FD;
   }
`;

export const Header = styled.div`
  display: flex;
  background-color: #fff;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  padding-right: 18px;
  overflow: hidden;
  border-radius: 8px;
  
`;
