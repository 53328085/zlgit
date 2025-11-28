import React,{useMemo, useRef, useState, useCallback, useEffect} from 'react'
import {Space, Form, message, Typography, Select, Descriptions} from 'antd'
import {useAntdTable, useRequest} from "ahooks"
import {useOutletContext} from "react-router-dom"
import Pagecount from '@com/pagecontent'

import UserTable from "@com/useTable";

import {CustButtonT,CustButton, ExportExcel} from "@com/useButton"
import CModal from '@com/useModal'
import {Serach} from "@com/comstyled"
import {AreaSelect} from "@com/useSerach/comhead"
import {useInsertOrUpdateExteriorAC,  useInsertOrUpdateInteriorACs, useQueryInteriorACs,useDeleteAC, useImportACs, useQueryExteriorACsByPage,useQueryCSnsList,useQueryMSnsList,useQueryModelsList } from "./api"
import {cols,  items,airconditioner,useTypeopt,initems } from "./data"
import {Mainbox } from './style'

 const {Link} = Typography


export default function Index() {
  const delref= useRef()
  const exprotref = useRef()
  const [form] = Form.useForm()
  const [newform] = Form.useForm()
  const [innewform] = Form.useForm()
  const {projectId} =useOutletContext()
  const [isadd, setIsadd] =useState(null)
  const [total, setTotal] = useState(0)
  const [lists, setLists] = useState([]) //空调控制器
  const [mlist, setMlist] = useState([]) // 计量设备
  const [model, setmodel] = useState([])
  const editRef = useRef()
  const tbref = useRef()
  const inRef =useRef() //空调内机
  const [curRow, setCurRow] = useState({})
  const areaId = Form.useWatch("areaId", newform)
  const aritype = Form.useWatch("type", newform)
  const [cusac, setcusac] = useState(0)
  
  const [Ctitle,msg,operate] = useMemo(()=> {
   let title = isadd=='add' ? "新增空调" : "编辑空调"
   let msg = isadd=='add' ? "新增成功" : "编辑成功"
   let operate = isadd=='add' ?1:2
   return [title, msg,operate]
  },[isadd])
  const downParams = useRef()

  const getTypeList =async ()=> {
    try {
      if(!Number.isInteger(parseInt(projectId))) return
      let {success, data} = await  useQueryModelsList({projectId})
      setmodel(data)
    } catch (error) {
      
    }
    
  }
  useRequest(getTypeList, {
    refreshDeps:[projectId]
  })
  const getList = async()=> { //  空调控制器列表/计量设备
    try {
      let fag = Number.isInteger(parseInt(projectId)) && parseInt(areaId)>0
      if(!fag) {
        setLists([])
        setMlist([])
        return
      }
      let params ={projectId, areaId}
      let {success, data, errMsg} = await useQueryCSnsList(params)
      let {success:suc, data:msns} = await useQueryMSnsList(params)
      if(suc && Array.isArray(msns) && msns.length) {
         let datas = msns.map(item=> {
          return {
            ...item,
            name:  item.name+  `(${item.sn})` ,
          }
        })
          setMlist(datas)
        //  newform.setFieldValue("msn", msns[0].sn)
      }else {
        setMlist([])
        newform.resetFields(["msn"])
      }
      if(success && Array.isArray(data) && data?.length) {
        setLists(data)
       // newform.setFieldValue("csn", data[0].sn)
      }else  {
       setLists([])
       newform.resetFields(["csn"])
       if(!success) message.warning(errMsg)
      }
    
    } catch (error) {
      console.log(error)
    }
 }
 useRequest(getList, {
  refreshDeps: [projectId, areaId]
 })




 const fromitem = useMemo(()=> {
  return items({csn:lists, msn:mlist, model,type:aritype})
 },[lists, mlist, model,aritype])

 const infromitem = useMemo(()=> {  
  const {id, areaId, gateWay, useType,csn} = curRow
  let params ={
    exteriorId:id, // 外机的Id
    projectId,
    areaId,gateWay,useType,
    id:null, //内机的id
  }
  console.log("params", params)
  return initems({model, cusac, setcusac, params, csn})
 },[model,cusac, setcusac, curRow, projectId])

  const getData= async ({current, pageSize }, formData)=> { 
    try {
      if(!Number.isInteger(parseInt(projectId))) return
      const {alike="", areaId, type=0, useType=0} = formData
      let params ={
        projectId,
        areaId,
        alike,
       pageNum: current,
       pageSize,
       type, 
       useType
    }
    downParams.current = params
    let {data, success, total, errMsg} =await useQueryExteriorACsByPage({},params)

    if(success && Array.isArray(data)) {
      setTotal(total)
      return {
        list: data,
        total,
      }
    }else {
      if(!success) message.warning(errMsg || "接口出错" )
      return {
        list: [],
        total:0
      }
    }
    } catch (error) {
      console.log(error)
    }

  }
  const {tableProps, search, refresh} = useAntdTable(getData, {
    form,
    defaultPageSize: 18,
    refreshDeps: [projectId]
  })
  const {submit} = search
  const onAdd=()=> {
     setIsadd('add')
    // newform.setFieldValue("projectId", projectId)
     editRef.current.onOpen()
  }
  const delparams = useRef()
  const onDel=({id})=> {
     delparams.current={
      id,
      projectId
     }
     delref.current.onOpen()
  }
  const onEdit=(row)=> {
    try {
      setIsadd('edit')
     const {cSn,mSn, ...params} = row

   //  outrow.current=params
   newform.setFieldsValue({csn:cSn, msn:mSn, ...params})
   //  console.log(id)
   //  newform.setFieldValue("areaId", id)
    editRef.current.onOpen()
      
    } catch (error) {
      console.log(error)
    }

  }
  const onOk= async()=> {
    try {
      let values = await newform.validateFields()
      let {success, errMsg} =await useInsertOrUpdateExteriorAC({projectId}, {operate,...values})
      if(success) {
        message.success(msg)
        if(isadd=='edit') {
          editRef.current.onCancel()
        }
        refresh()
      }else {

        message.warning(errMsg || "数据出错")
        return Promise.reject("")
      }

    } catch (error) {
      return Promise.reject("")
    }

  }
  const onOkDel=async()=> {
     try {
      let {success, errMsg} = await useDeleteAC(delparams.current)
      if(success) {
        message.success("删除成功")
        delref.current.onCancel()
        refresh()
      }else {
        message.warning(errMsg || "数据出错")
      }
     } catch (error) {
      
     }
  }
  const files = useRef()
  const dragprops = {
    link: '/deviceExcel/airConditoner.xlsx',
    maxCount: 1,
    beforeUpload(file) {
        files.current = file
        return false
    }
  }
  const onUpload=async()=> {
     try {
      let formdata = new FormData()
      formdata.append("projectId", projectId)
      formdata.append("file", files.current)
       let {data} =  await  useImportACs({projectId}, formdata)
       console.log(data)
       const {success, errMsg, data:errdata} = data
       let msg=errdata?.map?.(e=> e.cause)?.join()
       if(success) {
        message.success("导入成功")
        exprotref.current.onCancel()
        refresh()
       }else {
        message.warning(msg || "数据出错")
       }
     } catch (error) {
      console.log(error)
     }
   

  }
  const onexport = ()=> {
    exprotref.current.onOpen()
  }

// 内机

 const addInac =async(row)=> {
   try {
 
    const {id,areaId,gateWay,useType,dataSource, } = row
    let csn=[]
    if(!Number.isInteger(projectId)) return message.warning("没有创建项目")
      let  csnData = await useQueryCSnsList({projectId, areaId})
      if(csnData.success && Array.isArray(csnData.data) && csnData?.data?.length > 0) {
         csn = csnData.data
      }
   
     setCurRow({csn,...row, })
     let {success, data, errMsg} =  await  useQueryInteriorACs({id, projectId})
     if(success && Array.isArray(data)&&data.length>0) { 
      // let datas = data.map(d =>({...d}))
       let datas = data.map(d => {
        let {cSn, ...rest} = d
        return {csn:cSn, ...rest}
       })
       setIsadd('edit')
       innewform.setFieldValue("acs", datas)
     }else {
      let params =[{
        exteriorId:id, 
        areaId,
        gateWay,
        useType, 
        dataSource,
      }]
      setIsadd('add')
     // console.log(params)
      innewform.setFieldValue("acs", params) 
      
      if(!success)   message.warning(errMsg || "获取空调内机数据出错")
     }
     
     setcusac(0)
     inRef.current.onOpen()
   } catch (error) {
    console.log(error)
   }
  
 }

 const inonOk= async()=> {
  try {
    let {acs} = await innewform.validateFields()
    console.log(acs)
    let editarc = acs?.filter?.(v => v.id!==null) || []
    let newarc = acs?.filter?.(v=>v.id===null) || []
    let msg ={}
    let eparams = editarc.map(e => {
      let  {areaName,model,gateWay, ...rest} = e
      return {...rest, operate:2}
    })
    let nparams = newarc.map(n=> {
      let   {areaName,model,gateWay,id, ...rest} =n
       return { ...rest, operate:1}
    })
    /* if(editarc?.length>0)  {
      let eparams = editarc.map(e => {
        let  {areaName,model,gateWay, ...rest} = e
        return {...rest, operate:2}
      })
      try {
       let data =   await useInsertOrUpdateInteriorACs({projectId}, eparams)
       msg["edit"] = data
      } catch (error) {
        console.log(error)
      } 
    }
    if(newarc?.length >0) {
      let nparams = newarc.map(n=> {
        let   {areaName,model,gateWay,id, ...rest} =n
         return { ...rest, operate:1}
      })
     try {
        let data =  await useInsertOrUpdateInteriorACs({projectId}, nparams)
        msg["new"] =data
      } catch (error) {
        console.log(error)
      } 
      
    }*/
    let {success, errMsg} =  await useInsertOrUpdateInteriorACs({projectId}, [...nparams, ...eparams])
    if(success) {
      message.success("设置成功")
      editRef.current.onCancel()
    }else {
      message.warning(errMsg ||"数据出错")
    }
    /* if (msg?.edit ) {
       if(msg.edit.success){
        message.success("编辑成功")
       }else {
        message.warning(msg.edit?.errMsg || "编辑数据出错")
       }
      
    }
    if(msg?.new) {
      if(msg.new.success) {
        message.success("新增成功")
      }else {
        message.warning(msg.new?.errMsg || "新增出错")
      }
    } */
 /*    if(success) {
      message.success(msg)
      if(!isadd) {
        editRef.current.onCancel()
      }
      refresh()
    }else {
      message.warning(errMsg || "数据出错")
    } */

  } catch (error) {
    const {errorFields } = error
    
    errorFields?.forEach(err => {
      let  errmsg = err.errors?.join()
      
      let  hostname = innewform.getFieldValue(err.name[0])[[err.name[1]]]?.["name"] || `内机${err.name[1] + 1}`
      message.warning(hostname+"内机"+errmsg)

    })
    console.log(error)
    return Promise.reject("")
  }

}


 // 内机 end

  const columns = [
    ...cols,
    {
      title: '操作', 
      key:'option',
      render: (_, row)=> <Space size={16}>
        <Link onClick={()=> onEdit(row)}>编辑</Link>
         {row.type==2 ?  <Link underline onClick={()=> addInac(row)}>内机</Link> : null}
         <Link type="danger" onClick={()=> onDel(row)}>删除</Link></Space>
    },
  ]
  
  const onExport =useCallback(() => {  
    downParams.current.pageNum=1;
    downParams.current.pageSize=total
    return   useQueryExteriorACsByPage({}, downParams.current).then(res => {
      let {success, data, total} =res
      if(success && Array.isArray(data)) { 
        return {
          list: data,
          total,
        }
      }else {
        if(!success) message.warning(errMsg || "接口出错" )
        return {
          list: [],
          total:0
        }
      }

    })
 }, [total])
 


  return (
    <Pagecount pd="0">
      
        <Mainbox>
         <div className="search">
          <Form form={form} layout="inline"  >
            <Space size={16}>
            <Form.Item name="areaId" initialValue={0}>
            <AreaSelect style={{width: "264px"}} isall={{name: "全部", id:0}} onChange={submit} />
            </Form.Item>
            <Form.Item label="设备查询" name="alike" style={{marginLeft: "16px"}} >
         <Serach onSearch={submit} placeholder='请输入设备编号/安装地址'  />
            </Form.Item>
            <Form.Item name="type" initialValue={0}>
              <Select options={airconditioner} style={{width:"200px"}} onChange={submit}></Select>
              </Form.Item> 
            <Form.Item name="useType" initialValue={0}>
<Select options={useTypeopt} style={{width:"200px"}} onChange={submit}></Select>
            </Form.Item>
            </Space>
          </Form>
          <Space size={16}>
            <CustButtonT text="new" onClick={()=> onAdd()}></CustButtonT>
            <CustButton onClick={()=> onexport()}>批量导入</CustButton>
            <ExportExcel tb={tbref}></ExportExcel>
          </Space>
         </div>
        <UserTable columns={columns} {...tableProps} onExport={onExport} rowKey={row=>row.id} ref={tbref}  sheetName="空调档案"></UserTable>
        </Mainbox>
       
         {/* 新增/编辑空调内机 */}

       <CModal title="新增空调内机"   onOk={inonOk}    width={732} mold="cust"    ref={inRef} key="inref">
         <Descriptions>
           <Descriptions.Item label="设备名称">{curRow?.name}</Descriptions.Item>
           <Descriptions.Item label="设备编号">{curRow?.sn}</Descriptions.Item>
           <Descriptions.Item label="所属园区">{curRow?.areaName}</Descriptions.Item>
           <Descriptions.Item label="安装地址" span={3}>{curRow?.address}</Descriptions.Item>
         </Descriptions>
        <Form form={innewform} labelAlign="right" labelCol={{flex: "7em"}} preserve={false}>
          {infromitem}
        </Form>
       </CModal>

       {/* 新增/编辑空调外机 */}

       <CModal title={Ctitle}   onOk={onOk}   width={832} mold="cust"  custft={isadd=='add'}   ref={editRef} key="ediref">
        <Form form={newform} labelAlign="right" labelCol={{flex: "7em"}} preserve={false}>
          {fromitem}
        </Form>
       </CModal>

        <CModal title="删除提示"  ref={delref} width={512} mold="cust" type="warn" onOk={onOkDel} key="del" >
        删除该空调将同步删除关联内机空调，是否继续？
               </CModal>
               <CModal title="批量导入"  ref={exprotref} width={512} dragprops={dragprops}  type="drag" onOk={onUpload} > 
               </CModal>
    </Pagecount>
  )
}

