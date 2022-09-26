import React, { useState } from 'react'
import style from './style.module.less'
import { Select, Input, Button, Form, Checkbox } from 'antd'
import dashed from '@imgs/dashed.png'
import BlueColumn from '@com/bluecolumn'
import UseTable from '@com/useTable'
// import {AllRefundForm} from './refundForm'
const { Option } = Select
const { Item } = Form



export default function Refund() {

    const [refundType, setRefundType] = useState('all')
    const columns = [{
        dataIndex: 'name',
        key: '1',
        width: 120,

        onCell: () => {
            return {
                style: { background: '#f2f2f2', textAlign: 'center' }
            }
        }
    }, {
        dataIndex: 'age',
        key: '2'
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
    const formItemLayout = {
        labelCol: { span: 6 },
    };
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
                    <BlueColumn name="客户信息" styled={{ fontSize: 16 }}></BlueColumn>
                    <UseTable
                        bordered={true}
                        showHeader={false}
                        dataSource={datasource}
                        columns={columns}
                        onRow={(record, index) => { }}
                        style={{ margin: '32px 0 0 0px' }}></UseTable>
                </div>
                <div className={style.accountRecord}>
                    <BlueColumn name="能源账户退费" styled={{ fontSize: 16 }}></BlueColumn>
                    <div className={style.refundType} style={{ width: 420 }}>
                        <div className={style.type + ` ${refundType === 'all' ? style.activeType : null}`} onClick={() => { setRefundType('all') }}>
                            <div className={style.firstTitle}>全额退费&nbsp;(销户)</div>
                            <div className={style.secondTitle}>退还能源账户全部余额并销户</div>
                        </div>
                        <div className={style.type + ` ${refundType === 'part' ? style.activeType : null}`} onClick={() => { setRefundType('part') }}>
                            <div className={style.firstTitle}>部分退费</div>
                            <div className={style.secondTitle}>只能退小于余额的费用</div>
                        </div>
                    </div>
                    <Form
                        colon={false}
                        labelAlign='left'
                        {...formItemLayout}
                        layout='horizontal'
                        className={style.AllRefundForm}
                    >
                      {refundType==='all'?<AllRefundForm/>:<PartRefundForm/>} 
                        <Item >
                            <Checkbox /><span className={style.commit}>我已阅读并同意<span style={{ color: '#237ae4', cursor: 'pointer' }}>《能源费退费规则》</span></span>
                        </Item>
                        <Item>
                            <Button style={{ width: 120, height: 40, }}>打印</Button>
                            <Button style={{ width: 248, height: 40, backgroundColor: '#237ae4', color: "#fff", marginLeft: 'auto', marginRight: 0 }} >退费</Button>
                        </Item>
                    </Form>

                </div>
            </div>
        </div>
    )
}

//全额退费
const AllRefundForm = () => {
    return (
        <>
            <Item label="能源退费金额" style={{ display: 'flex', }}>
                <Input style={{ width: 181 }} />
                <Button type='primary' style={{ backgroundColor: "#237ae4", marginLeft: 'auto', marginRight: 0 }}>账户结算</Button>
            </Item>
            <Item label="备注信息">
                <Input />
            </Item>
        </>
    )
}

//部分退费
export const PartRefundForm = () => {
    return (
        <>
            <Item label="能源账户余额" >
                <Input />
            </Item>
            <Item label="退费金额">
                <Input/>
            </Item>
            <Item label="备注信息">
                <Input />
            </Item>
        </>
    )
}