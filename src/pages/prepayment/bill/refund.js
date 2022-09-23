import React from 'react'
import style from './style.module.less'
import {Select, Input, Space } from 'antd'
import UserTable from '@com/useTable'
import {AccountReport} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import {useSelector, useStore, useDispatch} from 'react-redux'
import {useAntdTable} from 'ahooks'

export default function  Index() {
    const {Search} = Input;
    const {Option} = Select;
    const onSearch = (value) => console.log(value);
    const selectStyle = {
        width: 160,
        marginRight: 16
    }

    const projectId = useSelector(selectCurProject)?.id;
    
    let params = {
        ProjectId: projectId,
        RegionId:0,
        BuildingId:0,
        FloorId:0,
        RoomId:0,
        PageNum: 1,
        PageSize: 10,
        Conditional: '',
      }

    const columns = [
        {
            title:'状态',
            dataIndex:'refundStatus',
        },{
            title:'申请时间',
            dataIndex:'transactionTime',
        },{
            title:'客户姓名',
            dataIndex:'customerName',
        },{
            title:'手机号',
            dataIndex:'mobile',
        },{
            title:'地址',
            dataIndex:'customerAddress'
        },{
            title:'账户余额',
            dataIndex:'balance'
        },{
            title:'申请退费金额',
            dataIndex:'orderAmount'
        },{
            title:'退费类型',
            dataIndex:'orderType'
        },{
            title:'账户类型',
            dataIndex:'walletType',
        },{
            title:'申请理由',
            dataIndex:'remark'
        },{
            title:'操作',
            key:'action',
            render: (_,record) => ( record.refundStatus == '待审核'? <Space>
            <span style={{textDecoration:'underline',cursor:'pointer',color:'#237ae4'}}>同意</span>
            <span style={{textDecoration:'underline',cursor:'pointer',color:'#f00'}}>打回</span>
        </Space>:<span style={{textDecoration:'underline',cursor:'pointer',color:'#237ae4'}}>退款操作</span> )
        }
    ]

    const getTableData = ({ current, PageSize}) => {
        params = Object.assign({}, params, {PageNum: current, PageSize})
        return AccountReport.GetRefundInfo(params).then(res => {
          let {success, data, totalNum} = res;
          console.log(data)
          if (success && Array.isArray(data)) {
            return {
              total: totalNum,
              list: data
            }
          
          }else {
            return {
              total: 0,
              list: []
            }
          }
        })
      }

      const {tableProps} = useAntdTable(getTableData,{
        refreshDeps: [projectId],
        defaultPageSize:12,
      })

  return (
    <div className={style.tabContent}>
        <div className={style.tabHeader}>
            <span>客户查询</span>
            <Search style={{width: 453, marginLeft: 16}} placeholder="客户姓名/手机号/客户地址" enterButton="查询" size="middle" onSearch={onSearch}/>
            <div className={style.line}></div>
            <Select size='middle' style={selectStyle} placeholder="区域选择">
                <Option value='1'>区域001</Option>
            </Select>
            <Select size='middle' style={selectStyle} placeholder="建筑选择">
                <Option value='1'>建筑001</Option>
            </Select>
            <Select size='middle' style={selectStyle} placeholder="楼层选择">
                <Option value='1'>楼层001</Option>
            </Select>
            <Select size='middle' style={selectStyle} placeholder="房间选择">
                <Option value='1'>房间001</Option>
            </Select>
        </div>
        <UserTable columns={columns} {...tableProps} rowKey='id' />
    </div>
  )
}
