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

function splitColumns(items) {
  const list = Array.isArray(items) ? items : [];
  const chunkSize = Math.max(1, Math.ceil(list.length / 3));
  return [
    list.slice(0, chunkSize),
    list.slice(chunkSize, chunkSize * 2),
    list.slice(chunkSize * 2),
  ];
}

const BmsOverviewPanel = memo(({ data = [] }) => {
  const columns = splitColumns(data);

  const renderColumn = (params, columnIndex) => (
    <ColumnWrapper key={`column-${columnIndex}`}>
      {params.map((param) => (
        <RuntimeParamCard
          key={param.key}
          iconText={param.iconText}
          name={param.name}
          value={param.value ?? '--'}
          unit={param.unit}
        />
      ))}
    </ColumnWrapper>
  );

  return <PanelWrapper>{columns.map(renderColumn)}</PanelWrapper>;
});

export default BmsOverviewPanel;
