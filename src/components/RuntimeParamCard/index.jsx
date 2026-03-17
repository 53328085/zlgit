import React, { memo } from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #E5ECF5;
  border-radius: 4px;

  .icon-wrapper {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
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
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .param-value {
      color: #1D3374;
      font-size: 20px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .unit {
        font-size: 12px;
        margin-left: 2px;
        color: #1D3374;
      }
    }
  }
`;

const RuntimeParamCard = memo(({ iconText, icon, name, value, unit }) => {
  return (
    <CardWrapper>
      <div className="icon-wrapper">
        {icon ? (
          <img src={icon} alt={name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
        ) : (
          <span className="icon-text">{iconText}</span>
        )}
      </div>
      <div className="info">
        <div className="param-name">{name}</div>
        <div className="param-value">
          {value}<span className="unit">{unit}</span>
        </div>
      </div>
    </CardWrapper>
  );
});

export default RuntimeParamCard;
