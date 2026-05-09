import styled from "styled-components";

export const Contentbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1fr;
  column-gap: 16px;
  flex: 1;
  min-height: 0;
  background: transparent;

  .leftwrap {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    overflow: hidden;
  }

  .leftTitle {
    height: 34px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    background: #dee7f2;
    color: #303133;
    font-size: 14px;
    font-weight: 600;
  }

  .leftTitle::before {
    content: "";
    width: 3px;
    height: 14px;
    margin-right: 8px;
    border-radius: 2px;
    background: #1e50e6;
  }

  .rightwrap {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    row-gap: 16px;
    min-width: 0;
    min-height: 0;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 16px;
  }

  .charts {
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(480px, 1.55fr);
    gap: 16px;
    min-height: 274px;
  }

  .tablewrap {
    display: flex;
    min-width: 0;
    min-height: 640px;
    padding: 0 0 20px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ebeef5;
  }

  .tablewrap .ant-pro-table-list-toolbar-container {
    min-height: 34px;
    margin-bottom: 12px;
    padding: 0 12px;
    align-items: center;
    background: #dee7f2;
  }

  .tablewrap .ant-pro-table-list-toolbar-left .ant-pro-table-list-toolbar-title {
    height: 34px;
    display: flex;
    align-items: center;
    padding-left: 0 !important;
    border-left: none !important;
  }

  .tablewrap .ant-pro-table-list-toolbar-left .ant-pro-table-list-toolbar-title::before {
    content: "";
    width: 3px;
    height: 14px;
    margin-right: 8px;
    border-radius: 2px;
    background: #1e50e6;
  }

  .consumeAnalysis {
    flex: 1;
    min-width: 0;
    min-height: 0;
    padding: 0 16px;

    .ant-pro-table-list-toolbar {
      margin: 0 -16px;
    }

    .ant-pro-card {
      height: 100%;
    }

    .ant-pro-card-body {
      min-height: 540px;
      padding-bottom: 8px;
    }

    .ant-table-thead > tr > th {
      background: #dee7f2;
      color: #303133;
      font-weight: 600;
      text-align: center !important;
    }

    .ant-table-thead > tr > th::before {
      display: none;
    }

    .ant-table-body {
      max-height: none !important;
      height: auto !important;
      overflow-y: visible !important;
    }

    .ant-pagination {
      margin: 14px 0 0;
    }
  }

  @media (max-width: 1320px) {
    grid-template-columns: 1fr;

    .leftwrap {
      min-height: 280px;
    }
  }
`;

export const SummaryCard = styled.div`
  height: 86px;
  padding: 14px 18px;
  display: grid;
  grid-template-columns: 48px 1fr;
  column-gap: 14px;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;

  .icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 22px;
    border-radius: 50%;
    background: linear-gradient(180deg, #38a9ff 0%, #1e63f0 100%);
  }

  .title {
    color: #606266;
    font-size: 13px;
    line-height: 20px;
  }

  .value {
    display: flex;
    align-items: baseline;
    column-gap: 6px;
    margin-top: 2px;
  }

  .num {
    color: #1e50e6;
    font-size: 22px;
    font-weight: 600;
    line-height: 28px;
  }

  .unit {
    color: #909399;
    font-size: 12px;
  }

  .compare {
    display: flex;
    align-items: center;
    column-gap: 6px;
    color: #909399;
    font-size: 12px;
    line-height: 18px;
  }

  .up {
    color: #ff6021;
  }

  .down {
    color: #43c66f;
  }
`;

export const Panel = styled.div`
  min-width: 0;
  min-height: 0;
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  overflow: hidden;

  .panelTitle {
    height: 34px;
    padding: 0 12px;
    margin: 0 -16px 12px;
    display: flex;
    align-items: center;
    background: #dee7f2;
    color: #303133;
    font-size: 14px;
    font-weight: 600;
  }

  .panelTitle::before {
    content: "";
    width: 3px;
    height: 14px;
    margin-right: 8px;
    border-radius: 2px;
    background: #1e50e6;
  }

  .chart {
    flex: 1;
    min-height: 220px;
    display: flex;
  }
`;
