import styled, { css } from "styled-components";
import { Timeline } from "antd";
import imgurl from "./imgs";
export const Mainbox = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: 1006px 1fr;
  column-gap: 16px;
  align-content: stretch;
  .left {
    background-color: #1c2c43; // ${(props) => props.theme.imgbgcolor || "#1C2C43" };
    display: flex;
    border-radius: 8px;
   
  }
  .right {
    display: grid;
    grid-template-rows: 228px 1fr;
    row-gap: 16px;
    .rightup {
      display: grid;
      grid-template-columns: 1fr;
      //  column-gap: 16px;
      //   height: 200px;
    }
    .rightdown {
      display: flex;
      flex-direction: column;
      .power {
        flex: 1;
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        gap: 16px;
        color: #303133;
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
      // grid-column: 1/3;
      // grid-row: 2/3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .text {
        font-weight: 500;
        font-size: 14px;
        color: #303133;
        display: flex;
        gap: 8px;
        .label {
          display: flex;
          color: #606266;
          justify-content: space-between;
          width: 84px;
        }
        .value {
          font-weight: 500;
          color: #303133;
        }
      }
    }
  }
`;

export const CTimeline = styled(Timeline)`
  && {
    flex: 1;
    .ant-carousel .slick-slider .slick-list {
      height: 100% !important;
    }
    .ant-timeline-item {
      padding-bottom: 10px;
      left: 2px;
      .ant-badge-status-dot {
        width: 12px;
        height: 12px;
      }
    }
    .content {
      height: 66px;
      background: rgba(229, 236, 245, 0.3);
      border-radius: 4px;
      padding: 10px 10px 10px 22px;
      font-size: 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        display: flex;
        gap: 8px;
        align-items: center;
        .time {
          color: #606266;
        }
        .name {
          color: #303133;
          font-weight: 600;
          margin-bottom: 0px;
          width: 262px;
        }
      }
      .des {
        color: #606266;
      }
    }
  }
`;
export const TopologySty = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  .up {
    display: flex;
    align-items: center;
    padding-bottom: 32px;
    border-bottom: 2px solid #46c7ff;
    justify-content: center;
    transform: translateY(1px);
   
    .outwrap {
      flex-basis: 300px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      .line1 {
        width: 164px;
        transform: translate(10px, 10px);
        margin-left: -30px;
        Z-index: 1;
      }
      .box {
        display: flex;
        flex-direction: column;
        .imgbox,
        .imgbox2 {
          width: 118px;
          overflow: hidden;
          .img {
            width: 100%;
          }
        }
        .imgbox { 
          position: relative;
        
        }
        .imgbox2 {
          width: 114px;
        }
      }
      .box.offset {
        transform: translate(-20px, -12px);
      }
     
    }
    .line2 {
      position: absolute;
    left: 0;
    bottom: 0;
    width: 9px;
    transform: translate(351px, -2px);
          }
  }
  .down {
    display: flex;
   // flex-wrap: nowrap;
   // overflow-x: auto;
    align-items: center;
    flex:1;
    overflow: hidden;
    .stack {
      display: flex;
      flex-basis: 224px;
      flex-direction: column;
      .stackup{
        display: flex;
        justify-content: center;
      }
    }
    .ant-carousel {
      .slick-dots-bottom{
        margin-bottom: -12px;
      }
       .slick-prev{
        background-color: ${prop=>prop.type=='dark' ? '#1b1d23' : '#fff'};
      }
    }
  }
`;
export const Stacksty = styled.div`
  display: flex;
  flex-direction: column; 
  flex:1;
  justify-content: flex-start;
  align-items: center;
  &:hover{
    cursor: pointer;
  }
  .line{
    flex-basis: 160px;
    width: 150px;

  }
  .detail {
    width: 224px;
    flex-basis: 294px;
    background: rgba(0,0,0,0.5);
    border-radius: 6px;
    border: 1px solid #46C7FF;
    display: flex;
    flex-direction: column;
    padding: 12px;
    color: #fff;
    row-gap: 12px;
    .title {
      font-weight: 600;
      font-size: 15px;
      color: #EEF3FA;
      display: flex;
      justify-content: center;
      margin-bottom: 0px;
    }
    .state{
      display: grid;
      grid-template-rows: repeat(2,24px);
      
   
      .label.item{
        background: rgba(30,80,230,0.8);
        border-radius: 2px 2px 0px 0px;
      
      }
      .value.item{ 
        background: rgba(255,255,255,0.1);
        
border-radius: 2px
      }
      .label.item,.value.item{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .progress{
      display:grid;
      grid-template-rows: repeat(2,24px);
      row-gap: 4px;

      .soc {
        background-image:linear-gradient(90deg,#05C06E 0%,#05C06E ${props=> props.soc}, #3D434D ${props=> props.soc}, #3D434D 100% ) ;
      }
      .soh {
        background-image:linear-gradient(90deg,#4B48F7 0%,#4B48F7 ${props=> props.soh}%, #3D434D ${props=> props.soh}%, #3D434D 100% ) ;
      }
      .soc,.soh{
        display: flex;
        justify-content: center;
      }
    }
    .voltage {
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-template-rows: repeat(2,24px);
       border-radius: 2px;
       overflow: hhidden;
       color: #fff;
       background: #3D434D;
       .labelv {
         background: #1E50E6;
        
       }
       .valuev,.labelv {
        justify-content: center;
        display: flex;
        align-items: center;
       }
    }
  }
`;
export const Custbtn = styled.div`
position: absolute;
right: 0;
top: 0;
transform: translate(48px, 18px);
  display: flex;
  justify-content: center;
  align-items: center;
  
 width: 64px;
height: 28px;
//background: ${props=>props.status="停机" ? props.theme.errorColor:  props.theme.successColor};
color: #fff;
border-radius: 6px;
border: 1px solid ${props=>props.status=="停机" ? props.theme.offlineColor:  props.theme.successColor};
.circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props=>props.status=="停机" ? props.theme.offlineColor:  props.theme.successColor};
  margin-right: 4px;
}
`