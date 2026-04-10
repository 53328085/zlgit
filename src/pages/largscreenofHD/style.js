import styled, { css, createGlobalStyle } from "styled-components";
import { Select } from "antd";
import { colors } from "./data";
import imgulr from "./icon";

const bgsty = css`
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;
const normal = css`
  display: flex;
  align-items: center;
`;
const title = css`
  color: #fff;
  font-family: headfont;
`;
export const Cselect = styled(Select)`
  && {
    .ant-select-selector {
      width: 420px;
      background: linear-gradient(
        170deg,
        rgba(11, 23, 51, 0.4) 0%,
        rgba(13, 28, 37, 0.5) 100%
      );
      border-radius: 4px;
      border: 1px solid;
      border-image: linear-gradient(
          270deg,
          rgba(30, 80, 230, 1),
          rgba(20, 220, 200, 1)
        )
        1 1;
      backdrop-filter: blur(8px);
      .ant-select-selection-item {
        color: #fff;
      }
    }
    .ant-select-arrow{
      color: rgba(41, 189, 250, 1);
    }
  }
`;
export const Pagelayout = styled.div`
  flex: 1;
  // width: 1920px;
  // height: 1080px;
  background-image: url(${imgulr["pgbg"]});
  background-size: 100% 100%;
  background-position: 0 0;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 0 16px 16px 16px;
  .hearder {
    height: 65px;
    display: flex;
    flex-direction: column;
    background-image: url(${imgulr["hdbg"]});
    ${bgsty}
    .h {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      line-height: 1;
      transform: translateY(10px);
      ${title}// height: 44px;;;;
    }
    .opt {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      .btns {
        display: flex;
        column-gap: 16px;
        .btn {
          height: 40px;
          width: 92px;
          background-image: url(${imgulr["btndf"]});
          color: #fff;
          padding-bottom: 9px;
          ${normal}
          justify-content: center;
          column-gap: 8px;
          &:hover {
            cursor: pointer;
          }
          .img {
            width: 16px;
            overflow: hidden;
            img {
              max-width: 100%;
            }
          }
        }

        .btn.act {
          background-image: url(${imgulr["btnatv"]});
        }
      }
      .date {
        ${normal}
        justify-content: space-between;
        column-gap: 16px;
        color: #fff;
        .time {
        }
        .full {
          ${normal}
          column-gap: 8px;
          &:hover {
            cursor: pointer;
          }
          .fullimg {
            width: 20px;
            img {
              max-width: 100%;
            }
          }
        }
      }
    }
  }
  .content {
    flex: 1;
    display: grid;
    grid-template-columns: 420px minmax(800px, 1fr) 420px;
    grid-template-rows: 1fr;
    gap: 16px;
    .left {
      display: grid;
      grid-template-rows: 375px 344px 232px;
      gap: 16px;
    }
    .center {
      display: flex;
      // flex-basis: 800px;
      flex-direction: column;
      row-gap: 16px;
      .centerup {
        flex: 1fr;
      }
      .centerdown {
        flex-basis: 232px;
      }
    }
    .right {
      display: grid;
      grid-template-rows: 185px 284px 185px 284px;
      row-gap: 16px;
    }
  }
`;

export const Layoutcom = styled.div`
  flex-basis: ${(props) => props.flex};
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    270deg,
    rgba(2, 40, 85, 0.4) 0%,
    rgba(13, 41, 50, 0.5) 100%
  );
  border-radius: 8px;
  color: #fff;
  backdrop-filter: blur(6px);
  .chartwrap {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: ${(props) => props.pd || "20px"};
    .mgr {
      margin-right: 2px;
    }
    .mgr8 {
      margin-right: 8px;
    }
  }
`;
export const Leftup = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 120px 165px;
  row-gap: 8px;

  .items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 120px;
    .item {
      ${normal};
      flex-direction: column;
      justify-content: space-between;
      .title {
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
      }
      .value {
        color: #fff;
        font-size: 20px;
        text-align: center;
        line-height: 1.2;
      }
      .icon {
        width: 70px;
        height: 70px;
        overflow: hidden;
        .img {
          max-width: 100%;
        }
      }
    }
  }
`;
export const Leftcenter = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 60px 176px;
  row-gap: 26px;
   .carbon {
    display: flex;
    height: 176px;
   }
  .item {
    display: flex;
    align-items: center;
    height: 60px;
    column-gap: 16px;
    .icon {
      width: 70px;
      height: 70px;
      overflow: hidden;
      .img {
        max-width: 100%;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .title {
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
      }
      .value {
        color: #fff;
        font-size: 20px;
        text-align: center;
        line-height: 1.2;
      }
    }
  }
`;
export const Leftdown = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-content: center;
  .part {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .title {
      color: rgba(255, 255, 255, 0.7);
    }
    .value {
      font-size: 28px;
      color: #fff;
    }
    .imgbox {
      width: 90px;
      overflow: hidden;
      .img {
        max-width: 100%;
      }
    }
  }
  .part:nth-child(2) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .sub {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      .imgbox {
        width: 42px;
        overflow: hidden;
        .img {
          max-width: 100%;
        }
      }
      .valuewrap {
        .title {
          color: rgba(255, 255, 255, 0.7);
        }
        .value {
          font-size: 22px;
          color: #fff;
        }
      }
    }
  }
`;
export const Centerup = styled.div`
  flex: 1;
`;
export const Centerdown = styled.div`
  height: 160px;
  display: grid;
  grid-template-columns: 1fr 1fr;
 
  column-gap: 32px;
  color: #ffffff;
  .chartbox {
    display: flex;
    height: 160px;
  }
  .centertitle {
    display: grid;
    grid-template-rows: 14px 18px;
    row-gap: 6px;
    .percentage {
      justify-self: flex-end;
      font-size: 12px;
      color: #ffffff;
    }
    .info {
      justify-content: space-between;
      display: flex;
      align-items: center;
      .centertotal {
        .month {
          color: ${colors[0]};
          padding-left: 4px;
        }
      }
      .percentline {
        width: 236px;
        height: 14px;
        background: linear-gradient(
          180deg,
          rgba(0, 197, 255, 0.3) 0%,
          rgba(0, 121, 237, 0.3) 100%
        );
        display: flex;
      }
    }
  }
  .contentwrap {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    .cols { 
      color: #ffffff;
      display: grid;
      grid-template-columns: 40px 100px 1fr;
      grid-template-rows: 32px;
      background: linear-gradient( 270deg, rgba(0, 122, 237, 0.32) 0%, rgba(31, 185, 189, 0.32) 100%);
       align-items: center;
       justify-items: center;
    }
  }
  .slider-container {
    width: 472px;

    .ant-carousel .slick-list .slick-slide > div > div.row {
      display: grid !important;
      grid-template-columns: 40px 100px 1fr;
      grid-template-rows: 32px;
      color: #ffffff;
      align-items: center;
      justify-items: center;
    
      .imgbox {
        width: 24px;
        overflow: hidden;
        .img {
          max-width: 100%;
        }
      }
      .circle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #1e50e6;
        color: #ffffff;
      }
    }

   .ant-carousel .slick-list .slick-slide:nth-of-type(odd) > div > div.row {
      background: linear-gradient( 270deg, rgba(0, 122, 237, 0.32) 0%, rgba(31, 185, 189, 0.32) 100%);
      
    }
  }
`;

export const Rightup = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  .item {
    ${normal};
    flex-direction: column;
    justify-content: space-between;
    .title {
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
    }
    .value {
      color: #fff;
      font-size: 20px;
      text-align: center;
      line-height: 1.2;
    }
    .icon {
      width: 70px;
      height: 70px;
      overflow: hidden;
      .img {
        max-width: 100%;
      }
    }
  }
`;

export const Right2nd = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 78px 137px;
  .tip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    justify-items: center;
    .item {
      ${normal};

      justify-content: space-between;
      .data {
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }
        .value {
          color: #fff;
          font-size: 20px;
          text-align: center;
          line-height: 1.2;
        }
      }
      .icon {
        width: 45px;
        //  height: 70px;
        overflow: hidden;
        .img {
          max-width: 100%;
        }
      }
    }
  }
  .airConditionerMap {
    display: flex;
    height: 137px;
  }
`;

export const Right3rd = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 120px;
  .streetlingtMap {
    display: flex;
    height: 120px;
  }
  .part {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .title {
      color: rgba(255, 255, 255, 0.7);
    }
    .value {
      font-size: 28px;
      color: #fff;
    }
    .imgbox {
      width: 90px;
      overflow: hidden;
      .img {
        max-width: 100%;
      }
    }
  }
`;

export const Rightupcenter = styled.div`
  flex: 1;
  display: flex;

  .slider-container {
    width: 488px;
    // height: calc(100% - 32px - 42px);

    .ant-carousel {
      .slick-slider {
        .slick-list {
          .slick-track {
            .slick-slide {
              > div {
                .chartbox {
                  height: 234px;
                }
              }
            }
          }
        }
      }
    }
  }

  .ant-carousel .slick-dots-bottom {
    bottom: -12px;
  }
`;

export const Rightdown = styled.div`
  && {
    flex: 1;
    display: grid;
    grid-template-rows: 75px 1fr;
    row-gap: 12px;
    color: #ffffff;
    align-items: center;
    justify-items: center;
    .levelchart {
      display: grid;
     grid-template-columns: 1fr 2fr;
     width: 100%;
     height: 75px;
     .barchart {
      display: flex;
      height: 90px;
     }
     .levels {
      display: flex;
        flex-direction: column;
        justify-content: center;
      .level{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .ant-badge-status-text{
          font-size: 14px;
          color:rgba(255, 255, 255, 0.70);
        }
        .value{
          font-size: 16px;
          color: #FFFFFF;
        }
      }
     }
    }
    .contentwrap {
      display: flex;
      flex-direction: column;
      row-gap: 8px;
      .cols {
        opacity: 0.5;
        color: #ffffff;
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        grid-template-rows: 32px;
      }
    }
    .slider-container {
      width: 380px;

      .ant-carousel .slick-list .slick-slide > div > div.row {
        display: grid !important;
        grid-template-columns: 1fr 1fr 2fr;
        grid-template-rows: 32px;
        color: #ffffff;
      }

      .ant-carousel .slick-list .slick-slide:even > div > div.row {
        background-color: rgba(13, 129, 180, 0.5);
      }
    }
  }
`;

export const Titlesty = styled.div`
  ${normal}
  flex:0 0 42px;
  justify-content: space-between;
  background-image: url(${imgulr["titbg"]});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left center;
  padding-right: 20px;
  .chartTitle {
    ${title}
    font-size: 17px;
    padding-left: 16px;
  }
  .subtitle {
    color: rgba(255, 255, 255, 1);
    font-size: 13px;
    opacity: 0.5;
  }
`;
export const Circle = styled.div`
  width: 12px;
  height: 12px;
  background: linear-gradient(179deg, #00c5ff 0%, #0079ed 100%);
  border-radius: 50%;
`;

export const Position = styled.div`
  position: absolute;
  left: ${(props) => props.left + "px"};
  top: ${(props) => props.top + "px"};
  transform: translateY(-132px);
  width: 232px;
  height: 162px;
  background-image:${(props) => (props.visiable ? `url(${imgulr["pzbg"]})`: "none")} ;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .contentmain{
    display: ${(props) => (props.visiable ? "flex" : "none")};
    flex-direction: column;
 // visibility: ${(props) => (props.visiable ? "visible" : "hidden")};
  .ptitle {
    color: #fff;
    font-size: 16px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pcontent {
    display: grid;
    grid-template-rows: repeat(3, 26px);
    row-gap: 8px;
    .pitem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      padding: 0 8px 0 56px;
      .plabel {
        color: #fff;
      }
      .pvalue {
        font-size: 16px;
        color: #fff;
      }
    }
  }

}
  .mark{
    position: absolute;
    left:0;
    bottom:0;
    width: 24px;
  }
`;

export const Btns = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  .btns {
    display: flex;
    column-gap: 16px;
    .btn {
      height: 40px;
      width: 92px;
      background-image: url(${imgulr["btndf"]});
      color: #fff;
      padding-bottom: 9px;
      ${normal}
      justify-content: center;
      column-gap: 8px;
      &:hover {
        cursor: pointer;
      }
      .img {
        width: 16px;
        overflow: hidden;
        img {
          max-width: 100%;
        }
      }
    }

    .btn.act {
      background-image: url(${imgulr["btnatv"]});
    }
  }
  .date {
    ${normal}
    justify-content: space-between;
    column-gap: 16px;
    color: #fff;
    .time {
    }
    .full {
      ${normal}
      column-gap: 8px;
      &:hover {
        cursor: pointer;
      }
      .fullimg {
        width: 20px;
        img {
          max-width: 100%;
        }
      }
    }
  }
`;
export const Dropsty=createGlobalStyle`
 .ant-select-dropdown,.ant-select-dropdown:fullscreen{
  background: linear-gradient( 170deg, rgba(11,23,51,0.4) 0%, rgba(13,28,37,0.5) 100%);
border-radius: 4px;
border: 1px solid;
border-image: linear-gradient(270deg, rgba(30, 80, 230, 1), rgba(20, 220, 200, 1)) 1 1;
backdrop-filter: blur(8px);
padding: 6px;
>div{
  width: 100%;
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled),.ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background: rgba(30,80,230,0.6);
    border-radius: 4px;
  }
  .ant-select-item-option {
    color: #fff;
    margin-bottom: 8px;
  }
}
 }
`
export const Defempty= styled.div`
  width: 380px;
  height: 128px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-image: url(${imgulr["noData"]});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  span {
    font-size: 12px;
    transform:translateY(50%);
  }
`