import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import imgurl from "../../cabinetMonitor/imgs";
import {
  DiagramViewport,
  DiagramScroller,
  DiagramCanvas,
  ScrollActionButton,
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
  EmptyData,
} from "./styled.js";

const SIDE_PADDING = 36;
const CLUSTER_CARD_WIDTH = 224;
const CLUSTER_GAP = 22;
const STACK_CARD_WIDTH = 224;
const STACK_TOP = 48;
// 这里要和 styled.js 里 DetailCard($isStack) 的高度保持一致，否则会出现卡片和竖线脱节
const STACK_BLOCK_HEIGHT = 130;
const BUS_Y = 314;
const CLUSTER_TOP = BUS_Y + 4;
const CARD_ROLL_STEP = CLUSTER_CARD_WIDTH + CLUSTER_GAP;
const EPSILON = 2;

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

/**
 * 按关键字匹配数据项。
 *
 * @param items 指标数组
 * @param patterns 正则关键字
 * @returns 匹配项或 null
 *
 * @author ybdpx
 */
function findByNamePatterns(items, patterns) {
  const list = Array.isArray(items) ? items : [];
  return (
    list.find((item) => patterns.some((pattern) => pattern.test(String(item?.name ?? "")))) ??
    null
  );
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
    findByNamePatterns(items, [/状态/, /运行/, /charge/i]) ||
    items.find((item) => item?.style === "Value") ||
    null;
  const socItem = findByNamePatterns(items, [/soc/i]);
  const sohItem = findByNamePatterns(items, [/soh/i]);
  const maxVoltageItem = findByNamePatterns(items, [/电压高/, /最高电压/, /max.?v/i]);
  const minVoltageItem = findByNamePatterns(items, [/电压低/, /最低电压/, /min.?v/i]);
  const maxTempItem = findByNamePatterns(items, [/温度高/, /最高温度/, /max.?temp/i]);
  const minTempItem = findByNamePatterns(items, [/温度低/, /最低温度/, /min.?temp/i]);

  const rawTitle = String(node?.name || (isStack ? "BMS设备" : "电池簇"));
  const sn = String(node?.sn || "").trim();
  const title = sn && !rawTitle.includes(sn) ? `${rawTitle}（${sn}）` : rawTitle;

  return {
    title,
    status: String(statusItem?.value ?? "充电"),
    socText: String(socItem?.value ?? "--"),
    socUnit: String(socItem?.unit ?? ""),
    socPercent: toProgressPercent(socItem?.value, socItem?.unit),
    sohText: String(sohItem?.value ?? "--"),
    sohUnit: String(sohItem?.unit ?? ""),
    sohPercent: toProgressPercent(sohItem?.value, sohItem?.unit),
    maxVoltage: String(maxVoltageItem?.value ?? "--"),
    maxVoltageUnit: String(maxVoltageItem?.unit ?? "V"),
    minVoltage: String(minVoltageItem?.value ?? "--"),
    minVoltageUnit: String(minVoltageItem?.unit ?? "V"),
    maxTemp: String(maxTempItem?.value ?? "--"),
    maxTempUnit: String(maxTempItem?.unit ?? "℃"),
    minTemp: String(minTempItem?.value ?? "--"),
    minTempUnit: String(minTempItem?.unit ?? "℃"),
  };
}

function formatValue(value, unit) {
  if (!value || value === "--") return "--";
  return unit ? `${value}(${unit})` : value;
}

function calcCanvasLayout(viewportWidth, clusterCount) {
  const safeCount = Math.max(clusterCount, 1);
  const contentWidth = safeCount * CLUSTER_CARD_WIDTH + (safeCount - 1) * CLUSTER_GAP;
  const minimumCanvasWidth = SIDE_PADDING * 2 + contentWidth;
  const canvasWidth = Math.max(viewportWidth, minimumCanvasWidth);
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
        <StateLabel>当前状态</StateLabel>
        <StateValue>{model.status}</StateValue>
      </StateGrid>
      <ProgressGroup>
        <ProgressLine $variant="soc" $percent={model.socPercent}>
          SOC {model.socText}
          {model.socUnit}
        </ProgressLine>
        <ProgressLine $variant="soh" $percent={model.sohPercent}>
          SOH {model.sohText}
          {model.sohUnit}
        </ProgressLine>
      </ProgressGroup>
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
          <StateLabel>当前状态</StateLabel>
          <StateValue>{model.status}</StateValue>
        </StateGrid>
        <ProgressGroup>
          <ProgressLine $variant="soc" $percent={model.socPercent}>
            SOC {model.socText}
            {model.socUnit}
          </ProgressLine>
          <ProgressLine $variant="soh" $percent={model.sohPercent}>
            SOH {model.sohText}
            {model.sohUnit}
          </ProgressLine>
        </ProgressGroup>
        <ValueGrid>
          <ValueLabel>电压高值</ValueLabel>
          <ValueLabel>电压低值</ValueLabel>
          <ValueText>{formatValue(model.maxVoltage, model.maxVoltageUnit)}</ValueText>
          <ValueText>{formatValue(model.minVoltage, model.minVoltageUnit)}</ValueText>
        </ValueGrid>
        <ValueGrid>
          <ValueLabel>温度高值</ValueLabel>
          <ValueLabel>温度低值</ValueLabel>
          <ValueText>{formatValue(model.maxTemp, model.maxTempUnit)}</ValueText>
          <ValueText>{formatValue(model.minTemp, model.minTempUnit)}</ValueText>
        </ValueGrid>
      </DetailCard>
    </ClusterNode>
  );
});

export default memo(function BmsDeviceDiagram({ loading, stackData, clusterData = [] }) {
  const viewportRef = useRef(null);
  const scrollerRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const stackModel = useMemo(() => buildDisplayModel(stackData, true), [stackData]);
  const clusters = useMemo(() => {
    return Array.isArray(clusterData)
      ? clusterData.map((item, idx) => ({
          id: item?.id ?? item?.sn ?? item?.name ?? `cluster-${idx}`,
          model: buildDisplayModel(item),
        }))
      : [];
  }, [clusterData]);

  const layout = useMemo(() => calcCanvasLayout(viewportWidth, clusters.length), [
    viewportWidth,
    clusters.length,
  ]);

  const updateScrollState = () => {
    const node = scrollerRef.current;
    if (!node) return;
    const overflow = node.scrollWidth - node.clientWidth > EPSILON;
    setHasOverflow(overflow);
    setCanScrollLeft(node.scrollLeft > EPSILON);
    setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - EPSILON);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    const scroller = scrollerRef.current;
    if (!viewport || !scroller) return undefined;

    const syncLayout = () => {
      setViewportWidth(viewport.clientWidth || 0);
      updateScrollState();
    };

    const onScroll = () => updateScrollState();
    scroller.addEventListener("scroll", onScroll);
    const observer = new ResizeObserver(() => syncLayout());
    observer.observe(viewport);
    observer.observe(scroller);
    window.addEventListener("resize", syncLayout);

    const raf = requestAnimationFrame(syncLayout);
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
      observer.disconnect();
      window.removeEventListener("resize", syncLayout);
    };
  }, [clusters.length]);

  useEffect(() => {
    updateScrollState();
  }, [layout.canvasWidth, clusters.length]);

  const onStepScroll = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({
      left: direction === "left" ? -CARD_ROLL_STEP : CARD_ROLL_STEP,
      behavior: "smooth",
    });
  };

  if (loading && !stackData && clusters.length === 0) {
    return <EmptyData>加载中...</EmptyData>;
  }

  if (!stackData && clusters.length === 0) {
    return <EmptyData>暂无拓扑数据</EmptyData>;
  }

  const stackLeft = (layout.canvasWidth - STACK_CARD_WIDTH) / 2;
  const stackCenter = stackLeft + STACK_CARD_WIDTH / 2;

  return (
    <DiagramViewport ref={viewportRef}>
      {hasOverflow && (
        <>
          <ScrollActionButton
            type="button"
            $side="left"
            onClick={() => onStepScroll("left")}
            disabled={!canScrollLeft}
            aria-label="向左滚动电池簇"
          >
            <LeftOutlined />
          </ScrollActionButton>
          <ScrollActionButton
            type="button"
            $side="right"
            onClick={() => onStepScroll("right")}
            disabled={!canScrollRight}
            aria-label="向右滚动电池簇"
          >
            <RightOutlined />
          </ScrollActionButton>
        </>
      )}

      <DiagramScroller ref={scrollerRef}>
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
