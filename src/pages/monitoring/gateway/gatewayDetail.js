import { React, useState,useEffect } from "react";
import style from './style.module.less'
import { useSelector } from 'react-redux'
import imgurl from './images/index.js'
import {  Pagination,message} from 'antd'
import { useLocation } from 'react-router';
import { Monitoring } from '@api/api.js'
import {Link, useNavigate } from 'react-router-dom'
import { selectProjectId } from '@redux/systemconfig.js'
import Table from '@com/useTable'

export default function GatewayDetail(props) {
    let location = useLocation()
    let qs=require('query-string')
    let search=qs.parse(location.search)
    console.log(search)
    const projectId = useSelector(selectProjectId)
  const [messageApi, contextHolder] = message.useMessage();
  const { RuntimeGateway: { RuntimeGatewayDetail, Children, Log,CategoryImages } } = Monitoring
    let [state, setstate] = useState(true)
    let [detail,setDetail]=useState({})
    const onchangeTab = () => {
        setstate(!state)
    }
  const [page, setpage] = useState(1)
  let [total, setTotal] = useState(1)
  let [pageNum, setPageNum] = useState(1)
  const [pageLog, setpageLog] = useState(1)
  let [totalLog, setTotalLog] = useState(1)
  let [pageNumLog, setPageNumLog] = useState(1)
    const columns = [
        {
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn',
            render: (sn) => <Link to={{
                pathname: "/deviceDetail?"+sn,
            }} target="_blank"> {sn} </Link>,
            id: 'id'
        },
        {
            title: '设备型号',
            dataIndex: 'category',
            key: 'category',
            id: 'id'
        },
        {
            title: '安装地址',
            dataIndex: 'address',
            key: 'address',
            id: 'id'
        },
        {
            title: '通信地址',
            dataIndex: 'commAddress',
            key: 'commAddress',
            id: 'id'
        },
        {
            title: '通信端口',
            dataIndex: 'commPort',
            key: 'commPort',
            id: 'id'
        },
        {
            title: '通信协议',
            dataIndex: 'commProtocol',
            render: (commProtocol) => <span>{commProtocol==1?'Modbus':'DL645'}</span>,
            key: 'commProtocol',
            id: 'id'
        },
    ];
    const columnsLog = [
        {
            title: '时间',
            dataIndex: 'sn',
            key: 'sn',
            id: 'id'
        },
        {
            title: '设备日志',
            dataIndex: 'category',
            key: 'category',
            id: 'id'
        },
    ];
    let [dataSource, setdataSource] = useState([
        {
            id:1,
            sn:202213202289,
            category:'category',
            state:'state',
            connMethod:'connMethod',
            childrenCnt:'childrenCnt',
            address:'address',
            lastSampleTime:'lastSampleTime'
        }
    ])
    let [dataSourceLog, setdataSourceLog] = useState([])
    const onChangePage = (page, pageSize) => {
            setpage(page)
      }
      const onChangePageLog = (page, pageSize) => {
        setpageLog(page)
  }
      const getData = () => {//网关详情
        return RuntimeGatewayDetail( projectId, search.sn ).then(res => {
          let { success, data } = res
          if (success && data) {
            setDetail(data)
            if(detail.category){
                getGatewayImages()
            }
          } else {
            messageApi.open({
              type: 'error',
              content: res.errMsg
            })
          }
        })
      }
      let params={
        projectId:projectId,
        pageNum:page,
        pageSize:12,
        sn:search.sn
      }
      const getChildrenData = () => {//网关子设备详情
        return Children( params ).then(res => {
          let { success, data } = res
          if (success ) {
            setdataSource(data)
            setTotal(total)
          } else {
            messageApi.open({
              type: 'error',
              content: res.errMsg
            })
          }
        })
      }
      let paramsLog={
        projectId:projectId,
        pageNum:pageLog,
        pageSize:12,
        sn:search.sn
      }
      const getLogData = () => {//网关子设备详情
        return Log( paramsLog ).then(res => {
          let { success, data } = res
          if (success ) {
            setdataSourceLog(data)
            setTotalLog(total)
          } else {
            messageApi.open({
              type: 'error',
              content: res.errMsg
            })
          }
        })
      }
      let [imgUrl,setimgUrl]=useState([])
      const getGatewayImages = () => {//网关图片
        return CategoryImages({projectId:projectId,group:[detail.category]}).then(res => {
          let { success, data } = res
          if (success && data) {
            setimgUrl(data[0].imageBase64)
          } else {
            messageApi.open({
              type: 'error',
              content: res.errMsg
            })
          }
        })
      }
      useEffect(() => {
        getData()
        
      }, [search.sn,projectId])
      useEffect(() => {
        getGatewayImages()
        
      }, [detail.category,projectId])
      useEffect(() => {
        getChildrenData()
      }, [search.sn,projectId,page,params.pageSize])
      useEffect(() => {
        getLogData()
      }, [search.sn,projectId,pageLog,paramsLog.pageSize])
    return (
        <div className={style.main}>
            <div className={style.head}>
                <img src={imgurl.logo} className={style.headImg} ></img>
                <p>智慧能源服务管理平台</p>
            </div>
            <div className={style.body}>
                <div className={style.left}>
                    <div className={style.leftHead}><div className={style.leftHeadLine} ></div>
                        <p>网关详情</p></div>
                    <div className={style.leftImgBox}>
                        <img src={imgUrl?'data:image/png;base64,'+imgUrl:imgurl.category} className={style.leftImg} ></img>
                        <div className={style.leftImgState}>{detail.state==2?'网关在线':'网关失联'}</div>
                    </div>
                    <div className={style.leftBottom}>
                        <p><span className={style.leftBottomSpan}>网关编号：</span><span>{detail.sn}</span></p>
                        <p><span className={style.leftBottomSpan}>网关名称：</span><span>{detail.name}</span></p>
                        {/* <p><span className={style.leftBottomSpan}>设备类型：</span><span>{detail.category}</span></p> */}
                        <p><span className={style.leftBottomSpan}>设备型号：</span><span>{detail.category}</span></p>
                        <p><span className={style.leftBottomSpan}>联网方式：</span><span>{detail.connMethod}</span></p>
                        <p><span className={style.leftBottomSpan}>子设备数：</span><span>{detail.childrenCnt}</span></p>
                        <div className={style.line}></div>
                        <p><span className={style.leftBottomSpan}>安装地址：</span></p>
                        <p><span>{detail.address}</span></p>
                    </div>
                </div>
                <div className={style.right}>
                    <div className={style.rightHead}>
                        <div className={state ? style.tabBoxW : style.tabBoxB} onClick={onchangeTab}>子设备</div>
                        <div className={!state ? style.tabBoxW : style.tabBoxB} onClick={onchangeTab}>上线日志</div>
                    </div>
                    <div className={style.newTime}>
                        <img src={imgurl.time} className={style.time} ></img>
                        <p>数据最新更新时间：{detail.lastSampleTime}</p>
                    </div>
                    <img src={imgurl.line} className={style.timeline} ></img>
                    <div className={style.tableBox}>
                        {state ?
                            <div>
                                <Table columns={columns} dataSource={dataSource} rowKey={columns => columns.id} ></Table>
                            <Pagination className={style.pageNumD} size="small" current={page} total={total}  defaultPageSize={12} onChange={onChangePage} />
                            </div>
                            : <div>
                                <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.id} ></Table>
                                <Pagination className={style.pageNumD} size="small" current={pageLog} total={totalLog}  defaultPageSize={12} onChange={onChangePageLog} />
                            </div>}
                            
                    </div>
                </div>
            </div>
        </div>
    )
}
