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
    background-color: #1C2C43;  // ${(props) => props.theme.imgbgcolor || "#ffffff"};
    display: flex;
    border-radius: 8px;
    overflow: hidden;
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
          .ant-card-head-wrapper .ant-card-head-title {
            padding-left: 0;
          }
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
export const TopologySty = styled.div`
position: relative;
//width: 618px;
display: flex;
flex-direction: column;
height: 680px;
color: #fff;
overflow: hidden;
 .digitalup {
    width: 162px;
 //   height: 96px;
    background: rgba(0,0,0,0.5);
    border-radius: 6px;
    border: 1px solid #46C7FF;
    display: flex;
    flex-direction: column;
    padding: 6px 12px;
    position: relative;
    align-self: flex-end;
    transform: translate(10px, -20px);
    justify-content: space-between;
    .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &::before {
            content: '';
            display: block; 
            width: 24px;
            height: 2px;
            border-bottom: 2px dashed #46C7FF;
            transform: translate(-36px, 110px); 
        }
  }
  
.up {
    flex-basis:308px;
  display: flex;
 // align-items: center; 
 // border-bottom: 2px dashed #FF6021;
// justify-content: center;
 // flex-direction: column;
   justify-content: flex-end;
   padding-right: 80px;
  .paint {
    flex-basis: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url(${imgurl["line"]});
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: auto 180px ;
    
    padding-bottom: 32px;
    justify-content: space-between;
    .outwrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 4px;
   }
   .outwrap.meter{
    row-gap: 12px;
   }
   .imgbox1 {
        width: 70px; 
    }
    .imgbox2 {
        width: 66px;
        
    }
    .imgbox1, .imgbox2 {
        overflow: hidden;
        .img1{
            max-width: 100%;
        }
    }
    .text {
        font-size: 15px; 
        line-height: 1;
    }
  }
 
}
.down {
  display: flex;
 flex-wrap: nowrap;
  overflow-x: auto;
  justify-content: space-around;
  flex:1;
  overflow-x: auto;
  border-top: 2px dashed #FF6021;
  column-gap: 16px;
  .meters {
    display: flex;
    flex:0 0 290px;
  //  width: 280px;
    justify-content: space-between;
   .meter{
     flex-basis: 90px;
     display: flex;
     flex-direction: column;
     align-content: center;
     justify-content: space-evenly;
     background-image: url(${imgurl["line2"]});
     background-size: 3px 284px;
     background-repeat: no-repeat;
     background-position: top center;
     .upm {
        display: flex;
        flex-direction: column;
        
        align-items: center;
        row-gap: 14px;
        .eimgbox {
          width: 66px;
          overflow: hidden;
          .eimg{
            max-width: 100%;
          }
        
    }
    .simgbox {
          width: 98px;
          overflow: hidden;
          .eimg{
            max-width: 100%;
          }
        
    }
    .bimgbox {
          width: 48px;
          overflow: hidden;
          .bimg{
            max-width: 100%;
          }
    }
     }
   }
   .digital {
    width: 162px;
 //   height: 96px;
    background: rgba(0,0,0,0.5);
    border-radius: 6px;
    border: 1px solid #46C7FF;
    display: flex;
    flex-direction: column;
    padding: 6px 12px;
    position: relative;
    align-self: flex-end;
    transform: translate(10px, -20px);
    justify-content: space-between;
     align-self: flex-start;
    transform: translate3d(-10px, 78px, 10px);
    .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &::before {
            content: '';
            display: block; 
            width: 24px;
            height: 2px;
            border-bottom: 2px dashed #46C7FF;
            transform: translate(-36px, 20px); ; 
        }
  }
/*   .digital.downleft{
    align-self: flex-start;
    transform: translate3d(-16px, 78px, 10px);
    &::before { 
        transform: translate(-36px, 122px); 
    }
  } */
 }
 .last.meters {
     
    .digital{
    align-self: flex-start; 
    transform: translate3d(16px, 78px, 10px);
    &::before { 
        transform: translate(150px, 42px); 
    }
  
  }
 }
}
`;