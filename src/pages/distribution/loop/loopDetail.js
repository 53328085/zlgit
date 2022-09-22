import React, { useEffect, useState } from "react";
import style from './style.module.less'
import * as echarts from "echarts";
import ContentTable from "./contentTable";

export default function Index() {
    const activeStyle = {
        backgroundColor:'#039'
    }
    const [activeTab, setActiveTab] = useState('U');
    const changeTab = value => {
        setActiveTab(value);
    }
    const tabList = [
        {
            label:'电压',
            value:'U'
        },{
            label:'电流',
            value:'I'
        },{
            label:'总有功功率',
            value:'TWP',
        },{
            label:'总无功功率',
            value:'TRP',
        },{
            label:'功率因数',
            value:'PF',
        },{
            label: '总电度',
            value:'TED'
        }
    ]

    useEffect( ()=>{
        let lineChart = echarts.init(document.getElementById('lineChart'));
        lineChart.setOption({
            color:['#6395f9', '#62daab', '#657798'],
            tooltip:{
                trigger: "axis",
                axisPointer: {
                    type: "line",
                },
            },
            legend:{
                show: true,
                bottom: 50,
            },
            grid:{
                left:48,
                top:20,
                right: 30,
                bottom: 100,
            },
            dataZoom:{
                type:'slider',
                height: 30,
                bottom: 10,
                moveHandleSize: 0,
                height: 20,
            },
            xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1:00',"2:00",'3:00', '4:00','5:00', '6:00', '7:00', '8:00','9:00', '10:00', '11:00', '12:00',
                    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00','23:00', '24:00']
            },
            yAxis: {
            type: 'value',
            },
            series: [
            {
                name: 'A相电流(A)',
                type: 'line',
                symbol:'circle',
                symbolSize: 6,
                data: [224.23, 283.85, 214.36, 274.96, 289.37,205.63, 287.32, 245.36, 208.96, 254.63, 285.36, 235.21,
                        224.23, 283.85, 214.36, 274.96, 289.37, 205.63, 287.32, 245.36, 208.96, 254.63, 285.36, 235.21],
            },
            {
                name: 'B相电流(A)',
                type: 'line',
                symbol:'circle',
                symbolSize: 6,
                data: [197.32, 222.63, 162.92, 220.21, 256.22, 181.24, 236.08, 233.09, 200.6, 216.99, 259.65, 212.86,
                    197.32, 222.63, 162.92, 220.21, 256.22, 181.24, 236.08, 233.09, 200.6, 216.99, 259.65, 212.86],
            },{
                name: 'C相电流(A)',
                type: 'line',
                symbol:'circle',
                symbolSize: 6,
                data: [126.91, 131.22, 121.44, 124.75, 123.15, 141.39, 171.24, 121.27, 113.36, 78.64, 138.71, 112.35,
                    126.91, 131.22, 121.44, 124.75, 123.15, 141.39, 171.24, 121.27, 113.36, 78.64, 138.71, 112.35],
            }]
        }
        )
    } )
    const columns = [
        {
            title:'时间',
            dataIndex:'time',
            width:180,
        },{
            title:'电压',
            children:[
                {
                    title:'Ua(V)',
                    dataIndex:'Ua',
                    width:120
                },
                {
                    title:'Ub(V)',
                    dataIndex:'Ub',
                    width:120
                },
                {
                    title:'Uc(V)',
                    dataIndex:'Uc',
                    width:120
                },
            ]
        },{
            title:'电流',
            children:[
                {
                    title:'Ia(V)',
                    dataIndex:'Ia',
                    width:120
                },
                {
                    title:'Ib(V)',
                    dataIndex:'Ib',
                    width:120
                },
                {
                    title:'Ic(V)',
                    dataIndex:'Ic',
                    width:120
                },
            ]
        },{
            title:'功率因数',
            dataIndex:'PF',
            width: 118
        },{
            title:'总用功功率(kW)',
            dataIndex:'TWP',
            width: 130
        },,{
            title:'总无功功率(kVar)',
            dataIndex:'TRP',
            width: 130
        },,{
            title:'总电度(kW·h)',
            dataIndex:'TED',
            width: 130
        }
    ]
    
    const tableData = [
        {   
            key:'1',
            time:'2021-09-03  00:01:26',
            Ua:42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 12568.32
        },{   
            key:'2',
            time:'2021-08-11  00:11:26',
            Ua:42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 3668.32
        },{ 
            key:'3',
            time:'2021-08-11  00:21:26',
            Ua:42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 5645.32
        },{ 
            key:'4',
            time:'2021-08-11  00:31:26',
            Ua:42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 1568.32
        },{ 
            key:'5',
            time:'2021-08-11  00:41:26',
            Ua:42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 1228.97
        },{ 
            key:'6',
            time:'2021-08-11  00:51:26',
            Ua:42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 2568.35
        },{ 
            key:'7',
            time:'2021-08-11  01:01:26',
            Ua:223.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 2348.32
        },{ 
            key:'8',
            time:'2021-08-11  01:11:26',
            Ua:223.26,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 1984.32
        }
    ]
    return(
        <>
            <div className={style.topContent}>
                <div className={style.topTitle}>
                    {tabList.map((item, index) => {
                        return <span className="tabs" key={index} style={ activeTab == item.value ? activeStyle : null } onClick={() => changeTab(item.value)}>{item.label}</span>
                    })}
                </div>
                <div className={style.lineChart} id='lineChart'></div>
            </div>
            <div className={style.bottomContent}>
                <ContentTable columns={columns} tableData={tableData} height={320}></ContentTable>
            </div>
        </>
    )

}