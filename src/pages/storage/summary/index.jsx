import React,{Fragment}from 'react'
import style from './style.module.less'
import UseHeader from '@com/useHeader'
import BarChart from './barChart'
import LineChart from './lineChart'
import zhanwei from './imgs/zhanwei.png'
import warningPoint from '@imgs/warningPoint.png'

export default function Index() {
  const getFromHeader = values => {}
  const CardItem = props => {
    return <div className={style.leftCard}>
      <div className={style.cardTitle}>{props.title}</div>
      {props.children}
    </div>
  }
  const Tips = props => {
    return <div className={style.tips}>
      <div className={style.tipTitle}>
        <span>{props.name}</span>
        <span style={{fontSize: 12}}>({props.unit})</span>
      </div>
      <div className={style.tipValues}>{props.value}</div>
    </div>
  }
  const RightItem = props => {
    return <div className={style.rightCard}>
      <div className={style.cardTitle}>{props.title}</div>
      {props.children}
    </div>
  }
  const CustomProgress = props => {
    return <div className={style.bgStrip}>
      <div className={style.chargeProgress} style={{width:props.chargeData}}></div>
      <div className={style.dischargeProgress} style={{width:props.dischargeData}}></div>
    </div>
  } 
  const StateCard = props => {
    return <div className={style.stateCard} style={{width:props.width}}>
      <div className={style.stateTitle}>{props.title}</div>
      <div className={style.stateValue}>{props.value}</div>
    </div>
  }
  const WarningCard = props => {
    return <div className={style.warningItem}>
      <div className={style.leftImg}>
        <img src={warningPoint} className={style.warningPoint}></img>
      </div>
      <div className={style.warningData}>
        <div className={style.warningtop}>
          <span className={style.time}>{props.data.time}</span>
          <span className={style.description}>{props.data.description}</span>
        </div>
        <div className={style.warningbottom}>
          <span className={style.sn}>{props.data.sn}</span>
          <span className={style.level}>{props.data.level == 1? '一级告警' : props.data.level == 2? '二级告警' :'三级告警'}</span>
        </div>
      </div>
    </div>
  }
  const values = {
    x:['3/01', '3/02', '3/03', '3/04', '3/05', '3/06', '3/07', '3/08', '3/09', '3/10'],
    y:[523.23, 418.58, 306.98, 489.32, 874.59, 746.23, 684.25, 398.47, 510.95, 310.23]
  }
  const warningData = [
    {
      time:'13:48:23',
      description:'BMS 电池告警',
      sn:'PCS_TGA_4FA3',
      level:1
    },{
      time:'13:20:23',
      description:'SOC 低告警',
      sn:'TGA_9GG3S',
      level:2
    }
  ]
  const toWarning = () => {
    window.location.href = '/index/runtimeStorage/alarmMessage'
  }

  return (
    <div>
      <UseHeader getValues={getFromHeader} ></UseHeader>
      <div className={style.content}>
        <div className={style.left}>
          <CardItem title={'充放电统计'}>
            <div className={style.dataItem}>
              <div className={style.itemValues}>
                <div className={style.title}>累计充电量(kWh)</div>
                <div className={style.values}>50000.00</div>
              </div>
              <div className={style.itemValues}>
                <div className={style.title}>充电均价(元/kWh)</div>
                <div className={style.values}>0.64</div>
              </div>
              <div className={style.itemValues}>
                <div className={style.title}>累计充电费用(元)</div>
                <div className={style.values}>32000.00</div>
              </div>
            </div>
            <div className={style.line}></div>
            <div className={style.dataItem}>
              <div className={style.itemValues}>
                <div className={style.title}>累计放电量(kWh)</div>
                <div className={style.values}>40000.00</div>
              </div>
              <div className={style.itemValues}>
                <div className={style.title}>放电均价(元/kWh)</div>
                <div className={style.values}>1.4</div>
              </div>
              <div className={style.itemValues}>
                <div className={style.title}>累计充电费用(元)</div>
                <div className={style.values}>56000.00</div>
              </div>
            </div>
            <div className={style.line}></div>
            <div className={style.totalGet}>
              <span>累计收益</span>
              <span style={{fontSize: 18, color:'#000',fontWeight: 700}}>24,000.00</span>
            </div>
          </CardItem>
          <CardItem title={'收益统计'}>
            <BarChart data={values}></BarChart>
          </CardItem>
          <CardItem title={'实时功率'}>
            <LineChart data={values}></LineChart>
          </CardItem>
        </div>
        <div className={style.middle}>
          <div className={style.headerTips}>
            <Tips name='当日总放电量' unit='kWh' value={522.23}></Tips>
            <Tips name='当日总充电量' unit='kWh' value={650.00}></Tips>
            <Tips name='当日总上网电量' unit='kWh' value={100.00}></Tips>
            <Tips name='今日收益' unit='元' value={310.95}></Tips>
          </div>
          <div className={style.topology}>
            <img src={zhanwei} className={style.topologyPic}></img>
          </div>
        </div>
        <div className={style.right}>
          <RightItem title='储能系统'>
            <div className={style.tips}>
              <div className={style.tipItem}>
                <span className={style.titles}>充放状态</span>
                <div className={style.tipValues}>
                  <span>800</span>
                </div>
              </div>
              <div className={style.tipItem}>
                <span className={style.titles}>设计容量</span>
                <div className={style.tipValues}>
                  <span>800</span><span className={style.unit}>&nbsp;kWh</span>
                </div>
              </div>
              <div className={style.tipItem}>
                <span className={style.titles}>SOC</span>
                <div className={style.tipValues}>
                  <span>800</span><span className={style.unit}>&nbsp;%</span>
                </div>
              </div>
            </div>
            <div className={style.dashed}></div>
            <CustomProgress chargeData={'25%'} dischargeData={'70%'}></CustomProgress>
            <div className={style.progressdata}>
              <div style={{display:'flex',alignItems:'center'}}>
                <span className={style.progresstitle} style={{backgroundColor:'#44de94',color:"#333"}}>可充电量</span>
                <span className={style.progressvalue}>50.20&nbsp;kwh</span>
              </div>
              <div style={{display:'flex',alignItems:'center'}}>
                <span className={style.progresstitle} style={{backgroundColor:'#f93',color:"#fff"}}>可放电量</span>
                <span className={style.progressvalue}>251.02&nbsp;kwh</span>
              </div>
            </div>
          </RightItem>
          <RightItem title='实时状态'>
            <div className={style.stateItems}>
              <StateCard title='总功率(kWh)' value='773.72' width='336px'></StateCard>
              <StateCard title='总电压(V)' value='732.20' width='160px'></StateCard>
              <StateCard title='总电流(A)' value='10.22' width='160px'></StateCard>
              <StateCard title='可充电量(kWh)' value='50.20' width='160px'></StateCard>
              <StateCard title='可放电(kWh)' value='251.02' width='160px'></StateCard>
            </div>
          </RightItem>
          <RightItem title='最新告警'>
            {/* <Link className={style.toWarning} to='/index/runtimeStorage/alarmMessage'>查看详情</Link> */}
            <span className={style.toWarning} onClick={()=>toWarning()}>查看详情</span>
            <div className={style.warningDetails}>
              {warningData.map((item, index) => {
                return <Fragment key={index}>
                  <WarningCard data={item} ></WarningCard>
                  {warningData.length > (index + 1) ? <div className={style.dashed} style={{marginTop: 21, marginBottom: 21}}></div> : null }
                </Fragment>
              } )}
            </div>
          </RightItem>
        </div>
      </div>
    </div>
  )
}
