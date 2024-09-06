import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
 
import { Image, Form, Space, Button, Input, Select, Upload,Typography,   Timeline, message } from 'antd'
 
 
import { selectcurlRommid, selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import {selectUser} from "@redux/user"
 
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {WorkTicketRuntime} from '@api/api'
import { ExportExcel, CustButton } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import CModal from '@com/useModal'
import { CompleteIcon, UnCompleteIcon} from './completeicon'
 
import Pagecount from "@com/pagecontent";
import Addticket from './addticket'
 
import zhanwei from '@imgs/zhanwei.png'
import {isObject} from '@com/usehandler'
import upCloud from './upcloud.png'
const {Link} = Typography
const {Dragger} = Upload
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  .custTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px dotted #d7d7d7;
  }
`
const CTimeline = styled(Timeline)`
  && {
    .ant-timeline-item.ant-timeline-item-left{
      padding-left: 16px;
      .ant-timeline-item-content{ 
       left: 160px;
       .itemcontent {
        display: flex;
        flex-direction: column;
        min-height: 70px;
        font-weight: bold;
       }
    }
     .ant-timeline-item-label {
        text-align: left; 
         width: 145px;
    }
     .ant-timeline-item-head {
        left: 160px;
    }
     .ant-timeline-item-tail {
        left: 160px;
    }
    }

    
 
  
   
 
  }

`
const options = [
  {label: '全部工作票', value: 0},
  {label: '第一种工作票', value: 1},
  {label: '第二种工作票', value: 2}
]
 
export default function Index() {
  const areaId = useSelector(selectOneLevelDefaultId)
  const projectId = useSelector(selectProjectId)
  const roomId = useSelector(selectcurlRommid)
  const {userId} = useSelector(selectUser)
   
  const addref = useRef()
  const [type, setType] = useState(0)
  const [datas, setDatas] = useState([])
  const onAdd =(t) => {
    setType(t)
    addref.current.onOpen()
  }
  const onChange = (e) => {
    setType(e)
    getWorkTickets(e)
  }
  const getWorkTickets = async(type=0) => {
     try {
      let params = {
        projectId,
        areaId,
        switchHouseId: roomId,
        type,
      }
      let {success, data} = await WorkTicketRuntime.GetWorkTickets(params)
      if(success && Array.isArray(data)) {
          setDatas(data)
      }else {
        setDatas([])
      }
     } catch (error) {
       console.log(error)
     }
  } 
 //  获取工作票详情
 const ticketRef =useRef()
 const [orderdetail, setOrderdetail] = useState({})
 const orderNo = useRef()
 const getWrokTicketState = async ({id,no}) => {
    try {
      console.log(no)
      let {success, data, errMsg} =  await WorkTicketRuntime.GetWrokTicketState({projectId, id})
      if(success && isObject(data)) {
        orderNo.current = no
        setOrderdetail(data)
        ticketRef.current.onOpen()
      }else {
         return message.warning(errMsg || "获取数据出错")
      }
    } catch (error) {
      
    }
    
 }
 //  上传工作票
 const files = useRef([])
 const uploadprops = { 
  beforeUpload(file,fileList){
    console.log(fileList)
    files.current=fileList
    return false
  }
};
 const idref = useRef()
 const upref = useRef()
 const uploadWorkTicket =(id) => {
      idref.current = id;
      upref.current.onOpen()
 }
 const onImportOk =async() => {
   const formData =new FormData()
   formData.append("images",files.current[0]);
    await WorkTicketRuntime.UploadWorkTicket(formData, {id:idref.current,projectId, userId})
 }
  useEffect(() => {
       if([projectId, areaId, roomId].every(e => Number.isInteger(parseInt(e))))  {
        getWorkTickets()
       }
   
  }, [projectId, areaId, roomId ])
  const addprops ={
     type,
     areaId,
     projectId,
     switchHouseId:roomId,
     userId,
     getWorkTickets,
  }
  const columns = [
    {
      title: '工作票类型',
      dataIndex: 'workTicketType',
      key: 'workTicketType',
      align: 'center'
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center'
    },
    {
      title: ' 变电所',
      dataIndex: 'substation',
      key: 'substation',
      align: 'center'
    },
    {
      title: '编号',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      render(text, record) {
        return <Link underline onClick={() => getWrokTicketState(record)}>{text}</Link>
      }
    },
    {
      title: '任务内容',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center'
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      align: 'center'
    },
    {
      title: '审核时间',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'stateStr',
      key: 'stateStr',
      align: 'center'
    },
    {
      title: '流程操作',
      dataIndex: 'op',
      key: 'op',
      align: 'center',
      render(_,record) {
        return <Space>
           <CustButton ghost onClick={() => uploadWorkTicket(record.id)}>上传工作票</CustButton>
         {/*   {record?.state ==0 && <CustButton ghost>工作票审核</CustButton>}
           {record?.state ==1 && <CustButton ghost>上传工作票</CustButton>}
           {record?.state ==2 && <CustButton ghost>已完成</CustButton>} */}
        </Space>
      }
    },
  ]
  return (
    <Pagecount>
      <Mainbox>
      <div className='custTitle'>
        <Space>
            <span>任务状态</span>
            <Select style={{width: '200px'}} options={options} value={type} onChange={onChange}></Select>
        </Space>
        <Space>
          <CustButton wh="auto" ghost onClick={() =>onAdd(1)}>新增第一种工作票</CustButton>
          <CustButton wh="auto" ghost onClick={() =>onAdd(2)}>新增第二种工作票</CustButton>
        </Space>
      </div>
       <Usetable columns={columns}  dataSource={datas} hbg="#d3e4fa"  hbc="#515151"  pd="8px 4px" /> 
       <Addticket ref={addref} {...addprops} />
       {/* state: 0 创建工作票 1 工作票审核 2 工作票完成并上传  */}
       <CModal
                title={(<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:16, color: "#000", fontWeight: 'bold'}}>
                    <span>工作票详情</span>
                    <div>工作票编号:{orderNo.current}</div>
                    <CustButton onClick={() => {ticketRef.current.onCancel() }}>关闭</CustButton>
                </div>)}
                mold="cust"
                width={960}
                ref ={ticketRef}
                closable={false}
                bodyStyle={{paddingLeft:52}}
                footer={
                    null
                }
                >
                <CTimeline mode='left' >
                    <Timeline.Item label={orderdetail?.createTime} dot={<CompleteIcon />}  >
                        <div className='itemcontent' >
                          <span>创建工作票</span>
                           <span>{orderdetail?.creator}</span>
                        </div>
                    </Timeline.Item>
                  <Timeline.Item label={orderdetail?.state!==0?orderdetail?.reviewTime:null} dot={orderdetail?.state!==0?<CompleteIcon />:<UnCompleteIcon/>}  >
                        <div className='itemcontent'>
                          <span style={{color:orderdetail?.state!==0 ?'#000':'#ccc'}}>工作票审核</span>
                           <span>{orderdetail?.state>0 ? orderdetail?.reviewer : null}</span>
                          </div>
                    </Timeline.Item>  
                  <Timeline.Item label={orderdetail?.state==2?orderdetail?.uploadTime:null} dot={orderdetail?.state>1?<CompleteIcon />:<UnCompleteIcon/>}  >
                      <div className='itemcontent'>
                          <span style={{color:orderdetail?.state==2 ?'#000':'#ccc'}}>工作票完成并上传</span>
                            <span style={{fontWeight:'bold',color:orderdetail?.state>1?'#000':'#ccc'}}>{orderdetail?.state==2 ? orderdetail?.uploader : null}</span>
                            <div>
                            {orderdetail?.images?.map((it,index)=>{
                                return   <Image src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} key={index} />
                            })}
                            {!orderdetail?.images&&(<Image src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} />)}
                            </div>
                        </div> 
                       
                    </Timeline.Item> 
                   
                    <Timeline.Item  dot={orderdetail?.state==2?<CompleteIcon />:<UnCompleteIcon/>}  >
                        <div style={{fontWeight:'bold',color:orderdetail?.state==2 ?'#000':'#ccc'}}>完成</div>
                    </Timeline.Item>
                </CTimeline>  


            </CModal>
            <CModal mold='cust' ref={upref}  title="上传工作票" onOk={onImportOk}>
      {/* <BlueColumn name={name} styled={{ padding: '24px 0px' }}></BlueColumn> */}
      <Dragger {...uploadprops} accept="image/*" multiple>
        <img src={upCloud}></img>
        <p style={{ margin: '32px 0', fontSize: 16 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', }}>上传工作票</span></p>
        {/* <a style={{ color: '#237ae4', textDecoration: 'underline', fontSize: 16 }} onClick={(e) => { e.stopPropagation() }} href={link}>下载模板</a> */}
      </Dragger>  
    </CModal>
        </Mainbox>
    </Pagecount>
  )
}
