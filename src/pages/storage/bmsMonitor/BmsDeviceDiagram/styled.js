import styled from "styled-components";

const colorBlue = "#1E50E6";
const colorText = "#EEF3FA";
const colorBorder = "#46C7FF";
const colorBlock = "#3D434D";
const colorCardBg = "rgba(0, 0, 0, 0.5)";

export const DiagramViewport = styled.div`
  position: relative;
  width: 100%;
  height: 860px;
  margin-top: 14px;
  overflow: hidden;
`;

export const DiagramScroller = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
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
  height: 100%;
  min-width: 100%;
`;

export const ScrollActionButton = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.$side === "left" ? "left: 6px;" : "right: 6px;")}
  transform: translateY(-50%);
  z-index: 4;
  width: 30px;
  height: 52px;
  border: 1px solid rgba(70, 199, 255, 0.5);
  border-radius: 6px;
  background: rgba(10, 22, 40, 0.85);
  color: #d8efff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: #fff;
    border-color: rgba(70, 199, 255, 0.85);
    box-shadow: 0 0 10px rgba(70, 199, 255, 0.34);
  }
  &:disabled {
    color: rgba(216, 239, 255, 0.35);
    border-color: rgba(70, 199, 255, 0.24);
    cursor: not-allowed;
  }
`;

export const StackNameBadge = styled.div`
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  min-width: 230px;
  border-radius: 10px;
  background: linear-gradient(180deg, #2f5ce6 0%, #1f43bb 100%);
  color: ${colorText};
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  padding: 12px 16px;
  white-space: nowrap;
`;

export const StackBlockWrap = styled.div`
  position: absolute;
  width: 224px;
`;

export const TopStemLine = styled.img`
  position: absolute;
  transform: translateX(-50%);
  width: 10px;
  z-index: 1;
`;

export const MainBusLine = styled.div`
  position: absolute;
  height: 2px;
  background: #46c7ff;
  box-shadow: 0 0 8px rgba(70, 199, 255, 0.42);
`;

export const ClusterRow = styled.div`
  position: absolute;
  display: flex;
  gap: 22px;
`;

export const ClusterNode = styled.div`
  width: 224px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0;
`;

export const BranchLineImg = styled.img`
  width: 150px;
  height: 160px;
  object-fit: fill;
  pointer-events: none;
`;

export const DetailCard = styled.div`
  width: 224px;
  min-height: ${(props) => (props.$isStack ? "130px" : "294px")};
  background: ${colorCardBg};
  border-radius: 6px;
  border: 1px solid ${colorBorder};
  box-shadow: 0 0 10px rgba(70, 199, 255, 0.18);
  padding: ${(props) => (props.$isStack ? "10px" : "12px")};
  color: ${colorText};
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => (props.$isStack ? "10px" : "12px")};
`;

export const CardTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: ${colorText};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1.2;
`;

export const StateGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 24px);
  border-radius: 2px;
  overflow: hidden;
`;

export const StateLabel = styled.div`
  background: rgba(30, 80, 230, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StateValue = styled.div`
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProgressGroup = styled.div`
  display: grid;
  grid-auto-rows: 24px;
  row-gap: 4px;
`;

export const ProgressLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
    90deg,
    ${(props) => (props.$variant === "soh" ? "#4B48F7" : "#05C06E")} 0%,
    ${(props) => (props.$variant === "soh" ? "#4B48F7" : "#05C06E")} ${(props) => props.$percent}%,
    ${colorBlock} ${(props) => props.$percent}%,
    ${colorBlock} 100%
  );
`;

export const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 24px;
  border-radius: 2px;
  overflow: hidden;
  background: ${colorBlock};
`;

export const ValueLabel = styled.div`
  background: ${colorBlue};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ValueText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptyMetric = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8aa0c4;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
`;

export const EmptyData = styled.div`
  height: 860px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8aa0c4;
  font-size: 14px;
`;
