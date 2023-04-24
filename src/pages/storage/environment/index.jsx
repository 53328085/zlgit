import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import style from './style.module.less'
import { Button, DatePicker, message, Form, Select } from 'antd'
import moment from 'moment'
import { CaretLeftOutlined, CaretRightOutlined, SearchOutlined  } from '@ant-design/icons'
import CustModal from '@com/useModal'
import * as echarts from 'echarts'
import bgImg from './imgs/background.png'
import { StorageEnvironmentRuntime, SiteManagerDesigner } from '@api/api'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'

export default function Index() {

  const TempRef = useRef()
  const lineRef = useRef()
  const { queryEnvironmentInfo, queryTrends } =  StorageEnvironmentRuntime
  const today = new Date().toLocaleDateString().replace(/\//g, '-')
  const [form] = Form.useForm()
  const [headForm] = Form.useForm()
  const Item = Form.Item

  const { FindSiteList } = SiteManagerDesigner

  const dispatch = useDispatch()
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const areaName = useSelector(levelDefaultLabel) || '园区'
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)

  //页面组件
  const CustomCss = styled.div`
    width: 234px;
    height: 680px;
    margin-right: 148px;
    background-image: url('${bgImg}');
    background-size: 100% 100%;
    position:relative;
    .name{
      position: absolute;
      padding: 0 4px;
      top: 30px;
      right: 20px;
      height: 20px;
      line-height: 20px;
      color: #fff;
      background-color: #237ae4;
    }
    .itemTitle{
      position: absolute;
      left: 0;
      bottom: 456px;
      width: 234px;
      height: 24px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      line-height: 24px;
    }
    .itemData{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 234px;
      height: 456px;
      padding: 16px;
      .item{
        margin-bottom: 16px;
        width: 200px;
        background-color: #fff;
        .monitorTitle{
          width: 100%;
          height: 24px;
          line-height: 24px;
          text-align: center;
          font-size:12px;
          color: #fff;
        }
        .temData{
          padding-top: 6px;
          display: flex;
          align-items: center;
          .tem{
            width: 50%;
            font-size: 12px;
            color: #515151;
            padding-left: 24px;
          }
        }
        .tempTime{
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          color: #999;
          text-align: center;
        }
        .monitorData{
          height: 48px;
          padding: 0 10px;
          font-size: 14px;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span{
            display: inline-block;
            min-width: 20px;
            text-align: center;
          }
        }
      }
    }
  `
  const LeftButton = styled(CaretLeftOutlined)`
    font-size: 64px;
    position: absolute;
    left: -12px;
    top: 76px;
    color: #3c3c62;
    cursor: pointer;
      &:hover{
        color: #f2f2f2;
      }
  `
  const RightButton = styled(CaretRightOutlined)`
    font-size: 64px;
    position: absolute;
    right: -12px;
    top: 76px;
    color: #3c3c62;
    cursor: pointer;
      &:hover{
        color: #f2f2f2;
      }
  `
  const [count, setCount] = useState(0)
  const transLeft = () => {
    if((count)<= 0) return;
    setCount(count - 1)
  }
  const transRight = () => {
    if((count + 4)>= length) return;
    setCount(count + 1)
  }
  const CustomData = props => {
    let {data} = props
    return <CustomCss>
      <div className='name'>{data.name}</div>
      <div className='itemTitle'>环境监控</div>
      <div className='itemData'>
        <div className='item' style={{cursor:'pointer'}} onClick={()=>showChart(data.id)}>
          <div className='monitorTitle' style={{backgroundColor:'#237ae4', border: '1px solid #237ae4'}}>空调监控</div>
          <div className='temData'>
            <div className='tem'>
              <span>温度</span>
              <div>
                <span style={{fontSize:20}}>{ data.airTemp }</span>
              </div>
            </div>
            <div className='tem'>
              <span>湿度</span>
              <div>
                <span style={{fontSize:20}}>{ data.airHumidity }</span>
              </div>
            </div>
          </div>
          <div className='tempTime'> {data.airInformTime}</div>
        </div>
        <div className='item' style={{cursor:'pointer'}}>
          <div className='monitorTitle' style={{backgroundColor:'#237ae4', border: '1px solid #237ae4'}}>环境温湿度</div>
          <div className='temData'>
            <div className='tem'>
              <span>温度</span>
              <div>
                <span style={{fontSize:20}}>{ data.environmentTemp }</span>
              </div>
            </div>
            <div className='tem'>
              <span>湿度</span>
              <div>
                <span style={{fontSize:20}}>{ data.environmentHumidity }</span>
              </div>
            </div>
          </div>
          <div className='tempTime'> {data.environmentInformTime}</div>
        </div>
        <div className='item'>
          <div className='monitorTitle' style={{backgroundColor:'#093', border: '1px solid #093', height: 32, lineHeight:'32px'}}>水浸监控</div>
          <div className='monitorData'>
            <span>{ data.waterOutInformTime }</span>
            <span>{ data.waterOutWarning  }</span>
          </div>
        </div>
        <div className='item'>
          <div className='monitorTitle' style={{backgroundColor:'#093', border: '1px solid #093', height: 32, lineHeight:'32px'}}>灭火器监控</div>
          <div className='monitorData'>
            <span>{ data.fireInformTime }</span>
            <span>{ data.fireWarning }</span>
          </div>
        </div>
      </div>
    </CustomCss>
  }

  //页面数据
  const [storageData, setStorageData] = useState([])
  const [headerData, setHeaderData] = useState({})

  //siteList
  const [siteName, setSiteName] = useState('')
  const [siteList, setSiteList] = useState([])
  const querySite = () => {
    FindSiteList(projectId, headForm.getFieldValue('areaId')).then(res => {
      if (res.success) {
        if (res.data && res.data.length > 0) {
          setSiteList(res.data)
          headForm.setFieldValue('siteId', res.data[0].id)
          setSiteName(res.data[0].name)
          getFromHeader()
        } else {
          setSiteList([])
          setSiteName('')
          message.warning('当前' + areaList[0]?.levelName + '不存在站点!')
          return;
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const changeSite = val => {
    siteList.map(item => {
      if(item.id == val){
        setSiteName(item.name)
      }
    })
    getFromHeader()
  }

  useEffect(() => {
    if (areaList.length == 0 || !areaList) {
      message.error('当前项目尚未创建园区!')
    } else {
      headForm.setFieldValue('areaId', oneLevelDefaultId)
      querySite()
    }
  }, [])
  const changeArea = (val) => {
    areaList.map(item => {
      if(item.id == val){
        dispatch(setCurrentlevel(item))
      }
    })
    headForm.setFieldValue('siteId', null)
    querySite()
  }

  const getFromHeader = () => {
    queryEnvironmentInfo(projectId, headForm.getFieldValue('areaId'), headForm.getFieldValue('siteId')).then(res => {
      if(res.success){
        if(res.data){
          setStorageData(res.data)
        }else{
          setStorageData([])
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

   //弹窗
  const [roomId, setRoomId] = useState(0)
  const getTrends = (projectId, roomId, date) => {
    queryTrends(projectId, roomId, date).then(res=> {
      let {success, data} = res
      if(success){
        if(data){
          let tempTrends = []
          let humidityTrends = []
          let time = []
          data.tempTrends.map(item => {
            tempTrends.push([item.x, item.y]),
            time.push(item.x)
          })
          data.humidityTrends.map(item => {
            humidityTrends.push([item.x, item.y])
            time.push(item.x)
          })
          time = [...new Set(time)]
          setTimeout(()=>{
            drawLine({
              time,
              humidityTrends,
              tempTrends,
            })
          })
        }else{
          drawLine({
            time:[],
            tempTrends:[],
            humidityTrends:[],
          })
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const showChart = (id) => {
    setRoomId(id)
    form.setFieldValue('date', moment(today,'YYYY-MM-DD'))
    getTrends(projectId, id, today) 
    TempRef.current.onOpen()
  }
 
  const onOk = () => {
    TempRef.current.onCancel()
  }
  const drawLine = (lineData)=> {
    let lineChart = echarts.init(lineRef.current);
    lineChart.clear()
    lineChart.setOption({
      color:['#237ae4', '#093'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '0',
        left: 'center'
      },
      grid: {
        left: '32px',
        right: '20px',
        bottom: '48px',
        top: '32px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick:{
          alignWithLabel:true
        },
        data: lineData.time
      },
      yAxis: {
        type: 'value',
        // min: 24
        scale: true, //自适应
      },
      dataZoom:{
        type:'slider',
        height: 24
      },
      series: [
        {
          name: '温度(℃)',
          data: lineData.tempTrends,
          type: 'line',
          symbol:'circle', 
        },
        {
          name: '湿度(%)',
          data: lineData.humidityTrends,
          type: 'line',
          symbol:'circle', 
        }
      ]
    }, true)
  }
  const onSearch = () => {
    const date = form.getFieldValue('date').format('YYYY-MM-DD')
    getTrends(projectId, roomId, date) 
  }

  //defaultValue={moment(today,'YYYY-MM-DD')}
  return (
    <div>
      <div className={style.header}>
        <Form form={headForm} layout='inline'>
          <Item name='areaId' label={areaName + '选择'} style={{ marginLeft: 16 }}>
            <Select
              placeholder="请选择"
              size="middle"
              style={{ marginLeft: 16, width: '200px' }}
              onChange={changeArea}
            >
              {areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.line}></div>
          <Item name='siteId' label='站点选择' style={{ marginLeft: 16 }}>
            <Select
              placeholder="请选择站点"
              size="middle"
              style={{ marginLeft: 16, width: '200px' }}
              onChange={changeSite}
            >
              {siteList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
        </Form>
      </div>
      <div className={style.mainContent}>
        <div className={style.title}>{siteName}</div>
        <div className={style.yaxis}></div>
        <div className={style.xaxis}></div>
        <div className={style.dataList}>
          <div className={style.transLate} style={{ width: (parseInt(storageData.length / 4) + 1) * 100 + '%', left: (-(count * 382) + 65)}}>
            { storageData.map((item, index) =>{
              return <CustomData data={item} key={index}></CustomData>
            } ) }
          </div>
          <LeftButton onClick={()=>transLeft()}></LeftButton>
          <RightButton onClick={()=>transRight()}></RightButton>
        </div>
      </div>
      <CustModal title='温湿度趋势' ref={TempRef}  mold="cust" width={1680}  onOk={()=>onOk()}>
        <div style={{ position:'absolute', right: 32, top:32, display: 'flex',alignItems:'center'}}>
          <span>日期</span>
          <Form name='addForm' form={form}>
            <Item name='date' label=''>
              <DatePicker style={{width: 182, margin: '0 16px' }} ></DatePicker>
            </Item>
          </Form>
          <Button type='primary' icon={<SearchOutlined />} style={{width: 96}} onClick={()=> onSearch()}>查询</Button>
        </div>
        <div className={style.lineChart} ref={lineRef}></div>
      </CustModal>
    </div>
  )
}
