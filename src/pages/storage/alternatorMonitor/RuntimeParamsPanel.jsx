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

const CompactCardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background-color: #E5ECF5;
  border-radius: 4px;
  height: calc((100% - 36px) / 4);

  .icon-wrapper {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primaryColor || '#1890ff'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    flex-shrink: 0;

    .icon-text {
      color: #fff;
      font-size: 9px;
      font-weight: bold;
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .param-name {
      color: #303133;
      font-size: 10px;
      margin-bottom: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .param-value {
      color: #1D3374;
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .unit {
        font-size: 10px;
        margin-left: 2px;
        color: #1D3374;
      }
    }
  }
`;

const CompactCard = ({ iconText, name, value, unit }) => (
  <CompactCardWrapper>
    <div className="icon-wrapper">
      <span className="icon-text">{iconText}</span>
    </div>
    <div className="info">
      <div className="param-name">{name}</div>
      <div className="param-value">
        {value}<span className="unit">{unit}</span>
      </div>
    </div>
  </CompactCardWrapper>
);

// 参数配置数据
const PARAM_CONFIG = {
  // 第1列 - 线电压
  voltage: [
    { key: 'uab', iconText: 'Uab', name: 'Uab线电压AB', unit: 'V' },
    { key: 'ubc', iconText: 'Ubc', name: 'Ubc线电压BC', unit: 'V' },
    { key: 'uca', iconText: 'Uca', name: 'Uca线电压CA', unit: 'V' },
  ],
  // 第2列 - 电流
  current: [
    { key: 'ia', iconText: 'Ia', name: 'Ia A相电流', unit: 'A' },
    { key: 'ib', iconText: 'Ib', name: 'Ib B相电流', unit: 'A' },
    { key: 'ic', iconText: 'Ic', name: 'Ic C相电流', unit: 'A' },
  ],
  // 第3列 - 功率指标
  power: [
    { key: 'pwr', iconText: 'Pwr', name: '有功功率', unit: 'kW' },
    { key: 'q', iconText: 'Q', name: '无功功率', unit: 'kVar' },
    { key: 's', iconText: 'S', name: '视在功率', unit: 'kVA' },
    { key: 'pf', iconText: 'PF', name: '功率因数', unit: '' },
  ],
};

const RuntimeParamsPanel = memo(({ data = {} }) => {
  const renderNormalColumn = (params) => (
    <ColumnWrapper>
      {params.map((param) => (
        <RuntimeParamCard
          key={param.key}
          iconText={param.iconText}
          name={param.name}
          value={data[param.key] ?? '--'}
          unit={param.unit}
        />
      ))}
    </ColumnWrapper>
  );

  const renderCompactColumn = (params) => (
    <ColumnWrapper>
      {params.map((param) => (
        <CompactCard
          key={param.key}
          iconText={param.iconText}
          name={param.name}
          value={data[param.key] ?? '--'}
          unit={param.unit}
        />
      ))}
    </ColumnWrapper>
  );

  return (
    <PanelWrapper>
      {renderNormalColumn(PARAM_CONFIG.voltage)}
      {renderNormalColumn(PARAM_CONFIG.current)}
      {renderCompactColumn(PARAM_CONFIG.power)}
    </PanelWrapper>
  );
});

export default RuntimeParamsPanel;
