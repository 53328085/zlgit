import styled from "styled-components";

const colorText = "#eef3fa";
const colorBorder = "#46c7ff";
const colorCardBg = "rgba(0, 0, 0, 0.5)";
const colorBlock = "#2a3140";
const colorValue = "#19c37d";
const colorWarn = "#ffb629";

export const DiagramViewport = styled.div`
  position: relative;
  width: 100%;
  min-height: 880px;
  overflow: hidden;
`;

export const DiagramScroller = styled.div`
  position: relative;
  width: 100%;
  min-height: 880px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DiagramCanvas = styled.div`
  position: relative;
  min-height: 880px;
  min-width: 100%;
`;

export const ScrollActionButton = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.$side === "left" ? "left: 8px;" : "right: 8px;")}
  transform: translateY(-50%);
  z-index: 8;
  width: 30px;
  height: 56px;
  border-radius: 6px;
  border: 1px solid rgba(70, 199, 255, 0.5);
  background: rgba(10, 22, 40, 0.88);
  color: #d8efff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: #fff;
    border-color: rgba(70, 199, 255, 0.85);
    box-shadow: 0 0 10px rgba(70, 199, 255, 0.36);
  }

  &:disabled {
    color: rgba(216, 239, 255, 0.35);
    border-color: rgba(70, 199, 255, 0.24);
    cursor: not-allowed;
  }
`;

export const StationBadge = styled.div`
  position: absolute;
  top: 8px;
  transform: translateX(-50%);
  min-width: 108px;
  border-radius: 8px;
  background: linear-gradient(180deg, #2f5ce6 0%, #1f43bb 100%);
  color: ${colorText};
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  padding: 10px 18px;
  white-space: nowrap;
`;

export const StationStem = styled.div`
  position: absolute;
  width: 2px;
  background: ${colorBorder};
  box-shadow: 0 0 8px rgba(70, 199, 255, 0.42);
  transform: translateX(-50%);
`;

export const MainBusLine = styled.div`
  position: absolute;
  height: 2px;
  background: ${colorBorder};
  box-shadow: 0 0 8px rgba(70, 199, 255, 0.42);
`;

export const BusNodeDot = styled.span`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: ${colorBorder};
  box-shadow: 0 0 8px rgba(70, 199, 255, 0.5);
`;

export const NodeStem = styled.div`
  position: absolute;
  width: 2px;
  background: ${colorBorder};
  box-shadow: 0 0 8px rgba(70, 199, 255, 0.42);
  transform: translateX(-50%);
`;

export const CardNode = styled.div`
  position: absolute;
  width: 372px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0;
`;

export const NodeBadge = styled.div`
  min-width: 160px;
  border-radius: 8px;
  background: linear-gradient(180deg, #2f5ce6 0%, #1f43bb 100%);
  color: ${colorText};
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  padding: 10px 14px;
  margin-bottom: 10px;
`;

export const CabinetFigure = styled.div`
  width: 110px;
  height: 132px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin-bottom: 10px;
`;

export const CabinetImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const CabinetBase = styled.div`
  width: 84px;
  height: 16px;
  border: 1px solid ${colorBorder};
  border-bottom: none;
  border-radius: 2px;
  background: rgba(7, 19, 34, 0.85);
`;

export const DetailCard = styled.div`
  width: 372px;
  min-height: 438px;
  background: ${colorCardBg};
  border-radius: 8px;
  border: 1px solid ${colorBorder};
  box-shadow: 0 0 10px rgba(70, 199, 255, 0.2);
  color: ${colorText};
  padding: 14px;
  display: flex;
  flex-direction: column;
  row-gap: 14px;
  margin-top: 0;
`;

export const CardTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 1;
  text-align: center;
`;

export const ModuleBlock = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0;
`;

export const ModuleTitle = styled.div`
  height: 30px;
  background: rgba(30, 80, 230, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  border-radius: 2px 2px 0 0;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$cols || 2}, 1fr);
  grid-template-rows: repeat(2, 38px);
  background: ${colorBlock};
  border-radius: 0 0 2px 2px;
  overflow: hidden;
`;

export const MetricItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$small ? "14px" : "16px")};
  color: ${(props) => (props.$highlight ? colorValue : "#dce5f7")};
`;

export const MetricLabel = styled(MetricItem)`
  color: rgba(220, 229, 247, 0.72);
`;

export const FireList = styled.div`
  background: ${colorBlock};
  border-radius: 0 0 2px 2px;
  min-height: 104px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

export const FireListItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: 8px;
  font-size: 14px;
`;

export const FireDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${colorWarn};
  box-shadow: 0 0 6px rgba(255, 182, 41, 0.6);
`;

export const FireText = styled.span`
  color: rgba(238, 243, 250, 0.9);
`;

export const FireTime = styled.span`
  color: rgba(238, 243, 250, 0.52);
`;

export const FireStatus = styled.div`
  min-height: 104px;
  background: ${colorBlock};
  border-radius: 0 0 2px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 8px;
  color: rgba(238, 243, 250, 0.9);

  .icon {
    font-size: 30px;
    color: ${(props) => {
      if (props.$warning === true) return "#ff4d4f";
      if (props.$warning === false) return "#52c41a";
      return "#8aa0c4";
    }};
  }
`;

export const EmptyData = styled.div`
  min-height: 880px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 10px;
  color: #8aa0c4;
  font-size: 14px;
`;

export const RetryButton = styled.button`
  border: 1px solid rgba(70, 199, 255, 0.5);
  background: rgba(10, 22, 40, 0.88);
  color: #d8efff;
  border-radius: 4px;
  min-width: 72px;
  height: 30px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(70, 199, 255, 0.85);
    box-shadow: 0 0 10px rgba(70, 199, 255, 0.36);
  }
`;
