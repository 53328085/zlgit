import React, { memo } from 'react';
import styled from 'styled-components';
import RuntimeParamCard from '@com/RuntimeParamCard';

const PanelWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  row-gap: 16px;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

// BMS参数配置 - 根据接口返回的8个字段（3列x3行=9个卡片，最后一列用功率填充）
const PARAM_CONFIG = {
  // 第1列 - 堆电压、堆电流、最高电池电压
  column1: [
    { key: 'stackVoltage', iconText: 'V', name: '电池堆电压', unit: 'V' },
    { key: 'stackCurrent', iconText: 'A', name: '电池堆电流', unit: 'A' },
    { key: 'maxCellVoltage', iconText: 'V', name: '堆最高电池电压', unit: 'V' },
  ],
  // 第2列 - 堆最低电池电压、系统最高温度、最低电池温度
  column2: [
    { key: 'minCellVoltage', iconText: 'V', name: '堆最低电池电压', unit: 'V' },
    { key: 'maxCellTemp', iconText: '℃', name: '系统最高温度', unit: '℃' },
    { key: 'minCellTemp', iconText: '℃', name: '最低电池温度', unit: '℃' },
  ],
  // 第3列 - 堆允许最大放电功率、堆允许最大充电功率、空缺
  column3: [
    { key: 'maxDischargePower', iconText: 'P', name: '堆允许最大放电功率', unit: 'kW' },
    { key: 'maxChargePower', iconText: 'P', name: '堆允许最大充电功率', unit: 'kW' },
  ],
};

const BmsOverviewPanel = memo(({ data = {} }) => {
  const renderColumn = (params) => (
    <ColumnWrapper>
      {params.map((param) => (
        <RuntimeParamCard
          key={param.key}
          iconText={param.iconText}
          name={param.name}
          value={data[param.key] ?? '--'}
          unit={param.unit}
          badge={param.badge}
        />
      ))}
    </ColumnWrapper>
  );

  return (
    <PanelWrapper>
      {renderColumn(PARAM_CONFIG.column1)}
      {renderColumn(PARAM_CONFIG.column2)}
      {renderColumn(PARAM_CONFIG.column3)}
    </PanelWrapper>
  );
});

export default BmsOverviewPanel;
