import styled from "styled-components";

const toneMap = {
  blue: {
    bg: "linear-gradient(180deg, rgba(46, 107, 230, 0.16) 0%, rgba(46, 107, 230, 0.04) 100%)",
    color: "#2e6be6",
  },
  green: {
    bg: "linear-gradient(180deg, rgba(55, 191, 167, 0.18) 0%, rgba(55, 191, 167, 0.05) 100%)",
    color: "#20a98f",
  },
  orange: {
    bg: "linear-gradient(180deg, rgba(243, 123, 74, 0.18) 0%, rgba(243, 123, 74, 0.05) 100%)",
    color: "#e96a35",
  },
  cyan: {
    bg: "linear-gradient(180deg, rgba(20, 164, 223, 0.18) 0%, rgba(20, 164, 223, 0.05) 100%)",
    color: "#168ec4",
  },
};

const rankItemBackgroundMap = {
  1: "linear-gradient(270deg, rgba(158,217,246,0) 0%, rgba(158,217,246,0.6) 100%)",
  2: "linear-gradient(270deg, rgba(246,204,158,0) 0%, rgba(246,204,158,0.6) 100%)",
  3: "linear-gradient(270deg, rgba(158,190,246,0) 0%, rgba(158,190,246,0.6) 100%)",
  default: "linear-gradient(270deg, rgba(158,190,246,0) 0%, rgba(158,190,246,0.3) 100%)",
};

export const DirectionLayout = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;

  &.standaloneToolbar {
    min-height: 42px;
    padding: 6px 14px;
    background: #f6f9ff;
    border: 1px solid #ebeef5;
    border-radius: 6px;
  }

  .toolbarLabel {
    color: #606266;
    font-size: 13px;
  }

  .toolbarFilters {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }
`;

export const ViewSwitch = styled.div`
  padding: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(30, 80, 230, 0.08);
  border: 1px solid rgba(30, 80, 230, 0.12);
  border-radius: 999px;

  button {
    min-width: 110px;
    height: 32px;
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: #5e6d89;
    font-size: 13px;
    background: transparent;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  button.isActive {
    color: #fff;
    background: linear-gradient(135deg, #2b63ef 0%, #4c8dff 100%);
    box-shadow: 0 6px 14px rgba(43, 99, 239, 0.22);
  }
`;

export const FloatingViewSwitch = styled.div`
  position: relative;
  top: -52px;
  z-index: 3;
  margin-right: 12px;
  margin-bottom: -42px;
  margin-left: auto;
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 10px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
`;

export const MetricCard = styled.div`
  --tone-color: ${({ tone }) => toneMap[tone]?.color || toneMap.blue.color};
  min-width: 0;
  height: 84px;
  padding: 12px 14px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  column-gap: 10px;
  align-items: center;
  background: #f8fbff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;

  .metricIcon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .metricIcon img {
    width: 28px;
    height: 28px;
    display: block;
    object-fit: contain;
  }

  .metricContent {
    min-width: 0;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }

  .metricContent span {
    color: #606266;
    font-size: 12px;
    line-height: 16px;
  }

  .metricContent strong {
    min-width: 0;
    color: var(--tone-color);
    font-size: 24px;
    font-weight: 600;
    line-height: 28px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .metricContent em {
    margin-left: 4px;
    color: #7d8ba3;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }
`;

export const ChartCard = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 410px;
  background: #eef4ff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
`;

export const ChartHeader = styled.div`
  min-height: 42px;
  padding: 6px 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  background: #d8e2f2;

  h3 {
    margin: 0;
    color: #303133;
    font-size: 14px;
    font-weight: 600;
  }

  h3::before {
    content: "";
    width: 3px;
    height: 14px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: -2px;
    background: #1e50e6;
    border-radius: 2px;
  }
`;

export const FlowShell = styled.div`
  min-height: 0;
  padding: 10px 12px 12px;
  display: flex;
  flex: 1;
  background: #eef4ff;

  .ichartmap {
    min-height: 100%;
    height: 100%;
    width: 100%;
    flex: 1;
    min-width: 0;
  }
`;

export const EmptyChartState = styled.div`
  flex: 1;
  min-height: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  .emptyInner {
    width: 248px;
    min-height: 132px;
    padding: 16px 18px;
    display: grid;
    place-items: center;
    row-gap: 8px;
    text-align: center;
    color: #9aa6ba;
    background: linear-gradient(180deg, rgba(240, 244, 250, 0.72) 0%, rgba(247, 249, 252, 0.92) 100%);
    border: 1px dashed #d4dceb;
    border-radius: 10px;
  }

  strong {
    color: #5b6780;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }

  .emptyText {
    color: #8a97ab;
    font-size: 12px;
    line-height: 18px;
  }
`;

export const RankLayout = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
`;

export const RankChartShell = styled(FlowShell)`
  padding: 14px;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.9fr);
  gap: 16px;
  align-items: stretch;
  background: #fff;

  @media (max-width: 1320px) {
    grid-template-columns: 1fr;
  }

  .ichartmap {
    min-height: 340px;
  }
`;

export const RankChartPanel = styled.div`
  min-width: 0;
  min-height: 340px;
  padding: 12px 14px;
  background: #fff;
  border: none;
  border-radius: 10px;
`;

export const RankBoard = styled.div`
  min-width: 0;
  min-height: 340px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  background: #F2F7FF;
  border: none;
  border-radius: 10px;
  overflow: hidden;
`;

export const RankBoardHeader = styled.div`
  min-height: 42px;
  padding: 10px 14px 6px;
  display: flex;
  align-items: center;

  h4 {
    margin: 0;
    color: #2f3b52;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
`;

export const RankList = styled.div`
  flex: 1;
  min-height: 0;
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
  background: #F2F7FF;
`;

export const RankListItem = styled.div`
  --rank-item-bg: ${({ rank }) => rankItemBackgroundMap[rank] || rankItemBackgroundMap.default};
  min-width: 0;
  min-height: 68px;
  padding: 12px 14px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 12px;
  background: var(--rank-item-bg);
  border: 1px solid rgba(206, 220, 244, 0.96);
  border-radius: 10px;

  .rankIcon {
    width: 36px;
    height: 38px;
    object-fit: contain;
  }
  .rankMain {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .rankMain strong {
    color: #2f3b52;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rankMain span {
    color: #5f6b85;
    font-size: 12px;
    line-height: 18px;
  }

  .rankMeta {
    min-width: 84px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .rankValue {
    color: #2f3b52;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }

  .rankPercent {
    color: #6f7f97;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
`;
