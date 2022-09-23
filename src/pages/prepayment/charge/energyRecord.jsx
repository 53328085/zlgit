import React from 'react'
import { Select,Input } from 'antd'
import dashed from '@imgs/dashed.png'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import  UseTable from '@com/useTable'
const { Option } = Select
export default function energyRecord() {
     const columns = [{
        dataIndex:'name',
        key:'1',
        width:120,
       
        onCell:()=>{
            return {
                style:{background: '#f2f2f2',textAlign: 'center'}
            }
        }
     },{
        dataIndex:'age',
        key:'2'
     }]
     const datasource = [
     {
        key: 1,
        name: '客户编号',
      },
      {
        key: 2,
        name: '客户姓名',
      },
      {
        key: 3,
        name: '手机号',
      },
      {
        key: 4,
        name: '能源账户余额',
      },
      {
        key: 5,
        name: '账户状态',
      },
      {
        key: 6,
        name: '客户地址',
      },
      {
        key: 7,
        name: '备注',
      },
    ]
    const moneyList=[{name:'¥ 50 元',value:50},{name:'¥ 100 元',value:100},{name:'¥ 200 元',value:200},{name:'¥ 500 元',value:500},{name:'¥ 1000 元',value:1000},{name:'¥ 5000 元',value:5000}]
    return (
        <div>
            <div>
                <span style={{ paddingRight: 16 }}>客户查询</span>
                <Select style={{ width: 556 }}>
                    <Option>
                        客户
                    </Option>
                </Select>
            </div>
            <img src={dashed} alt="" className={style.dash} />
            <div className={style.tableArea}>
                <div className={style.message}>
                    <BlueColumn name="客户信息" styled={{fontSize:16}}></BlueColumn>
                    <UseTable 
                    showHeader={false} 
                    dataSource={datasource} 
                    columns={columns}
                    onRow={(record,index)=>{console.log(record,index)}} 
                    style={{margin: '16px 0 0 16px'}}></UseTable>
                </div>
                <div className={style.accountRecord}>
                    <BlueColumn name="物业费账户充值" styled={{fontSize:16}}></BlueColumn>
                    <div style={{margin:'16px 0'}}>充值金额(元)</div>
                    <Input style={{width:400}}/>
                    <div className={style.moneyNum}>
                        {moneyList.map((item,index)=>(<div key={item.value} className={style.moneydiv}>{item.name}</div>))}
                    </div>
                </div>
            </div>
        </div>
    )
}
