import React, {Fragment} from "react";
import style from './style.module.less'
import { range } from "lodash";
import renovate from './imgs/renovate.png'
import batteryMiddle from './imgs/batteryMiddle.png'
import { Pagination, Input } from "antd";
import warningPoint from '@imgs/warningPoint.png'
export default function Index() {
    const {Search} = Input
    const CustomProgress = props => {
        let {data, color} = props
        const count = parseFloat(data) == 0 ? 0 : parseInt(parseFloat(data) / 2) + 1
        let list = range(count)
        const progressStyle = {
            width: 200,
            height: 32, 
            backgroundColor:'#333', 
            display:'flex',
            alignItems:'center',
            position:'relative'
        }
        return <div style={progressStyle}>
            {list.map(item => {
                return <div style={{width: 3, height: 30, backgroundColor:color, marginRight: 1}} key={item}></div>
            })}
            <div style={{ position:'absolute', width:40, height: 32, left: 80, top:0, textAlign:'center', color:'#fff',lineHeight:'32px' }}>{data}</div>
        </div>
    }
    const SingleItem = props => {
        return <div className={style.singleItem}>
            <div className={style.singleTitle} style={{height:props.height || 36 }}>{props.title}</div>
            {
                (props.type && props.type == 'progress') ? <CustomProgress data={props.value} color={props.color}></CustomProgress> : <div className={style.singleValue} style={{height:props.height || 36 }}>{props.value}</div>
            }
        </div>
    }
    const DoubleItem = props => {
        return <div className={style.doubleItem}>
            <div className={style.firstItem}>
                <div className={style.DoubleTitle}>{props.data[0].title}</div>
                <div className={style.DoubleValue}>{props.data[0].value == '-1' ? '--.-' : props.data[0].value }</div>
            </div>
            <div className={style.secondItem}>
                <div className={style.DoubleTitle}>{props.data[1].title}</div>
                <div className={style.DoubleValue}>{props.data[1].value == '-1' ? '--.-' : props.data[1].value }</div>
            </div>
        </div>
    }
    const ComplexItem = props => {
        return <div className={style.complexItem}>
            <div className={style.complexTitle}>{props.title}</div>
            <div className={style.complexValue}>
                <span>{props.packageName}</span>
                <span>{props.value}</span>
            </div>
        </div>
    }
    const MonitorItem = props => {
        return <div className={style.monitorItem}>
            <div className={style.monitorHeader}></div>
            <div className={style.pack}>
                <div className={style.packName}>{props.name}</div>
                <div className={style.packData}>
                    <div className={style.packItem} style={{ backgroundColor: props.voltage > '3.3' ? '#c00' :'#06f'}}>
                        <span>电压</span>
                        <span>{props.voltage}</span>
                        <span>(V)</span>
                    </div>
                    <div className={style.packItem} style={{ backgroundColor: props.temperature < '20' ? '#c00' :'#06f'}}>
                        <span>温度</span>
                        <span>{props.temperature}</span>
                        <span>(℃)</span>
                    </div>
                </div>
            </div>
        </div>
    }

    const ErrorButton = props => {
        const errorStyle = {
            color: '#fff',
            backgroundColor:'#c00'
        }
        return <div className={style.errorTab}  style={props.error ? errorStyle : null}>
            {props.buttonName}
        </div>
    }

    const changePage = val=>{
        console.log(val)
    }
    const onSearch = val => {
        console.log(val)
    }
    const WarningCard = props => {
        return <div className={style.warningItem} style={{marginBottom:8}}>
          <div className={style.leftImg}>
            <img src={warningPoint} className={style.warningPoint}></img>
          </div>
          <div className={style.warningData}>
            <div className={style.warningtop}>
              <span className={style.time} style={{color:'#fff'}}>{props.data.time}</span>
              <span className={style.sn} style={{marginLeft: 16, color:'#a1a1a1'}}>{props.data.sn}</span>
              <span className={style.level} style={{color:'#c00'}}>{props.data.level == 1? '一级告警' : props.data.level == 2? '二级告警' :'三级告警'}</span>
            </div>
            <div className={style.warningbottom} style={{marginTop: 0}}>
                <span className={style.description} style={{color:'#a1a1a1'}}>{props.data.description}</span>
              
            </div>
          </div>
        </div>
    }
    const warningData = [
        {
          time:'13:48:23',
          description:'单体电池欠温',
          sn:'#1 1_1_5',
          level:2
        },{
          time:'13:48:20',
          description:'单体电压过压',
          sn:'#1 1_1_10',
          level:2
        }
    ]
    const singleList =[
        {
            name:'#1 1_1_1',
            voltage:'3.277',
            temperature: '36.2'
        },
        {
            name:'#1 1_1_2',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_1_3',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_1_4',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_1_5',
            voltage:'3.277',
            temperature: '16.2'
        },
        {
            name:'#1 1_1_6',
            voltage:'3.277',
            temperature: '36.2'
        },
        {
            name:'#1 1_1_7',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_1_8',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_1_9',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_1_10',
            voltage:'3.377',
            temperature: '36.2'
        },
        {
            name:'#1 1_2_1',
            voltage:'3.277',
            temperature: '36.2'
        },
        {
            name:'#1 1_2_2',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_2_3',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_2_4',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_2_5',
            voltage:'3.277',
            temperature: '16.2'
        },
        {
            name:'#1 1_3_6',
            voltage:'3.277',
            temperature: '36.2'
        },
        {
            name:'#1 1_3_7',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_3_8',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_3_9',
            voltage:'3.277',
            temperature: '36.2'
        },{
            name:'#1 1_3_10',
            voltage:'3.277',
            temperature: '36.2'
        },
    ]

    return (
        <div className={style.batteryContent}>
            <div className={style.left}>
                <div className={style.cardTitle}>
                    <span>电池包信息</span>
                    <span className={style.snName}>SN:223625223362_Rack1_1</span>
                </div>
                <div className={style.line}></div>
                <div className={style.time}>
                    <span>{'2023/03/14 09:08:25'}</span>
                    <div className={style.reload}>
                        <img src={renovate} className={style.renovate}></img>
                        <span>刷新</span>
                    </div>
                </div>
                <div className={style.items}>
                    <SingleItem title='运行状态' value={'自动'}></SingleItem>
                    <SingleItem title='充放状态' value={'充电'}></SingleItem>
                    <SingleItem title='设计容量(kWh)' value={100}></SingleItem>
                    <SingleItem title='电池包架构' value={'2包-200'}></SingleItem>
                    <SingleItem title='SOC' value={'25.0%'} height='32px' type={'progress'} color={'#3c6'}></SingleItem>
                    <SingleItem title='SOH' value={'99.2%'} height='32px' type={'progress'} color={'#06f'}></SingleItem>
                    <DoubleItem data={[{title:'电压 (V)',value:'732.2'},{title:'电流 (A)',value:'10'}]}></DoubleItem>
                    <DoubleItem data={[{title:'功率 (kW)',value:'7322.21'},{title:'绝缘电阻 (kΩ)',value:'10'}]}></DoubleItem>
                    <DoubleItem data={[{title:'单次充电 (kWh)',value:'-1'},{title:'单次放电 (kWh)',value:'-1'}]}></DoubleItem>
                    <DoubleItem data={[{title:'累计充电 (kWh)',value:'7322.22'},{title:'累计放电 (kWh)',value:'5232.01'}]}></DoubleItem>
                </div>
                <div className={style.line}></div>
                <div className={style.items}>
                    <ComplexItem title='最高电压 (V)' packageName='1-6' value={'3.278'}></ComplexItem>
                    <ComplexItem title='最低电压 (V)' packageName='1-2' value={'3.256'}></ComplexItem>
                    <ComplexItem title='最高电芯温度 (℃)' packageName='1-3' value={'36.3'}></ComplexItem>
                    <ComplexItem title='最低电芯温度 (℃)' packageName='1-8' value={'19.6'}></ComplexItem>
                    <ComplexItem title='最高接插件温度 (℃)' packageName='1-1' value={'38.2'}></ComplexItem>
                    <ComplexItem title='最低接插件温度 (℃)' packageName='1-9' value={'24.2'}></ComplexItem>
                </div>
            </div>
            <div className={style.diagramPic}>
                <img src={batteryMiddle} className={style.zhanwei}></img>
            </div>
            <div className={style.singleMonitor}>
                <div className={style.cardTitle} style={{color:'#fff'}}>
                    <span>单体监控</span>
                    <Pagination simple defaultCurrent={1} pageSize={20} total={50} onChange={changePage} style={{marginRight: 0}}></Pagination>
                </div>
                <Search placeholder="请输入单体编号" enterButton='查询' size="middle" onSearch={onSearch} style={{marginTop: 16 ,width:436 }}></Search>
                <div className={style.line}></div>
                <div className={style.monitorList}>
                    {singleList.map((item, index) => {
                        return <MonitorItem {...item} key={index}></MonitorItem>
                    })}
                </div>
            </div>
            <div className={style.singleWarning}>
                <div className={style.cardTitle} style={{color:'#fff'}}>单体告警</div>
                <div className={style.warningButton}>{ '告警总数 2 条' }</div>
                <div className={style.line}></div>
                <div className={style.errorTabs}>
                    <ErrorButton buttonName='单体电压欠压'></ErrorButton>
                    <ErrorButton buttonName='单体压差过高'></ErrorButton>
                    <ErrorButton buttonName='单体电池欠温' error={true}></ErrorButton>
                    <ErrorButton buttonName='单体温差过高'></ErrorButton>
                    <ErrorButton buttonName='单体电池过温'></ErrorButton>
                    <ErrorButton buttonName='单体电压过压' error={true}></ErrorButton>
                </div>
                <div className={style.line}></div>
                <div className={style.cardTitle}>最新告警</div>
                <div className={style.warningDetails}>
                {warningData.map((item, index) => {
                    return <Fragment key={index}>
                        <WarningCard data={item} ></WarningCard>
                        {warningData.length > (index + 1) ? <div className={style.line} style={{marginTop: 12, marginBottom: 12}}></div> : null }
                    </Fragment>
                } )}
                </div>
            </div>           
        </div>
    )
}