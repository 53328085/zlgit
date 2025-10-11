import styled, { css } from "styled-components";

const borderBox = ({ borderRadius = "4px", bgcolor = "#fff" }) => css`
  border: 1px solid #d7d7d7;
  border-radius: ${borderRadius};
  background: ${bgcolor};
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  .tree-box {
    height: 864px;
    flex-shrink: 0;
    max-width: 296px;
    display: flex;
    flex-direction: column;
    width: 296px;
  }
  .right-box {
    flex: 1;
    margin-left: 18px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* display: grid;
    grid-template-rows: 48px 233px 1fr; */
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
  overflow: hidden;
  border-radius: 4px;
  padding-left: 16px;
`;
export const Detail = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 229px) 1fr;
  grid-template-rows: 201px;
  grid-gap: 16px;
  margin: 16px 0;

  .card {
    ${borderBox}
    padding: 12px 14px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #515151;
    background-image: linear-gradient(to top, #DEE5FB 0%, #fff 30%);
    .small {
      font-size: 13px;
      display: flex;
      align-items: center;
    }
    .rise {
      color: #f00;
    }
    .down {
      color: #06cc45;
    }
  }
  .chart {
    ${borderBox}
    display: flex;
    flex-direction: column;
    padding: 12px 14px;
    width: 100%;
    overflow: hidden;
    min-width: 0;
    .head {
      height: 28px;
      width: 100%;
    }
    .chart-box {
      flex: 1;
      overflow: hidden;
      height: 100%;
      max-width: 100%;
    }
  }
`;
export const FooterChart = styled.div`
  ${borderBox};
  padding: 16px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 583px;
  max-height: 583px;

  .ant-radio-button-wrapper {
    margin-left: auto;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
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
  .chartdom {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
`;
