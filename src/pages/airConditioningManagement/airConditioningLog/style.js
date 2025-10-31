import styled, { css } from "styled-components";
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;
export const Container = styled.div`
 flex:1;
   display: flex;
   flex-direction: column;
   row-gap: 16px;
    
    .ant-space-item {
    &:nth-of-type(1){
    margin-right: 0px !important;
    }
        
    }
`;
const flexBox = ({ jc = "center", fd = "row" }) => css`
  display: flex;
  flex-direction: ${fd};
  // justify-content: ${jc};
  justify-content: space-between;
  align-items: center;
`;
const borderBox = ({
  borderRadius = "4px",
  bgcolor = "#fff",
  borderSize = "1px",
}) => css`
  border: ${borderSize} solid #d7d7d7;
  border-radius: ${borderRadius};
  background: ${bgcolor};
`;
export const Header = styled.div`
  height: 58px;
  width: 100%;
  padding: 0 20px;
  ${flexBox({ jc: "flex-start" })}
  .ant-radio-button-wrapper {
    border: none;
    height: 100%;
    box-shadow: none;
    background: #f0f0f0;
    height: 32px;
    line-height: 32px;
    min-width: 72px;
    text-align: center;
    font-size: 14px;
    &:first-child {
      border-radius: 4px 0 0 4px !important;
    }

    &:last-child {
      border-radius: 0 4px 4px 0 !important;
    }
    .ant-radio-button-checked::before {
      background: #fff;
    }
     
  } 
    .ant-radio-button-wrapper:not(:first-child):before {
     width:0;
     height:0;
    }
  ${borderBox({ borderSize: 0 })}
`;
export const Card = styled.div`
  border: 1px solid #d7d7d7;
  padding: 14px;
  background-color: #fff;
  margin-top: 10px;
  margin-bottom: 12px;
  flex:1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .leakage {
    display: flex;
    .leakage-item1 {
      width: 247px;
      height: 157px;
    }
    .leakage-item {
      margin: 0 34px 0 44px;
      flex: 1;
      .leakage-content {
        .leakage-title {
          display: flex;
          align-items: center;
          .leakage-title-icon {
            width: 11px;
            height: 11px;
            border-radius: 50%;
            margin-right: 2px;
          }
          .leakage-title-red {
            background-color: #f66f59;
          }
          .leakage-title-blue {
            background: #135abd;
          }
        }
        .leakage-text {
          margin-top: 18px;
          padding: 16px 0 16px 16px;
          display: grid;
          grid-template-columns: 120px 1fr;
          grid-gap: 20px 64px;
        }
      }
    }
  }
  .context {
    display: flex;
    flex-direction: column;
    overflow: hidden; 
    position: relative;
    flex:1;
    .chart {
      height: 100%;
    }
    .table {
      margin-top: 16px;
      flex: 1;
    }
  }
`;

