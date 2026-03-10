import styled, { css } from "styled-components";
const borderBox = ({ borderRadius = "4px", bgcolor = "#fff" }) => css`
  border: 1px solid #d7d7d7;
  border-radius: ${borderRadius};
  background: ${bgcolor};
`;

export const getBackgroundColor = (theme) => {
  const color = theme?.bg || theme.cardHeadBg;
  if (color && color !== "#ffffff") {
    return color;
  }
  return "rgba(229, 236, 245, 0.5)";
};
export const Container = styled.div`
  display: grid;
  // grid-template-rows: minmax(320px, 1fr) minmax(335px, 1fr);
  grid-template-rows: 305px 435px;
  gap: 16px;
`;
export const TopBox = styled.div`
  flex: 1;
  display: grid;
  color: #515151;
  grid-template-columns: 440px minmax(340px, 1fr) 570px 290px;
  gap: 16px;
  justify-content: flex-end;
  .infoBox1 {
    display: flex;
    column-gap: 16px;
    color: #606266;
    .powerStation {
      width: 160px;
      height: 150px;
      overflow: hidden;
      .img {
         max-width: 100%;
      }
    }
    .content {
      display: grid;
      align-items: center;
      font-size: 13px;
      flex:1;
      grid-template-rows: repeat(5, 1fr);
      .info {
        display: flex;
        align-items: baseline;
        span:nth-of-type(1) {
          width: 6px;
          height: 6px;
          background: #1e50e6;
          display: inline-block;
          border-radius: 50%;
          margin-right: 10px;
        }
        span:nth-of-type(2) {
          display: inline-block;
          width: 70px;
          color: #606266;
        }
        span:nth-of-type(3) {
          display: inline-block;
          width: 150px;
        }
        .value{
          color:#303133;
          font-weight: 500;
          margin-bottom: 0px;
        }
      }
    }
  }
  .powerNum {
    flex:1;
    margin-top: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .numBox {
      display: flex;
      align-items: center;
      color: #606266;
      .powerIcon {
        width: 36px;
        height: 36px;
      }
      .num {
        margin-left: 10px;
        font-weight: 400;
        font-size: 13px;
        div:nth-of-type(1) {
          font-size: 18px;
          color: #1e50e6;
          font-weight: 600;
        }
      }
    }

    background-color: ${(props) => getBackgroundColor(props.theme)};
  }
  .infoBox2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex:1;
    column-gap: 16px;
    .info {
      display: grid;
      gap: 16px;
      color: #606266;
      height: 100%;
      gird-template-rows: repeat(3, 1fr);
      flex:1;
      .box {
        display: flex;
        align-items: center;
        border-radius: 4px;
      //  height: 62px;
     //   width: 250px;
        padding-left: 16px;
        background-color: ${(props) => getBackgroundColor(props.theme)};
        .powerIcon {
          width: 36px;
          height: 36px;
        }
      }
      .num {
        margin-left: 20px;
        font-weight: 400;
        font-size: 13px;
        div:nth-of-type(1) {
          font-size: 18px;
          color: #1e50e6;
          font-weight: 600;
        }
      }
    }
  }
`;

export const FotterBox = styled.div`
  flex: 1;
  display: grid;
  color: #515151;
  grid-template-columns: ${(props) =>
    props.laptop ? "1fr 1fr" : "660px  1fr"};
  gap: 16px;
  justify-content: flex-end;
  .infoBox3 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 216px;
    //  align-items: center;
    // justify-content: space-around;
    gap: 16px;
    flex: 1;
    .box {
      border-radius: 8px;
      //  width: 281px;
      display: flex;
      flex-direction: column;
      height: 216px;
      overflow: auto;
      row-gap: 16px;
      justify-content: space-between;
      background-color: ${(props) => getBackgroundColor(props.theme)};
      cursor: pointer;
      .title {
        border-radius: 8px 8px 0px 0px;
        // width: 281px;
        height: 36px;
        line-height: 36px;
        padding-left: 16px;
        color: #ffffff;
      }
      .online {
        background: #1ec373;
      }
      .offline {
        background: #717d96;
      }
      .con {
        padding: 16px;
        font-weight: 400;
        font-size: 13px;
        color: #303133;
        flex: 1;
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        justify-content: space-between;
        .top {
          display: flex;
          align-items: center;
          .info {
            margin-left: 16px;
            display: grid;
            gap: 5px;
            flex: 1;
            .name {
              font-weight: 400;
              font-size: 13px;
              color: #606266;
            }
            .status {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin: 0px 5px;
              display: inline-block;
            }

            .online {
              background: #1ec373;
            }
            .offline {
              background: #717d96;
            }
          }
        }
        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .name {
            color: #606266;
          }
          .num {
            font-weight: 500;
            font-size: 14px;
            color: #1e50e6;
          }
        }
      }
    }
  }
`;

export const Header = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  .historicalData {
    color: #1e50e6;
  }
`;
