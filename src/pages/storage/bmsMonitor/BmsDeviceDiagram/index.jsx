import React, { memo } from "react";
import {
  DiagramContainer,
  ConnectionLayer,
  StackArea,
  StackBox,
  StackName,
  ClusterContainer,
  ClusterBox,
  ClusterName,
  DataRow,
  DataLabel,
  DataValue,
  DataUnit,
  StatusBadge,
  ProgressBar,
  NoData,
} from "./styled.js";

// 簇组件 - 不再需要 ref，位置通过数学计算
const ClusterPanel = memo(({ data }) => {
  if (!data || !data.items || data.items.length === 0) {
    return (
      <ClusterBox>
        <ClusterName>{data.name || "未知簇"}</ClusterName>
        <NoData>暂无数据</NoData>
      </ClusterBox>
    );
  }

  return (
    <ClusterBox>
      <ClusterName>{data.name}</ClusterName>
      {data.items.map((item) => renderDataItem(item, "NameValueTwo"))}
    </ClusterBox>
  );
});

// 渲染单个数据项
const renderDataItem = (item, style = "NameValueOne") => {
  if (!item) return null;

  const { name, value, unit = "", color = "white", style: itemStyle } = item;
  const finalStyle = itemStyle || style;

  // 状态标签样式（Value）
  if (finalStyle === "Value") {
    return (
      <StatusBadge key={item.index} $color={color}>
        {value}
      </StatusBadge>
    );
  }

  // 百分比进度条样式（NameValueOne - SOC/SOH）
  if (finalStyle === "NameValueOne") {
    const percent = parseFloat(value) || 0;
    return (
      <div key={item.index}>
        <DataRow>
          <DataLabel>{name}</DataLabel>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <DataValue $color={color}>{value}</DataValue>
            <DataUnit>{unit}</DataUnit>
          </div>
        </DataRow>
        <ProgressBar $percent={Math.min(percent, 100)} $color={color} />
      </div>
    );
  }

  // 双列数据样式（NameValueTwo - 电压/温度等）
  if (finalStyle === "NameValueTwo") {
    return (
      <DataRow key={item.index}>
        <DataLabel>{name}</DataLabel>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <DataValue $color={color}>{value}</DataValue>
          <DataUnit>{unit}</DataUnit>
        </div>
      </DataRow>
    );
  }

  // 默认样式
  return (
    <DataRow key={item.index}>
      <DataLabel>{name}</DataLabel>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <DataValue $color={color}>{value}</DataValue>
        <DataUnit>{unit}</DataUnit>
      </div>
    </DataRow>
  );
};

// 电池堆组件
const StackPanel = memo(({ data }) => {
  if (!data || !data.items || data.items.length === 0) {
    return (
      <StackBox>
        <NoData>暂无数据</NoData>
      </StackBox>
    );
  }

  return (
    <StackBox>
      <StackName>{data.name}</StackName>
      {data.items.map((item) => renderDataItem(item, "Value"))}
      {data.items
        .filter((item) => item.style === "NameValueOne")
        .map((item) => renderDataItem(item, "NameValueOne"))}
    </StackBox>
  );
});

// 主组件
export default memo(function BmsDeviceDiagram({ stackData, clusterData = [] }) {
  // 常量定义
  const CONTAINER_WIDTH = 504; // DiagramContainer 宽度
  const CLUSTER_WIDTH = 140; // ClusterBox 宽度
  const CLUSTER_GAP = 16; // 簇间距
  const BUS_Y = 320; // 水平总线 Y 坐标
  const CLUSTER_OFFSET = -22; // 簇整体左偏移量（负数向左，正数向右）

  // 数学计算簇的中心位置
  const clusterCount = clusterData.length;
  const totalClusterWidth = clusterCount * CLUSTER_WIDTH + (clusterCount - 1) * CLUSTER_GAP;
  const startX = (CONTAINER_WIDTH - totalClusterWidth) / 2;

  // 计算每个簇的中心 X 坐标
  const clusterPositions = clusterData.map((_, index) => {
    return startX + index * (CLUSTER_WIDTH + CLUSTER_GAP) + CLUSTER_WIDTH / 2 + CLUSTER_OFFSET;
  });

  // 计算水平总线的范围
  const minX = clusterPositions.length > 0 ? Math.min(...clusterPositions) : 230;
  const maxX = clusterPositions.length > 0 ? Math.max(...clusterPositions) : 230;

  return (
    <DiagramContainer>
      {/* SVG 连接线层 */}
      <ConnectionLayer>
        {/* 从堆到底部总线的垂直线 */}
        <line x1="230" y1="230" x2="230" y2={BUS_Y} />
        {/* 水平总线 - 固定位置和长度 */}
        {clusterPositions.length > 0 && (
          <line x1="36" y1={BUS_Y} x2="468" y2={BUS_Y} />
        )}
        {/* 从总线到每个簇的垂直线 */}
        {clusterPositions.map((x, index) => (
          <line key={index} x1={x} y1={BUS_Y} x2={x} y2="380" />
        ))}
      </ConnectionLayer>

      {/* 电池堆 */}
      <StackArea>
        <StackPanel data={stackData} />
      </StackArea>

      {/* 电池簇容器 */}
      <ClusterContainer>
        {clusterData.map((cluster) => (
          <ClusterPanel key={cluster.id} data={cluster} />
        ))}
      </ClusterContainer>
    </DiagramContainer>
  );
});
