import React from 'react'
import { Input, Button,Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import UserTable from '@com/useTable'
import { columns } from './columns'
import { useAntdTable, usePagination } from 'ahooks'
import { Warning } from '@api/api'
import BlueColumn from '@com/bluecolumn'
const { Search } = Input;
export default function Warncontent({ style }) {
    const param = {
        projectId: 1,
        region: 0,
        building: 0,
        floor: 0,
        room: 0,
        pageNum: 1,
        pageSize: 15,
        alike: ''
    }
    const getTableData = async ({ current, pageSize }, FormData) => {
        const resp = await Warning.FindAlikeDevice({...param,pageNum:current,pageSize,})
        return {
            total:resp.totalNum,
            list:resp.data
        }
    }
    const {tableProps}=useAntdTable(getTableData,{
        defaultParams: {
            current:1, pageSize:10
        }
    })

    return (
        <div className={style.WarnContent}>
            <div className={style.SearchContent}>
                <BlueColumn name="告警信息"/>

            </div>
            <div style={{ marginTop: 16 }}>
                <UserTable columns={columns} {...tableProps} rowKey="sn" ></UserTable>
            </div>

        </div>
    )
}
