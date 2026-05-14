import React, { memo } from 'react';
import styled from 'styled-components';
import RuntimeParamCard from '@com/RuntimeParamCard';

const PanelWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  row-gap: 16px;
  flex:1;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
 // gap: 16px;
  height: 100%;
  justify-content: space-between;
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
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    flex-shrink: 0;

    .icon-text {
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .param-name {
      color: #303133;
      font-size: 12px;
      margin-bottom: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .param-value {
      color: #1D3374;
      font-size: 18px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

     
    }
  }
`;

const CompactCard = ({ iconText, icon, name, value }) => (
  <CompactCardWrapper>
    <div className="icon-wrapper">
      {icon ? (
        <img src={icon} alt={name} style={{ width: 28, height: 28, objectFit: 'contain' }} />
      ) : (
        <span className="icon-text">{iconText}</span>
      )}
    </div>
    <div className="info">
      <div className="param-name">{name}</div>
      <div className="param-value">
        {value} 
      </div>
    </div>
  </CompactCardWrapper>
);

const RUNTIME_COLUMN_KEYS = {
  voltage: ['LineVoltageAB', 'LineVoltageBC', 'LineVoltageCA'],
  current: ['PhaseCurrentA', 'PhaseCurrentB', 'PhaseCurrentC'],
  power: ['ActivePower', 'ReactivePower', 'ApparentPower', 'PowerFactor'],
};

function buildRuntimeColumns(items) {
  const list = Array.isArray(items) ? items : [];
  const itemMap = new Map(list.map(item => [item.key, item]));

  const voltage = RUNTIME_COLUMN_KEYS.voltage
    .map(key => itemMap.get(key))
    .filter(Boolean);
  const current = RUNTIME_COLUMN_KEYS.current
    .map(key => itemMap.get(key))
    .filter(Boolean);
  const power = RUNTIME_COLUMN_KEYS.power
    .map(key => itemMap.get(key))
    .filter(Boolean);

  const knownKeys = new Set([
    ...RUNTIME_COLUMN_KEYS.voltage,
    ...RUNTIME_COLUMN_KEYS.current,
    ...RUNTIME_COLUMN_KEYS.power,
  ]);
  const extras = list.filter(item => !knownKeys.has(item.key));

  return [voltage, current, power.concat(extras)];
}

const RuntimeParamsPanel = memo(({ data = [] }) => {
  const [voltage, current, power] = buildRuntimeColumns(data);

  const renderNormalColumn = (params, columnIndex) => (
    <ColumnWrapper key={`normal-${columnIndex}`}>
      {params.map((param) => (
        <RuntimeParamCard
          key={param.key}
          iconText={param.iconText}
          icon={param.icon}
          name={param.name}
          value={param.value ?? '--'}
          
        />
      ))}
    </ColumnWrapper>
  );

  const renderCompactColumn = (params, columnIndex) => (
    <ColumnWrapper key={`compact-${columnIndex}`}>
      {params.map((param) => (
        <CompactCard
          key={param.key}
          iconText={param.iconText}
          icon={param.icon}
          name={param.name}
          value={param.value ?? '--'}
           
        />
      ))}
    </ColumnWrapper>
  );

  return (
    <PanelWrapper>
      {renderNormalColumn(voltage, 0)}
      {renderNormalColumn(current, 1)}
      {renderCompactColumn(power, 2)}
    </PanelWrapper>
  );
});

export default RuntimeParamsPanel;
