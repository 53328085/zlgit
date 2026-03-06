import React, { memo, useMemo } from "react";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import deviceImg from "../../../../assets/image/energyStorageEquipment.png";
import {
  DiagramViewport,
  DiagramScroller,
  DiagramCanvas,
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
  RetryButton,
} from "./styled.js";
import {
  ENV_FIRE_DISPLAY_TYPE,
  ENV_METRIC_CODE,
  ENV_METRIC_CODE_ALIASES,
  ENV_MODULE_TYPE,
  ENV_MODULE_TYPE_ALIASES,
  ENV_MONITOR_TEXT,
} from "../constants";

const SIDE_PADDING = 36;
const CARD_WIDTH = 340;
const CARD_GAP = 28;
const BUS_Y = 60;
const NODE_TOP = 88;

const DEFAULT_LIQUID = { mode: "--", temperature: "--" };
const DEFAULT_DEHUMIDIFIER = { humidity: "--", temperature: "--", status: "--" };
const DEFAULT_FIRE = {
  mode: ENV_FIRE_DISPLAY_TYPE.EMPTY.toLowerCase(),
  statusText: ENV_MONITOR_TEXT.NO_DATA,
  warning: false,
  rows: [],
};

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

function extractIdentityTokens(entity) {
  const keys = [
    entity?.moduleType,
    entity?.type,
    entity?.code,
    entity?.itemType,
    entity?.metricCode,
    entity?.name,
  ];
  return keys
    .filter((item) => item !== null && item !== undefined && String(item).trim() !== "")
    .map((item) => String(item).trim().toUpperCase());
}

function isMatchedByAliases(tokens, aliases) {
  if (!tokens.length || !aliases.length) return false;
  return aliases.some((candidate) => {
    const upperCandidate = String(candidate).trim().toUpperCase();
    return tokens.some((token) => token === upperCandidate || token.includes(upperCandidate));
  });
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
function findMetric(items, patterns, metricCode) {
  const list = safeList(items);
  const aliases = metricCode ? ENV_METRIC_CODE_ALIASES[metricCode] || [metricCode] : [];
  const byCode = list.find((item) => isMatchedByAliases(extractIdentityTokens(item), aliases));
  if (byCode) return byCode;
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

  if (mode.includes(ENV_FIRE_DISPLAY_TYPE.LIST.toLowerCase())) {
    const rows = items.map((item, index) => ({
      id: `${fireModule?.id ?? "fire"}-${index}`,
      text: normalizeText(item?.name || item?.value || ENV_MONITOR_TEXT.FIRE_DEFAULT_ALARM),
      time: normalizeText(item?.time, "--"),
    }));
    return rows.length > 0
      ? { mode: ENV_FIRE_DISPLAY_TYPE.LIST.toLowerCase(), rows, statusText: ENV_MONITOR_TEXT.FIRE_ALARM_LIST, warning: true }
      : { mode: ENV_FIRE_DISPLAY_TYPE.EMPTY.toLowerCase(), rows: [], statusText: ENV_MONITOR_TEXT.NO_DATA, warning: false };
  }

  if (mode.includes(ENV_FIRE_DISPLAY_TYPE.STATUS.toLowerCase())) {
    const first = items[0];
    const statusText = normalizeText(first?.value || first?.name, ENV_MONITOR_TEXT.NO_DATA);
    const warning = hasWarningKeyword(statusText);
    return { mode: ENV_FIRE_DISPLAY_TYPE.STATUS.toLowerCase(), rows: [], statusText, warning };
  }

  if (mode.includes(ENV_FIRE_DISPLAY_TYPE.EMPTY.toLowerCase())) {
    return DEFAULT_FIRE;
  }

  if (items.length === 0) {
    return DEFAULT_FIRE;
  }

  const alarmRows = items
    .filter((item) => hasWarningKeyword(`${item?.name ?? ""}${item?.value ?? ""}`) || item?.time)
    .map((item, index) => ({
      id: `${fireModule?.id ?? "fire"}-${index}`,
      text: normalizeText(item?.name || item?.value || ENV_MONITOR_TEXT.FIRE_DEFAULT_ALARM),
      time: normalizeText(item?.time, "--"),
    }));

  if (alarmRows.length > 0) {
    return {
      mode: ENV_FIRE_DISPLAY_TYPE.LIST.toLowerCase(),
      rows: alarmRows,
      statusText: ENV_MONITOR_TEXT.FIRE_ALARM_LIST,
      warning: true,
    };
  }

  const first = items[0];
  const statusText = normalizeText(first?.value || first?.name, ENV_MONITOR_TEXT.NO_DATA);
  const warning = hasWarningKeyword(statusText);
  return { mode: ENV_FIRE_DISPLAY_TYPE.STATUS.toLowerCase(), rows: [], statusText, warning };
}

function findModule(modules, moduleType, patterns) {
  const list = safeList(modules);
  const aliases = ENV_MODULE_TYPE_ALIASES[moduleType] || [moduleType];
  const byType = list.find((module) => isMatchedByAliases(extractIdentityTokens(module), aliases));
  if (byType) return byType;
  return list.find((module) => patterns.some((pattern) => pattern.test(String(module?.name ?? ""))));
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
  const liquidModule = findModule(modules, ENV_MODULE_TYPE.LIQUID_COOLING, [/液冷/]);
  const dehumidifierModule = findModule(modules, ENV_MODULE_TYPE.DEHUMIDIFIER, [/除湿/]);
  const fireModule = findModule(modules, ENV_MODULE_TYPE.FIRE, [/消防/]);

  const liquidItems = safeList(liquidModule?.items);
  const dehumidifierItems = safeList(dehumidifierModule?.items);

  const liquidMode = findMetric(liquidItems, [/工作模式/, /运行模式/, /模式/], ENV_METRIC_CODE.MODE);
  const liquidTemp = findMetric(liquidItems, [/环境温度/, /温度/], ENV_METRIC_CODE.TEMPERATURE);

  const currentHumidity = findMetric(
    dehumidifierItems,
    [/当前湿度/, /湿度/],
    ENV_METRIC_CODE.HUMIDITY
  );
  const currentTemp = findMetric(
    dehumidifierItems,
    [/当前温度/, /温度/],
    ENV_METRIC_CODE.TEMPERATURE
  );
  const dehumidifierStatus = findMetric(
    dehumidifierItems,
    [/工作状态/, /运行状态/, /状态/],
    ENV_METRIC_CODE.STATUS
  );

  return {
    id: container?.id ?? `env-node-${index + 1}`,
    name: normalizeText(
      container?.displayName ?? container?.containerName ?? container?.name,
      `${ENV_MONITOR_TEXT.DEFAULT_CONTAINER_PREFIX}${index + 1}`
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
function calcCanvasLayout(count) {
  const safeCount = Math.max(count, 1);
  const contentWidth = safeCount * CARD_WIDTH + (safeCount - 1) * CARD_GAP;
  const minimumCanvasWidth = SIDE_PADDING * 2 + contentWidth;
  const canvasWidth = minimumCanvasWidth;
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
      <div>{ENV_MONITOR_TEXT.NO_DATA}</div>
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
        <CardTitle>{ENV_MONITOR_TEXT.ENV_TITLE}</CardTitle>
        <ModuleBlock>
          <ModuleTitle>{ENV_MONITOR_TEXT.LIQUID_TITLE}</ModuleTitle>
          <MetricsGrid $cols={2}>
            <MetricLabel>{ENV_MONITOR_TEXT.LIQUID_MODE}</MetricLabel>
            <MetricLabel>{ENV_MONITOR_TEXT.LIQUID_TEMP}</MetricLabel>
            <MetricItem $highlight>{model.liquid.mode}</MetricItem>
            <MetricItem>{model.liquid.temperature}</MetricItem>
          </MetricsGrid>
        </ModuleBlock>
        <ModuleBlock>
          <ModuleTitle>{ENV_MONITOR_TEXT.DEHUMIDIFIER_TITLE}</ModuleTitle>
          <MetricsGrid $cols={3}>
            <MetricLabel>{ENV_MONITOR_TEXT.DEHUMIDIFIER_HUMIDITY}</MetricLabel>
            <MetricLabel>{ENV_MONITOR_TEXT.DEHUMIDIFIER_TEMP}</MetricLabel>
            <MetricLabel>{ENV_MONITOR_TEXT.DEHUMIDIFIER_STATUS}</MetricLabel>
            <MetricItem>{model.dehumidifier.humidity}</MetricItem>
            <MetricItem>{model.dehumidifier.temperature}</MetricItem>
            <MetricItem $highlight>{model.dehumidifier.status}</MetricItem>
          </MetricsGrid>
        </ModuleBlock>
        <ModuleBlock>
          <ModuleTitle>{ENV_MONITOR_TEXT.FIRE_TITLE}</ModuleTitle>
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
  errorText,
  onRetry,
}) {

  const containerVMs = useMemo(() => {
    return safeList(containers).map((item, index) => toContainerVM(item, index));
  }, [containers]);

  const layout = useMemo(() => calcCanvasLayout(containerVMs.length), [containerVMs.length]);

  if (loading && containerVMs.length === 0) {
    return <EmptyData>{ENV_MONITOR_TEXT.LOADING}</EmptyData>;
  }

  if (errorText && containerVMs.length === 0) {
    return (
      <EmptyData>
        <div>{errorText}</div>
        {typeof onRetry === "function" && (
          <RetryButton type="button" onClick={onRetry}>
            {ENV_MONITOR_TEXT.RETRY}
          </RetryButton>
        )}
      </EmptyData>
    );
  }

  if (containerVMs.length === 0) {
    return <EmptyData>{ENV_MONITOR_TEXT.EMPTY}</EmptyData>;
  }

  const stationText = normalizeText(stationTitle, ENV_MONITOR_TEXT.DEFAULT_STATION_NAME);
  const stationCenter = layout.canvasWidth / 2;

  return (
    <DiagramViewport>
      <DiagramScroller>
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
