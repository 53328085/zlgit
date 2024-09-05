import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Space, Button, message, InputNumber, Input, Select, DatePicker, Divider } from 'antd'
import { nanoid } from "@reduxjs/toolkit"
import { selectdiscurlevel, selectProjectId, selectOneLevelDefaultId, selectcurlRommid } from "@redux/systemconfig";
import { SpareParts, distributionRoom } from '@api/api.js'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { useSelector, useDispatch } from 'react-redux'
import Pagecount from "@com/pagecontent";
import UseModal from '@com/useModal'
import { getInitialProps } from 'react-i18next';
import { useOutletContext } from 'react-router-dom'
import { isArray } from 'lodash';
import moment from "moment";

const Mainbox = styled.div`
    && {
      flex: 1;
      display: flex;
      flex-direction: column;
      .content {
        display: grid;
        grid-template-rows: 32px 4px 1fr;
        row-gap: 16px; 
        flex: 1;
        color:#515151;
        padding-top: 16px;
        height: 700px;   
        width: 1650px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

        }
     
        .ant-form-inline {
          .ant-form-item {
            margin-right: 0;
          }
        }
      }
      .ant-form-item{
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        
      }
      .ant-form-item-label{
        width: 100px!important;
        text-align: left;
        margin-right: 16px;
      }
       
       }

`
export default function Index() {
  let { setCustview } = useOutletContext()
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
  const roomId = useSelector(selectcurlRommid)
  const { RangePicker } = DatePicker;
  useEffect(() => {
    setCustview(
      <Button type="primary" onClick={openRecord}>出入库记录</Button>);
    return () => {
      setCustview(undefined)
    }
  }, [])
  const columns = [
    {
      title: '备件名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '备件类型',
      key: 'type',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.type == 1 ? '通用件/标准件' : record.type == 2 ? '易损件' : record.type == 3 ? '电气备件' : '关键备件'}</span>
        </Space>
      ),
    },
    {
      title: ' 当前库存量',
      dataIndex: 'currentCount',
      key: 'currentCount',
      align: 'center'
    },
    {
      title: '库存最低标准',
      dataIndex: 'minimumCount',
      key: 'minimumCount',
      align: 'center'
    },
    {
      title: '库存状态',
      key: 'inventoryStatus',
      dataIndex: 'inventoryStatus',
      align: 'center',
      render: (text, record) => {
        return (text == '库存量低' ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 16, height: 16, backgroundColor: 'rgb(244,67,54)', borderRadius: '50%', marginRight: 16 }}></div><span>{text}</span></div>
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 16, height: 16, backgroundColor: 'rgb(2,219,114)', borderRadius: '50%', marginRight: 16 }}></div><span>{text}</span></div>)

      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' ghost onClick={() => getOut(record)}>领用</Button>
          <Button type='primary' ghost onClick={() => getIn(record)}>入库</Button>
        </Space>
      ),
    },
  ]
  const modalRef = useRef()
  const [Mtitle, setMtitle] = useState("备件领用")
  const [remark, setRemark] = useState('')
  const [num, setNum] = useState('')
  const [deviceInfo, setDeviceInfo] = useState()
  const getOut = (record) => {
    setDeviceInfo(record)
    modalRef.current.onOpen()
    setMtitle('备件领用')
    setNum('')
    setRemark('')
  }
  const dispatchOrderOk = () => {
    if (num == "" || num == undefined)
      return message.error('请输入数量')
      SpareParts.InAndOutStorage({
        projectId,sparePartsId:deviceInfo.id,operate:Mtitle=='备件领用'?0:1,count:num,remark
      }).then(res=>{
        if(res.success){
          message.success(Mtitle=='备件领用'?'领用成功':'入库成功')
          modalRef.current.onCancel()
          warnPage()
        }else{
          message.error(res.errMsg)
        }
      })
  }
  const getIn = (record) => {
    setDeviceInfo(record)
    modalRef.current.onOpen()
    setMtitle('备件入库')
    setNum('')
    setRemark('')
  }
 
  const onChangeNum = (value) => {
    console.log('changed', value);
    setNum(value)
  };
  const onChangeInput = (event) => {
    console.log('changed', event.target.value);
    setRemark(event.target.value)
  };
 
  const [tabledata, setTabledata] = useState([])

  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const changePage = (page, pageSize) => {
    setPageInfo(page)
  }

  const warnPage = () => {
    let params = {
      projectId,
      pageNum: pageInfo.current,
      pageSize: pageInfo.pageSize,
      roomId,
      areaId
    }
    SpareParts.SparePartsController(params).then(res => {
      if (res.success) {
        if(Array.isArray(res.data)){
          setTabledata(res.data)
        }else{
          setTabledata([])
        }
        setPageInfo({
          current: res.pageNum,
          pageSize: res.pageSize,
          total: res.total,
        })
      } else {
        message.error(res.errMsg)
      }
    })


  }
  const modalRefRecord = useRef()
  const [nameList, setnameList] = useState([])
  const [beiType, setBeiType] = useState(0)
  const [beiName, setBeiName] = useState()
  const openRecord = () => {
    modalRefRecord.current.onOpen()
    //getRecord()
  }
  const getRecord = () => {
    if(!roomId) return
    SpareParts.QuerySparePartsName(projectId, areaId, roomId).then(res => {
      if (res.success) {
        setnameList(res.data)
        setBeiName(res.data[0]?.name)
        //getRecordList()
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const getRecordList = () => {
    if(!roomId) return
    SpareParts.QueryInventoryRecord({projectId, name:beiName||null, type:beiType, startDate:rangeTime1[0], endDate:rangeTime1[1]}).then(res => {
      if (res.success) {
        setTabledataRecord(res.data)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const [typeList1, settypeList1] = useState([
    { id: 0, name: '全部类型' },
    { id: 1, name: '通用件/标准件' },
    { id: 2, name: '易损件' },
    { id: 3, name: '电气备件' },
    { id: 4, name: '关键备件' },
  ])

  const changeType = (e) => {
    console.log(e)
    setBeiType(e)
  }
  const changeName = (e) => {
    console.log(e)
    setBeiName(e)
  }
  const getDefaultDates = () => {
    const today = moment();
    const lastWeek = moment().subtract(7, 'days');
    let date=[]
    date.push(lastWeek)
    date.push(today)
    console.log(date)
    return date;
  };
  const getDefaultDates1 = () => {
    const today = moment().format('YYYY-MM-DD');
    const lastWeek = moment().subtract(7, 'days').format('YYYY-MM-DD');
    let date=[]
    date.push(lastWeek)
    date.push(today)
    console.log(date)
    return date;
  };
  const [rangeTime, setRangeTime] = useState(getDefaultDates())
  const [rangeTime1, setRangeTime1] = useState(getDefaultDates1())
  
  const changeTime = (dates, dateStrings) => {
    console.log(dates, dateStrings)
    setRangeTime(dates)
    setRangeTime1(dateStrings)
  }
  // 禁止选择今天的日期之前的日期
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };
  const columnsRecord = [
    {
      title: '日期时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center'
    },
    {
      title: '领用人',
      dataIndex: 'creator',
      key: 'creator',
      align: 'center'
    },
    {
      title: ' 备件名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '备件类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.type == 1 ? '通用件/标准件' : record.type == 2 ? '易损件' : record.type == 3 ? '电气备件' : '关键备件'}</span>
        </Space>
      ),
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.operate == 1 ? '入库' :'领用'}</span>
        </Space>
      ),
    }, {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      align: 'center'
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center'
    },
  ]
  const [tabledataRecord, setTabledataRecord] = useState([])
  useEffect(() => {
    console.log(roomId,areaId)
    if (roomId) {
      getRecord()
    }else{
      setnameList([])
    }
  }, [roomId,areaId])
  useEffect(() => {
      getRecordList()
  }, [beiName,beiType,rangeTime1])
  useEffect(() => {
    if(roomId){
      warnPage()
    }else{
      setTabledata([])
    }

  }, [pageInfo.current,roomId,areaId])

  return (
    <Pagecount pd="0" showserach={false} custserach>
      <Mainbox>
        <Titlelayout title="" layout="flex">
          <Usetable
            hbg="#f0f9ff"
            hbc="#515151"
            columns={columns}
            dataSource={tabledata}
            pagination={pageInfo}
            onChange={changePage}
          />
          <UseModal
            ref={modalRef}
            mold='cust'
            okText="确定"
            onOk={dispatchOrderOk}
            title={Mtitle}
          >
            <div style={{ margin: '16px 0' }}>
              <div className='ant-form-item'>
                <p style={{ width: '100px', textAlign: 'left' }} className='ant-form-item-label'>当前库存</p>
                <sapn style={{ lineHeight: '32px', height: '32px' }}>{deviceInfo?.currentCount}</sapn>
              </div>
              <div className='ant-form-item'>
                <p style={{ width: '100px', textAlign: 'left' }} className='ant-form-item-label'>{Mtitle=='备件领用'?'本次领用':'本次入库'}</p>
                <InputNumber min={1} max={100} value={num} step={1} onChange={onChangeNum} />
                <sapn>（个）</sapn>
              </div>
              <div className='ant-form-item'>
                <p style={{ width: '100px', textAlign: 'left' }} className='ant-form-item-label'>备注</p>
                <Input style={{ width: '350px' }} placeholder="" value={remark} onChange={onChangeInput} />
              </div>
            </div>
          </UseModal>
          <UseModal width={1469} height={697}
            ref={modalRefRecord}
            mold='cust'
            custft={false}
            footer={false}
            title="出入库记录"
            closable
          >
            <div style={{ margin: '16px 0', width: '1410px', height: '600px' }}>
              <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', flexDirection: 'row', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'row' }}>
                  <div style={{ marginRight: '16px' }}>
                    <span style={{ marginRight: '16px' }}>备件类型</span>
                    <Select style={{ width: 112 }} value={beiType} options={typeList1} fieldNames={{ label: 'name', value: 'id' }} onChange={changeType}></Select>
                  </div>
                  <div> <span style={{ marginRight: '16px' }}>备件名称</span>
                    <Select style={{ width: 112 }} value={beiName} options={nameList} onChange={changeName} fieldNames={{ label: 'name', value: 'name', options: 'options' }}
                    ></Select></div>
                </div>
                <div>
                  <span style={{ marginRight: '16px' }}>操作时间</span>
                  <RangePicker value={rangeTime} format='YYYY-MM-DD'  onChange={changeTime} disabledDate={disabledDate} />
                </div>
              </div>
              <Usetable
                hbg="#f0f9ff"
                hbc="#515151"
                columns={columnsRecord}
                dataSource={tabledataRecord}
                scroll={{y: 580}}
              />
            </div>
          </UseModal>
        </Titlelayout>
      </Mainbox>
    </Pagecount>
  )
}
