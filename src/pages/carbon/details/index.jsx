import React, { useEffect, useState, useRef, useMemo } from 'react'
import { DatePicker, Form, Select, message, Typography, Input, Space, Upload } from 'antd';
import {useAntdTable} from 'ahooks'
import {useOutletContext} from 'react-router-dom'
import Table from '@com/useTable'
import Titlelayout from '@com/titlelayout';
import Pagecount from '@com/pagecontent'
import {CustLink, CustButtonT} from "@com/useButton"
import {Carbon} from '@api/api'
import CModal from "@com/useModal"
import {ComDatePicker} from "@com/comstyled"
export default function Index() {
  let {projectId } = useOutletContext() 
  const [form] = Form.useForm()
  const [mTitle, setMtitle] = useState('')
  const mref=useRef()
  const getTabledata = ({current, pageSize}) => {
     if(Number.isInteger(projectId)) {
      return  Carbon.QueryCarbonManagePlan({projectId, pageNum:current, pageSize}).then(res => {
            let {success, errMsg, data, total} = res
            let {carbonManagePlanTable}=data || { }
            if(success && Array.isArray(carbonManagePlanTable) && carbonManagePlanTable.length >0) {
                return {
                  list: carbonManagePlanTable,
                  total,
                }
            }else {
              if(!success) message.warning(errMsg || "数据出错")
               return {
                list: [],
                total: 0
               }
            }


         })


     }
  }
  const {tableProps,refresh} = useAntdTable(getTabledata, {
    refreshDeps: [projectId],
    defaultPageSize: 14
  })

 const DownloadCarbonManagePlan = async(year) => {
    try {
      let res = await  Carbon.DownloadCarbonManagePlan(projectId, year)
      console.log(res)
       let blob = new Blob([res.data], {
        type: "application/msword",
      }); 
     
      let url = window.URL.createObjectURL(blob); 
      let a = document.createElement("a");
      a.href = url;
     // a.download = `排放监测计划模板.docx`;
      document.body.appendChild(a);
      a.click();
     
      document.body.removeChild(a);
      } catch (error) {
        console.log(error)
      }
 }

 const DeleteCarbonManagePlan = async (year) => {
    try {
      let {success,errMsg} = await  Carbon.DeleteCarbonManagePlan(projectId, year)
      if(success) {
        message.success('删除成功')
        refresh()
      }else {
      message.warning(errMsg || "数据出错")
      }
    } catch (error) {
      
    }
 }
  const columns = [
    { title: '序号', dataIndex: 'key', align: "center", width: 48, render: (text, _, index) => <>{index + 1}</>  },
    { title: '企业名称', dataIndex: 'enterpriseName', align: "center",  },
    { title: '组织机构代码', dataIndex: 'creditCode', align: "center",  },
    { title: '盘查年度', dataIndex: 'year', align: "center",  },
    { title: '填报时间', dataIndex: 'createTime', align: "center", width: 160,   },
    { title: '最新一次填报时间', dataIndex: 'latestTime', align: "center", width: 160,  },
    { title: '监测计划最新版本', dataIndex: 'latestVersion', align: "center", width: 160,  },
    { title: '填报人', dataIndex: 'applicant', align: "center", width: 96,  },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <CustLink text ="Viewreport" onClick={() => DownloadCarbonManagePlan(record.year)} />
          <CustLink type="danger" text="delete" onClick={() => DeleteCarbonManagePlan(record.year)}>删除</CustLink>
        </Space>
      ),
    },
  ];
  const download =async () => {
     try {
      let res = await Carbon.DownloadTemplateCarbon()      
      let blob = new Blob([res.data], {
       type: "application/msword",
     }); 
    
     let url = window.URL.createObjectURL(blob); 
     let a = document.createElement("a");
     a.href = url;
     a.download = `排放监测计划模板.docx`;
     document.body.appendChild(a);
     a.click();
    
     document.body.removeChild(a);
     } catch (error) {
       console.log(error)
     }

   
  }  
  const onAdd = () => {
       mref.current.onOpen()
  }
  let flies = useRef()
  const beforeUpload = (file, fileList) =>{
    flies.current = [...fileList]
    return false
  }
  const afterClose = () => {
    flies.current = null
  }
  const onOk= async() => {
    try {
      if(!flies.current) return message.info("请上传文档")
      let {year, latestTime, ...rest} = await form.validateFields()
      let params = {
        ...rest,
        year: year.year(),
        projectId,
        latestTime: latestTime.format("YYYY-MM-DD HH:mm:ss")
      }
      let formData = new FormData()
      formData.append("file", flies.current[0])
     let {success, errMsg} = await  Carbon.PostCarbonManagePlan(params, formData)
     if(success) {
      message.success("填报成功")
      refresh()

      mref.current.onCancel()
     }else {
      message.warning(errMsg || '数据出错')
     }
    } catch (err) {
      
    }
  }
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>碳排放数据表</span>
        <Space size={16}>
          <CustButtonT text="Templatedownload" type="default" onClick={download}   /> 
          <CustButtonT text="carbonplan"  wh="auto" src="new" onClick={onAdd}  />
        </Space>
    </div>
  )
  return (
    <Pagecount bgcolor="transparent" pd="0">
    <Titlelayout title={CTitle} layout="flex">
      
      <Table style={{ marginTop: 16 }} columns={columns} rowKey={(columns) => columns.id}  {...tableProps} hbg="##ecf5ff" hbc="#515151" /> 
    </Titlelayout>
    <CModal title="碳排放监测计划填报" ref={mref} mold="cust" onOk={onOk} width={520} afterClose={afterClose} >
        <Form form={form}   preserve={false} labelCol={{span: 6}} labelAlign='left'>
           <Form.Item label="盘查年度" name="year"       
            rules={[{
              required: true,
           }]}>
                 <DatePicker picker="year" style={{width: "100%"}} format="YYYY" />
           </Form.Item>
           <Form.Item label="填报时间" name="latestTime"       
            rules={[{
              required: true,
           }]}>
                  <DatePicker showTime style={{width: "100%"}} format="YYYY-MM-DD HH:mm:ss" />
           </Form.Item>
           <Form.Item label="监测计划版本" name="latestVersion"       
            rules={[{
              required: true,
           }]}>
                 <Input   allowClear />
           </Form.Item>
           <Form.Item label="填报人" name="applicant"       
            rules={[{
              required: true,
           }]}>
                 <Input   allowClear />
           </Form.Item>
           <Form.Item label="碳排放监测计划上传" name="file" labelCol={{span: 8}}>
                 <Upload accept=".doc,.docx" maxCount={1} beforeUpload={beforeUpload}><CustButtonT text="uploadfiles" /> </Upload>
           </Form.Item>
        </Form>

     </CModal>
    </Pagecount>
  )
}
