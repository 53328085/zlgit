import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import { DatePicker, Progress } from "antd";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";

import Pagecount from "@com/pagecontent";
import UserTree from "@com/useTree";
import Ichart from "@com/useEcharts/Ichart";
import UseProTable from "@com/useTable/proTable";
import { ProExportExcel } from "@com/useButton";

import { getCarbonBudgetMock } from "./data";
import {
  BudgetList,
  Contentbox,
  Panel,
  StatusCell,
  StatusTag,
  SummaryCard,
  VarianceText,
} from "./style";
import annualBudgetIcon from "./icon/annual-budget.png";
import budgetAchievementRateIcon from "./icon/budget-achievement-rate.png";
import remainingBudgetIcon from "./icon/remaining-budget.png";
import usedBudgetIcon from "./icon/used-budget.png";

const PAGE_SIZE = 10;

const cardIconMap = {
  budget: annualBudgetIcon,
  actual: usedBudgetIcon,
  remain: remainingBudgetIcon,
  rate: budgetAchievementRateIcon,
};

export default function Index() {
  const { exparams = {} } = useOutletContext() || {};
  const { areaId, projectId, publictype, publicdate, publicrangedate } = exparams;
  const [treeId, setTreeId] = useState();
  const [line, setLine] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [exportYear, setExportYear] = useState(dayjs());
  const tbref = useRef();

  const mockData = useMemo(
    () =>
      getCarbonBudgetMock({
        areaId,
        projectId,
        publictype,
        publicdate,
        publicrangedate,
        treeId,
        line,
      }),
    [areaId, projectId, publictype, publicdate, publicrangedate, treeId, line],
  );

  useEffect(() => {
    setExportYear(publicdate || dayjs());
  }, [publicdate]);

  useEffect(() => {
    setPageCurrent(1);
  }, [mockData.scopeKey]);

  const chartOption = useMemo(
    () => ({
      type: 1,
      dataset: {
        source: mockData.trendSource,
      },
      grid: {
        left: 48,
        right: 20,
        top: 58,
        bottom: 32,
      },
      legend: {
        top: 16,
        right: 360,
        icon: "circle",
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 24,
        textStyle: {
          color: "#606266",
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        axisLine: {
          lineStyle: {
            color: "#E6EAF2",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#909399",
          fontSize: 11,
        },
      },
      yAxis: {
        name: "tce",
        min: 0,
        max: 30,
        interval: 10,
        nameTextStyle: {
          color: "#909399",
          fontSize: 13,
        },
        splitLine: {
          lineStyle: {
            color: "#E8EBF0",
            type: "solid",
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#909399",
          fontSize: 11,
        },
      },
      series: [
        {
          type: "line",
          seriesLayoutBy: "row",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          lineStyle: {
            width: 2,
            color: "#80E4C1",
          },
          itemStyle: {
            color: "#80E4C1",
          },
          areaStyle: {
            color: "rgba(128, 228, 193, 0.13)",
          },
        },
        {
          type: "line",
          seriesLayoutBy: "row",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          lineStyle: {
            width: 2,
            color: "#5F8CFF",
          },
          itemStyle: {
            color: "#5F8CFF",
          },
          areaStyle: {
            color: "rgba(95, 140, 255, 0.18)",
          },
        },
      ],
    }),
    [mockData.trendSource],
  );

  const columns = useMemo(
    () => [
      {
        title: "用能单元",
        dataIndex: "energyUnit",
        key: "energyUnit",
      },
      {
        title: "预算(tce)",
        dataIndex: "budgetCarbon",
        key: "budgetCarbon",
        align: "right",
      },
      {
        title: "实际使用(tce)",
        dataIndex: "actualCarbon",
        key: "actualCarbon",
        align: "right",
      },
      {
        title: "预算偏差",
        dataIndex: "variance",
        key: "variance",
        align: "right",
        render: (_, record) => (
          <VarianceText positive={String(record.variance).startsWith("+")}>
            {record.variance}
          </VarianceText>
        ),
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: (_, record) =>
          record.status ? (
            <StatusCell>
              {record.status.icon ? (
                <img src={record.status.icon} alt={record.status.key || "status"} />
              ) : null}
              <StatusTag tone={record.status.tone}>{record.status.text}</StatusTag>
            </StatusCell>
          ) : null,
      },
    ],
    [],
  );

  const currentRows = useMemo(() => {
    const startIndex = (pageCurrent - 1) * PAGE_SIZE;
    return mockData.tableRows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [mockData.tableRows, pageCurrent]);

  const toolbar = useMemo(
    () => [
      <div className="toolbarYearPicker" key="export-year">
        <DatePicker
          picker="year"
          allowClear={false}
          format="YYYY"
          value={exportYear}
          onChange={(value) => setExportYear(value || dayjs())}
        />
      </div>,
      <ProExportExcel tb={tbref} className="carbonBudgetTable" single={true} key="export" />,
    ],
    [exportYear],
  );

  return (
    <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none">
      <Contentbox data-area-id={areaId ?? ""} data-project-id={projectId ?? ""}>
        <div className="leftwrap">
          <div className="leftTitle">区域列表</div>
          <UserTree
            areaId={areaId}
            setTreeId={setTreeId}
            setLine={setLine}
            showline={false}
            showSearch={true}
            datatype={NaN}
            allselect={false}
          />
        </div>
        <div className="rightwrap">
          <div className="cards">
            {mockData.summaryCards.map((card) => {
              const TrendIcon = card.trend === "up" ? CaretUpOutlined : CaretDownOutlined;
              const cardIcon = cardIconMap[card.key] || annualBudgetIcon;

              return (
                <SummaryCard key={card.key} tone={card.tone}>
                  <div className="icon">
                    <img src={cardIcon} alt={card.title} />
                  </div>
                  <div>
                    <div className="title">
                      {card.title}
                      <span>{card.unit}</span>
                    </div>
                    <div className="value">{card.value}</div>
                    <div className="compare">
                      <span>{card.compare}</span>
                      <span className={card.trend}>
                        <TrendIcon /> {card.rate}
                      </span>
                    </div>
                  </div>
                </SummaryCard>
              );
            })}
          </div>

          <div className="chartRow">
            <Panel>
              <div className="panelTitle">
                <span>季度目标完成情况</span>
                <em>tce(吨标准煤)</em>
              </div>
              <BudgetList>
                {mockData.budgetItems.map((item) => (
                  <div className="budgetItem" key={item.key}>
                    <div className="budgetHeader">
                      <div className="budgetName">
                        <strong>{item.name}</strong>
                        <StatusTag status={item.status}>{item.status}</StatusTag>
                      </div>
                      <VarianceText positive={item.variance > 0}>{item.varianceText}</VarianceText>
                    </div>
                    <div className="budgetValueRow">
                      <span>目标： {item.budget.toLocaleString("zh-CN", { maximumFractionDigits: 0 })}</span>
                      <span>实际： {item.actualText}</span>
                    </div>
                    <Progress
                      percent={item.percent}
                      strokeColor={item.progressColor}
                      trailColor="#D7DCE6"
                      showInfo={false}
                    />
                  </div>
                ))}
              </BudgetList>
            </Panel>

            <Panel>
              <div className="panelTitle">能耗预算执行偏差分析</div>
              <div className="chart">
                <Ichart {...chartOption} />
              </div>
            </Panel>
          </div>

          <div className="tablewrap">
            <UseProTable
              headerTitle="能碳预算明细"
              tableClassName="carbonBudgetTable"
              rowKey="id"
              columns={columns}
              dataSource={currentRows}
              search={false}
              ref={tbref}
              toolBarRender={() => toolbar}
              options={{
                fullScreen: false,
                reload: false,
                density: false,
                setting: false,
              }}
              scroll={{ x: "max-content" }}
              pagination={{
                current: pageCurrent,
                pageSize: PAGE_SIZE,
                total: mockData.tableRows.length,
                showTotal: (total) => `共 ${total} 条`,
                onChange: (page) => setPageCurrent(page),
              }}
              sheetName={`能碳预算明细-${exportYear?.format?.("YYYY") || dayjs().format("YYYY")}`}
            />
          </div>
        </div>
      </Contentbox>
    </Pagecount>
  );
}
