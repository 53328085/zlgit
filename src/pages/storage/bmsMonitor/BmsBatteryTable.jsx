import React, { memo } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';

const TableWrapper = styled.div`
  .ant-table-thead > tr > th {
    background-color: #E5ECF5;
    color: #303133;
    font-weight: 500;
    text-align: center;
  }
  .ant-table-tbody > tr > td {
    text-align: center;
  }
`;

// 表格列配置 - 根据图片内容
const columns = [
  {
    title: '簇号',
    dataIndex: 'clusterNo',
    key: 'clusterNo',
    align: 'center',
    width: 80,
  },
  {
    title: 'SOC(%)',
    dataIndex: 'soc',
    key: 'soc',
    align: 'center',
    width: 100,
  },
  {
    title: 'SOH(%)',
    dataIndex: 'soh',
    key: 'soh',
    align: 'center',
    width: 100,
  },
  {
    title: '电压(V)',
    dataIndex: 'voltage',
    key: 'voltage',
    align: 'center',
    width: 100,
  },
  {
    title: '电流(A)',
    dataIndex: 'current',
    key: 'current',
    align: 'center',
    width: 100,
  },
  {
    title: '最高电压(mV)',
    dataIndex: 'maxVoltage',
    key: 'maxVoltage',
    align: 'center',
    width: 120,
  },
  {
    title: '电池号',
    dataIndex: 'maxVoltageCellNo',
    key: 'maxVoltageCellNo',
    align: 'center',
    width: 80,
  },
  {
    title: '最低电压(mV)',
    dataIndex: 'minVoltage',
    key: 'minVoltage',
    align: 'center',
    width: 120,
  },
  {
    title: '电池号',
    dataIndex: 'minVoltageCellNo',
    key: 'minVoltageCellNo',
    align: 'center',
    width: 80,
  },
  {
    title: '最高温度(℃)',
    dataIndex: 'maxTemp',
    key: 'maxTemp',
    align: 'center',
    width: 120,
  },
  {
    title: '电池号',
    dataIndex: 'maxTempCellNo',
    key: 'maxTempCellNo',
    align: 'center',
    width: 80,
  },
];

const BmsBatteryTable = memo(({ dataSource = [], loading = false, pagination, onChange }) => {
  return (
    <TableWrapper>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        rowKey="clusterNo"
        size="middle"
        scroll={{ x: 'max-content' }}
      />
    </TableWrapper>
  );
});

export default BmsBatteryTable;
