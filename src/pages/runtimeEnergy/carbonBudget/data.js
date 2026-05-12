import dayjs from "dayjs";

import excellentIcon from "../efficiencyCompare/icon/excellent.png";
import goodIcon from "../efficiencyCompare/icon/good.png";
import overBudgetIcon from "../efficiencyCompare/icon/over-budget.png";

const tableStatusIcons = {
  excellent: excellentIcon,
  good: goodIcon,
  danger: overBudgetIcon,
};

const fallbackDate = dayjs("2024-08-01");

const scopeFactorMap = {
  1: 0.88,
  2: 1,
  3: 1.16,
  4: 0.96,
};

const budgetUnits = ["Q1", "Q2", "Q3", "Q1"];
const tableUnits = ["研发楼", "研发楼", "研发楼", "研发楼"];

const normalizeTreeValue = (treeId) => {
  if (Array.isArray(treeId)) return treeId[0];
  if (treeId && typeof treeId === "object") {
    return treeId.id || treeId.areaId || treeId.key || treeId.value;
  }
  return treeId;
};

const stringSeed = (value) =>
  String(value || "root")
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

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
    : "2-20240801";
};

const getDateLabels = ({ publictype, publicdate }) => {
  const dateValue = dayjs.isDayjs(publicdate)
    ? publicdate
    : dayjs(publicdate || fallbackDate);

  if (publictype === 1) {
    return ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  }

  if (publictype === 3) {
    return Array.from({ length: 9 }, (_, index) => `${dateValue.year() - 8 + index}年`);
  }

  return Array.from({ length: 12 }, (_, index) => `${index + 1}月`);
};

const formatNumber = (value, digits = 0) =>
  Number(value).toLocaleString("zh-CN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const formatPercent = (value, digits = 2) =>
  `${value > 0 ? "+" : ""}${Number(value).toFixed(digits)}%`;

const buildSummaryCards = (scopeFactor, treeFactor) => {
  const budget = Math.round(87500 * scopeFactor + treeFactor * 1200);
  const actual = Math.round(budget * (0.525 + treeFactor * 0.01));
  const remain = budget - actual;

  return [
    {
      key: "budget",
      title: "年度预算",
      unit: "tce(标准煤)",
      value: formatNumber(budget),
      compare: "较上月",
      rate: "-6.08%",
      trend: "down",
      tone: "blue",
    },
    {
      key: "actual",
      title: "已使用预算",
      unit: "tce(52.7%)",
      value: formatNumber(actual),
      compare: "低于预期",
      rate: "2.3%",
      trend: "down",
      tone: "green",
    },
    {
      key: "remain",
      title: "剩余预算",
      unit: "tce(52.7%)",
      value: formatNumber(remain),
      compare: "较上月",
      rate: "-6.08%",
      trend: "up",
      tone: "blue",
    },
    {
      key: "rate",
      title: "预算达成率",
      unit: "%",
      value: `${formatNumber((actual / budget) * 100, 2)}%`,
      compare: "较上期",
      rate: "+1.2%",
      trend: "up",
      tone: "orange",
    },
  ];
};

const buildBudgetItems = (scopeFactor, treeFactor) =>
  budgetUnits.map((name, index) => {
    const budget = 24300 * scopeFactor;
    const ratios = [0.992, 1.038, 0.62, 0];
    const actual = index === 3 ? 0 : budget * ratios[index];
    const variance = index === 3 ? 0 : ((actual - budget) / budget) * 100;
    const status = ["已完成", "已完成", "进行中", "计划中"][index];
    const progressColor = ["#ff5d2f", "#11c777", "#38bdf8", "#cfd5df"][index];

    return {
      key: name,
      name,
      budget,
      actual,
      actualText: index === 3 ? "—" : formatNumber(budget),
      variance,
      varianceText: index === 3 ? "" : formatPercent(variance, 1),
      status,
      progressColor,
      percent: Math.round(Math.min(actual / budget, 1) * 100),
    };
  });

const buildTrendSource = (labels, scopeFactor, treeFactor) => {
  const budgetTemplate = [23, 18, 21, 20, 24.5, 19.2, 23.4, 22, 20.8, 21.3, 20.2, 19.1];
  const actualTemplate = [15, 18.1, 16.5, 20, 18.5, 15.6, 19.7, 18, 20.8, 18.2, 14.2, 19.6];
  const budget = labels.map((_, index) =>
    Number((budgetTemplate[index] + (scopeFactor - 1) * 1.4 + treeFactor * 0.2).toFixed(1)),
  );
  const actual = labels.map((_, index) =>
    Number((actualTemplate[index] + (scopeFactor - 1) * 1.1 + treeFactor * 0.2).toFixed(1)),
  );

  return [["product", ...labels], ["预算目标", ...budget], ["实际消耗", ...actual]];
};

const buildTableRows = (scopeFactor, treeFactor, scopeKey) =>
  tableUnits.map((name, index) => {
    if (!name) {
      return {
        id: `${scopeKey}-empty-${index}`,
        energyUnit: "",
        budgetCarbon: "",
        actualCarbon: "",
        variance: "",
        status: null,
      };
    }

    const budgetValues = [2850, 2850, "", ""];
    const actualValues = [12850, 2850, "", ""];
    const varianceValues = ["-100(-7.70%)", "0(0.00%)", "+50(1.80%)", ""];
    const statusList = ["优秀！", "良好", "超预算", ""];
    const budget = budgetValues[index];
    const actual = actualValues[index];
    const variance = varianceValues[index];
    const status = statusList[index];

    return {
      id: `${scopeKey}-${index}`,
      energyUnit: name,
      budgetCarbon: typeof budget === "number" ? formatNumber(budget) : "",
      actualCarbon: typeof actual === "number" ? formatNumber(actual) : "",
      variance,
      status: status
        ? {
            key: {
              "优秀！": "excellent",
              良好: "good",
              超预算: "danger",
            }[status],
            text: status,
            icon: tableStatusIcons[
              {
                "优秀！": "excellent",
                良好: "good",
                超预算: "danger",
              }[status]
            ],
            tone: {
              "优秀！": "excellent",
              良好: "good",
              超预算: "danger",
            }[status],
          }
        : null,
    };
  });

export const getCarbonBudgetMock = ({
  publictype = 2,
  publicdate,
  publicrangedate,
  treeId,
  line = 0,
}) => {
  const normalizedType = Number(publictype) || 2;
  const scopeKey = getDateSeed({ publictype: normalizedType, publicdate, publicrangedate });
  const treeValue = normalizeTreeValue(treeId) || "root";
  const treeSeed = stringSeed(treeValue) + Number(line || 0) * 17;
  const treeFactor = (treeSeed % 7) * 0.08;
  const scopeFactor = scopeFactorMap[normalizedType] || 1;
  const labels = getDateLabels({ publictype: normalizedType, publicdate });

  return {
    scopeKey,
    summaryCards: buildSummaryCards(scopeFactor, treeFactor),
    budgetItems: buildBudgetItems(scopeFactor, treeFactor),
    trendSource: buildTrendSource(labels, scopeFactor, treeFactor),
    tableRows: buildTableRows(scopeFactor, treeFactor, scopeKey),
  };
};
