import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
 
import { Image, Form, Space, Button, Input, Select, Upload,Typography,   Timeline, message } from 'antd'
 
import {useRequest} from 'ahooks'
import { selectcurlRommid, selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import {selectUser} from "@redux/user"
 
 
import Usetable from '@com/useTable'
import {WorkTicketRuntime} from '@api/api'
import { ExportExcel, CustButton, CustButtonT } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import CModal from '@com/useModal'
import { CompleteIcon, UnCompleteIcon} from './completeicon'
import  {renderAsync} from 'docx-preview'
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
const Exmain = styled.div`
   height: 920px;
   overflow: auto;
   display: flex;
   flex-direction: column;
   .docbox {
     flex: 1;
   }
   .op {
     height: 48px;
     display: flex;
     justify-content: center;
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
  const [ischeck, setIscheck] = useState(false) //审核或查看工作票
  const optitle = ischeck ? '审核工作票' : "查看工作票"
  const onAdd =(t) => {
    setType(t)
    addref.current.onOpen()
  }
  const onChange = (e) => {
    setType(e)
    
  }
  
  const getWorkTickets = async() => {
    if(![projectId, areaId, roomId].every(e => Number.isInteger(parseInt(e)))) return
     try {
      let params = {
        projectId,
        areaId,
        switchHouseId: roomId,
        type,
      }
      let {success, data} = await WorkTicketRuntime.GetWorkTickets(params)
      if(success && Array.isArray(data)) {
          return  data
      }else {
         return  []
      }
     } catch (error) {
       console.log(error)
     }
  } 
  const {data, loading,   refresh} = useRequest(getWorkTickets, {
    refreshDeps:[projectId,areaId, roomId, type] 
  })
   
 //  获取工作票详情
 const ticketRef =useRef()
 const [orderdetail, setOrderdetail] = useState({})
 const orderNo = useRef()
 const getWrokTicketState = async ({id,no}) => {
    try {
      
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
  try {
    const formData =new FormData()
    
  files.current.forEach((f,index) => {
     let {name} = f
     formData.append("images",files.current[index]);
    })
    
    let {success, errMsg} =  await WorkTicketRuntime.UploadWorkTicket(formData, {id:idref.current,projectId, userId})
    if(success) {
     message.success('上传成功')
     upref.current.onCancel()
     refresh()
    }else {
      message.warning(errMsg || '上传出错')
    }
  } catch (error) {
    console.log(error)
  }

   }

   // 审核工作票
   const eidref = useRef()
   const exref = useRef()
   const docbox = useRef()
   const bkref = useRef()
   const [bkform] =Form.useForm();
   const [open, setOpen]  = useState(false)
 
 
   const examineWorkTicket =async({id, no}) => {
      try {
        setIscheck(true)
        let params ={
          projectId,
          areaId,
          no
        }
        let res = await WorkTicketRuntime.GetWrokTicketWrold(params)
        let blob = new Blob([res], {
          // type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          type: "application/msword"
         });
         eidref.current = id
         setOpen(true)
         setTimeout(() => {
          renderAsync(blob,docbox.current).then().catch(e => {
            console.log(e)
          })
         }, 20)

      } catch (error) {
        
      }

     
   }
   const onback =() => {
      bkref.current.onOpen()
   }
   const onExamine =async (res) => { // 审核工作票
    try {
      if(res == 0) {
        let remark =await bkform.validateFields()
        console.log(remark)
      }
      let params ={
        id: eidref.current,
        res,
        remark: '',
        projectId,
        userId,

       }
      let {success, errMsg} =  await WorkTicketRuntime.ExamineWorkTicket(params)
      if(success) {
        let msg=['打回成功',"审核通过", ][res]
        message.success(msg)
        setOpen(false)
      //  exref.current.onCancel()
        refresh()
      }else {
        message.warning(errMsg || '数据出错')
      }
    } catch (error) {
       console.log(error)
    }

   }

// 查看工作票\下载打印工作票
const testref = useRef()
const getWrokTicketWrold = async({no}, type) => {
  try {
  setIscheck(false)
  let params ={
    projectId,
    areaId,
    no
  }
  let res = await WorkTicketRuntime.GetWrokTicketWrold(params)

  if(type == 1) {
    setOpen(true)
    let blob = new Blob([res], {
      // type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      type: "application/msword" // doc
     });
    setTimeout(() => {
      renderAsync(blob,docbox.current).then().catch(e => {
        console.log(e)
      })
     }, 20)


  }else if(type ==2) {
    let blob = new Blob([res], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  // docx
     });
    let a = document.createElement('a');
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.click();
    a.remove();

  }


   
  


 
 
       
} catch (error) {
    console.log(error)
}
}
 
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
        return <Space><Link underline onClick={() => getWrokTicketState(record)}>{text}</Link></Space> 
      }
    },
    {
      title: '任务内容',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      render(text, record) {
        return <Space>
          <Link underline onClick={() => getWrokTicketWrold(record, 1)}>查看工作票</Link>
         {record.state ==2 && <Link underline onClick={() => getWrokTicketWrold(record, 2)}>下载打印工作票</Link>}
          </Space>
      }
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
           
          {record?.state ==0 && <CustButton ghost onClick={() => examineWorkTicket(record)}>工作票审核</CustButton>}
           {record?.state ==1 && <CustButton ghost onClick={() => uploadWorkTicket(record.id)}>上传工作票</CustButton>}
           {record?.state ==2 && <CustButton >已完成</CustButton>} 
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
        <Space size={16}>
          <CustButton wh="auto" ghost onClick={() =>onAdd(1)}>新增第一种工作票</CustButton>
          <CustButton wh="auto" ghost onClick={() =>onAdd(2)}>新增第二种工作票</CustButton>
        </Space>
      </div>
       <Usetable columns={columns}  dataSource={data} hbg="#d3e4fa"  hbc="#515151"  pd="8px 4px" loading={loading} /> 
       <Addticket ref={addref} {...addprops} />
       {/* state: 0 创建工作票 1 工作票审核 2 工作票完成并上传  */}
       <CModal
                title={(<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:16, color: "#000", fontWeight: 'bold'}}>
                    <span>工作票详情</span>
                    <div>工作票编号:{orderNo.current}</div>
                  
                </div>)}
                mold="cust"
                width={960}
                ref ={ticketRef}
                closable={true}
                styles={{
                  body:{
                    paddingLeft:52
                  }
                }}
                footer={<div ><CustButton style={{marginLeft: "auto"}} onClick={() => {ticketRef.current.onCancel() }}>关闭</CustButton></div>}
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
     <CModal mold='cust' open={open} ref={exref} width={1664} height={1080} title={optitle}   footer={null}>
       <Exmain>
        <div className="docbox" ref={docbox}></div>
        <div className="op">
            <Space size={32}>
            <CustButtonT ghost text="cancel"  onClick={() => setOpen(false)} /> 
            
          {ischeck &&  <><CustButton ghost onClick={onback}>打回</CustButton>
              <CustButton onClick={() => onExamine(1)}>审核通过</CustButton> </>}
            </Space>
        </div>
       </Exmain>
       <CModal mold='cust' ref={bkref} width={585}    title="打回" onOk={() =>onExamine(0)}  >
        <Form form={bkform} preserve={false} layout="vertical">
           <Form.Item label="工作票打回原因" name="remark" rules={[{
            required: true,
            message: '请输入原因'
           }]}>
           <Input.TextArea rows={4} showCount /> 
           </Form.Item>
        </Form>
       </CModal>
     </CModal>
     

    
   </Mainbox>
  
    </Pagecount>
  )
}
