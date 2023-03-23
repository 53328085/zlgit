import React, {Fragment, useEffect, useState} from "react";
import style from './style.module.less'
import { merge, range } from "lodash";
import renovate from './imgs/renovate.png'
import batteryMiddle from './imgs/batteryMiddle.png'
import { Pagination, Input, message } from "antd";
import warningPoint from '@imgs/warningPoint.png'
import { BMSRuntime } from '@api/api.js'
export default function Index(props) {
    let { projectId, areaId, batteryPackId, batteryPackName  } = props.batteryData
    const { queryBatteryPackInfo, queryBatteryInfo, queryBatteryWarning } = BMSRuntime
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
                <div className={style.packName}>{props.batteryNo}</div>
                <div className={style.packData}>
                    <div className={style.packItem} style={{ backgroundColor: props.voltage > '3.3' ? '#c00' :'#06f'}}>
                        <span>电压</span>
                        <span>{props.v}</span>
                        <span>(V)</span>
                    </div>
                    <div className={style.packItem} style={{ backgroundColor: props.temperature < '20' ? '#c00' :'#06f'}}>
                        <span>温度</span>
                        <span>{props.temp}</span>
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
    
    const WarningCard = props => {
        return <div className={style.warningItem} style={{marginBottom:8}}>
          <div className={style.leftImg}>
            <img src={warningPoint} className={style.warningPoint}></img>
          </div>
          <div className={style.warningData}>
            <div className={style.warningtop}>
              <span className={style.time} style={{color:'#fff'}}>{props.data.warningTime}</span>
              <span className={style.sn} style={{marginLeft: 16, color:'#a1a1a1'}}>{props.data.sn}</span>
              <span className={style.level} style={{color:'#c00'}}>{props.data.level}</span>
            </div>
            <div className={style.warningbottom} style={{marginTop: 0}}>
                <span className={style.description} style={{color:'#a1a1a1'}}>{props.data.content}</span>
              
            </div>
          </div>
        </div>
    }
    
    const [batteryPackInfo, setBatteryPackInfo] = useState({})
    const getContent = () => {
        let time = new Date()
        queryBatteryPackInfo(projectId, areaId, batteryPackId).then(res => {
            if(res.success){
                if(res.data){
                    setBatteryPackInfo({
                        nowDate: time.toLocaleString(),
                        ...res.data
                    })
                }else{
                    setBatteryPackInfo({})
                }
            }else{
                message.error(res.errMsg)
            }
        })
    }
    //电池列表数据
    const [singleList, setSingleList] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const onSearch = val => {
        setPageNum(1)
        setSearchInput(val)
        getBatteryList()
    }
    const getBatteryList = () => {
        let params = {
            projectId,
            pageNum,
            pageSize: 20
        }
        queryBatteryInfo(areaId, batteryPackId, searchInput, params).then(res => {
            if(res.success){
                if(res.data){
                    setSingleList(res.data)
                    setTotal(res.total)
                }else{
                    setSingleList([])
                }
            }else{
                message.error(res.errMsg)
            }
        })
    }
    //电池列表分页
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(0)

    const changePage = val=>{
        setPageNum(val)
    }

    //告警信息
    const [warningData, setWarningData] = useState({batteryWarnings:[]})
    const getwarningData = () => {
        queryBatteryWarning(projectId, areaId, batteryPackId).then(res => {
            if(res.success){
                if(res.data){
                    setWarningData(res.data)
                }else{
                    setWarningData({batteryWarnings:[]})
                }
            }else{
                message.error(res.errMsg)
            }
        })
    }

    //电池单体接线图数据--仿
    const battery ={
        position:'absolute',
        display:'inline-block',
        height:299,
        width: 169,
        lineHeight:'20px',
        left: 125,
        bottom: 51,
        padding:16,
        backgroundColor: '#000',
        border: '1px solid rgb(35, 122, 228)',
        borderRadius: 2,
        color:'#fff',
        fontSize: 12,
        cursor:'pointer',
    }
    const NormalValue = props => {
        return (
            <div style={{width: 136, border:'1px solid #d7d7d7', borderRadius: 2, marginBottom: 12}}>
                <div style={{width: '100%', height: 24, lineHeight:'24px', backgroundColor:'#237ae4',borderBottom:'1px solid #d7d7d7'}}>
                    <span style={{display:"inline-block", width: 66, textAlign:'center'}}>{props.title[0]}</span>
                    <span style={{display:"inline-block", width: 66, textAlign:'center'}}>{props.title[1]}</span>
                </div>
                <div style={{width: '100%', height: 24, lineHeight:'24px'}}>
                    <span style={{display:"inline-block", width: 66, textAlign:'center'}}>{props.value[0]}</span>
                    <span style={{display:"inline-block", width: 66, textAlign:'center'}}>{props.value[1]}</span>
                </div>
            </div>
        )
    }
    const Progress = props => {
        return (
            <div style={{ position:'relative',marginBottom: 10, width: 136, height: 24, background:'#2b2b2b', border:"1px solid rgb(153, 153, 153)", borderRadius: 2, display:'flex', alignItems:'center',justifyContent:'center'}}>
                <div style={{ position:'absolute',zIndex:0, left:-1, top: -1, width: props.value, height: 24, background: props.color, border:"1px solid rgb(228, 228, 228)", borderRadius: 2,borderRight:'none'}}></div>
                <span style={{zIndex: 1}}>{ props.title + ' ' + props.value }</span>
            </div>
        )
    }

    useEffect(() => {
        getBatteryList()
    },[searchInput, pageNum])

    useEffect(()=>{
        getContent()
        getBatteryList()
        getwarningData()
        const timer = setInterval(()=> {
            getContent()
          }, 60000);
          return ()=> clearInterval(timer)
    },[])

    return (
        <div className={style.batteryContent}>
            <div className={style.left}>
                <span style={{display:'inline-block', height:32, lineHeight:'32px'}}>SN:{batteryPackName}</span>
                <div className={style.line}></div>
                <div className={style.time}>
                    <span>{ batteryPackInfo.nowDate }</span>
                    <div className={style.reload} onClick={() =>getContent()}>
                        <img src={renovate} className={style.renovate}></img>
                        <span>刷新</span>
                    </div>
                </div>
                <div className={style.items}>
                    <SingleItem title='运行状态' value={ batteryPackInfo.runtimeStatus }></SingleItem>
                    <SingleItem title='充放状态' value={ batteryPackInfo.chargingStatus }></SingleItem>
                    <SingleItem title='设计容量(kWh)' value={ batteryPackInfo.batteryPackCapacity }></SingleItem>
                    <SingleItem title='电池包架构' value={ batteryPackInfo.batteryPackStructure }></SingleItem>
                    <SingleItem title='SOC' value={ batteryPackInfo.soc + '%' } height='32px' type={'progress'} color={'#3c6'}></SingleItem>
                    <SingleItem title='SOH' value={  batteryPackInfo.soh + '%' } height='32px' type={'progress'} color={'#06f'}></SingleItem>
                    <DoubleItem data={[{title:'电压 (V)',value: batteryPackInfo.v },{title:'电流 (A)',value: batteryPackInfo.i }]}></DoubleItem>
                    <DoubleItem data={[{title:'功率 (kW)',value: batteryPackInfo.p },{title:'绝缘电阻 (kΩ)',value: batteryPackInfo.r }]}></DoubleItem>
                    <DoubleItem data={[{title:'单次充电 (kWh)',value: batteryPackInfo.singleChargingE },{title:'单次放电 (kWh)',value:batteryPackInfo.singleDisChargingE }]}></DoubleItem>
                    <DoubleItem data={[{title:'累计充电 (kWh)',value: batteryPackInfo.accumulateChargingE },{title:'累计放电 (kWh)',value:batteryPackInfo.accumulateDisChargingE }]}></DoubleItem>
                </div>
                <div className={style.line}></div>
                <div className={style.items}>
                    <ComplexItem title='最高电压 (V)' packageName={ batteryPackInfo.maxVBatteryNo } value={ batteryPackInfo.maxV }></ComplexItem>
                    <ComplexItem title='最低电压 (V)' packageName={ batteryPackInfo.minVBatteryNo } value={ batteryPackInfo.minV }></ComplexItem>
                    <ComplexItem title='最高单体温度 (℃)' packageName={ batteryPackInfo.maxTempBatteryNo } value={ batteryPackInfo.maxTemp }></ComplexItem>
                    <ComplexItem title='最低单体温度 (℃)' packageName={ batteryPackInfo.minTempBatteryNo } value={ batteryPackInfo.minTemp }></ComplexItem>
                    <ComplexItem title='最高接插件温度 (℃)' packageName={ batteryPackInfo.maxPlugTempBatteryNo } value={ batteryPackInfo.maxPlugTemp }></ComplexItem>
                    <ComplexItem title='最低接插件温度 (℃)' packageName={ batteryPackInfo.minPlugTempBatteryNo } value={ batteryPackInfo.minPlugTemp }></ComplexItem>
                </div>
            </div>
            <div className={style.diagramPic}>
                <img src={batteryMiddle} className={style.zhanwei}></img>
                <div style={battery}>
                <NormalValue title={['可充电', '可放电']} value={[parseInt(batteryPackInfo.canChargingE) +'(kWh)', parseInt(batteryPackInfo.canDisChargingE) + '(kWh)']}></NormalValue>
                <Progress title={'SOC'} value={batteryPackInfo.soc +'%'} color={'#060'}></Progress>
                <Progress title={'SOH'} value={batteryPackInfo.soh + '%'} color={'#06f'}></Progress>
                <div style={{ height: 0, border:'1px dashed #666', margin:'16px 0'}}></div>
                <NormalValue title={['电压高值', '电压低值']} value={[batteryPackInfo.maxV + '(V)', batteryPackInfo.minV + '(V)']}></NormalValue>
                <NormalValue title={['温度高值', '温度低值']} value={[batteryPackInfo.maxTemp + '(℃)', batteryPackInfo.minTemp + '(℃)']}></NormalValue>
            </div>
            </div>
            <div className={style.singleMonitor}>
                <div className={style.cardTitle} style={{color:'#fff'}}>
                    <span>单体监控</span>
                    <Pagination simple defaultCurrent={1} current={pageNum} pageSize={20} total={total} onChange={changePage} style={{marginRight: 0}}></Pagination>
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
                <div style={{height: 267, backgroundColor:'#000', borderRadius: 4, width: 302, padding: 16}}>
                    <div className={style.cardTitle} style={{color:'#fff'}}>单体告警</div>
                    <div className={style.warningButton}>{ '告警总数 '+ warningData.warningCnt +' 条' }</div>
                    <div className={style.line}></div>
                    <div className={style.errorTabs}>
                        <ErrorButton buttonName='单体电压欠压' error={warningData.underV}></ErrorButton>
                        <ErrorButton buttonName='单体压差过高' error={warningData.diffPressureHigh}></ErrorButton>
                        <ErrorButton buttonName='单体电池欠温' error={warningData.batteryUnderTemp}></ErrorButton>
                        <ErrorButton buttonName='单体温差过高' error={warningData.diffTempHigh}></ErrorButton>
                        <ErrorButton buttonName='单体电池过温' error={warningData.batteryOverTemp}></ErrorButton>
                        <ErrorButton buttonName='单体电压过压' error={warningData.overV}></ErrorButton>
                    </div>
                </div>
                <div style={{height: 515, backgroundColor:'#000', borderRadius: 4, width: 302, padding: 16, marginTop: 16}}>
                    <div className={style.cardTitle}>最新告警</div>
                    <div className={style.warningDetails}>
                    {warningData.batteryWarnings.map((item, index) => {
                        return <Fragment key={index}>
                            <WarningCard data={item} ></WarningCard>
                            {warningData.batteryWarnings.length > (index + 1) ? <div className={style.line} style={{marginTop: 12, marginBottom: 12}}></div> : null }
                        </Fragment>
                    } )}
                    </div>
                </div>
            </div>           
        </div>
    )
}