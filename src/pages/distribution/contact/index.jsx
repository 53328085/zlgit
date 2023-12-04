import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import UseHeader from '@com/useHeader'
import { Input, Button, Select, Radio, Pagination, FormTable, message, Space, Divider, Form } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useRequest } from "ahooks";
import style from './style.module.less'
import Icard from './card'
import imgurl from './images/index.js'
import { Monitoring, distributionRoom, DistributionRoomRuntime } from '@api/api.js'
import { ExportExcel } from '@com/useButton'
import { selectProjectId, selectOneLevel, selectOneLevelDefaultId, levelDefaultLabel } from '@redux/systemconfig.js'

import Table from '@com/useTable'



let inputValue = ''
export default function Index(props) {
  const tableLoadRef = useRef()
  const projectId = useSelector(selectProjectId)
  // const [messageApi, contextHolder] = message.useMessage();
  const { DeviceTypeManager: { AllDeviceStyle }, RuntimeDevice: { Statistics, Overview, CategoryImages, Detail, Current, HistoryTrend, HistoryTable, EnergyActuary, EnergyReport, AlarmPage }, DeviceManager: { QueryUsedDeviceCategory } } = Monitoring
  let [deviceStyle, setdeviceStyle] = useState(1)
  let [statistics, setStatistics] = useState({})
  let [overView, setoverView] = useState({ details: undefined, categories: undefined })
  const areaLists = useSelector(selectOneLevel)
  const oneLevel = useSelector(state => state.system.onelevel)
  const LevelDefaultId = useSelector(selectOneLevelDefaultId)
  const areaList = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
  const defaultLabel = useSelector(levelDefaultLabel)

  const [defaultArea, setDefaultArea] = useState(areaList[0] ? areaList[0].id : undefined)
  console.log(areaList, oneLevel)
  let [areaId, setAreaId] = useState(defaultArea)
  let [optionsGateway, setoptionsGateway] = useState([])
  const [changeTag, setChangeTag] = useState('')
  const [isCard, setisCard] = useState(true)//卡片模式true或列表模式false 
  let [total, setTotal] = useState(0)
  let [imageList, setimageList] = useState([])
  const roomopts = useSelector(state => state.system.roomId)
  const [roomlist, setRoomList] = useState(roomopts)
  const [roomId, setRoomId] = useState(roomopts[0]?.id)
  const [form] = Form.useForm()
  const { Item } = Form
  let initparams = {
    projectId: projectId,
    // areaId: areaId,
    // gatewayId: 0,
    deviceStyle: 13,
    // category: '',
    alike: '',
    state: 0,
    pageNum: 1,
    pageSize: 12,
  }

  const [params, setParams] = useState(initparams)

  const showTotal = (total) => `共 ${total} 条记录`;
  const columns = [
    {
      title: '设备编号',
      dataIndex: 'sn',
      render: (sn) => <Link to={{
        pathname: "/deviceDetail",
        search: `?sn=${sn}`
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
    {
      title: '设备状态',
      dataIndex: 'state',
      render: (state) => <span> {state == 1 ? '失联' : state == 2 ? '在线' : '告警'}</span>,
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
  let [devices, setDevies] = useState([])

  const getType = async () => { // 表计类型

    try {
      let { success, data } = await AllDeviceStyle();
      if (success && Array.isArray(data)) {
        setDevies(data);
      } else {
        setDevies([]);
      }
    } catch (error) {
      setDevies([]);
    }
  }
  const getData = () => {                   // 表计状态
    DistributionRoomRuntime.Statistics({ projectId: params.projectId, roomId, deviceStyle: params.deviceStyle }).then(res => {
      let { success, data } = res
      if (success) {
        setStatistics(data || [])
      } else {
        message.error(res.errMsg)
      }
    }).catch()
  }
  const getGatewayUsed = () => {            // 表计型号
    QueryUsedDeviceCategory({ projectId: projectId, deviceStyle: params.deviceStyle }).then(res => {
      let { success, data } = res
      if (success) {
        setoptionsGateway(data || [])
      } else {
        message.error(res.errMsg)
      }
    }).catch()
  }
  const getOverviewData = () => {        //   表计数据
    DistributionRoomRuntime.Overview({...params,roomId}).then(res => {
      let { success, data, total, pageNum } = res
      if (success) {

        setoverView(data || [])
        setTotal(total)
        // setPageNum(pageNum)
        let overViewList = []
        data?.details?.map(item => {
          let description = ''
          item.fields.map(items => {
            description += items.name + ' ' + items.value + ' '
          })
          overViewList.push({ ...item, description: description })
        })
        console.log(overViewList)
        setdataSource(overViewList)
      } else {
        message.error(res.errMsg)
      }
    }).catch()
  }

  const paginationProps = {
    current: params.pageNum, //当前页码
    pageSize: params.pageSize, // 每页数据条数
    total, // 总条数
    onChange: (page) => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
    showTotal: (total) => `共${total}条记录`,
  };
  const handlePageChange = (page) => {
    //setPageNum(page);
    setParams({
      ...params,
      pageNum: page
    })
  };





  // let [imgUrl, setimgUrl] = useState()
  const getGatewayImages = () => {//网关图片
    CategoryImages({ projectId: projectId, group: overView.categories }).then(res => {
      let { success, data } = res
      if (success) {
        if (data != []) {
          let imgList = []
          overView?.details?.map((item, index) => {
            data.map((items, indexs) => {
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


  const changeArea = (value) => {
    getRoomList(value)
    // setParams({
    //   ...initparams,
    //   areaId: value,
    //   pageNum: 1,
    // })
  };
  const handleChangeDevice = (value) => {
    console.log(value);
    setParams({
      ...initparams,
      deviceStyle: value,
      pageNum: 1,
    })
  }
  const onChangeValue = e => {
    setParams({
      ...params,
      alike: e.target.value
    })
  }//输入框改变值

  const handleChange = e => {

    // getOverviewData()
    setParams({
      ...params,
      category: e,
      pageNum: 1,
    })
  }//网关型号选择
  const handleChangeState = e => {
    setParams({
      ...params,
      state: e,
      pageNum: 1,
    })
   

  }//网关状态选择
  const changeTab = val => {
    console.log(val)
    setisCard(val.target.value == 'card' ? true : false)
    // setPageNum(1)
    // setParams({ 
    //   ...initparams
    // })
    //getOverviewData()
  }//切换卡片列表模式


  const onExport = useCallback(() => {        //   表计数据
    let posts = { ...params,roomId, pageNum: 1, pageSize: total }
    return DistributionRoomRuntime.Overview(posts).then(res => {
      let { success, data, total, pageNum } = res
      if (success) {
        // setPageNum(pageNum)
        let overViewList = []
        data?.details?.map(item => {
          let description = ''
          item.fields.map(items => {
            description += items.name + ' ' + items.value + ' '
          })
          overViewList.push({ ...item, description: description })
        })
        return {
          list: overViewList,
          total,
        }

      } else {
        message.error(res.errMsg)
      }
    })
  }, [params])

  const getRoomList = async (areaId) => {
    const resp = await distributionRoom.RoomList(projectId, areaId)
    if (resp.success) {
      setRoomList(resp.data)
      setParams({
        ...initparams,
        pageNum: 1,
      })
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        form.setFieldValue('roomId', resp.data[0][['id']])
        setRoomId(resp.data[0][['id']])
       
      } else {
        form.setFieldValue('roomId', [])
        setRoomId(null)
        // setTableData([])

      }
    }
  }
  useEffect(() => {
    getType();
    if (areaList.length == 0 || !areaList) {
      message.error('当前项目尚未创建园区!')
      return;
    }
  }, [])
  useEffect(() => {
    console.log(roomId,Number.isFinite(roomId))
    if (Number.isFinite(roomId)) {
      getOverviewData()
      getData()
      getGatewayUsed()
    }else{
      setdataSource([])
      setoverView({ details: undefined, categories: undefined })
      setStatistics(
        {all: 0, off: 0, on: 0, alarm: 0}
      )
    }
  }, [roomId,params.state])
  useEffect(() => {
    if (overView.categories) {
      getGatewayImages()
      console.log(456)
    }
  }, [overView.categories])
  const onChangePage = (page, pageSize) => {
    // setPageNum(page)

    setParams({
      ...params,
      pageNum: page
    })
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* <UseHeader {...headerProps} getValues={getFromChild}></UseHeader> */}
      <div className={style.header}>
        {/* <span style={{ marginLeft: "16px", marginRight: 16 }}>{defaultLabel || '园区'}选择</span> */}
        <Form
          form={form}
          colon={false}
          layout="inline"
        >
          <Item name="area" label={defaultLabel || '园区'} style={{ marginLeft: "16px", }}>
            <Select
              placeholder="请选择园区"
              size="middle"
              key={defaultArea}
              defaultValue={defaultArea}
              style={{ width: "200px"}}
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
          </Item>
          <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
          <Item>
            <Select
              value={roomId}
              options={roomlist}
              fieldNames={{ label: 'name', value: 'id' }}
              style={{ width: 240, marginLeft: 12 }}
              placeholder="请选择配电房"
              onChange={(v) => {
                setRoomId(v)
              }}></Select>
          </Item>
        </Form>

        

        {/* <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div> */}
      </div>
      <div className={style.bottom} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className={style.bottomTab}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><span>触点查询</span><Input size="middle" placeholder='输入设备编号/安装地址' value={params.alike} style={{ width: '260px', marginLeft: 16 }} onChange={onChangeValue} />
            <Button style={{ width: 80, backgroundColor: '#F5F7FA', color: '#515151', borderLeft: 'none' }} size="middle" onClick={getOverviewData}>查询</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}><div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div><span>测温状态</span>
            <Select
              value={params.state}
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
          <Space size={16} style={{ marginLeft: 'auto' }}>
            <Radio.Group onChange={changeTab} defaultValue="card" buttonStyle="solid">
              <Radio.Button style={{ width: '96px', marginLeft: 16, textAlign: 'center', }} value="card">卡片模式</Radio.Button>
              <Radio.Button style={{ width: '96px', textAlign: 'center', }} value="list">列表模式</Radio.Button>
            </Radio.Group>
            <ExportExcel disabled={isCard} tb={tableLoadRef} />
            {/* <Button style={{ width: 80, backgroundColor: '#F5F7FA', color: '#515151', marginLeft: 16 }} size="middle" disabled={isCard} onClick={() => { exportExecel() }}>导出</Button> */}
          </Space>
        </div>
        <div style={{ marginTop: 16, marginBottom: 16, width: 1649, borderTop: "1px dashed #515151", }} ></div>
        {isCard ? <div className={style.cardBox}>
          {overView.details != null ? overView.details.map((item, index) => {
            let status = Object.prototype.toString.call(item.status) === '[object Object]' ? item.status[1] : ''
            return <div key={index}>
              <Link to={`/deviceDetail?sn=${item.sn}`} target="_blank">
                <Icard img={imageList[index] ? imageList[index] : imgurl.contactor} title={item.name}
                  deviceStyle={params.deviceStyle}
                  value={item.address} state={item.state} fields={item.fields}
                  lastSampleTime={item.lastSampleTime} category={item.sn} />
              </Link>
            </div>
          }) : ''}
        </div> : <div className={style.tableHead} style={{ flex: 1, display: 'flex' }}>
          <Table columns={columns} dataSource={dataSource} rowKey={columns => columns.id} ref={tableLoadRef} onExport={onExport} expandable={{
            expandedRowRender: (record) => (
              <p
                style={{
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                {record.description}
              </p>
            ),
            rowExpandable: (record) => record.description,
          }}
            pagination={paginationProps}
          ></Table>
        </div>}
        {isCard && <Pagination className={style.pageNum} size="small" current={params.pageNum} total={total} showTotal={showTotal} defaultPageSize={12} onChange={onChangePage} showSizeChanger={false} />}
      </div>

    </div >
  )
}
