import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import deviceImg from "../../../../assets/image/energyStorageEquipment.png";
import {
  DiagramViewport,
  DiagramScroller,
  DiagramCanvas,
  ScrollActionButton,
  StationBadge,
  StationStem,
  MainBusLine,
  BusNodeDot,
  NodeStem,
  CardNode,
  NodeBadge,
  CabinetFigure,
  CabinetImage,
  CabinetBase,
  DetailCard,
  CardTitle,
  ModuleBlock,
  ModuleTitle,
  MetricsGrid,
  MetricItem,
  MetricLabel,
  FireList,
  FireListItem,
  FireDot,
  FireText,
  FireTime,
  FireStatus,
  EmptyData,
} from "./styled.js";

const SIDE_PADDING = 36;
const CARD_WIDTH = 372;
const CARD_GAP = 34;
const CARD_ROLL_STEP = CARD_WIDTH + CARD_GAP;
const BUS_Y = 84;
const NODE_TOP = 134;
const EPSILON = 2;

const DEFAULT_LIQUID = { mode: "--", temperature: "--" };
const DEFAULT_DEHUMIDIFIER = { humidity: "--", temperature: "--", status: "--" };
const DEFAULT_FIRE = { mode: "empty", statusText: "暂无数据", warning: false, rows: [] };

function safeList(list) {
  return Array.isArray(list) ? list : [];
}

function unwrapDisplayText(input, fallback = "--") {
  if (input === null || input === undefined) return fallback;
  if (typeof input === "string" || typeof input === "number") {
    const text = String(input).trim();
    return text || fallback;
  }
  if (typeof input === "object") {
    const next =
      input.label ??
      input.name ??
      input.displayName ??
      input.title ??
      input.text ??
      input.value;
    if (next === input) return fallback;
    return unwrapDisplayText(next, fallback);
  }
  return fallback;
}

function normalizeText(value, fallback = "--") {
  return unwrapDisplayText(value, fallback);
}

function normalizeWithUnit(value, unit) {
  const text = normalizeText(value);
  if (text === "--") return "--";
  return unit ? `${text}${unit}` : text;
}

/**
 * 从模块指标数组里按名称关键字匹配数据项。
 *
 * @param items 指标数组
 * @param patterns 关键字正则集合
 * @returns 匹配到的指标项或 null
 *
 * @author ybdpx
 */
function findMetric(items, patterns) {
  const list = safeList(items);
  return list.find((item) => patterns.some((pattern) => pattern.test(String(item?.name ?? "")))) ?? null;
}

/**
 * 解析消防模块展示模式。
 *
 * @param fireModule 消防系统模块
 * @returns 标准化后的消防展示模型
 *
 * @author ybdpx
 */
function resolveFireVM(fireModule) {
  if (!fireModule) {
    return DEFAULT_FIRE;
  }

  const mode = String(
    fireModule?.displayType ?? fireModule?.mode ?? fireModule?.showType ?? ""
  ).toLowerCase();
  const items = safeList(fireModule?.items);
  const hasWarningKeyword = (text) => /告警|报警|异常|故障|故障中|fault|alarm|warning/i.test(text);

  if (mode.includes("list")) {
    const rows = items.map((item, index) => ({
      id: `${fireModule?.id ?? "fire"}-${index}`,
      text: normalizeText(item?.name || item?.value || "消防告警"),
      time: normalizeText(item?.time, "--"),
    }));
    return rows.length > 0
      ? { mode: "list", rows, statusText: "告警列表", warning: true }
      : { mode: "empty", rows: [], statusText: "暂无数据", warning: false };
  }

  if (mode.includes("status")) {
    const first = items[0];
    const statusText = normalizeText(first?.value || first?.name, "暂无数据");
    const warning = hasWarningKeyword(statusText);
    return { mode: "status", rows: [], statusText, warning };
  }

  if (mode.includes("empty")) {
    return DEFAULT_FIRE;
  }

  if (items.length === 0) {
    return DEFAULT_FIRE;
  }

  const alarmRows = items
    .filter((item) => hasWarningKeyword(`${item?.name ?? ""}${item?.value ?? ""}`) || item?.time)
    .map((item, index) => ({
      id: `${fireModule?.id ?? "fire"}-${index}`,
      text: normalizeText(item?.name || item?.value || "消防告警"),
      time: normalizeText(item?.time, "--"),
    }));

  if (alarmRows.length > 0) {
    return {
      mode: "list",
      rows: alarmRows,
      statusText: "告警列表",
      warning: true,
    };
  }

  const first = items[0];
  const statusText = normalizeText(first?.value || first?.name, "暂无数据");
  const warning = hasWarningKeyword(statusText);
  return { mode: "status", rows: [], statusText, warning };
}

function findModule(modules, patterns) {
  return safeList(modules).find((module) =>
    patterns.some((pattern) => pattern.test(String(module?.name ?? "")))
  );
}

/**
 * 把环境监控容器转换成拓扑展示模型。
 *
 * @param container 容器原始数据
 * @param index 容器序号
 * @returns 拓扑展示模型
 *
 * @author ybdpx
 */
function toContainerVM(container, index) {
  const modules = safeList(container?.types);
  const liquidModule = findModule(modules, [/液冷/]);
  const dehumidifierModule = findModule(modules, [/除湿/]);
  const fireModule = findModule(modules, [/消防/]);

  const liquidItems = safeList(liquidModule?.items);
  const dehumidifierItems = safeList(dehumidifierModule?.items);

  const liquidMode = findMetric(liquidItems, [/工作模式/, /运行模式/, /模式/]);
  const liquidTemp = findMetric(liquidItems, [/环境温度/, /温度/]);

  const currentHumidity = findMetric(dehumidifierItems, [/当前湿度/, /湿度/]);
  const currentTemp = findMetric(dehumidifierItems, [/当前温度/, /温度/]);
  const dehumidifierStatus = findMetric(dehumidifierItems, [/工作状态/, /运行状态/, /状态/]);

  return {
    id: container?.id ?? `env-node-${index + 1}`,
    name: normalizeText(
      container?.displayName ?? container?.containerName ?? container?.name,
      `储能柜_${index + 1}`
    ),
    liquid: {
      mode: liquidMode ? normalizeWithUnit(liquidMode?.value, liquidMode?.unit) : DEFAULT_LIQUID.mode,
      temperature: liquidTemp
        ? normalizeWithUnit(liquidTemp?.value, liquidTemp?.unit)
        : DEFAULT_LIQUID.temperature,
    },
    dehumidifier: {
      humidity: currentHumidity
        ? normalizeWithUnit(currentHumidity?.value, currentHumidity?.unit)
        : DEFAULT_DEHUMIDIFIER.humidity,
      temperature: currentTemp
        ? normalizeWithUnit(currentTemp?.value, currentTemp?.unit)
        : DEFAULT_DEHUMIDIFIER.temperature,
      status: dehumidifierStatus
        ? normalizeWithUnit(dehumidifierStatus?.value, dehumidifierStatus?.unit)
        : DEFAULT_DEHUMIDIFIER.status,
    },
    fire: resolveFireVM(fireModule),
  };
}

/**
 * 根据容器数量计算拓扑画布和节点坐标。
 *
 * @param viewportWidth 视窗宽度
 * @param count 容器数量
 * @returns 画布尺寸与坐标
 *
 * @author ybdpx
 */
function calcCanvasLayout(viewportWidth, count) {
  const safeCount = Math.max(count, 1);
  const contentWidth = safeCount * CARD_WIDTH + (safeCount - 1) * CARD_GAP;
  const minimumCanvasWidth = SIDE_PADDING * 2 + contentWidth;
  const canvasWidth = Math.max(viewportWidth, minimumCanvasWidth);
  const startX = (canvasWidth - contentWidth) / 2;
  const centers = Array.from({ length: safeCount }, (_, idx) => {
    return startX + idx * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
  });

  return {
    canvasWidth,
    startX,
    centers,
    busStart: Math.max(SIDE_PADDING, centers[0] - CARD_WIDTH / 2 + 16),
    busEnd: Math.min(canvasWidth - SIDE_PADDING, centers[safeCount - 1] + CARD_WIDTH / 2 - 16),
  };
}

const FireModule = memo(function FireModule({ fire }) {
  if (fire.mode === "list") {
    return (
      <FireList>
        {fire.rows.slice(0, 3).map((row) => (
          <FireListItem key={row.id}>
            <FireDot />
            <FireText>{row.text}</FireText>
            <FireTime>{row.time}</FireTime>
          </FireListItem>
        ))}
      </FireList>
    );
  }

  if (fire.mode === "status") {
    return (
      <FireStatus $warning={fire.warning}>
        {fire.warning ? (
          <ExclamationCircleOutlined className="icon" />
        ) : (
          <CheckCircleOutlined className="icon" />
        )}
        <div>{fire.statusText}</div>
      </FireStatus>
    );
  }

  return (
    <FireStatus>
      <FileTextOutlined className="icon" />
      <div>暂无数据</div>
    </FireStatus>
  );
});

const EnvCardNode = memo(function EnvCardNode({ model, left }) {
  return (
    <CardNode style={{ left, top: NODE_TOP }}>
      <NodeBadge>{model.name}</NodeBadge>
      <CabinetFigure>
        <CabinetImage src={deviceImg} alt={model.name} />
      </CabinetFigure>
      <CabinetBase />
      <DetailCard>
        <CardTitle>环境监控</CardTitle>
        <ModuleBlock>
          <ModuleTitle>液冷系统</ModuleTitle>
          <MetricsGrid $cols={2}>
            <MetricLabel>工作模式</MetricLabel>
            <MetricLabel>环境温度</MetricLabel>
            <MetricItem $highlight>{model.liquid.mode}</MetricItem>
            <MetricItem>{model.liquid.temperature}</MetricItem>
          </MetricsGrid>
        </ModuleBlock>
        <ModuleBlock>
          <ModuleTitle>除湿机</ModuleTitle>
          <MetricsGrid $cols={3}>
            <MetricLabel>当前湿度</MetricLabel>
            <MetricLabel>当前温度</MetricLabel>
            <MetricLabel>工作状态</MetricLabel>
            <MetricItem>{model.dehumidifier.humidity}</MetricItem>
            <MetricItem>{model.dehumidifier.temperature}</MetricItem>
            <MetricItem $highlight>{model.dehumidifier.status}</MetricItem>
          </MetricsGrid>
        </ModuleBlock>
        <ModuleBlock>
          <ModuleTitle>消防系统</ModuleTitle>
          <FireModule fire={model.fire} />
        </ModuleBlock>
      </DetailCard>
    </CardNode>
  );
});

export default memo(function EnvDeviceDiagram({
  loading,
  stationTitle,
  containers = [],
}) {
  const viewportRef = useRef(null);
  const scrollerRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const containerVMs = useMemo(() => {
    return safeList(containers).map((item, index) => toContainerVM(item, index));
  }, [containers]);

  const layout = useMemo(() => calcCanvasLayout(viewportWidth, containerVMs.length), [
    viewportWidth,
    containerVMs.length,
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

    const observer = new ResizeObserver(syncLayout);
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
  }, [containerVMs.length]);

  useEffect(() => {
    updateScrollState();
  }, [layout.canvasWidth, containerVMs.length]);

  const onStepScroll = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({
      left: direction === "left" ? -CARD_ROLL_STEP : CARD_ROLL_STEP,
      behavior: "smooth",
    });
  };

  if (loading && containerVMs.length === 0) {
    return <EmptyData>加载中...</EmptyData>;
  }

  if (containerVMs.length === 0) {
    return <EmptyData>暂无拓扑数据</EmptyData>;
  }

  const stationText = normalizeText(stationTitle, "储能站点");
  const stationCenter = layout.canvasWidth / 2;

  return (
    <DiagramViewport ref={viewportRef}>
      {hasOverflow && (
        <>
          <ScrollActionButton
            type="button"
            $side="left"
            onClick={() => onStepScroll("left")}
            disabled={!canScrollLeft}
            aria-label="向左滚动储能柜"
          >
            <LeftOutlined />
          </ScrollActionButton>
          <ScrollActionButton
            type="button"
            $side="right"
            onClick={() => onStepScroll("right")}
            disabled={!canScrollRight}
            aria-label="向右滚动储能柜"
          >
            <RightOutlined />
          </ScrollActionButton>
        </>
      )}

      <DiagramScroller ref={scrollerRef}>
        <DiagramCanvas style={{ width: layout.canvasWidth }}>
          <StationBadge style={{ left: stationCenter }}>{stationText}</StationBadge>
          <StationStem style={{ left: stationCenter, top: 56, height: BUS_Y - 56 }} />

          <MainBusLine
            style={{
              left: layout.busStart,
              top: BUS_Y,
              width: Math.max(layout.busEnd - layout.busStart, 1),
            }}
          />
          <BusNodeDot style={{ left: stationCenter, top: BUS_Y }} />

          {containerVMs.map((item, index) => {
            const left = layout.startX + index * (CARD_WIDTH + CARD_GAP);
            const centerX = left + CARD_WIDTH / 2;
            return (
              <React.Fragment key={item.id}>
                <BusNodeDot style={{ left: centerX, top: BUS_Y }} />
                <NodeStem style={{ left: centerX, top: BUS_Y, height: Math.max(NODE_TOP - BUS_Y, 12) }} />
                <EnvCardNode model={item} left={left} />
              </React.Fragment>
            );
          })}
        </DiagramCanvas>
      </DiagramScroller>
    </DiagramViewport>
  );
});
