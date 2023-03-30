import React, { useState, useEffect, useContext, useRef } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import UseHeader from '@com/useHeader'
import { Input, Button, Select, Radio, Pagination, FormTable, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import {  Link, useNavigate, useLocation } from 'react-router-dom'
import { useRequest } from "ahooks";
import style from './style.module.less'
import Icard from './card'
import imgurl from './images/index.js'
import { Monitoring } from '@api/api.js'
import { selectProjectId,selectOneLevel } from '@redux/systemconfig.js'
import { SemanticClassificationFormat } from 'typescript';
import Table from '@com/useTable'
import { area } from '@antv/g2plot';


export default function Index(props) {
  const tableLoadRef = useRef()
  const projectId = useSelector(selectProjectId)
  // const [messageApi, contextHolder] = message.useMessage();
  const { RuntimeDevice: { Statistics, Overview, CategoryImages, Detail, Current, HistoryTrend, HistoryTable, EnergyActuary, EnergyReport, AlarmPage },DeviceManager: { QueryUsedDeviceCategory } } = Monitoring
  let [deviceStyle, setdeviceStyle] = useState(1)
  let [statistics, setStatistics] = useState({})
  let [overView, setoverView] = useState({ details: undefined, categories: undefined })
  const areaList = useSelector(selectOneLevel)
  const [defaultArea, setDefaultArea] = useState(areaList[0]?areaList[0].id:undefined)
  let [areaId, setAreaId] = useState(defaultArea)
  let [optionsGateway, setoptionsGateway] = useState([])
  const [changeTag, setChangeTag] = useState('')
  const [isCard, setisCard] = useState(true)//卡片模式true或列表模式false
  let inputValue = ''
  const [page, setpage] = useState(1)
  let [total, setTotal] = useState(0)
  let [imageList, setimageList] = useState([])
  let [pageNum, setPageNum] = useState(1)
  let params = {
    projectId: projectId,
    areaId: areaId,
    gatewayId: 0,
    deviceStyle:deviceStyle,
    category:'',
    alike: '',
    state: 0,
    pageNum: page,
    pageSize: 12,
  }
  const showTotal = (total) => `共 ${total} 条记录`;
  const columns = [
    {
      title: '设备详情',
      dataIndex: 'id',
      render: (text) => <span style={{textAlign:'center'}}> {'>'}</span>,
      key: 'sn',
      id: 'id',
    },
    {
      title: '设备编号',
      dataIndex: 'sn',
      render: (sn) => <Link to={{
        pathname: "/deviceDetail?sn="+sn,
    }} target="_blank"> {sn} </Link>,
      key: 'sn',
      id: 'id'
    },
    {
      title: '设备型号',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    // {
    //   title: '电流(A)',
    //   dataIndex: 'connMethod',
    //   key: 'connMethod',
    //   id: 'id'
    // },
    // {
    //   title: '电压(V)',
    //   dataIndex: 'childrenCnt',
    //   key: 'childrenCnt',
    //   id: 'id'
    // },
    // {
    //   title: '功率(kW)',
    //   dataIndex: 'childrenCnt',
    //   key: 'childrenCnt',
    //   id: 'id'
    // },
    // {
    //   title: '用电量(kWh)',
    //   dataIndex: 'childrenCnt',
    //   key: 'childrenCnt',
    //   id: 'id'
    // },
    {
      title: '设备状态',
      dataIndex: 'state',
      render: (state) => <span> {state==1?'失联':state==2?'在线':'告警'}</span>,
      key: 'state',
      id: 'id'
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
      id: 'id'
    },
    {
      title: '更新时间',
      dataIndex: 'lastSampleTime',
      key: 'lastSampleTime',
      id: 'id'
    },
  ];
  let [dataSource, setdataSource] = useState([])

  const getData = () => {//设备统计
    return Statistics({ projectId, areaId,deviceStyle }).then(res => {
      let { success, data } = res
      if (success) {
        setStatistics(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const getGatewayUsed = () => {//使用的网关
    return QueryUsedDeviceCategory({projectId:projectId,deviceStyle:deviceStyle}).then(res => {
      let { success, data } = res
      if (success) {
        setoptionsGateway(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const getOverviewData = () => {//设备统计
    return Overview(params).then(res => {
      let { success, data, total, pageNum } = res
      if (success) {
        setoverView(data)
        setTotal(total)
        setPageNum(pageNum)
        setdataSource(data.details)
      } else {
        message.error(res.errMsg)
      }
    })
  }

  let [imgUrl, setimgUrl] = useState()
  const getGatewayImages = () => {//网关图片
    return CategoryImages({projectId:projectId,group:overView.categories}).then(res => {
      let { success, data } = res
      if (success) {
        if(data!=[]){
          let imgList=[]
            overView.details.map((item, index) => {
              data.map((items,indexs)=>{
                if (data[indexs].category == item.category) {
                  imgList.push(data[indexs].imageBase64)
                } else {
                }
              })
            })
            setimageList(imgList)
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const { run: queryData } = useRequest(getGatewayUsed, {
    refreshDeps: [changeTag],
    manual: true,
  })

  const changeArea = (value) => {
    setAreaId(value);
  };
  const handleChangeDevice=(value)=>{
    console.log(value)
    setdeviceStyle(value)
  }
  const onChangeValue = e => {
    inputValue = e.target.value
  }//输入框改变值
  const onSearchList = () => {
    params.alike = inputValue
    getOverviewData()
  }//点击查询按钮
  const handleChange = e => {
    params.category = e
    getOverviewData()
  }//网关型号选择
  const handleChangeState = e => {
    params.state = e
    getOverviewData()
  }//网关状态选择
  const changeTab = val => {
    setisCard(val.target.value == 'card' ? true : false)
    setpage(1)
    getOverviewData()
  }//切换卡片列表模式

  const exportExecel = () => {
    tableLoadRef.current.download()
  }//数据导出
  
  useEffect(() => {
    if(areaList.length == 0 || !areaList){
      message.error('当前项目尚未创建园区!')
      return;
    }
  }, [])
  useEffect(() => {
    if(areaId){
      getData()
    queryData()
    }
  }, [areaId, changeTag,deviceStyle])
  useEffect(() => {
    if(areaId){
      getOverviewData()
    console.log('getOverviewData')
    }
  }, [params.alike, params.areaId, params.category, params.pageNum, params.projectId, params.state, page,params.deviceStyle])
  useEffect(() => {
    if (overView.categories) {
      getGatewayImages()
      console.log(456)
    }
  }, [overView.categories])
  const onChangePage = (page, pageSize) => {
    setpage(page)
  }
  return (
    <div>
      {/* <UseHeader {...headerProps} getValues={getFromChild}></UseHeader> */}
      <div className={style.header}>
      <span style={{ marginLeft: "16px", marginRight: 16 }}>{areaList[0]?.levelName || '园区'}选择</span>
      <Select
          placeholder="请选择园区"
          size="middle"
          key={defaultArea}
          defaultValue={defaultArea}
          style={{ width: "200px" }}
          onChange={changeArea}
        >
          {areaList.map((item) => {
            return (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
        <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
        <span style={{  marginRight: 16 }}>表计类型</span>
        <Select
              defaultValue={1}
              style={{
                width: 200, marginLeft: 16
              }}
              onChange={handleChangeDevice}
              options={[
                {
                  value: 1,
                  label: '电表',
                },
                {
                  value: 2,
                  label: '水表',
                },
                {
                  value: 3,
                  label: '燃气表',
                },
                {
                  value: 4,
                  label: '传感器',
                },
                {
                  value: 5,
                  label: '变压器',
                },
              ]}
            />
      </div>
      <div className={style.bottom}>
        <div className={style.bottomTab}>
           <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><span>表计查询</span><Input size="middle" placeholder='输入表计编号/安装地址' style={{ width: '260px', marginLeft: 16 }} onChange={onChangeValue} />
            <Button style={{ width: 80, backgroundColor: '#F5F7FA', color: '#515151' ,borderLeft:'none'}} size="middle" onClick={() => { onSearchList() }}>查询</Button>
            <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div></div>
          <span>表计型号</span>
          <Select
            defaultValue=''
            style={{
              width: 200, marginLeft: 16
            }}
            onChange={handleChange}
          >
            <Select.Option value={''}>全部型号</Select.Option>
            {optionsGateway.map((item, index) => {
              return (
                <Select.Option key={index} value={item}>
                  {item}
                </Select.Option>
              );
            })}
          </Select>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div><span>表计状态</span>
            <Select
              defaultValue={0}
              style={{
                width: 200, marginLeft: 16
              }}
              onChange={handleChangeState}
              options={[
                {
                  value: 0,
                  label: '全部(' + statistics.all + ')',
                },
                {
                  value: 2,
                  label: '正常(' + statistics.on + ')',
                },
                {
                  value: 1,
                  label: '失联(' + statistics.off + ')',
                },
                {
                  value: 3,
                  label: '告警(' + statistics.alarm + ')',
                },
              ]}
            /></div> 
          <div className={style.radioBox}>
            <Radio.Group onChange={changeTab} defaultValue="card" buttonStyle="solid">
              <Radio.Button style={{ width: '96px', marginLeft: 16, textAlign: 'center', }} value="card">卡片模式</Radio.Button>
              <Radio.Button style={{ width: '96px', textAlign: 'center', }} value="list">列表模式</Radio.Button>
            </Radio.Group>
            <Button style={{ width: 80, backgroundColor: '#F5F7FA', color: '#515151', marginLeft: 16 }} size="middle" onClick={() => { exportExecel() }}>导出</Button>
          </div>
        </div>
        <div style={{ marginTop: 16, marginBottom: 16, width: 1649, borderTop: "1px dashed #515151" }} ></div>
        {isCard ? <div className={style.cardBox}>
          {overView.details!=null?overView.details.map((item, index) => {
            return <div key={index}>
              <Link  to={`/deviceDetail?sn=${item.sn}`}   target="_blank">
                  <Icard img={imageList[index]? imageList[index] : imgurl.category} title={item.sn}

                    value={item.address} state={item.state} fields={item.fields} 
                    lastSampleTime={item.lastSampleTime} category={item.category} />
                    </Link>
            </div>
          }):''}
      </div> : <div className={style.tableHead}>
        <Table columns={columns} dataSource={dataSource} rowKey={columns => columns.id} ref={tableLoadRef}></Table>
      </div>}
      <Pagination className={style.pageNum} size="small" current={pageNum} total={total} showTotal={showTotal} defaultPageSize={12} onChange={onChangePage} />
    </div>

    </div >
  )
}
