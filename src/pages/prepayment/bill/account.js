import React from 'react'
import style from './style.module.less'
import {Select, Input } from 'antd'
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
            title:'交易时间',
            dataIndex:'transactionTime',
        },{
            title:'客户编号',
            dataIndex:'customerNo',
        },{
            title:'交易种类',
            dataIndex:'orderType',
        },{
            title:'交易金额',
            dataIndex:'orderAmount',
        },{
            title:'客户姓名',
            dataIndex:'customerName'
        },{
            title:'手机号',
            dataIndex:'mobile'
        },{
            title:'客户地址',
            dataIndex:'customerAddress'
        },{
            title:'操作人员',
            dataIndex:'creator'
        },{
            title:'票据编号',
            dataIndex:'innerOrderNo'
        },{
            title:'账户类型',
            dataIndex:'walletType',
        },{
            title:'备注',
            dataIndex:'remark'
        },{
            title:'票据打印',
            key:'action',
            render: (_,record) => <span style={{textDecoration:'underline',cursor:'pointer'}}>打印小票</span>
        }
    ]

    const getTableData = ({ current, PageSize}) => {
        params = Object.assign({}, params, {PageNum: current, PageSize})
        return AccountReport.GetAccountTransactions(params).then(res => {
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
