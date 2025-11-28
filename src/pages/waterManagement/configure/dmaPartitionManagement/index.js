import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form, Select, Input,Radio ,Typography, message} from "antd";
import Pagecount from "@com/pagecontent";
import {useNavigate, useLocation} from "react-router-dom"
import {useSelector} from "react-redux"
 import {selectProjectId} from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import UseTree from "@com/useTree";
import {RadiogroupB} from "@com/comstyled"
import { cols, options,loptions } from "./data";
 import {CustButton} from "@com/useButton"
 import {  useGetListPaged,useDelete } from "./api.js";
 
import { Mainwrap, TitleBox } from "./style";
import CModal from '@com/useModal'
import { useAntdTable, useRequest} from "ahooks";
import Newdma from "./newdma"

 
 const {Link} = Typography
 
export default function Index() { 
    const navigate = useNavigate();  
    const { pathname, state,hash } = useLocation();
 
  const [form] = Form.useForm()
  const  projectId  =  useSelector(selectProjectId)  
  const [treeId, setTreeId] = useState(null)
  const [sorting, setsorting] = useState("")
  const [level, setLevle] = useState("0")
  const  listnew = useMemo(()=> {
    return !hash || hash=="#list"
  }, [hash])
  const getDetail =async ({current, pageSize}, formData)=> {
     try {
       console.log(treeId)
       if(!(Number.isInteger(projectId) && Array.isArray(treeId))) {
        return  {
        list:[],
        total:0
       }
      }
       let {name="", partitionType } = formData       
       let body = {
        pageNum:current,
        pageSize,
        projectId,
        parentId: treeId?.[0],
        name,
        partitionType,
        level,
        sorting,
       }
       let {data,success, total} = await useGetListPaged({},body)
       if(success && Array.isArray(data) ) {         
          return {
             list:  data,
             total
          }
       }else {
        return {
          list: [],
          total
       }
        
       }
     } catch (error) {
       console.log(error)
     }
  }
  
const {tableProps, search, refresh} =  useAntdTable(getDetail, {
    form,
    defaultPageSize: 14,
    refreshDeps: [projectId, treeId, level,sorting]
  })
const {submit} = search
const dmachange =(v) => {
  setLevle(v.target.value)
}
const addDma =() => {
  navigate(pathname+ `?item=1` + "#new", { state, replace: true }); // 新建 没有id
}
const editAlarm = (row) => { 
  navigate(pathname+`?item=3&id=${row.id}` + "#edit", { state, replace: true });
} 
const editRecod = (row) => {
  navigate(pathname+ `?item=1&id=${row.id}` + "#edit", { state, replace: true });
} 
const editDrive =(row) => {
  navigate(pathname+ `?item=2&id=${row.id}` + "#edit", { state, replace: true });
}
const delRef = useRef()
const idRef = useRef()
const onDel=(id)=> {
    idRef.current = id;
    delRef.current.onOpen()
}
const delOk =async ()=> {
  console.log("del")
  try {
    let params = {
      projectId,
      id:idRef.current
    }
   let {success,errMsg} =  await useDelete(params,{})
   if(success) {
     message.success("删除成功")
     delRef.current.onCancel()
     refresh()
   }else {
     message.warning(errMsg || "数据出错")
   }
  } catch (error) {
    console.log(error)
  }


}
const Ctitle = <TitleBox>
  <Space size={16}>
    <span>分区列表</span>
    <RadiogroupB options={loptions}  value={level}
        onChange={dmachange}
        optionType="button"
        buttonStyle="solid"></RadiogroupB>
  </Space>
  <CustButton onClick={()=>addDma("new")}>新建分区</CustButton>
</TitleBox>
 
 const columns = [...cols,  {
  title: "操作",
  dataIndex: "operation",
  key: "operation",
  render: (_,row)=><Space size={24}><Link onClick={()=> editRecod(row)}>档案</Link><Link onClick={()=>editDrive(row)}>表具</Link><Link onClick={()=>editAlarm(row)}>告警</Link><Link type="danger" onClick={()=>onDel(row.id)}>删除</Link></Space>
},]
 const sortChnage=(_, filters, sorter)=> {    
    const {order,field} = sorter
    if(order=="descend") {
      setsorting(field + " desc")
    }else {
      setsorting(field)
    }
    
 }


  return (
    <Pagecount pd="0" bgcolor="none">
    {listnew ?  <Mainwrap>
        <div className="left"> 
            <UseTree
            title="选择区域"
            sty = {{ bordered: 'n', pv: '8px' }}
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => {}}
            showline={false}
            datatype={3}
            energytype={1}
            multiple={false}
            allselect={false}
          />
        </div>
        <div className="right">
           <div className="search">
              <Form form={form} layout="inline">
                <Space size={16}>
                  <Form.Item label="分区名称" name="name">
                    <Input ></Input>
                  </Form.Item>
                  <Form.Item label="分区类型" name="partitionType" initialValue={0}>
                    <Select options={options} style={{width: "200px"}}  ></Select>
                  </Form.Item>
                  <Form.Item>
                    <CustButton onClick={submit}>查询</CustButton>
                  </Form.Item>
                  </Space>
              </Form>
           </div>
          <Titlelayout layout="flex" title={Ctitle}  dr="column"> 
              <UserTable columns={columns} {...tableProps} onChange={sortChnage}></UserTable> 
          </Titlelayout>
        </div>
      </Mainwrap>
     : <Newdma projectId={projectId}  addDma={addDma} />
    }
      <CModal ref={delRef} type="warn" mold="cust" title="分区删除提示" onOk={()=>delOk()} >
      删除该DMA管理分区，对应分区将不参与分区控漏计算
      </CModal>
    </Pagecount>
  );
}