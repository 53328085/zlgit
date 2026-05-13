import dayjs from "dayjs";

import rank1Icon from "../direction/icon/rank-1.png";
import rank2Icon from "../direction/icon/rank-2.png";
import rank3Icon from "../direction/icon/rank-3.png";
import rank4Icon from "../direction/icon/rank-4.svg";
import rank5Icon from "../direction/icon/rank-5.svg";
import rank6Icon from "../direction/icon/rank-6.svg";
import rank7Icon from "../direction/icon/rank-7.svg";
import rank8Icon from "../direction/icon/rank-8.svg";
import rank9Icon from "../direction/icon/rank-9.svg";
import excellentIcon from "./icon/excellent.png";
import goodIcon from "./icon/good.png";
import overBudgetIcon from "./icon/over-budget.png";

const rankIcons = [
  rank1Icon,
  rank2Icon,
  rank3Icon,
  rank4Icon,
  rank5Icon,
  rank6Icon,
  rank7Icon,
  rank8Icon,
  rank9Icon,
];

const tableStatusIcons = {
  excellent: excellentIcon,
  good: goodIcon,
  danger: overBudgetIcon,
};

const statusMetaMap = {
  qualified: {
    key: "qualified",
    text: "合格",
    tone: "qualified",
  },
  good: {
    key: "good",
    text: "良好",
    tone: "good",
  },
  pending: {
    key: "pending",
    text: "待改进",
    tone: "pending",
  },
};

const scopeFactorMap = {
  1: 0.92,
  2: 1,
  3: 1.14,
  4: 1.08,
};

const fallbackDate = dayjs("2026-08-01");

const rankingUnits = [
  "生产厂区A",
  "能耗车间1",
  "能耗车间2",
  "能耗车间5",
];

const tableUnits = [
  "研发楼",
  "研发楼",
  "研发楼",
  "研发楼",
];

const normalizeTreeValue = (treeId) => {
  if (Array.isArray(treeId)) return treeId[0];
  if (treeId && typeof treeId === "object") {
    return treeId.id || treeId.areaId || treeId.key || treeId.value;
  }
  return treeId;
};

const getDateSeed = ({ publictype, publicdate, publicrangedate }) => {
  if (publictype === 4 && Array.isArray(publicrangedate)) {
    const start = publicrangedate?.[0];
    const end = publicrangedate?.[1];
    return `${start?.format?.("YYYYMMDD") || "range"}-${end?.format?.("YYYYMMDD") || "range"}`;
  }

  const dateValue = dayjs.isDayjs(publicdate)
    ? publicdate
    : dayjs(publicdate || fallbackDate);

  return dateValue.isValid()
    ? `${publictype || 2}-${dateValue.format("YYYYMMDD")}`
    : "2-20260801";
};

const stringSeed = (value) =>
  String(value || "root")
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

const getDateLabels = ({ publictype, publicdate }) => {
  const dateValue = dayjs.isDayjs(publicdate)
    ? publicdate
    : dayjs(publicdate || fallbackDate);

  if (publictype === 1) {
    return ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  }

  if (publictype === 3) {
    return Array.from({ length: 7 }, (_, index) => `${dateValue.year() - 6 + index}年`);
  }

  return Array.from({ length: 7 }, (_, index) => `${index + 1}月`);
};

const formatNumber = (value, digits = 1) =>
  Number(value).toLocaleString("zh-CN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const buildSummaryCards = (scopeFactor, treeFactor) => {
  const rate = 78.5 + (scopeFactor - 1) * 1.4 + treeFactor * 0.6;
  const betterCount = Math.max(2, Math.round(2 + treeFactor * 0.4));
  const pendingCount = Math.max(10, Math.round(13 + (scopeFactor - 1) * 4 + treeFactor * 1.2));

  return [
    {
      key: "rate",
      title: "对标达成率",
      value: `${formatNumber(rate)}%`,
      compare: "较上周期",
      rate: `-${formatNumber(Math.abs(79.2 - rate), 1)}%`,
      trend: "down",
      tone: "blue",
    },
    {
      key: "better",
      title: "优势单元",
      value: `${betterCount}`,
      unit: "个",
      compare: "较上周期",
      rate: `+${formatNumber(0.9 + treeFactor * 0.1, 1)}%`,
      trend: "up",
      tone: "green",
    },
    {
      key: "pending",
      title: "需改进单元",
      value: `${pendingCount}`,
      unit: "个",
      compare: "较上周期",
      rate: `-${formatNumber(0.7 - treeFactor * 0.1, 1)}%`,
      trend: "down",
      tone: "orange",
    },
  ];
};

const buildRankingItems = (scopeFactor, treeSeed) =>
  rankingUnits.map((name, index) => {
    const rawValue = 25.12 + (scopeFactor - 1) * 1.5 - index * 0.38 + (treeSeed % 3) * 0.06;
    const status =
      index < 3 ? statusMetaMap.qualified : statusMetaMap.pending;

    return {
      id: `${name}-${index}`,
      name,
      benchmarkValue: formatNumber(rawValue, 2),
      benchmarkUnit: "能效数据",
      status,
      percent: `${formatNumber(rawValue, 2)}%`,
      icon: rankIcons[index],
    };
  });

const buildTrendSource = (labels, scopeFactor, treeFactor) => {
  const months = labels.slice(0, 7);
  const industry = months.map((_, index) =>
    Math.round(280 - index * 35 + (scopeFactor - 1) * 20 + treeFactor * 10),
  );
  const actual = months.map((_, index) =>
    Math.round(400 - index * 45 + (scopeFactor - 1) * 18 + treeFactor * 8),
  );

  return [["product", ...months], ["行业对标值", ...industry], ["实际能效值", ...actual]];
};

const buildTableRows = (scopeFactor, treeFactor, scopeKey) =>
  tableUnits.map((name, index) => {
    const industryValues = [2850, 2850, 2850, 2850];
    const actualValues = [
      Math.round(12850 + (scopeFactor - 1) * 1200 + treeFactor * 300),
      Math.round(2850 + (scopeFactor - 1) * 400 + treeFactor * 120),
      Math.round(2850 + (scopeFactor - 1) * 900 + treeFactor * 220),
      Math.round(2850 + (scopeFactor - 1) * 600 + treeFactor * 160),
    ];
    const deviationValues = [
      -100 + (scopeFactor - 1) * 8 - treeFactor * 5,
      0,
      50 + (scopeFactor - 1) * 8 + treeFactor * 5,
      12 + (scopeFactor - 1) * 5 + treeFactor * 3,
    ];
    const statusList = [
      {
        ...statusMetaMap.qualified,
        text: "优秀！",
        tone: "excellent",
        icon: tableStatusIcons.excellent,
      },
      {
        ...statusMetaMap.good,
        text: "良好",
        tone: "good",
        icon: tableStatusIcons.good,
      },
      {
        ...statusMetaMap.pending,
        text: "超预算",
        tone: "danger",
        icon: tableStatusIcons.danger,
      },
      {
        ...statusMetaMap.pending,
        text: "超预算",
        tone: "danger",
        icon: tableStatusIcons.danger,
      },
    ];

    return {
      id: `${scopeKey}-${index}`,
      energyUnit: name,
      industryBenchmark: industryValues[index].toLocaleString("zh-CN"),
      actualBenchmark: actualValues[index].toLocaleString("zh-CN"),
      deviation: `${deviationValues[index] > 0 ? "+" : ""}${formatNumber(deviationValues[index], 2)}%`,
      status: statusList[index],
    };
  });

export const getEfficiencyBenchmarkMock = ({
  publictype = 2,
  publicdate,
  publicrangedate,
  treeId,
  line = 0,
}) => {
  const normalizedType = Number(publictype) || 2;
  const scopeKey = getDateSeed({ publictype: normalizedType, publicdate, publicrangedate });
  const treeValue = normalizeTreeValue(treeId) || "root";
  const treeSeed = stringSeed(treeValue) + Number(line || 0) * 13;
  const treeFactor = (treeSeed % 7) * 0.08;
  const scopeFactor = scopeFactorMap[normalizedType] || 1;
  const labels = getDateLabels({ publictype: normalizedType, publicdate });

  return {
    scopeKey,
    summaryCards: buildSummaryCards(scopeFactor, treeFactor),
    rankingItems: buildRankingItems(scopeFactor, treeSeed),
    trendSource: buildTrendSource(labels, scopeFactor, treeFactor),
    tableRows: buildTableRows(scopeFactor, treeFactor, scopeKey),
  };
};
