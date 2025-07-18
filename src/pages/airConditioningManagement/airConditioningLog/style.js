import styled from "styled-components";
import { Radio } from "antd";
export const Container = styled.div`
  display: grid;
  row-gap: 16px;
    .content{
    width: 100%;
    height: 750px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dedede;
    padding:16px;
    .control{
    display: flex;
    justify-content: space-between;
    }
    
    }
`;

export const Header = styled.div`
  background-color: #fff;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dedede;
  padding-right: 18px;
  overflow: hidden;
  border-radius: 4px;
  row-gap: 16px;
  .ant-radio-button-wrapper {
    border: none;
    height: 100%;
    box-shadow: none;
    border-radius: 0;
    background: #f0f0f0;
    height: 48px;
    line-height: 48px;
    width: 144px;
    text-align:center;
    font-size:14px;
    &:nth-of-type(1) {
    }
    .ant-radio-button-checked::before{
       background:#fff;
    }
  }
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
export const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    margin-left: auto;
    height: 32px;
    line-height: 32px;
    font-size:14px;
    border-radius: 2px;

    &:first-child {
      border-radius: 0;
    }

    &:last-child {
      border-radius: 0;
    }

    &::before {
      display: none;
    }
  }
`;


