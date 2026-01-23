import styled, { css } from "styled-components";

// 容器
export const DiagramContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  /* 背景由父元素 .leftlayout 提供 */
`;

// 连接线层（SVG）
export const ConnectionLayer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  line {
    stroke: #1e3a5f;
    stroke-width: 2;
  }
`;

// 电池堆区域
export const StackArea = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StackBox = styled.div`
  width: 180px;
  padding: 12px;
  background: rgba(30, 58, 95, 0.6);
  border: 1px solid #2d5a87;
  border-radius: 6px;
  text-align: center;
`;

export const StackName = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

// 电池簇区域容器
export const ClusterContainer = styled.div`
  position: absolute;
  top: 380px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 20px;
  box-sizing: border-box;
`;

export const ClusterBox = styled.div`
  width: 140px;
  padding: 10px;
  background: rgba(30, 58, 95, 0.6);
  border: 1px solid #2d5a87;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ClusterName = styled.div`
  color: #a0c4ff;
  font-size: 12px;
  margin-bottom: 6px;
  text-align: center;
`;

// 数据项通用样式
const dataItemBase = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
`;

export const DataRow = styled.div`
  ${dataItemBase}
  width: 100%;
`;

export const DataLabel = styled.span`
  color: #8ba3bf;
  margin-right: 8px;
`;

export const DataValue = styled.span`
  color: ${(props) => {
    const colors = {
      blue: "#4dabf7",
      green: "#69db7c",
      orange: "#ffa94d",
      red: "#ff6b6b",
      yellow: "#ffd43b",
      purple: "#da77f2",
    };
    return colors[props.$color] || "#fff";
  }};
  font-weight: 500;
`;

export const DataUnit = styled.span`
  color: #6c7a8d;
  font-size: 10px;
  margin-left: 2px;
`;

// 状态标签（Value 样式专用）
export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    const colors = {
      blue: "rgba(77, 171, 247, 0.2)",
      green: "rgba(105, 219, 124, 0.2)",
      orange: "rgba(255, 169, 77, 0.2)",
      red: "rgba(255, 107, 107, 0.2)",
    };
    return colors[props.$color] || "rgba(255, 255, 255, 0.1)";
  }};
  color: ${(props) => {
    const colors = {
      blue: "#4dabf7",
      green: "#69db7c",
      orange: "#ffa94d",
      red: "#ff6b6b",
    };
    return colors[props.$color] || "#fff";
  }};
`;

// SOC/SOH 进度条
export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;

  &::after {
    content: "";
    display: block;
    width: ${(props) => props.$percent}%;
    height: 100%;
    background: ${(props) => {
      const colors = {
        green: "#69db7c",
        blue: "#4dabf7",
        orange: "#ffa94d",
        red: "#ff6b6b",
      };
      return colors[props.$color] || "#4dabf7";
    }};
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

// 无数据占位
export const NoData = styled.div`
  color: #4a5568;
  font-size: 12px;
  text-align: center;
  padding: 20px;
`;
