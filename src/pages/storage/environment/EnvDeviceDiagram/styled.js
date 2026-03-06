import styled from "styled-components";

const colorText = "#eef3fa";
const colorBorder = "#46c7ff";
const colorCardBg = "rgba(0, 0, 0, 0.5)";
const colorBlock = "#2a3140";
const colorValue = "#19c37d";
const colorWarn = "#ffb629";

export const DiagramViewport = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;
`;

export const DiagramScroller = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DiagramCanvas = styled.div`
  position: relative;
  min-height: 100%;
  flex: 0 0 auto;
`;

export const StationBadge = styled.div`
  position: absolute;
  top: 8px;
  transform: translateX(-50%);
  min-width: 108px;
  border-radius: 8px;
  background: linear-gradient(180deg, #2f5ce6 0%, #1f43bb 100%);
  color: ${colorText};
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  padding: 8px 16px;
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
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0;
`;

export const NodeBadge = styled.div`
  min-width: 148px;
  border-radius: 8px;
  background: linear-gradient(180deg, #2f5ce6 0%, #1f43bb 100%);
  color: ${colorText};
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  padding: 8px 12px;
  margin-bottom: 8px;
`;

export const CabinetFigure = styled.div`
  width: 96px;
  height: 116px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin-bottom: 8px;
`;

export const CabinetImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const CabinetBase = styled.div`
  width: 72px;
  height: 14px;
  border: 1px solid ${colorBorder};
  border-bottom: none;
  border-radius: 2px;
  background: rgba(7, 19, 34, 0.85);
`;

export const DetailCard = styled.div`
  width: 340px;
  min-height: 392px;
  background: ${colorCardBg};
  border-radius: 8px;
  border: 1px solid ${colorBorder};
  box-shadow: 0 0 10px rgba(70, 199, 255, 0.2);
  color: ${colorText};
  padding: 12px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  margin-top: 0;
`;

export const CardTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
  line-height: 1;
  text-align: center;
`;

export const ModuleBlock = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0;
`;

export const ModuleTitle = styled.div`
  height: 28px;
  background: rgba(30, 80, 230, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
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
  font-size: ${(props) => (props.$small ? "13px" : "14px")};
  color: ${(props) => (props.$highlight ? colorValue : "#dce5f7")};
`;

export const MetricLabel = styled(MetricItem)`
  color: rgba(220, 229, 247, 0.72);
`;

export const FireList = styled.div`
  background: ${colorBlock};
  border-radius: 0 0 2px 2px;
  min-height: 92px;
  padding: 8px 10px;
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
  min-height: 92px;
  background: ${colorBlock};
  border-radius: 0 0 2px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 8px;
  color: rgba(238, 243, 250, 0.9);

  .icon {
    font-size: 26px;
    color: ${(props) => {
      if (props.$warning === true) return "#ff4d4f";
      if (props.$warning === false) return "#52c41a";
      return "#8aa0c4";
    }};
  }
`;

export const EmptyData = styled.div`
  flex: 1;
  min-height: 0;
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
