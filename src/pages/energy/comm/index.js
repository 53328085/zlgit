import React, {useState, useEffect, useRef} from 'react'
import { useRequest } from 'ahooks';
import style from './style.module.less';
import { message } from 'antd';
import UseHeader from '@com/useHeader'
import Searchtree from '@com/searchTree';
import Barchart from './barChart';
import Ringchart from './ringChart';
import Percent from './percent'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import {utils, writeFile} from 'xlsx'
import { EnergyPublicRuntime } from '@api/api.js'
export default function Index() {
  const tableRef = useRef()
  const { queryEnergyCategoryTree } = EnergyPublicRuntime
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    })
  }
  const projectId = useSelector(selectProjectId);
  //导出数据
  const exportData = () => {
    console.log('export')
    // const params = { raw: true };
    // const workbook = utils.book_new(); // 新建工作簿   
    // let table = tableRef.current  
    // const ws = utils.table_to_sheet(
    //   // 新建工作表
    //   table,
    //   params
    // );
    // utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    // let file =  "xlsx";
    // writeFile(workbook, '公共能耗.xlsx', { bookType: file }); // 下载
  }
  const headerProps = {
    isEnergy:true,
    isDate: true,
    isShift: true,
    isExport: true,
    isSearch: true,
    isTab:false,
    export: exportData
  }
  const [headerData, setHeaderData] = useState({})
  const getFromChild = data => {
    setHeaderData(data)
  }
  //树
  const [treeData, setTreeData] = useState([])
  const fieldNames = {
    title:'name',
    key: 'id',
    children: 'nodes'
  }
  const getCategoryTree = () => {
    return queryEnergyCategoryTree(projectId, headerData.energyType).then(res => {
      let {success, data} = res
      if(res.success){}
    })
  }
  const {run: runTree} = useRequest(getCategoryTree,{
    manual: true
  })
  useEffect(()=>{
    if(headerData.energyType){
      runTree()
    }
  },[headerData.energyType])

  return (
    <div>
      {contextHolder}
      <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
      <div className={style.content}>
        <Searchtree title='公共能耗分类' fieldNames={fieldNames} treeData ={treeData}></Searchtree>
        <div className={style.contentMiddle}>
          <span className={style.title}>公共能耗</span>
          <Barchart></Barchart>
        </div>
        <div className={style.contentRight}>
          <div className={style.rightTop}>
            <span className={style.title}>公共能耗占比</span>
            <Ringchart></Ringchart>
          </div>
          <Percent></Percent>
        </div>
      </div>
    </div>
  )
}
