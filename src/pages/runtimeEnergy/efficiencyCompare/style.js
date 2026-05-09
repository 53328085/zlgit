import styled from "styled-components";

const summaryToneMap = {
  blue: {
    iconBg: "linear-gradient(180deg, #38A9FF 0%, #1E63F0 100%)",
    accent: "#1E50E6",
  },
  green: {
    iconBg: "linear-gradient(180deg, #4FD9A6 0%, #2DB57E 100%)",
    accent: "#21A36B",
  },
  orange: {
    iconBg: "linear-gradient(180deg, #FFBE6C 0%, #FF8A3D 100%)",
    accent: "#F06B2D",
  },
};

const statusToneMap = {
  excellent: {
    bg: "rgba(255, 236, 184, 0.46)",
    text: "#E0A100",
  },
  qualified: {
    bg: "rgba(74, 203, 120, 0.12)",
    text: "#2EA55F",
  },
  good: {
    bg: "rgba(76, 137, 255, 0.12)",
    text: "#2D6BEB",
  },
  pending: {
    bg: "rgba(255, 137, 84, 0.14)",
    text: "#E86C3A",
  },
  danger: {
    bg: "rgba(255, 137, 84, 0.14)",
    text: "#E86C3A",
  },
};

const rankItemBackgroundMap = {
  1: "linear-gradient(270deg, rgba(158, 217, 246, 0) 0%, rgba(158, 217, 246, 0.6) 100%)",
  2: "linear-gradient(270deg, rgba(246, 204, 158, 0) 0%, rgba(246, 204, 158, 0.6) 100%)",
  3: "linear-gradient(270deg, rgba(158, 190, 246, 0) 0%, rgba(158, 190, 246, 0.6) 100%)",
  4: "linear-gradient(270deg, rgba(158, 190, 246, 0) 0%, rgba(158, 190, 246, 0.3) 100%)",
  default: "linear-gradient(270deg, rgba(158, 190, 246, 0) 0%, rgba(158, 190, 246, 0.3) 100%)",
};

export const Contentbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1fr;
  column-gap: 16px;
  flex: 1;
  min-height: 0;
  background: transparent;

  .rightwrap {
    display: grid;
    grid-template-rows: auto auto auto;
    row-gap: 8px;
    min-width: 0;
    min-height: 0;
  }

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

  .cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .centerwrap {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.95fr);
    align-items: start;
    gap: 8px;
    min-height: 0;
  }

  @media (max-width: 1560px) {
    .cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .centerwrap {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 1320px) {
    grid-template-columns: 1fr;

    .leftwrap {
      min-height: 280px;
    }

    .cards {
      grid-template-columns: 1fr;
    }
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

  .efficiencyCompare {
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
`;

export const SummaryCard = styled.div`
  ${({ tone = "blue" }) => {
    const item = summaryToneMap[tone] || summaryToneMap.blue;
    return `
      --card-icon-bg: ${item.iconBg};
      --card-accent: ${item.accent};
    `;
  }}
  min-height: 78px;
  padding: 10px 14px;
  display: grid;
  grid-template-columns: 48px 1fr;
  column-gap: 12px;
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
    font-size: 20px;
    border-radius: 50%;
    background: var(--card-icon-bg);
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
    display: flex;
    align-items: baseline;
    column-gap: 6px;
    margin-top: 2px;
  }

  .num {
    color: var(--card-accent);
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  .unit {
    color: #909399;
    font-size: 12px;
  }

  .compare {
    display: flex;
    align-items: center;
    column-gap: 4px;
    color: #909399;
    font-size: 11px;
    line-height: 16px;
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
  padding: 0 8px 8px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  overflow: hidden;

  .panelTitle {
    min-height: 42px;
    padding: 0 12px;
    margin: 0 -8px 8px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #dee7f2;
    color: #303133;
    font-size: 12px;
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

  .panelTitle span {
    display: flex;
    align-items: center;
  }
`;

export const ChartPanel = styled(Panel)`
  .chart {
    flex: 1;
    min-height: 270px;
    display: flex;
  }

  .ichartmap {
    min-height: 270px;
  }
`;

export const RankBoard = styled(Panel)`
  padding-bottom: 12px;
  background: #f6f9ff;

  .panelTitle {
    margin-bottom: 10px;
  }
`;

export const RankList = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: auto;
  padding-right: 2px;
`;

export const RankListItem = styled.div`
  --rank-bg: ${({ rank }) => rankItemBackgroundMap[rank] || rankItemBackgroundMap.default};
  min-width: 0;
  min-height: 53px;
  padding: 6px 12px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 12px;
  background: var(--rank-bg);
  border: 1px solid rgba(206, 220, 244, 0.96);
  border-radius: 8px;

  .rankIndex {
    width: 36px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #eff4ff;
    color: #5a6b91;
    font-size: 15px;
    font-weight: 600;
  }

  .rankIcon {
    width: 36px;
    height: 38px;
    object-fit: contain;
  }

  .rankMain {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .rankMain strong {
    color: #2f3b52;
    font-size: 12px;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rankMain span {
    color: #5f6b85;
    font-size: 10px;
    line-height: 14px;
  }

  .rankMeta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .rankValue {
    color: #2f3b52;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
  }

  .rankPercent {
    color: #90a0bc;
    font-size: 10px;
    line-height: 14px;
  }
`;

export const StatusTag = styled.span`
  ${({ tone = "good" }) => {
    const item = statusToneMap[tone] || statusToneMap.good;
    return `
      --status-bg: ${item.bg};
      --status-text: ${item.text};
    `;
  }}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--status-bg);
  color: var(--status-text);
  font-size: 10px;
  font-weight: 600;
  line-height: 20px;
`;

export const StatusCell = styled.div`
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

export const DeviationText = styled.span`
  color: ${({ positive }) => (positive ? "#E86C3A" : "#2EA55F")};
  font-weight: 600;
`;
