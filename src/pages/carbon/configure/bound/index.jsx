import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react'
import Pagecount from '@com/pagecontent'
import styled, {createGlobalStyle} from 'styled-components'
import {Form, Space,Button, Tree, Input, message} from 'antd'
import {useSelector} from 'react-redux'
import {selectProjectId, enterprise} from '@redux/systemconfig'
import { cloneDeep } from 'lodash';
import {Carbon} from '@api/api'
import Titlelayout from "@com/titlelayout"
import {TreeBtnN, TreeBtnW} from "@com/useButton"
import {CustButtonT, CustButton} from "@com/useButton"
import CModal from "@com/useModal"
import TableT from  "./tabletmp"
import CDraw from './draw'
const {TreeNode} = Tree;
import {
  useBoundaryTreeQuery, 
  useAddCarbonBoundaryMutation, 
  useUpdateBoundaryMutation,
  useDeleteBoundaryMutation,
  useBoundaryConfigQuery,
  useSetConfigDataMutation,
  boundarySlice
} from "./boundary"

const GlobalStyles = createGlobalStyle`
     .ant-tree-switcher-leaf-line:before {
     // border: 4px solid var(--ant-primary-color);
    }
`;
const CTree = styled(Tree)`
  && {
    flex:1;
    padding-right: 16px;
    margin-top: 16px;
    padding-top: 32px;
    border-top: 1px solid #d7d7d7;
    .ant-tree-title {
      display: block;
      margin-bottom: 16px;
    }
    .ant-tree-list-holder-inner {
      align-items: stretch;
    }
   .ant-tree-node-content-wrapper {
       display: block;
       flex: 1;
    }
    .ant-tree-show-line{
      .ant-tree-indent-unit:before {
        border-right: 4px solid ${props => props.theme.primaryColor};
      }  
       
    }
  }

`
const Custtitle = styled.div`
    display: flex;
    padding: 2px 32px;
    height: 22px;
    border-radius: 4px;
    color: var(--ant-primary-color);
    border: 1px solid ${props => props.theme.primaryColor};
    justify-content: center;
    align-items: center;
    font-size: 16px;
    .ant-tree-switcher-leaf-line:before {
      border-color: #237ae4;
    }

`
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 672px 1fr ;
  column-gap: 16px;
  .formbox {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dotted #d7d7d7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex:1;
  }
  .ant-form {
    flex: 1;
    .ant-form-item {
    margin-bottom: 16px;
  }
  }
 
`
const Tablebox = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 16px;
  padding-top: 16px;
  overflow-y: auto;
`
 
export default function Index() { 
  // const {id:enterpriseId} = useSelector(enterprise)
  const  enterpriseData = useSelector(enterprise)
  let  {id:enterpriseId} = enterpriseData
 
  const projectId = useSelector(selectProjectId)
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState(null)
  let carbonBoundaryId = useRef()
  const [mTitle, setMtitle] =useState()
  const [expandedKeys, setExpandedKeys] = useState([])
  console.log(expandedKeys)
  const drawref = useRef()
  
  const displaydraw=(params) => {
     setParams({...params, carbonBoundaryId: carbonBoundaryId.current})
     drawref.current.drawOpen()
  } 

  // 查询树
const expandkeys = []
const getKeys = (data) => {
   if(Array.isArray(data) && data.length > 0) {
      data.forEach((d) => {
        expandkeys.push(d.id.toString())
       
        if(d.nodes) {
          getKeys(d.nodes)
        }


      })



   }

}

 const [treeData, setTreeData] = useState([]) 
const getTreeData = async () => {
  try {
   let {success, data, errMsg} = await  Carbon.QueryCarbonBoundary(enterpriseId)
   if(success && Array.isArray(data) && data.length) {
      setTreeData(data)
      getKeys(data)
      setExpandedKeys([...expandkeys])
   }else {
    if(!success) message.warning(errMsg || '数据出错')
     setTreeData([])
     setExpandedKeys([])
   }

  } catch (error) {
    
  }


}

useEffect(() => {
  if(Number.isInteger(enterpriseId)) {
    getTreeData()
  }

}, [enterpriseId])

/*   let treeData
  const {isSuccess,refetch, data:boundaryData  } = useBoundaryTreeQuery(enterpriseId, {
    skip: !Number.isInteger(enterpriseId),
    
  })
  if(isSuccess) {
    treeData =Array.isArray(boundaryData?.data) ? boundaryData?.data : []
    console.log('s')
  }else {
     console.log('e',enterpriseId)
     treeData = []
  }
  */
  
  // 新增 编辑 删除子项
 
  const [addedit, setAddedit] = useState(true)
  const [saveSubItem] =useAddCarbonBoundaryMutation() // 新增
  const [editSubItem] = useUpdateBoundaryMutation() // 编辑
  const [deleteSubItme] = useDeleteBoundaryMutation() // 删除
  const parentIdRef = useRef({})
  const mref=useRef()
  const addSubitem = (id) => {
     parentIdRef.current = id
     setMtitle('新增碳排放边界分类子项')
     setAddedit(true)
     mref.current.onOpen()

  }
  const editSubitem = (id,name) => {
   
    parentIdRef.current = id
    form.setFieldValue('name',name);
    setMtitle('编辑碳排放边界分类子项')
    setAddedit(false)
    mref.current.onOpen()

 }
 const onDelete = async (id) => {
    let {success, errMsg} = await deleteSubItme(id).unwrap()
   if(success) {
      message.warning("删除成功")
      getTreeData()
    }else {
      message.warning(errMsg || "数据出错")
    } 
 }
 const onOk = async () => {
    try {
      let {name} = await form.validateFields()
      let id= parentIdRef.current
   
      if(addedit) {
        let params ={
          name,
          parentId: id,
          enterpriseId,
        }
         let {success, errMsg} = await saveSubItem(params).unwrap()
          if(success) {
            //refetch()
            getTreeData()
            message.success("保存成功")
           
          }else {
            message.warning(errMsg || '数据出错')
          }
      }else {
        let post ={
          id,
          name,
        }
        let {success, errMsg} = await editSubItem(post)
        if(success) {
          message.success("修改成功")
          getTreeData()
        }else {
          message.warning(errMsg || '数据出错')
        }
      }
    } catch (error) {
       console.log(error)
    }
   

 }

// 配置

   const [queryconfig] = boundarySlice.useLazyDataConfigQuery() // 碳排边界数据查询
   const  [title, setTitle]=useState();
   const [dataconfig, setDataConfig] =useState([])
   const saveData = useRef({}) // 点击 完成配置 时需要传递的数据
   const onConfig = async (item) => {
       try {
        let {id} = item
        carbonBoundaryId.current = id;
     //   setParams({...params,carbonBoundaryId:id})
        let txt= treeData.find((t) => t.id==1)?.name + '碳排放-数据源配置'
        let {success, data, errMsg} = await queryconfig({enterpriseId, carbonBoundaryId:id, projectId}).unwrap();
 
        if(success && Array.isArray(data)) {
         setTitle(txt)
         setOpen(true)
         setDataConfig(data)       
         data.forEach(e => {
           saveData.current[e.categoryName] = e
         })
         console.log(saveData.current)
        }else {
         saveData.current={}
         message.warning(errMsg || '数据出错')
        }
       } catch (error) {
         console.log(error)
       }
      
      
       
   }

   // 完成配置

   const [finshconfig, {isLoading: isfinsh}] =useSetConfigDataMutation()
   
   const onfinsh = async () => {
    try {
      let params = {
        enterpriseId,
        carbonBoundaryId:carbonBoundaryId.current,
        post: []
      }
     
      for(let value of Object.values(saveData.current)) {
        let {dataSubCategoryVos} = value
        let keys = dataSubCategoryVos.map(d => ({subCategoryId:d.subCategoryId, dataSource: d.dataSource}))
        params.post = [...params.post, ...keys]

      }
      let {success, errMsg} = await finshconfig(params).unwrap()
      if(success) {
        message.success('保存成功')
      }else {
        message.warning(errMsg || '数据出错')
      }
       
    } catch (error) {
      console.log(error)
    }
     

   }

   // end

   const Title = useMemo(() => (<div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
   <span>{title}</span>
   <CustButtonT text="Completeconfiguration" ns="button" loading={isfinsh} onClick={onfinsh} /> 
  </div>), [title,open])

const renderTreeNodes = (data) => {
  data = cloneDeep(data);
  let nodeArr = data.map((item) => {
    let valName = cloneDeep(item.name);
    let {name, id, nodes,parentId} = item   
   
      item.name = (
        <div style={{display:"flex", justifyContent:"space-between", alignItems: "center"}}>
        {parentId === 0 ? <CustButton wh="auto">{item.name}</CustButton> :  <Custtitle>{item.name}</Custtitle>}
        <Space size={16}>
        <TreeBtnN text="addSubitem" wh="auto" onClick={() => addSubitem(id,valName)} key="add" />
        <TreeBtnN text="edit" key="edit" onClick={() => editSubitem(id,valName)} />
        {parentId!==0 && <TreeBtnW text="delete" key="delete" onClick={() => onDelete(id)} />}
        <TreeBtnN text="configure" key="configure" onClick={() => onConfig(item)} />
        </Space>
      </div>
      )
      if(item.nodes){
          return (
              <TreeNode title={item.name} key={item.id} dataRef={item}>
                  {renderTreeNodes(item.nodes)}
              </TreeNode>
          )
      }
      return <TreeNode title={item.name} key={item.id}></TreeNode>
  })
  return nodeArr;
}

  const custitem =(item) => {
    let {name, id, nodes,parentId} = item   
    if(Array.isArray(nodes) && nodes.length >0) {
       custitem(nodes)
     }
    return   (
      <div style={{display:"flex", justifyContent:"space-between", alignItems: "center"}} key={id}>
        {parentId === 0 ? <CustButton wh="auto">{name}</CustButton> :  <Custtitle>{name}</Custtitle>}
        <Space size={16}>
        <TreeBtnN text="addSubitem" wh="auto" onClick={() => addSubitem(item)} key="add" />
        <TreeBtnN text="edit" key="edit" onClick={() => editSubitem(item)} />
        {parentId!==0 && <TreeBtnW text="delete" key="delete" onClick={() => onDelete(id)} />}
        <TreeBtnN text="configure" key="configure" onClick={() => onConfig(item)} />
        </Space>
      </div>
    )
  }
  return (
    <Pagecount bgcolor="transparent" pd="0">
    
    <Mainbox >
      <GlobalStyles/>
         <Titlelayout title="排放单元结构" layout="flex" key="left">
       {treeData?.length > 0 ?   (<CTree  height={654} defaultExpandedKeys={expandedKeys} showLine blockNode selectable={false}>{renderTreeNodes(treeData)}</CTree>): null
       }
          
          </Titlelayout>
         {open && (<Titlelayout   title={Title} layout="flex"  key="right">
                       <Tablebox>
                       {dataconfig.map((e,index) => <TableT tabledata={e} key={e.categoryName}  displaydraw={displaydraw} saveData={saveData.current} projectId={projectId} enterpriseId={enterpriseId} /> )}
                       </Tablebox>
          </Titlelayout>)
          }
       </Mainbox>  
       <CModal title={mTitle} ref={mref} mold="cust" onOk={onOk} width={480} custft>
        <Form form={form}   preserve={false}>
           <Form.Item label="边界子项名称" name="name"
           normalize={value => value.trim()}
            rules={[{
              required: true,
              message: '名称不能为空'
           }]}>
                 <Input placeholder='请输入碳排子项名称' allowClear />
           </Form.Item>
            
        </Form>

     </CModal>
     <CDraw ref={drawref} params={params} />
    </Pagecount>
  )
}
