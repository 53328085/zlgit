import React, { useState, useEffect, useMemo } from 'react'
import { Input, Button, DatePicker, Modal, Timeline,Select,Divider  } from 'antd';
import { SearchOutlined, CheckCircleFilled } from '@ant-design/icons'
import { CompleteIcon, ResolveIcon, WaitIcon } from './completeicon'
import UserTable from '@com/useTable'
import { columns } from './columns'
import { useAntdTable, usePagination } from 'ahooks'
import { Warning } from '@api/api'
import zhanwei from '@imgs/zhanwei.png'
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
export default function Warncontent({ style }) {
    const [order, setOrder] = useState(false)
  
    columns[0].render = (_,record,rowIndex)=>(<a onClick={()=>{setOrder(true)}}>{record.sn}</a>)
    return (
        <div className={style.OrderContent}>
            <div className={style.SearchContent}>
                <div>
                    <RangePicker separator={<>至</>} size="default" style={{ width: 376 }} />
                    <Button size='default' style={{ width: 96, marginLeft: 16 }} icon={<SearchOutlined />} type="primary">查询</Button>
                </div>
                <div style={{marginLeft:'auto'}}>
                    <span style={{paddingRight:16}}>工单状态</span>
                    <Select style={{width:128}}></Select>
                </div>
                <Divider type='vertical' style={{height:32,borderColor:'#d7d7d7',margin:'0 32px'}} dashed/>
                <Button size='default' style={{ width: 96 }} >导出</Button>
            </div>
            <div style={{ marginTop: 16 }}>
                <UserTable columns={columns}  rowKey="sn" onChange={() => { console.log(111) }}></UserTable>
            </div>
            <Modal
                title="工单跟踪"
                open={order}
                width={1280}
                closable={false}
                footer={
                    <div style={{ textAlign: 'center' }}>
                        <Button style={{ width: 96, height: 36, padding: 0, borderRadius: 4 }} onClick={() => { setOrder(false) }}>关闭</Button>
                    </div>}>
                <Timeline mode='left' >
                    <div style={{ margin: '0px 0 24px 5px' }}>工单编号:202011276323</div>
                    <Timeline.Item label='2020/11/20  01:12:13' dot={<CompleteIcon />} className={style.timeline}>
                        <div style={{ minHeight: 130 }}>派单已确认 维护工程师 / 张三  / 13588322654</div>
                    </Timeline.Item>
                    <Timeline.Item label='2020/11/20  01:12:13' dot={<CompleteIcon />} className={style.timeline}>
                        <div style={{ minHeight: 100 }}>
                            <div>到达故障点</div>
                            <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                            <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                            <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                        </div>
                    </Timeline.Item>
                    <Timeline.Item label='2020/11/20  01:12:13' dot={<CompleteIcon />} className={style.timeline}>
                        <div style={{ minHeight: 100 }}>
                            <div >故障处理</div>
                            <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                            <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                            <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                            <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                            <TextArea rows={4} style={{width:240,height:80}} />
                            <></>
                        </div>
                    </Timeline.Item>
                    <Timeline.Item label='2020/11/20  01:12:13' dot={<CompleteIcon />} className={style.timeline}>
                        <div >处理完成</div>
                    </Timeline.Item>
                </Timeline>


            </Modal>
        </div>
    )
}
