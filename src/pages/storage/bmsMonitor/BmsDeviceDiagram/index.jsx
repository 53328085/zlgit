import React, { memo, useMemo } from "react";
import imgurl from "../../cabinetMonitor/imgs";
import {
  DiagramViewport,
  DiagramScroller,
  DiagramCanvas,
  StackNameBadge,
  StackBlockWrap,
  TopStemLine,
  MainBusLine,
  ClusterRow,
  ClusterNode,
  BranchLineImg,
  DetailCard,
  CardTitle,
  StateGrid,
  StateLabel,
  StateValue,
  ProgressGroup,
  ProgressLine,
  ValueGrid,
  ValueLabel,
  ValueText,
  EmptyMetric,
  EmptyData,
} from "./styled.js";

const SIDE_PADDING = 36;
const CLUSTER_CARD_WIDTH = 208;
const CLUSTER_GAP = 18;
const STACK_CARD_WIDTH = 208;
const STACK_TOP = 32;
// 这里要和 styled.js 里 DetailCard($isStack) 的高度保持一致，否则会出现卡片和竖线脱节
const STACK_BLOCK_HEIGHT = 120;
const BUS_Y = 222;
const CLUSTER_TOP = BUS_Y + 4;

/**
 * 把接口值转换成进度条百分比，兼容百分比/千分比/历史数值。
 *
 * @param value 数值原文
 * @param unit 单位原文
 * @returns 0-100 的进度值
 *
 * @author ybdpx
 */
function toProgressPercent(value, unit) {
  const numeric = Number.parseFloat(String(value ?? "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric)) return 0;

  const hasPermille = String(unit ?? "").includes("‰") || String(value ?? "").includes("‰");
  if (hasPermille) {
    return Math.max(0, Math.min(100, numeric / 10));
  }
  if (numeric > 100 && numeric <= 1000) {
    return Math.max(0, Math.min(100, numeric / 10));
  }
  if (numeric > 0 && numeric <= 1) {
    return Math.max(0, Math.min(100, numeric * 100));
  }
  return Math.max(0, Math.min(100, numeric));
}

function getItemStyle(item) {
  return String(item?.style ?? "").trim();
}

function getSortIndex(item, fallback) {
  const idx = Number(item?.index);
  return Number.isFinite(idx) ? idx : fallback;
}

function getItemLabel(item, fallback) {
  const name = String(item?.name ?? "").trim();
  if (name) return name;
  const point = String(item?.point ?? "").trim();
  if (point) return point;
  return fallback;
}

function formatRawValue(value) {
  const text = String(value ?? "").trim();
  return text || "--";
}

/**
 * 把接口节点映射成统一展示模型。
 *
 * @param node 拓扑节点
 * @param isStack 是否堆节点
 * @returns 展示模型
 *
 * @author ybdpx
 */
function buildDisplayModel(node, isStack = false) {
  const items = Array.isArray(node?.items) ? node.items : [];
  const statusItem =
    items.find((item) => getItemStyle(item).toLowerCase() === "value") || null;
  const progressItems = items
    .filter((item) => getItemStyle(item).toLowerCase() === "namevalueone")
    .sort((a, b) => getSortIndex(a, 0) - getSortIndex(b, 0))
    .map((item, index) => ({
      key: `progress-${getSortIndex(item, index)}-${item?.point || item?.name || index}`,
      label: getItemLabel(item, `指标${index + 1}`),
      value: formatRawValue(item?.value),
      unit: String(item?.unit ?? ""),
      percent: toProgressPercent(item?.value, item?.unit),
    }));
  const valueItems = items
    .filter((item) => getItemStyle(item).toLowerCase() === "namevaluetwo")
    .sort((a, b) => getSortIndex(a, 0) - getSortIndex(b, 0))
    .map((item, index) => ({
      key: `value-${getSortIndex(item, index)}-${item?.point || item?.name || index}`,
      label: getItemLabel(item, `点位${index + 1}`),
      value: formatRawValue(item?.value),
      unit: String(item?.unit ?? ""),
    }));

  const rawTitle = String(node?.name || (isStack ? "BMS设备" : "电池簇"));
  const sn = String(node?.sn || "").trim();
  const title = sn && !rawTitle.includes(sn) ? `${rawTitle}（${sn}）` : rawTitle;

  return {
    title,
    statusLabel: getItemLabel(statusItem, "当前状态"),
    statusValue: formatRawValue(statusItem?.value),
    progressItems,
    valueItems,
    hasData: items.length > 0,
  };
}

function formatValue(value, unit) {
  if (!value || value === "--") return "--";
  return unit ? `${value}(${unit})` : value;
}

function calcCanvasLayout(clusterCount) {
  const safeCount = Math.max(clusterCount, 1);
  const contentWidth = safeCount * CLUSTER_CARD_WIDTH + (safeCount - 1) * CLUSTER_GAP;
  const minimumCanvasWidth = SIDE_PADDING * 2 + contentWidth;
  const canvasWidth = minimumCanvasWidth;
  const clusterStartX = (canvasWidth - contentWidth) / 2;
  const centers = Array.from({ length: safeCount }, (_, idx) => {
    return clusterStartX + idx * (CLUSTER_CARD_WIDTH + CLUSTER_GAP) + CLUSTER_CARD_WIDTH / 2;
  });

  const minCenter = centers[0];
  const maxCenter = centers[centers.length - 1];
  return {
    canvasWidth,
    clusterStartX,
    centers,
    busStart: Math.max(SIDE_PADDING, minCenter - 110),
    busEnd: Math.min(canvasWidth - SIDE_PADDING, maxCenter + 110),
  };
}

const TopStackCard = memo(function TopStackCard({ model }) {
  return (
    <DetailCard $isStack>
      <StateGrid>
        <StateLabel>{model.statusLabel}</StateLabel>
        <StateValue>{model.statusValue}</StateValue>
      </StateGrid>
      {model.progressItems.length > 0 ? (
        <ProgressGroup>
          {model.progressItems.map((item, index) => (
            <ProgressLine key={item.key} $variant={index % 2 === 1 ? "soh" : "soc"} $percent={item.percent}>
              {item.label} {item.value}
              {item.unit}
            </ProgressLine>
          ))}
        </ProgressGroup>
      ) : (
        <EmptyMetric>暂无指标数据</EmptyMetric>
      )}
    </DetailCard>
  );
});

const ClusterCard = memo(function ClusterCard({ model }) {
  return (
    <ClusterNode>
      <BranchLineImg src={imgurl.line} alt="" />
      <DetailCard>
        <CardTitle>{model.title}</CardTitle>
        <StateGrid>
          <StateLabel>{model.statusLabel}</StateLabel>
          <StateValue>{model.statusValue}</StateValue>
        </StateGrid>
        {model.progressItems.length > 0 ? (
          <ProgressGroup>
            {model.progressItems.map((item, index) => (
              <ProgressLine key={item.key} $variant={index % 2 === 1 ? "soh" : "soc"} $percent={item.percent}>
                {item.label} {item.value}
                {item.unit}
              </ProgressLine>
            ))}
          </ProgressGroup>
        ) : null}
        {model.valueItems.length > 0 ? (
          <ValueGrid>
            {model.valueItems.map((item) => (
              <React.Fragment key={item.key}>
                <ValueLabel>{item.label}</ValueLabel>
                <ValueText>{formatValue(item.value, item.unit)}</ValueText>
              </React.Fragment>
            ))}
          </ValueGrid>
        ) : null}
        {!model.hasData ? <EmptyMetric>暂无指标数据</EmptyMetric> : null}
      </DetailCard>
    </ClusterNode>
  );
});

export default memo(function BmsDeviceDiagram({ loading, stackData, clusterData = [] }) {

  const stackModel = useMemo(() => buildDisplayModel(stackData, true), [stackData]);
  const clusters = useMemo(() => {
    return Array.isArray(clusterData)
      ? clusterData.map((item, idx) => ({
          id: item?.id ?? item?.sn ?? item?.name ?? `cluster-${idx}`,
          model: buildDisplayModel(item),
        }))
      : [];
  }, [clusterData]);

  const layout = useMemo(() => calcCanvasLayout(clusters.length), [clusters.length]);

  if (loading && !stackData && clusters.length === 0) {
    return <EmptyData>加载中...</EmptyData>;
  }

  if (!stackData && clusters.length === 0) {
    return <EmptyData>暂无拓扑数据</EmptyData>;
  }

  const stackLeft = (layout.canvasWidth - STACK_CARD_WIDTH) / 2;
  const stackCenter = stackLeft + STACK_CARD_WIDTH / 2;

  return (
    <DiagramViewport>
      <DiagramScroller>
        <DiagramCanvas style={{ width: layout.canvasWidth }}>
          <StackNameBadge style={{ left: stackCenter }}>{stackModel.title || "BMS设备"}</StackNameBadge>
          <StackBlockWrap style={{ left: stackLeft, top: STACK_TOP }}>
            <TopStackCard model={stackModel} />
          </StackBlockWrap>

          <TopStemLine
            src={imgurl.line2}
            alt=""
            style={{
              left: stackCenter,
              top: STACK_TOP + STACK_BLOCK_HEIGHT,
              height: Math.max(BUS_Y - (STACK_TOP + STACK_BLOCK_HEIGHT), 24),
            }}
          />

          <MainBusLine
            style={{
              left: layout.busStart,
              top: BUS_Y,
              width: Math.max(layout.busEnd - layout.busStart, 1),
            }}
          />
          {clusters.length > 0 && (
            <ClusterRow style={{ left: layout.clusterStartX, top: CLUSTER_TOP }}>
              {clusters.map((cluster) => (
                <ClusterCard key={cluster.id} model={cluster.model} />
              ))}
            </ClusterRow>
          )}
        </DiagramCanvas>
      </DiagramScroller>
    </DiagramViewport>
  );
});
