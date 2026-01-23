import styled, { css } from "styled-components";
import {Timeline} from "antd";
import imgurl from "./imgs";
export const Mainbox = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: 666px 1fr;
  column-gap: 16px;
  align-content: stretch;
  .left {
    background-color: ${(props) => props.theme.imgbgcolor || "#ffffff"};
    display: flex;
    .topology {
      position: relative;

      .zhanwei {
        width: 750px;
        height: 696px;
      }
      .storageMeter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        position: absolute;
        left: 202px;
        top: 338px;
        padding: 6px 12px;
        width: 164px;
        height: 80px;
        border: 1px solid #41a4b9;
        background-color: #003;
      }
      .transformer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        position: absolute;
        right: 130px;
        top: 163px;
        padding: 4px 12px;
        width: 164px;
        height: 80px;
        border: 1px solid #41a4b9;
        background-color: #003;
      }
      .batterys {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        position: absolute;
        right: 214px;
        top: 338px;
        padding: 4px 12px;
        width: 164px;
        height: 80px;
        border: 1px solid #41a4b9;
        background-color: #003;
      }
      .meterData {
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          text-align: right;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          color: #fff;
        }
        span:first-child {
          width: 38px;
          text-align: left;
        }
        span:nth-child(2) {
          width: 67px;
          font-size: 14px;
        }
        span:last-child {
          width: 32px;
          color: #c9c9c9;
        }
      }
      .transPlaceholder {
        position: absolute;
        width: 136px;
        height: 136px;
        left: 76px;
        top: 364px;
        cursor: pointer;
      }
      .batteryPlaceholder {
        position: absolute;
        width: 136px;
        height: 136px;
        left: 76px;
        top: 549px;
        cursor: pointer;
      }
    }
  }
  .right {
    display: grid;
    grid-template-rows: 228px 1fr;
    row-gap: 16px;
    .rightup {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 16px;
      //   height: 200px;
    }
    .rightdown {
      display: flex;
      flex-direction: column; 
      .chartbox {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .power {
          flex: 1;
          display: grid;
          grid-template-rows: repeat(2, 1fr);
          gap: 16px;
          color:#303133;
          .down {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
      }
    }
  }
`;
export const Station = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  flex: 1;
  .imgbox {
    width: 150px;
    height: inherit;
    background-size: cover;
    overflow: hidden;
    .img {
      max-width: 100%;
    }
  }
  .right {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 92px 1fr;
    gap: 12px;
    .part {
      background: rgba(229, 236, 245, 0.5);
      background-image: url(${imgurl["part"]});
      background-repeat: no-repeat;
      background-position: center 6px;
      background-size: 32px 32px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 6px;
      .value {
        font-weight: 600;
        font-size: 16px;
        color: #1d3374;
      }
      .label {
        font-size: 13px;
        color: #606266;
      }
    }
    .info {
      grid-column: 1/3;
      grid-row: 2/3;
      display: flex;
      flex-direction: column; 
      justify-content: space-between;
      
        .text {
          font-weight: 500;
          font-size: 14px;
          color: #303133;
          display:flex;
          gap: 4px;
          .label {
            display: flex;
            color: #606266;
            justify-content:space-between;
            width: 4em;
          } 
          .value{
            font-weight: 500; 
            color: #303133
          }
      } 
    }
  }
`;
 
 
export const CTimeline = styled(Timeline)`
&&{
    flex: 1;
    .ant-carousel .slick-slider .slick-list {
        height: 100% !important; 
    }
     .ant-timeline-item{
        padding-bottom: 10px;
        left:2px;
         .ant-badge-status-dot{
            width: 12px;
            height: 12px;
        }
     }
    .content {
        height: 66px;
        background: rgba(229,236,245,0.3);
        border-radius: 4px;
        padding: 10px 10px 10px 22px;
        font-size: 13px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title{
            display: flex;
            gap: 8px ;
            align-items: center;
            .time{
                color: #606266;
            }
            .name{
                color:#303133;
                font-weight: 600;
                margin-bottom: 0px;
                width: 262px;
            }
        }
        .des{
            color: #606266;
        }
  }
}
 
`
 