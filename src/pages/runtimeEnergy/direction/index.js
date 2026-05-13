import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Form, Radio, message } from "antd";
import {
  DatabaseOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

import { Editapi, EnergyFlowRuntime } from "@api/api";
import Ichart from "@com/useEcharts/Ichart";
import Pagecount from "@com/pagecontent";
import { getTime, isObject } from "@com/usehandler";
import {
  selectOneLevel,
  selectOneLevelDefaultId,
  selectProjectId,
} from "@redux/systemconfig.js";

import {
  ChartCard,
  ChartHeader,
  DirectionLayout,
  EmptyChartState,
  FlowShell,
  RankBoard,
  RankBoardHeader,
  RankChartPanel,
  RankChartShell,
  RankLayout,
  RankList,
  RankListItem,
  MetricCard,
  MetricGrid,
} from "./style";
import rank1Icon from "./icon/rank-1.png";
import rank2Icon from "./icon/rank-2.png";
import rank3Icon from "./icon/rank-3.png";
import rank4Icon from "./icon/rank-4.svg";
import rank5Icon from "./icon/rank-5.svg";
import rank6Icon from "./icon/rank-6.svg";
import rank7Icon from "./icon/rank-7.svg";
import rank8Icon from "./icon/rank-8.svg";
import rank9Icon from "./icon/rank-9.svg";
import metricInputIcon from "./icon/metric-input.png";
import metricUsefulIcon from "./icon/metric-useful.png";
import metricLossIcon from "./icon/metric-loss.png";
import metricRateIcon from "./icon/metric-rate.png";

const { QueryConsumeRankByDevice, QueryFlowByEnergyType } = EnergyFlowRuntime;
const DATE_OPTIONS = [
  { value: 1, label: "日" },
  { value: 2, label: "月" },
  { value: 3, label: "年" },
];

const PICKER_MAP = {
  1: "date",
  2: "month",
  3: "year",
};

const DATE_FORMAT_MAP = {
  1: "YYYY-MM-DD",
  2: "YYYY-MM",
  3: "YYYY",
};

const DEFAULT_METRICS = {
  inputTotal: 0,
  usefulTotal: 0,
  lossTotal: 0,
  lossRate: 0,
};

const DEFAULT_RANKING = {
  leaderboardCount: 5,
  rankCount: 5,
  consumeRank: [],
};

const USE_MOCK_DATA = true;
const MOCK_FLOW_LINKS = {
  1: [
    { source: "电力输入", target: "动力负荷", value: 6900 },
    { source: "动力负荷", target: "设备名称001", value: 1850 },
    { source: "动力负荷", target: "设备名称002", value: 1680 },
    { source: "动力负荷", target: "设备名称003", value: 1560 },
    { source: "动力负荷", target: "设备名称004", value: 1380 },
    { source: "动力负荷", target: "设备名称005", value: 1080 },
    { source: "动力负荷", target: "设备名称006", value: 820 },
    { source: "动力负荷", target: "设备名称007", value: 530 },
  ],
  2: [
    { source: "天然气输入", target: "锅炉转化", value: 6900 },
    { source: "锅炉转化", target: "设备名称001", value: 1850 },
    { source: "锅炉转化", target: "设备名称002", value: 1680 },
    { source: "锅炉转化", target: "设备名称003", value: 1560 },
    { source: "锅炉转化", target: "设备名称004", value: 1380 },
    { source: "锅炉转化", target: "设备名称005", value: 1080 },
    { source: "锅炉转化", target: "设备名称006", value: 820 },
    { source: "锅炉转化", target: "设备名称007", value: 530 },
  ],
  3: [
    { source: "供水输入", target: "用水分配", value: 6900 },
    { source: "用水分配", target: "设备名称001", value: 1850 },
    { source: "用水分配", target: "设备名称002", value: 1680 },
    { source: "用水分配", target: "设备名称003", value: 1560 },
    { source: "用水分配", target: "设备名称004", value: 1380 },
    { source: "用水分配", target: "设备名称005", value: 1080 },
    { source: "用水分配", target: "设备名称006", value: 820 },
    { source: "用水分配", target: "设备名称007", value: 530 },
  ],
};

const MOCK_METRICS = {
  inputTotal: 6900,
  usefulTotal: 6900,
  lossTotal: 6900,
  lossRate: 69,
};

const MOCK_RANKING = {
  leaderboardCount: 9,
  rankCount: 12,
  consumeRank: [
    { rank: 1, name: "设备名称001", value: 19000, percent: "25.12%", icon: rank1Icon },
    { rank: 2, name: "设备名称002", value: 16800, percent: "25.12%", icon: rank2Icon },
    { rank: 3, name: "设备名称003", value: 15600, percent: "25.12%", icon: rank3Icon },
    { rank: 4, name: "设备名称004", value: 14800, percent: "25.12%", icon: rank4Icon },
    { rank: 5, name: "设备名称005", value: 13200, percent: "25.12%", icon: rank5Icon },
    { rank: 6, name: "设备名称006", value: 12100, percent: "25.12%", icon: rank6Icon },
    { rank: 7, name: "设备名称007", value: 11800, percent: "25.12%", icon: rank7Icon },
    { rank: 8, name: "设备名称008", value: 11000, percent: "25.12%", icon: rank8Icon },
    { rank: 9, name: "设备名称009", value: 8200, percent: "25.12%", icon: rank9Icon },
    { rank: 10, name: "设备名称010", value: 6100, percent: "25.12%" },
    { rank: 11, name: "设备名称011", value: 4300, percent: "25.12%" },
    { rank: 12, name: "设备名称012", value: 2100, percent: "25.12%" },
  ],
};

const getEmptyMetrics = () => ({ ...DEFAULT_METRICS });
const getEmptyRanking = () => ({ ...DEFAULT_RANKING, consumeRank: [] });
const getMockLinks = (energyType) =>
  normalizeLinks(MOCK_FLOW_LINKS[energyType] || MOCK_FLOW_LINKS[1]);
const getMockMetrics = () => ({ ...MOCK_METRICS });
const getMockRanking = () => ({
  ...MOCK_RANKING,
  consumeRank: MOCK_RANKING.consumeRank.map((item) => ({ ...item })),
});

const metricItems = [
  {
    key: "inputTotal",
    title: "能源输入总量",
    icon: metricInputIcon,
    tone: "blue",
  },
  {
    key: "usefulTotal",
    title: "有效利用能源",
    icon: metricUsefulIcon,
    tone: "green",
  },
  {
    key: "lossTotal",
    title: "能源损失总量",
    icon: metricLossIcon,
    tone: "orange",
  },
  {
    key: "lossRate",
    title: "综合能源利用率",
    icon: metricRateIcon,
    tone: "cyan",
    suffix: "%",
  },
];

const palette = ["#2E6BE6", "#37BFA7", "#F37B4A", "#5B8FF9", "#7B61FF", "#F2B84B"];

const normalizeNumber = (value) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
};

const formatValue = (value, precision = 2) => {
  const number = normalizeNumber(value);
  if (Number.isInteger(number)) return number.toLocaleString("zh-CN");

  return number.toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  });
};

const toDateValue = (date) => {
  if (dayjs.isDayjs(date)) return date;
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed : dayjs();
};

const normalizeLinks = (links = []) => {
  if (!Array.isArray(links)) return [];
  return links
    .map((item) => ({
      source: item?.source,
      target: item?.target,
      value: normalizeNumber(item?.value),
    }))
    .filter((item) => item.source && item.target && item.value > 0);
};

const buildSummary = (links) => {
  const sources = new Set(links.map((item) => item.source));
  const targets = new Set(links.map((item) => item.target));

  const inputTotal = links
    .filter((item) => !targets.has(item.source))
    .reduce((total, item) => total + item.value, 0);
  const usefulTotal = links
    .filter((item) => !sources.has(item.target))
    .reduce((total, item) => total + item.value, 0);
  const lossTotal = Math.max(inputTotal - usefulTotal, 0);
  const lossRate = inputTotal > 0 ? (lossTotal / inputTotal) * 100 : 0;

  return {
    inputTotal,
    usefulTotal,
    lossTotal,
    lossRate,
  };
};

const buildChartOption = (links) => {
  const nodeNames = Array.from(
    new Set(links.flatMap((item) => [item.source, item.target])),
  );
  const targetSet = new Set(links.map((item) => item.target));
  const sourceSet = new Set(links.map((item) => item.source));

  return {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      borderWidth: 0,
      backgroundColor: "rgba(20, 35, 64, 0.88)",
      textStyle: {
        color: "#fff",
      },
      formatter: (params) => {
        if (params.dataType === "edge") {
          return `${params.data.source} -> ${params.data.target}<br/>${formatValue(params.data.value)}`;
        }
        return params.name;
      },
    },
    animationDuration: 650,
    series: [
      {
        type: "sankey",
        layout: "none",
        left: 18,
        right: 86,
        top: 16,
        bottom: 14,
        nodeWidth: 12,
        nodeGap: 18,
        nodeAlign: "left",
        draggable: false,
        emphasis: {
          focus: "adjacency",
        },
        label: {
          color: "#303133",
          fontSize: 12,
          lineHeight: 16,
          distance: 6,
        },
        itemStyle: {
          borderWidth: 0,
          borderRadius: 2,
        },
        lineStyle: {
          color: "source",
          curveness: 0.48,
          opacity: 0.28,
        },
        data: nodeNames.map((name, index) => {
          const isInput = !targetSet.has(name);
          const isTerminal = !sourceSet.has(name);
          return {
            name,
            itemStyle: {
              color: isInput
                ? "#2E6BE6"
                : isTerminal
                  ? "#F2B84B"
                  : palette[index % palette.length],
            },
          };
        }),
        links: links.map((item) => ({
          ...item,
          value: Number(item.value.toFixed(4)),
        })),
      },
    ],
    type: 5,
  };
};

const getDefaultEnergyType = (energyTypes, current) => {
  if (Number.isInteger(Number.parseInt(current))) return Number.parseInt(current);
  return energyTypes?.[0]?.type ?? 1;
};

const buildRankingChartOption = (ranking) => {
  const source = ranking.consumeRank.slice(0, ranking.rankCount);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params = []) => {
        const item = params[0];
        if (!item) return "";
        return `${item.name}<br/>${formatValue(item.value)}`;
      },
    },
    grid: {
      left: "12px",
      right: "24px",
      top: "22px",
      bottom: "16px",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      data: source.map((item) => item.name),
      axisLabel: {
        color: "#8a97ab",
      },
      axisLine: {
        lineStyle: {
          color: "#cfd8ea",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#e2eaf6",
          type: "dashed",
        },
      },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: source.map((item) => item.name),
      axisLabel: {
        color: "#5f6b85",
        width: 120,
        overflow: "truncate",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        type: "bar",
        name: "能耗",
        data: source.map((item) => item.value),
        barWidth: 14,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(47, 103, 239, 0.08)",
          borderRadius: 999,
        },
        label: {
          show: true,
          position: "right",
          color: "#5f6b85",
          fontSize: 12,
          formatter: ({ value }) => formatValue(value),
        },
        itemStyle: {
          borderRadius: 999,
          color: {
            type: "linear",
            x: 1,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#7397ff" },
              { offset: 1, color: "#4a6ff0" },
            ],
          },
        },
      },
    ],
    type: 2,
  };
};

export default function Index() {
  const outlet = useOutletContext() || {};
  const { exparams = {}, setCustview } = outlet;
  const projectIdFromStore = useSelector(selectProjectId);
  const levelone = useSelector(selectOneLevel);
  const defaultAreaId = useSelector(selectOneLevelDefaultId);

  const projectId = exparams.projectId ?? projectIdFromStore;
  const areaId = exparams.areaId ?? defaultAreaId;
  const energytype = getDefaultEnergyType([], exparams.energytype);
  const rawDateType = Number.parseInt(exparams.type ?? 1);
  const dateType = energytype > 1 && rawDateType === 1 ? 2 : rawDateType;
  const dateValue = toDateValue(exparams.date);

  const [energyTypes, setEnergyTypes] = useState([]);
  const [localEnergyType, setLocalEnergyType] = useState(energytype);
  const [localDateType, setLocalDateType] = useState(dateType);
  const [localDate, setLocalDate] = useState(dateValue);
  const [currentView, setCurrentView] = useState(exparams.viewType === "b" ? "ranking" : "flow");
  const [links, setLinks] = useState([]);
  const [metrics, setMetrics] = useState(getEmptyMetrics);
  const [ranking, setRanking] = useState(getEmptyRanking);
  const [loading, setLoading] = useState(false);
  const [rankingLoading, setRankingLoading] = useState(false);

  const energyTypeValue = exparams.energytype ?? localEnergyType;
  const effectiveEnergyType = Number.parseInt(energyTypeValue);
  const effectiveDateType =
    effectiveEnergyType > 1 && Number.parseInt(exparams.type ?? localDateType) === 1
      ? 2
      : Number.parseInt(exparams.type ?? localDateType);
  const effectiveDate = exparams.date ?? localDate;

  const areaIds = useMemo(() => {
    const realIds = levelone.filter((item) => item.id !== 0).map((item) => item.id);
    if (!realIds.length) return [];
    if (Number.parseInt(areaId) === 0 || !Number.isInteger(Number.parseInt(areaId))) {
      return [realIds[0]];
    }
    return [Number.parseInt(areaId)];
  }, [areaId, levelone]);

  const dateOptions = useMemo(
    () =>
      effectiveEnergyType > 1
        ? DATE_OPTIONS.filter((item) => item.value !== 1)
        : DATE_OPTIONS,
    [effectiveEnergyType],
  );

  const chartOption = useMemo(() => buildChartOption(links), [links]);
  const rankingChartOption = useMemo(() => buildRankingChartOption(ranking), [ranking]);

  const fetchEnergyTypes = useCallback(async () => {
    if (!Number.isInteger(Number.parseInt(projectId))) return;
    try {
      const { success, data, errMsg } = await Editapi.QueryEnergyType(projectId);
      if (!success) {
        message.warning(errMsg || "能源类型获取失败");
        return;
      }
      setEnergyTypes(Array.isArray(data) ? data : []);
      const nextType = getDefaultEnergyType(data, effectiveEnergyType);
      setLocalEnergyType(nextType);
    } catch (error) {
      message.error("能源类型获取失败");
    }
  }, [effectiveEnergyType, projectId]);

  const fetchFlowData = useCallback(async () => {
    if (USE_MOCK_DATA) {
      const mockLinks = getMockLinks(effectiveEnergyType);
      setLinks(mockLinks);
      setMetrics(getMockMetrics());
      return;
    }

    const valid =
      Number.isInteger(Number.parseInt(projectId)) &&
      Number.isInteger(Number.parseInt(effectiveEnergyType)) &&
      Number.isInteger(Number.parseInt(effectiveDateType)) &&
      areaIds.length > 0 &&
      effectiveDate;

    if (!valid) return;

    const params = {
      projectId,
      energyType: effectiveEnergyType,
      type: effectiveDateType,
      date: getTime(toDateValue(effectiveDate), effectiveDateType),
    };

    setLoading(true);
    try {
      const { success, data, errMsg } = await QueryFlowByEnergyType(params, areaIds);
      if (!success) {
        setLinks([]);
        setMetrics(getEmptyMetrics());
        message.warning(errMsg || "能源流向数据获取失败");
        return;
      }

      const nextLinks = normalizeLinks(isObject(data) ? data.link : []);
      if (nextLinks.length > 0) {
        setLinks(nextLinks);
        setMetrics(buildSummary(nextLinks));
        return;
      }

      setLinks([]);
      setMetrics(getEmptyMetrics());
    } catch (error) {
      setLinks([]);
      setMetrics(getEmptyMetrics());
      message.warning("能源流向数据获取失败");
    } finally {
      setLoading(false);
    }
  }, [areaIds, effectiveDate, effectiveDateType, effectiveEnergyType, projectId]);

  const fetchRankingData = useCallback(async () => {
    if (USE_MOCK_DATA) {
      setRankingLoading(false);
      setRanking(getMockRanking());
      return;
    }

    const valid =
      Number.isInteger(Number.parseInt(projectId)) &&
      Number.isInteger(Number.parseInt(effectiveEnergyType)) &&
      Number.isInteger(Number.parseInt(effectiveDateType)) &&
      effectiveDate;

    if (!valid) return;

    const params = {
      projectId,
      meterType: effectiveEnergyType,
      dayMonthYear: effectiveDateType,
      date: getTime(toDateValue(effectiveDate), effectiveDateType),
    };

    setRankingLoading(true);
    try {
      const { success, data, errMsg } = await QueryConsumeRankByDevice(params);
      if (!success) {
        setRanking(getEmptyRanking());
        message.warning(errMsg || "能耗排名数据获取失败");
        return;
      }

      const consumeRank = Array.isArray(data?.consumeRank)
        ? data.consumeRank.map((item) => ({
            name: item?.name || "-",
            value: normalizeNumber(item?.value),
            percent: item?.percent || "--",
          }))
        : [];

      if (consumeRank.length) {
        setRanking({
          leaderboardCount: Number.parseInt(data?.leaderboardCount) || 5,
          rankCount: Number.parseInt(data?.rankCount) || consumeRank.length,
          consumeRank,
        });
        return;
      }

      setRanking(getEmptyRanking());
    } catch (error) {
      setRanking(getEmptyRanking());
      message.warning("能耗排名数据获取失败");
    } finally {
      setRankingLoading(false);
    }
  }, [effectiveDate, effectiveDateType, effectiveEnergyType, projectId]);

  useEffect(() => {
    fetchEnergyTypes();
  }, [fetchEnergyTypes]);

  useEffect(() => {
    if (effectiveEnergyType > 1 && localDateType === 1) {
      setLocalDateType(2);
    }
  }, [effectiveEnergyType, localDateType]);

  useEffect(() => {
    setCurrentView(exparams.viewType === "b" ? "ranking" : "flow");
  }, [exparams.viewType]);

  useEffect(() => {
    fetchFlowData();
  }, [fetchFlowData]);

  useEffect(() => {
    fetchRankingData();
  }, [fetchRankingData]);

  useEffect(() => {
    const CustView = () => {
      const form = Form.useFormInstance();

      useEffect(() => {
        form?.setFieldValue("viewType", exparams.viewType ?? "a");
      }, [form, exparams.viewType]);

      return (
        <Form.Item name="viewType" initialValue="a" style={{ marginBottom: 0 }}>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio.Button value="a">能源流向</Radio.Button>
            <Radio.Button value="b">能耗排名</Radio.Button>
          </Radio.Group>
        </Form.Item>
      );
    };

    setCustview?.(<CustView />);
    return () => setCustview?.(undefined);
  }, [exparams.viewType, setCustview]);

  return (
    <Pagecount pd="0px" bgcolor="transparent">
      <DirectionLayout>
        <MetricGrid>
          {metricItems.map((item) => (
            <MetricCard key={item.key} tone={item.tone}>
              <div className="metricIcon">
                <img src={item.icon} alt={item.title} />
              </div>
              <div className="metricContent">
                <span>{item.title}</span>
                <strong>
                  {formatValue(metrics[item.key])}
                  {item.suffix && <em>{item.suffix}</em>}
                </strong>
              </div>
            </MetricCard>
          ))}
        </MetricGrid>

        {currentView === "flow" ? (
          <>
            <ChartCard>
              <ChartHeader>
                <h3>能流分布</h3>
              </ChartHeader>
              <FlowShell>
                {links.length > 0 ? (
                  <Ichart custoption={chartOption} />
                ) : (
                  <EmptyChartState>
                    <div className="emptyInner">
                      {loading ? <DatabaseOutlined style={{ fontSize: 36 }} /> : <FileSearchOutlined style={{ fontSize: 36 }} />}
                      <strong>{loading ? "正在加载流向数据" : "当前筛选条件暂无真实流向数据"}</strong>
                      <div className="emptyText">
                        {loading ? "请稍候" : "可调整区域、能源类型或日期后重试"}
                      </div>
                    </div>
                  </EmptyChartState>
                )}
              </FlowShell>
            </ChartCard>
          </>
        ) : (
          <RankLayout>
            <ChartCard>
              <ChartHeader>
                <h3>能耗排名</h3>
              </ChartHeader>
              <RankChartShell>
                <RankChartPanel>
                  {ranking.consumeRank.length > 0 ? (
                    <Ichart {...rankingChartOption} />
                  ) : (
                    <EmptyChartState>
                      <div className="emptyInner">
                        {rankingLoading ? <DatabaseOutlined style={{ fontSize: 36 }} /> : <FileSearchOutlined style={{ fontSize: 36 }} />}
                        <strong>{rankingLoading ? "正在加载排名数据" : "当前筛选条件暂无真实排名数据"}</strong>
                        <div className="emptyText">
                          {rankingLoading ? "请稍候" : "可调整区域、能源类型或日期后重试"}
                        </div>
                      </div>
                    </EmptyChartState>
                  )}
                </RankChartPanel>

                <RankBoard>
                  <RankBoardHeader>
                    <h4>能耗排名</h4>
                  </RankBoardHeader>
                  <RankList>
                    {ranking.consumeRank.slice(0, ranking.leaderboardCount).length > 0 ? (
                      ranking.consumeRank
                        .slice(0, ranking.leaderboardCount)
                        .map((item, index) => (
                          <RankListItem key={`${item.name}-${index}`} rank={index + 1}>
                            <img className="rankIcon" src={item.icon} alt={`${item.name}-rank`} />
                            <div className="rankMain">
                              <strong>{item.name}</strong>
                              <span>{formatValue(item.value)} kWh</span>
                            </div>
                            <div className="rankMeta">
                              <strong className="rankValue">{formatValue(item.value)} kWh</strong>
                              <div className="rankPercent">{item.percent}</div>
                            </div>
                          </RankListItem>
                        ))
                    ) : (
                      <EmptyChartState>
                        <div className="emptyInner">
                          <FileSearchOutlined style={{ fontSize: 36 }} />
                          <strong>暂无排行榜数据</strong>
                        </div>
                      </EmptyChartState>
                    )}
                  </RankList>
                </RankBoard>
              </RankChartShell>
            </ChartCard>
          </RankLayout>
        )}
      </DirectionLayout>
    </Pagecount>
  );
}
