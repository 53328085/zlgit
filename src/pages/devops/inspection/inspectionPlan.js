import React, { useState } from "react";
import style from './style.module.less';
import { DatePicker,Button, Table, Pagination  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function Index(){

    const { RangePicker } = DatePicker;

    const columns = [{
        title:'巡检工单',
        dataIndex:'Number',
        render: text =><a>{text}</a>
    },{
        title:'计划时间',
        dataIndex:'Time',
    },{
        title:'计划名称',
        dataIndex:'PlanName',
    },{
        title:'项目名称',
        dataIndex:'ProjectName',
    },{
        title:'巡检区域',
        dataIndex:'RegionName',
    },{
        title:'计划任务',
        dataIndex:'Task',
    },{
        title:'巡检周期',
        dataIndex:'Circle',
    },{
        title:'巡检人员',
        dataIndex:'Operator',
    },{
        title:'状态',
        dataIndex:'State',
        render: text => <span>{text == 'wait'?'待巡检':text == 'progress'?'巡检中':'已完成'}</span>
    },]

    const dataSource = [
        {   key:'1',
            Number:'20201130001',
            Time:'2020/11/30 08:00',
            PlanName:'巡检计划1',
            ProjectName:'项目名称001',
            RegionName:'正泰物联滨江园区',
            Task:'all',
            Circle:'天',
            Operator:'xxx',
            State:'wait'
        },{ 
            key:'2',
            Number:'20201130002',
            Time:'2021/11/30 08:00',
            PlanName:'巡检计划2',
            ProjectName:'项目名称001',
            RegionName:'正泰物联滨江园区',
            Task:'all',
            Circle:'天',
            Operator:'xxx',
            State:'finish'
        },{
            key:'3',
            Number:'20201130003',
            Time:'2021/07/11 08:00',
            PlanName:'巡检计划3',
            ProjectName:'项目名称001',
            RegionName:'正泰物联滨江园区',
            Task:'all',
            Circle:'天',
            Operator:'xxx',
            State:'finish'
        },
    ]
    

    return(
        <>
            <div className={style.contentHeader}>
                <RangePicker size="middle" style={{width:372}}></RangePicker>
                <Button type="primary" size="middle" icon={<SearchOutlined />} style={{marginLeft:16,width:96}}>查询</Button>
                <Button size="middle" style={{marginLeft:'auto',marginRight:0,width:96}}>导出</Button>
            </div>
            <div className={style.contentTable}>
                <Table bordered dataSource={dataSource} columns={columns} pagination={false}></Table>
                <Pagination 
                total={85} 
                showTotal={total => `共 ${total} 条记录`} 
                defaultCurrent={1}
                showSizeChanger={false} 
                defaultPageSize={10}></Pagination>
            </div>
        </>
    )
}