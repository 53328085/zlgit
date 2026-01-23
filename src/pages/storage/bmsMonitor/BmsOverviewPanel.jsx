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

// BMS参数配置 - 根据图片中的内容（3列x3行=9个卡片）
const PARAM_CONFIG = {
  // 第1列 - 堆电压、SOC、SOH
  column1: [
    { key: 'stackVoltage', iconText: 'V', name: '堆电压', unit: 'V' },
    { key: 'soc', iconText: 'SOC', name: 'SOC', unit: '%' },
    { key: 'soh', iconText: 'SOH', name: 'SOH', unit: '%' },
  ],
  // 第2列 - 堆电流、最高电池电压、最高电池温度
  column2: [
    { key: 'stackCurrent', iconText: 'A', name: '堆电流', unit: 'A' },
    { key: 'maxCellVoltage', iconText: 'V', name: '最高电池电压', unit: 'V', badge: 'Max' },
    { key: 'maxCellTemp', iconText: '℃', name: '最高电池温度', unit: '℃', badge: 'Max' },
  ],
  // 第3列 - 堆功率、最低电池电压、最低电池温度
  column3: [
    { key: 'stackPower', iconText: 'P', name: '堆功率', unit: 'kW' },
    { key: 'minCellVoltage', iconText: 'V', name: '最低电池电压', unit: 'V', badge: 'Min' },
    { key: 'minCellTemp', iconText: '℃', name: '最低电池温度', unit: '℃', badge: 'Min' },
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
