import React, { useState, useEffect, useRef,useMemo } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { useRequest, useToggle, useAntdTable } from 'ahooks'
import { GetLogOperation, Remote, Monitoring } from '@api/api.js'
import { Form, DatePicker, Input, Button, Table, Pagination, Select, message, Modal, Spin ,Space,Divider} from 'antd'
import Bluecolumn from '@com/bluecolumn'
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import CustContext from '@com/content.js'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import redwarn from '@imgs/redwarn.png'
import imgurl from './images/index.js'
import UseHeader from '@com/useHeader'
import style from './style.module.less'
import moment from 'moment'
const { RangePicker } = DatePicker;
const {DeviceTypeManager: {AllDeviceStyle} } = Monitoring
export default function Index() {
  const projectId = useSelector(selectProjectId)
  let [areaId, setAreaId] = useState(0)
  // let [pageNum, setpageNum] = useState(1)
  // let [totalalarm, settotalalarm] = useState(1)
  // let [dataSourceLog, setdataSourceLog] = useState([])
  let [dataSourceRead, setdataSourceRead] = useState([])
  let [DataSourceReadR, setDataSourceReadR] = useState([])
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]
  const tableRef = useRef()
  tableRef.current = DataSourceReadR
  // let [alike, setalike] = useState('')
  // let [deviceStyle, setdeviceStyle] = useState(0)
  let [readout, setreadout] = useState(false)
  // const [selectTableList, setselectTableList] = useState([])
  const [loading, setLoading] = useState(false);
  const tableRefs= useRef()
  const [devices, setDevies] = useState([])
  const getType = async () => { // 获取设备类型
      
      try {
        let {success, data} = await AllDeviceStyle();
        if(success && Array.isArray(data)) {
           setDevies(data);
        }else {
          setDevies([]);
        }
      } catch (error) {
        setDevies([]);
      }
}
useEffect(() => {
  getType()
}, [])
  // const [selectTableListRadio, setselectTableListRadio] = useState([])
  // const [selectTableListCheckbox, setselectTableListCheckbox] = useState([])
  // let params = {
  //   pageNum: pageNum,
  //   pageSize: 15,
  //   projectId: projectId,
  //   areaId: areaId,
  //   gatewayId: 0,
  //   deviceStyle: deviceStyle,
  //   category: '',
  //   alike: alike,
  //   state: 0
  // }
  // const getData = () => {//设备统计
  //   return Remote.AllCallMeter(params).then(res => {
  //     let { success, data } = res
  //     if (success) {
  //       setdataSourceLog(data)
  //       settotalalarm(res.total)
  //     } else {
  //       message.error(res.errMsg)
  //     }
  //   })
  // }
  // useEffect(() => {
  //   if (areaId) {
  //     getData()
  //   }
  // }, [projectId, pageNum, areaId, deviceStyle, alike])
  const [form] = Form.useForm()
    const {Item} = Form
    const getData = ({current, pageSize}, form={}) => {
       let {alike, deviceStyle} = form
       let params ={pageNum: current, pageSize, projectId, areaId, gatewayId: 0, state: 0,category: '', deviceStyle, alike}
       return Remote.AllCallMeter(params).then(res => {
        let {success, data, total} = res
        if(success && Array.isArray(data) && data.length > 0) {
           return {
            list: data,
            total,
           }
        }else {
            return {
                list: [],
                total: 0,
               }
        }
       }).catch(e => {
        console.log(e)
       })

    }
   const {tableProps, search} = useAntdTable(getData, {
    form,
    defaultPageSize: 18,
    refreshDeps: [areaId]
   })
   const {submit} = search
  const changeArea = (value) => {
    setAreaId(value);
  };
  // const submit = e => {
  //   setalike(e.target.value)
  // }
  const changeType = () => {
    getData()
  }
  let [state, setstate] = useState(1)
  const changeTab = val => {
     setstate(val)
    // setpageNum(1)
    if (val == 2) {
      setSelectionType("checkbox")
      // setselectTableList(selectTableListCheckbox)
    } else if (val == 1) {
      setSelectionType("radio")
      // let list = []
      // list.push(selectTableListCheckbox[0])
      // setselectTableList(selectTableListCheckbox ? list : [])
    }
  }
  const [selectionType, setSelectionType] = useState("radio");
  const columnsLog = [
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      id: 'id'
    },
    {
      title: '设备型号',
      dataIndex: 'category',
      key: 'sn',
      id: 'id'
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'sn',
      id: 'id'
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      key: 'sn',
      id: 'id'
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      render: (status) => <span> {status == 1 ? '离线' : '在线'} </span>,
      key: 'sn',
      id: 'id'
    },
  ];
  let realcolumns = [
    {
      title: '抄读时间',
      dataIndex: 'LastSampleTime',
      key: 'sn',
      id: 'sn',
    },
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      id: 'sn',
    },
    {
      title: 'A相电压(V)',
      dataIndex: 'Ua',
      key: 'sn',
      id: 'sn',
    },
    {
      title: 'B相电压(V)',
      dataIndex: 'Ub',
      key: 'sn',
      id: 'sn',
    },
    {
      title: 'C相电压(V)',
      dataIndex: 'Uc',
      key: 'sn',
      id: 'sn',
    },
    {
      title: 'A相电流(A)',
      dataIndex: 'Ia',
      key: 'sn',
      id: 'sn',
    },
    {
      title: 'B相电流(A)',
      dataIndex: 'Ib',
      key: 'sn',
      id: 'sn',
    },

    {
      title: 'C相电流(A)',
      dataIndex: 'Ic',
      // render: (data) => <span> {JSON.parse(data).Ic} </span>,
      key: 'sn',
      id: 'sn',
    },
    {
      title: '总电度(kWh)',
      dataIndex: 'EP',
      key: 'sn',
      id: 'sn',
    }
  ]
  const onChangePageLog = (page, pageSize) => {
    console.log(page)
    setpageNum(page)
  }
  const headerProps = {
    isEnergy: false,//能耗类型
    isDate: false,//日期
    isShift: false,//班次
    isTab: false,//能耗、费用radioButton
    isSearch: false,//查询按钮
    isExport: false,//导出按钮
    allarea:areaOptions
    //export: exportData //导出调用方法
  }
  const getFromChild = data => {
    console.log(data.areaId)//园区id
    if (data.areaId == undefined) {
      return
    } else {
      setAreaId(data.areaId)
    }
  }
  const handleChangeDevice = (value) => {
    console.log(value)
    setdeviceStyle(value)
  }
  let snList = []
  const [isClick, setIsClick] = useState(false)
  const rowSelectionRadio = {
    tableRefs,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // setselectTableListRadio(selectedRows)
      // setselectTableList(selectedRows)
      tableRefs.current=selectedRows
      if (selectedRows[0].status == 1) {
        setIsClick(true)
      } else {
        setIsClick(false)
      }
    },
  }
  const rowSelectionCheckbox = {
    tableRefs,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // setselectTableListCheckbox(selectedRows)
      // setselectTableList(selectedRows)
      tableRefs.current=selectedRows
      if (selectedRowKeys.length > 0) {
        selectedRows.map(item => {
          if (item.status == 1) {
            setIsClick(true)
          } else {
            setIsClick(false)
          }
        })
      } else {
        setIsClick(false)
      }
    },
  }

   const changeReadout = () => {
    snList = []
    if (tableRefs.current&&tableRefs.current.length > 0) {
      tableRefs.current.map((item, index) => {
        snList.push(item.sn)
      })
    }
   
    if (tableRefs.current&&tableRefs.current.length > 0) {
      setLoading(true)
      Remote.StartCalling(snList).then(res => {
        let { success, data } = res
        if (success) {
          let isOkList = []
          let isresetOk = []
          let setResultInfo = {}
          let setResultInfoList = []
          data.map((item, index) => {
            setResultInfo = { id: "", status: 2 }
            setResultInfoList.push(setResultInfo)
            setResultInfoList[index].id = item.id
            if (item.isOk == true && item.errorCode == 0) {
              isOkList.push({ sn: item.sn, taskNo: item.taskNo })
            } else {
              message.error('设备' + item.sn + '抄读失败！')
              setLoading(false)
            }
          })
          if (isOkList.length > 0) {
            let count = [1, 2, 3]
            let arr = []
            let resData = []
            let status = true
            count.map((item, index) => {
             
              setTimeout(() => {
                if (status) {
                  Remote.CallingResponse(isOkList).then(res => {
                    arr.push(index)
                    let { success, data } = res
                    if (success) {
                      resData = []
                      isOkList = []
                      data.map((item, index) => {
                        if (item.isOk  && item.errorCode == 0) {
                          resData.push(item)
                          setResultInfoList[index].status = 1
                        } else {
                          
                          isOkList.push({ sn: item.sn, taskNo: item.taskNo })
                        }
                        console.log(arr, resData)
                        if (arr.length == 3 || resData.length == data.length) {
                          setreadout(true)
                          setLoading(false)
                          status = false
                          let arrlist = []
                          resData.map(item => {
                            arrlist.push({ ...JSON.parse(item.data), sn: item.sn })
                          })
                          setdataSourceRead(arrlist)
                          console.log(dataSourceRead)
                          Remote.SetResult(setResultInfoList).then((res) => { })
                        }
                      })
                    } else {
                      message.error(res.errMsg)
                      setLoading(false)
                    }

                  })
                }

              }, 5000 * index)

            })

          }

        } else {
          message.error(res.errMsg)
        }
      })
    } else {
      message.error('请先选择设备！')
    }
  }  
  return (
    <Spin tip="正在抄读，请稍候……" size="large" spinning={loading}>
      <div className={style.main}>
        <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
        <div className={style.header}>
          <Button className={state == 1 ? style.tabon : style.taboff} onClick={() => { changeTab(1) }}>单表抄读</Button>
          <Button className={state == 2 ? style.tabon : style.taboff} onClick={() => { changeTab(2) }}>批量抄读</Button>
        </div>
        <div className={style.body}>
        <div className={style.mainBox} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Form form={form} className={style.bodyHeader} layout='inline' initialValues={{deviceStyle: 1, alike: ''}}>
                        <Space size={32}>
                        <Item name="deviceStyle" style={{marginBottom: '0px', marginRight: '0px'}}>
                        <Select
                           style={{width: "128px"}}
                            fieldNames={{label: "name", value: "deviceStyle"}}
                            onChange={submit}
                            options={devices}
                        />
                        </Item>
                        <Divider type="vertical" style={{margin: '0px', height: '32px'}} dashed />
                        <Item name="alike" label="设备查询" style={{marginBottom: '0px', marginRight: '0px'}}>
                            <Input.Search placeholder='请输入设备编号/安装地址' allowClear style={{ width: '370px' }} size='middle' enterButton="查询" onSearch={submit} /> 
                             
                        </Item>
                        <Divider type="vertical" style={{margin: '0px', height: '32px'}} dashed />
                        <Space size={16}>
                        <Button size='middle' disabled={isClick} style={{ width: 96, height: 32, backgroundColor: '#237AE4', color: '#fff',borderRadius:2 }} onClick={() => { changeReadout() }}>实时抄读</Button>
                        </Space>
                        </Space>
                    </Form>
                    <img src={imgurl.line} className={style.timeline} ></img>
                    {selectionType == 'radio' ? <div style={{display: 'flex', flex: 1}}>
                        <UserTable columns={columnsLog}   rowKey={columnsLog => columnsLog.sn} className={style.alarmTable} {...tableProps}  rowSelection={{
                            type: 'radio',  
                            ...rowSelectionRadio,
                          
                        }} bordered></UserTable>
                      {/*   <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} /> */}
                    </div> : <div style={{display: 'flex', flex: 1}}>
                        <UserTable columns={columnsLog}   rowKey={columnsLog => columnsLog.sn} className={style.alarmTable} {...tableProps}  rowSelection={{
                            type: 'checkbox',
                            ...rowSelectionCheckbox,
                        }} bordered></UserTable>
                       {/*  <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} /> */}
                    </div>}
                </div>
          {/* <div className={style.mainBox}>
            <div className={style.bodyHeader}>
              <Select
                defaultValue={0}
                style={{
                  width: 128,
                }}
                onChange={handleChangeDevice}
                options={[
                  {
                    value: 0,
                    label: '全部',
                  },
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
                ]}
              />
              <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
              <div className={style.contentTitle}>
                <span>设备查询</span>
                <Input placeholder='请输入设备编号/安装地址' style={{ width: 291, marginLeft: 16 }} size='middle' onChange={submit}></Input>
                <Button size='middle' style={{ width: 80, backgroundColor: 'rgb(245,247,250)', borderLeft: 'none' }} onClick={() => { changeType() }}>查询</Button>
              </div>
              <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
              <Button size='middle' disabled={isClick} style={{ width: 96, height: 32, backgroundColor: '#237AE4', color: '#fff' }} onClick={() => { changeReadout() }}>实时抄读</Button>
            </div>
            <img src={imgurl.line} className={style.timeline} ></img>
            {selectionType == 'radio' ? <div>
              <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.sn} className={style.alarmTable} pagination={false} rowSelection={{
                type: 'radio',
                ...rowSelectionRadio,
              }} bordered></Table>
              <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} showSizeChanger={false}/>
            </div> : <div>
              <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.sn} className={style.alarmTable} pagination={false} rowSelection={{
                type: 'checkbox',
                ...rowSelectionCheckbox,
              }} bordered></Table>
              <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} showSizeChanger={false}/>
            </div>}
          </div> */}
        </div>
        <Modal
          title={<Bluecolumn name="实时抄读" />}
          open={readout}
          centered={true}
          onCancel={() => { setreadout(false) }}
          width={1218}
          className={style.readoutBule}
          footer={[<Button type='primary' style={{ width: 96, height: 36 }} onClick={() => { setreadout(false) }}>关闭</Button>]}
        >
          <UserTable className={style.readTable} columns={realcolumns} dataSource={dataSourceRead} rowKey={realcolumns => realcolumns.sn} ></UserTable>

        </Modal>
      </div>
    </Spin>
  )
}
