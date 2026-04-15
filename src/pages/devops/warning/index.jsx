import React, { useCallback, useState, useRef } from 'react'

import { useAntdTable } from 'ahooks'
import { Input, Space, message, Timeline, Modal, Typography, Image } from 'antd';
import { useOutletContext } from 'react-router-dom'
import UserTable from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
import UseModal from '@com/useModal'
import unknow from './imgs/unknow.png'
import { CompleteIcon, UnCompleteIcon } from './completeicon'
import Pagecount from '@com/pagecontent'
import { operation } from '@api/api'
import style from './style.module.less'
import styled from 'styled-components';
import zhanwei from '@imgs/zhanwei.png'
import { ExportExcel, CustButton } from '@com/useButton'
import { Serach } from "@com/comstyled";

const { TextArea } = Input;
const { Link } = Typography
const Mainbox = styled.div`
   flex: 1;
   display: flex;
   flex-direction: column;
   row-gap: 16px;
   .serach {
    display: flex;
    justify-content: space-between;
    align-items: center;
   }
`

export default function Index() {

  let { exparams } = useOutletContext()

  let { areaId, projectId } = exparams
  const condition = Number.isInteger(areaId) && Number.isInteger(projectId)
  const tableRef = useRef()
  const modalRef = useRef()

  const [total, setTotal] = useState(0)

  const [inputvalue, setInpValue] = useState()

  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState()
  const [orderdetail, setOrderDetail] = useState()
  const [key, setKey] = useState()
  const columns = [
    {
      title: '最新告警时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '告警详情',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '设备地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: '设备型号',
      dataIndex: 'category',
      key: 'category',
    },

    {
      title: '操作',
      key: 'option',
      align: 'center',
      export: false,
      render: (_, val) => (

        <Link
          underline
          type={_.orderId == 0 && _.status != 2 ? 'danger' : ''}
          onClick={() => {
            if (_.status != 2) {
              if (_.orderId == 0) {
                dispatchOrder(_, val)
              } else {
                setOrder(true)
                getOrderDetail(_.orderId)
              }
            }

          }}
        >{_.status == 2 ? "已处理" : _.orderId == 0 ? '派单' : '已派单'}</Link>
      ),
    },
    {
      title: '设备详情',
      key: 'deteail',
      align: 'center',
      export: false,
      render: (_, record) => (
        <Link underline href={`/deviceDetail?sn=${record.sn}`} target="_blank">详情</Link>

      ),
    },
  ]
  let dispatchId;

  //获取告警信息
  const [pageNum, setPageNum] = useState(0)
  const params = useRef({
    projectId,
    pageNum: 1,
    pageSize: 14,
    alike: '',
    areaId,
  })
  const getAlarmPage = ({ current, pageSize }) => {
    if (!condition) return
    console.log(current)
    setPageNum(current)
    params.current = {
      projectId,
      pageNum: current,
      pageSize,
      alike: inputvalue,
      areaId,
    }
    return operation.AlarmPage(params.current).then(res => {
      let { success, data, total } = res
      let f = Array.isArray(data)
      setTotal(total)
      if (success) {
        return {
          list: f ? data : [],
          total: f ? total : 0
        }
      } else {
        message.error(res.errMsg || "数据出错")
        return {
          list: [],
          total: 0
        }
      }
    })

  }
  const { tableProps } = useAntdTable(getAlarmPage, {
    refreshDeps: [areaId, projectId, inputvalue]
  })
  //派单
  const dispatchOrder = (text, record) => {
    modalRef.current.onOpen()
    dispatchId = record.id
    console.log(text, record)
  }
  //确认派单
  const dispatchOrderOk = async () => {
    const res = await operation.DispachOrder({
      projectId,
      alarmId: dispatchId
    })
    if (res.success) {
      modalRef.current.onCancel()
      message.success('派单成功！')
      getAlarmPage(pageNum)
    } else {
      message.error(res.errMsg)
    }
  }
  //工单详情
  const getOrderDetail = async (orderId) => {
    let param = {
      projectId,
      orderId
    }
    const res = await operation.OrderDetail(param)
    if (res.success) {
      setOrderDetail(res.data)
    } else {
      message.error(res.errMsg)
    }

  }


  const onExport = useCallback(() => {
    params.current.pageSize = total
    params.current.pageNum = 1
    return operation.AlarmPage(params.current).then((res) => {
      let { success, data, total } = res;
      if (success) {
        return {
          list: data.details || [],
          total,
        };
      } else {
        message.error(res.errMsg);
        return {
          list: [],
          total: 0,
        };
      }
    });
  }, [total]);


  return (
    <Pagecount>
      <Mainbox>
        <div className='serach'>
          <Space>
            <span style={{ paddingRight: 16, }} >告警查询</span>
            <Serach
              placeholder="输入设备编号/安装地址"
              style={{ width: "340px" }}

              onSearch={v => setInpValue(v)}
            />
          </Space>

          <ExportExcel setKey={setKey} tb={tableRef}></ExportExcel>
        </div>
        <UserTable
          columns={columns}
          ref={tableRef}
          {...tableProps}
          onExport={onExport}
        />
        <UseModal
          ref={modalRef}
          mold='cust'
          okText="立即派单"
          onOk={dispatchOrderOk}
          title="派单提示"
          type="ok"
        >
          {/* <BlueColumn name="派单提示" styled={{padding: '24px 0'}}/> */}
           
            <span>是否要对本告警事件进行派单？</span>
           
        </UseModal>
        <DispatchComp order={order} setOrder={setOrder} orderdetail={orderdetail} />
      </Mainbox>
    </Pagecount>
  )
}


let DispatchComp = ({ order, setOrder, orderdetail = null, orderSn = "" }) => {
  return (
    <Modal
      title={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 16, padding: 16 }}>
        <BlueColumn name="工单详情" />
        <div>工单编号:{orderSn}</div>
        <CustButton onClick={() => { setOrder(false) }}>关闭</CustButton>
      </div>)}
      open={order}
      width={960}
      onCancel={() => { setOrder(false) }}
      closable={false}
      styles={
        {
          body:{
            paddingLeft:32
          }
        }
      }
      footer={
        null
      }
    >
      <Timeline mode='left' >
        <Timeline.Item label={orderdetail?.createTime} dot={<CompleteIcon />} className={style.timeline}>
          <div style={{ minHeight: 50, fontWeight: 'bold' }} >平台派单</div>
        </Timeline.Item>
        <Timeline.Item label={orderdetail?.state !== 1 ? orderdetail?.confirmTime : null} dot={orderdetail?.state !== 1 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
          <div style={{ minHeight: 50 }}><span style={{ paddingRight: 64, fontWeight: 'bold', color: orderdetail?.state !== 1 ? '#000' : '#ccc' }}>派单确认</span>{orderdetail?.operator}</div>
        </Timeline.Item>
        <Timeline.Item label={orderdetail?.state > 2 ? orderdetail?.arriveTime : null} dot={orderdetail?.state > 2 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
          <div style={{ minHeight: 100 }}>
            <div style={{ fontWeight: 'bold', color: orderdetail?.state > 2 ? '#000' : '#ccc' }}>到达现场</div>
            {orderdetail?.arriveImages?.map((it, index) => {
              return <Image src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} key={index} preview={true}></Image>
            })}
            {!orderdetail?.arriveImages && (<Image src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} preview={true}></Image>)}
          </div>

        </Timeline.Item>
        <Timeline.Item label={orderdetail?.state > 3 ? orderdetail?.finishTime : null} dot={orderdetail?.state > 3 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
          <div style={{ fontWeight: 'bold', color: orderdetail?.state > 3 ? '#000' : '#ccc' }}>故障处理</div>
          {
            orderdetail?.processImages?.map((it, index) => {
              return <Image src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} preview={true}></Image>
            })
          }
          {!orderdetail?.processImages && (<Image src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} preview={true}></Image>)}

          <div style={{ padding: '12px 0', color: orderdetail?.state > 3 ? '#000' : '#ccc' }}>处理详情描述:</div>
          <div>
            <TextArea rows={4} style={{ width: 528, height: 80 }} value={orderdetail?.result} />
          </div>
        </Timeline.Item>
        <Timeline.Item dot={orderdetail?.state > 3 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
          <div style={{ fontWeight: 'bold', color: orderdetail?.state > 3 ? '#000' : '#ccc' }}>完成</div>
        </Timeline.Item>
      </Timeline>


    </Modal>
  )
}
