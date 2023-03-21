import { range } from "lodash";
import React, {useState, Fragment} from "react";
import style from "./style.module.less";
import subMiddle from './imgs/subMiddle.png'
import warningPoint from '@imgs/warningPoint.png'
import { useNavigate } from "react-router-dom";
export default function Index() {
    const navigate = useNavigate()
    const Items = props => {
        return <div className={style.items} style={{width:props.width}}>
            {props.data.map((item, index) => {
                return <div className={style.itemData} key={index}>
                    <div className={style.dataTitle}>{item.title}</div>
                    <div className={style.dataValue}>{item.value}</div>
                </div>
            })}
        </div>
    }
    //自定义进度条
    const CustomProgress = props => {
        let {data, color} = props
        const count = parseFloat(data) == 0 ? 0 : parseInt(parseFloat(data) / 2.5) + 1
        let list = range(count)
        const progressStyle = {
            width: 160,
            height: 24, 
            border:'1px solid #d7d7d7', 
            backgroundColor:'#333', 
            display:'flex',
            alignItems:'center',
            position:'relative'
        }
        return <div style={progressStyle}>
            {list.map(item => {
                return <div style={{width: 3, height: 20, backgroundColor:color, marginRight: 1}} key={item}></div>
            })}
            <div style={{ position:'absolute', width:40, height: 24, left: 60, top:0, textAlign:'center', color:'#fff' }}>{data}</div>
        </div>
    }
    const Bettery = props => {
        return (
            <div className={style.betteryCard}>
                <div className={style.betteryTitle}>
                    <span>{props.name}</span>
                    <span style={{marginLeft:'auto', marginRight: 16, color:'#f03'}}>告警</span>
                    <span className={style.warningCount}>{props.warningCount}</span>
                </div>
                <div className={style.betteryData}>
                    <div className={style.dataItem}>
                        <div className={style.itemName}>充放电状态</div>
                        <div className={style.itemData}>{props.state == 'charge' ? '充电' : '放电'}</div>
                    </div>
                    <div className={style.dataItem} style={{width:160}}>
                        <div className={style.itemName}>SOC(%)</div>
                        {/* <div className={style.itemData}>{props.SOC}</div> */}
                        <CustomProgress color={'#3c6'} data={props.SOC}></CustomProgress>
                    </div>
                    <div className={style.dataItem} style={{width:160}}>
                        <div className={style.itemName}>SOH(%)</div>
                        {/* <div className={style.itemData} >{props.SOH}</div> */}
                        <CustomProgress color={'#06f'} data={props.SOH}></CustomProgress>
                    </div>
                    <div className={style.dataItem}>
                        <div className={style.itemName}>总电流(A)</div>
                        <div className={style.itemData}>{props.totalCurrent}</div>
                    </div>
                    <div className={style.dataItem} style={{width:160}}>
                        <div className={style.itemName}>最高/最低电压(V)</div>
                        <div className={style.itemData} >{props.vlotage}</div>
                    </div>
                    <div className={style.dataItem} style={{width:160}}>
                        <div className={style.itemName}>最高/最低温度(℃)</div>
                        <div className={style.itemData} >{props.temperature}</div>
                    </div>
                </div>
            </div>
        )
    }
    const betteryList = [
        {
            name:'电池簇1_1',
            warningCount: 0,
            state:'charge',
            SOC:'25.0%',
            SOH: '99.0%',
            totalCurrent: 50.2,
            vlotage:52.3,
            temperature:'41.3'
        },{
            name:'电池簇1_2',
            warningCount: 0,
            state:'charge',
            SOC:'100.0%',
            SOH: '99.6%',
            totalCurrent: 50.1,
            vlotage:52.8,
            temperature:'51.2'
        },{
            name:'电池簇1_3',
            warningCount: 0,
            state:'charge',
            SOC:'25.0%',
            SOH: '99.0%',
            totalCurrent: 50.3,
            vlotage:52.3,
            temperature:'32.1 / 21.4'
        }
    ]
    const StateCard = props => {
        return <div className={style.stateCard} style={{width:props.width}}>
          <div className={style.stateTitle}>{props.title}</div>
          <div className={style.stateValue}>{props.value}</div>
        </div>
    }
    const WarningCard = props => {
        return <div className={style.warningItem} style={{marginBottom:8}}>
          <div className={style.leftImg}>
            <img src={warningPoint} className={style.warningPoint}></img>
          </div>
          <div className={style.warningData}>
            <div className={style.warningtop}>
              <span className={style.time}>{props.data.time}</span>
              <span className={style.sn} style={{marginLeft: 16}}>{props.data.sn}</span>
            </div>
            <div className={style.warningbottom} style={{marginTop: 0}}>
                <span className={style.description}>{props.data.description}</span>
              <span className={style.level}>{props.data.level == 1? '一级告警' : props.data.level == 2? '二级告警' :'三级告警'}</span>
            </div>
          </div>
        </div>
    }
    const warningData = [
        {
          time:'13:48:23',
          description:'1#电堆  SOC低告警',
          sn:'1#1_1_42',
          level:2
        },{
          time:'13:30:23',
          description:'2#电堆  SOC低告警',
          sn:'1#2_1_42',
          level:2
        },{
            time:'13:20:23',
            description:'3#电堆  SOC低告警',
            sn:'1#3_1_42',
            level:2
          }
    ]
    const toWarning = () => {
      navigate('/index/runtimeStorage/alarmMessage',{
        state: { type: 'index', primary: 'runtimeStorage', title: '告警信息',  nested: 'alarmMessage' } 
      })
    }
  return (
    <div className={style.bmsContent}>
        <div className={style.left}>
            <div className={style.storageState}>
                <div className={style.cardTitle}>1#储能室状态</div>
                <div className={style.itemList}>
                    <Items width={96} data={[{title:'运行状态', value:'在线'}]}></Items>
                    <Items width={160} data={[{title:'SOC', value:'21.2%'}]}></Items>
                    <Items width={160} data={[{title:'SOH', value:'100%'}]}></Items>
                    <Items width={96} data={[{title:'充放状态', value:'充电'}]}></Items>
                    <Items width={160} data={[{title:'可充电量', value:'158 kWh'}, {title:'可放电量', value:'158 kWh'}]}></Items>
                    <Items width={160} data={[{title:'总电压', value:'732.25 V'}, {title:'总电流', value:'10 A'}]}></Items>
                </div>
            </div>
            <div className={style.line}></div>
            {
                betteryList.map((item, index) => {
                    return <Bettery {...item} key={index}></Bettery>
                })
            }
        </div>
        <div className={style.middle}>
        <img src={subMiddle} className={style.zhanwei}></img>
        </div>
        <div className={style.right}>
            <div className={style.environment}>
                <div className={style.cardTitle}>环境监控</div>
                <div className={style.item}>
                    <div className={style.itemName}>水浸监控</div>
                    <div className={style.itemData}>
                        <span>{'2023-03-10 18:00'}</span>
                        <span style={{marginLeft:16}}>无告警</span>
                    </div>
                </div>
                <div className={style.item}>
                    <div className={style.itemName} style={{backgroundColor:'#f63'}}>灭火器监控</div>
                    <div className={style.itemData}>
                        <span>{'2023-03-10 18:00'}</span>
                        <span style={{marginLeft:16}}>无告警</span>
                    </div>
                </div>
                <div className={style.item}>
                    <div className={style.itemName} style={{backgroundColor:'#096'}}>空调监控</div>
                    <div className={style.temData}>
                        <div className={style.tem}>
                            <span>温度</span>
                            <div>
                                <span style={{ color:'#135abd', fontSize:28}}>23.5</span>
                                <span style={{fontSize:14, marginLeft: 8}}>℃</span>
                            </div>
                        </div>
                        <div className={style.separate}></div>
                        <div className={style.tem}>
                            <span>湿度</span>
                            <div>
                                <span style={{ color:'#135abd', fontSize:28}}>54.2</span>
                                <span style={{fontSize:14, marginLeft: 8}}>%</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.itemData} style={{height:'28px', lineHeight:'28px'}}>
                        <span style={{color:'#999'}}>{'2023-03-10 18:00'}</span>
                    </div>
                </div>
            </div>
            <div className={style.newWarning}>
                <div className={style.cardTitle}>告警信息</div>
                <span className={style.toWarning} onClick={()=>toWarning()}>查看详情</span>
                <div className={style.stateItems}>
                    <StateCard title='通讯告警' value='0' width='120px'></StateCard>
                    <StateCard title='电堆告警' value='2' width='120px'></StateCard>
                    <StateCard title='储能室告警' value='0' width='120px'></StateCard>
                    <StateCard title='单体告警' value='0' width='120px'></StateCard>
                </div>
                <div className={style.cardTitle}>最新告警</div>
                <div className={style.warningDetails}>
                {warningData.map((item, index) => {
                    return <WarningCard data={item} key={index}></WarningCard>
                } )}
                </div>
            </div>
        </div>
    </div>
  )
}