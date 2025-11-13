import styled, { css } from "styled-components";
import bgimg from "./imgs/bgimg.png";
import lights from "./imgs/lights.png";
import imgurl from "./imgs";
export const custsty = css`
  margin: -16px;
  background-image: url(${bgimg});
  background-repeat: no-repeat;
  background-size: cover;
`;
export const Mainwrap = styled.div`
  display: grid;
  // grid-template-rows: 73px minmax(721px, 1fr);
  grid-template-columns: 478px 1fr;
  gap: 16px;
  flex: 1;
  .left {
    background-image: linear-gradient(
        90deg,
        rgba(19, 85, 253, 0.15),
        rgba(3, 160, 255, 0.15)
      ),
      url(${imgurl.circle});
    background-position: 0% 0%, left top;
    background-repeat: no-repeat, no-repeat;
    background-size: 100% 100%, 100% 42px;
    .titlehd {
      font-family: headfont;
      color: #fff;
      font-size: 17px;
      padding-left: 32px;
    }
    .titleUp {
      height: 42px;

      display: flex;
      align-items: center;
      font-size: 17px;
      justify-content: space-between;
      .overew {
        padding-left: 32px;
      }

      .manger {
        display: flex;
        align-items: center;
        column-gap: 4px;
        padding-right: 10px;
        .label {
          color: #9ed8dc;
          font-size: 11px;
        }
        .value {
          color: #0aeeff;
          font-size: 14px;
        }
      }
    }
    .content {
      padding: 28px 24px 24px 24px;
      display: grid;
      grid-template-rows: 56px  repeat(3, minmax(216px,1fr));
      row-gap: 16px;
      .infobox {
        display: flex;
        flex-direction: column;
      }
      .info {
        display: flex;
        .item {
          flex: 1;
          display: flex;
          align-items: center;
          column-gap: 16px;
          .imgbox {
            width: 55px;
            height: 56px;
            overflow: hidden;
            img {
              max-width: 100%;
            }
          }
          .data {
            display: flex;
            align-items: center;
            flex-direction: column;
            .label {
              color: #9ed8dc;
              font-size: 11px;
            }
            .value {
              color: #0aeeff;
              font-size: 18px;
            }
          }
        }
      }
      .chart{
        display: flex;
        flex-direction: column;
      .chartTitle {
        background-image: linear-gradient(
            to left,
            rgba(0, 69, 88, 0.14) 0%,
            rgba(24, 114, 139, 0.19) 33%,
            rgba(81, 164, 244, 0.25) 66%,
            rgba(23, 134, 255, 0.2) 100%
          ),
          url(${imgurl?.["arrow"]});
        background-position: 0% 0%, left;
        background-repeat: no-repeat, no-repeat;
        height: 28px;
        padding-left: 16px;
        background-size: 50% 100%, auto;
        /* font-size: 16px;
                font-weight: bold;
                font-style: italic;
                color:#fff; */
      }
      .chartWrap {
       // height: 100%;
        display: flex;
        flex:1;
      }
    }
    }
  }
  .right {
    display: grid;
    grid-template-rows: 74px 1fr;
    row-gap: 16px;
    .up {
      display: grid;
      grid-template-columns: ${(props) =>
        props.theme.laptop ? "repeat(4,1fr)" : " repeat(4,minmax(203px, 1fr))"};
      grid-template-rows: 1fr;
      column-gap: 16px;
      .shownum {
        background-image: linear-gradient(
          90deg,
          rgba(19, 85, 253, 0.15),
          rgba(3, 160, 255, 0.15)
        );
        border-radius: 8px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        column-gap: 14px;
        .imgwrap {
          width: 42px;
          height: 42px;
          overflow: hidden;
          img {
            max-width: 100%;
          }
        }

        .data {
          display: flex;
          flex-direction: column;
          .title {
            color: #fff;
          }
          .num {
            color: #0aeeff;
            font-size: 24px;
          }
        }
      }
    }
    .middler {
      border-radius: 8px;
      overflow: auto;
      position: relative;
      .img {
        position: absolute;
      }
    }
  }

 
`;

export const TitP = styled.div`
  && {
    min-width: 190px;
    min-height: 115px;
    color: #2afaff;
    border-radius: 4px;
    left: ${(props) => props.left + "px"};
    top: ${(props) => props.top + 32 + "px"};
    position: absolute;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    padding: 6px 12px 12px 12px;
    font-size: 12px;
    border: 1px solid rgba(139, 197, 241, 1);
    background-image: linear-gradient(
      90deg,
      rgba(37, 64, 125, 0.7),
      rgba(8, 44, 65, 0.7)
    );
    .title {
      padding-left: 18px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #2afaff;
      justify-content: space-between;
      background-image: url(${imgurl["tiny"]});
      background-position: left;
      background-repeat: no-repeat;
    }
    .contentbox {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .key {
          color: #fff;
        }
        .value {
          font-weight: bold;
        }
      }
    }
  }
`;
