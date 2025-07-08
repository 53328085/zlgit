import styled from "styled-components";
import { Radio } from "antd";
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
    grid-template-rows: 48px 233px 1fr;
    .card2 {
      margin-top: 16px;
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
  .ant-radio-button-wrapper {
    border: none;
    height: 100%;
    box-shadow: none;
    border-radius: 0;
    background: #f0f0f0;
  }
`;
export const Card = styled.div`
  border: 1px solid #d7d7d7;
  padding: 14px;
  background-color: #fff;
  margin-top: 10px;
  margin-bottom: 12px;
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
    height: 502px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    .chart {
      height: 100%;
      width: 100%;
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
    /* border-radius: 20px; */
    /* margin-right: 8px; */

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

export const AlarmWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 16px;
  margin-top: 16px;
  min-height: 808px;

  .tableWrapper {
    margin-top: 16px;
    flex: 1;
    display: flex;
    .warn {
      display: flex;
      justify-content: center;
      .warnState {
        width: 103px;
        height: 20px;
        font-size: 11px;
        color: #fff;
        text-align: center;
        line-height: 20px;
        border-radius: 4px;
        background-color: ${(props) =>
          props.warnState === "1"
            ? "#f10303"
            : props.warnState === "2"
            ? "#f16d03"
            : props.warnState === "3"
            ? "#f1c603"
            : "#039df1"};
      }
    }
  }
`;
