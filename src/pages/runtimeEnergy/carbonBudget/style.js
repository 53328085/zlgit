import styled from "styled-components";

const toneMap = {
  blue: {
    iconBg: "linear-gradient(180deg, #47A7FF 0%, #2E67F2 100%)",
    accent: "#1F58EA",
  },
  green: {
    iconBg: "linear-gradient(180deg, #53D8A7 0%, #1FA871 100%)",
    accent: "#1B9B67",
  },
  orange: {
    iconBg: "linear-gradient(180deg, #FFC06E 0%, #FF8A3D 100%)",
    accent: "#F06A2A",
  },
  cyan: {
    iconBg: "linear-gradient(180deg, #62D4FF 0%, #3388FF 100%)",
    accent: "#2775F2",
  },
};

const statusMap = {
  已完成: {
    bg: "rgba(67, 198, 111, 0.12)",
    color: "#20A45E",
  },
  进行中: {
    bg: "rgba(76, 137, 255, 0.12)",
    color: "#2D6BEB",
  },
  计划中: {
    bg: "rgba(144, 147, 153, 0.12)",
    color: "#606266",
  },
  优秀: {
    bg: "rgba(67, 198, 111, 0.12)",
    color: "#20A45E",
  },
  良好: {
    bg: "rgba(76, 137, 255, 0.12)",
    color: "#2D6BEB",
  },
  超预算: {
    bg: "rgba(255, 111, 60, 0.12)",
    color: "#E7612E",
  },
};

const statusTextMap = {
  excellent: {
    bg: "rgba(255, 236, 184, 0.46)",
    text: "#E0A100",
  },
  good: {
    bg: "rgba(76, 137, 255, 0.12)",
    text: "#2D6BEB",
  },
  danger: {
    bg: "rgba(255, 137, 84, 0.14)",
    text: "#E86C3A",
  },
};

export const Contentbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1fr;
  column-gap: 8px;
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
    row-gap: 8px;
    min-width: 0;
    min-height: 0;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .chartRow {
    display: grid;
    grid-template-columns: minmax(390px, 0.62fr) minmax(640px, 1fr);
    align-items: stretch;
    gap: 12px;
    min-width: 0;
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
    min-height: 42px;
    margin-bottom: 12px;
    padding: 0 12px;
    align-items: center;
    background: #dee7f2;
  }

  .tablewrap .ant-pro-table-list-toolbar-left .ant-pro-table-list-toolbar-title {
    min-height: 42px;
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

  .carbonBudgetTable {
    flex: 1;
    min-width: 0;
    min-height: 0;
    padding: 0 16px;

    .ant-pro-table-list-toolbar {
      margin: 0 -16px;
    }

    .toolbarYearPicker {
      display: flex;
      align-items: center;
    }

    .toolbarYearPicker .ant-picker {
      width: 108px;
      height: 30px;
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

    .ant-table-tbody > tr > td {
      text-align: center;
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

  @media (max-width: 1500px) {
    .cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .chartRow {
      grid-template-columns: 1fr;
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
  ${({ tone = "blue" }) => {
    const item = toneMap[tone] || toneMap.blue;
    return `
      --card-icon-bg: ${item.iconBg};
      --card-accent: ${item.accent};
    `;
  }}
  min-height: 78px;
  padding: 10px 14px;
  display: grid;
  grid-template-columns: 54px 1fr;
  column-gap: 12px;
  align-items: center;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;

  .icon {
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon img {
    width: 54px;
    height: 54px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .title {
    color: #606266;
    font-size: 12px;
    line-height: 18px;
  }

  .title span {
    margin-left: 4px;
    color: #909399;
    font-size: 12px;
  }

  .value {
    margin-top: 2px;
    color: var(--card-accent);
    font-size: 20px;
    font-weight: 600;
    line-height: 26px;
  }

  .compare {
    display: flex;
    align-items: center;
    gap: 6px;
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
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;

  .panelTitle {
    min-height: 48px;
    margin: 0 -16px 16px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    background: #dee7f2;
    color: #303133;
    font-size: 15px;
    font-weight: 600;
  }

  .panelTitle::before {
    content: "";
    width: 3px;
    height: 18px;
    margin-right: 8px;
    border-radius: 2px;
    background: #1e50e6;
  }

  .panelTitle em {
    margin-left: 6px;
    color: #9aa3b2;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
  }

  .chart {
    flex: 1;
    min-height: 320px;
    display: flex;
  }
`;

export const BudgetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .budgetItem {
    padding: 10px 16px 8px;
    border: none;
    border-radius: 4px;
    background: #f5f7fc;
  }

  .budgetHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 24px;
    margin-bottom: 4px;
  }

  .budgetName {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #303133;
    font-size: 14px;
    line-height: 22px;
  }

  .budgetName strong {
    color: #343a45;
    font-size: 18px;
    font-weight: 600;
  }

  .budgetValueRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    color: #646b78;
    font-size: 13px;
    font-weight: 600;
  }

  .ant-progress-line {
    margin-bottom: 0;
  }

  .ant-progress-bg {
    height: 8px !important;
    border-radius: 8px !important;
  }

  .ant-progress-outer {
    padding-inline-end: 0 !important;
  }
`;

export const VarianceText = styled.span`
  color: ${({ positive }) => (positive ? "#E7612E" : "#20A45E")};
  min-width: 58px;
  text-align: right;
  font-weight: 600;
`;

export const StatusTag = styled.span`
  ${({ status, tone }) => {
    const item = tone ? statusTextMap[tone] || statusTextMap.good : statusMap[status] || statusMap.良好;
    return `
      color: ${item.color || item.text};
      background: ${item.bg};
    `;
  }}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 20px;
  padding: 0 8px;
  border-radius: ${({ tone }) => (tone ? "999px" : "4px")};
  font-size: ${({ tone }) => (tone ? "10px" : "13px")};
  font-weight: 600;
  line-height: 20px;
`;

export const StatusCell = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    flex-shrink: 0;
  }
`;
