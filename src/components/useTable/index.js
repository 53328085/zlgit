import React, {useRef, useImperativeHandle, forwardRef, useEffect, useState} from 'react'
import {Table} from 'antd'
import styled from 'styled-components'
import {utils, writeFile} from 'xlsx'
 function Index(props, ref) { 
  const {pagination, sheetName="sheet.xlsx", ...otherprops} =props  
  const tableref = useRef()
  const domExprot = ()=> { // 通过table DOM 导出  
    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿   
    let table = tableref.current  
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    let file =  sheetName.split(".").length == 1 ? "xlsx" : sheetName.split(".")[1];
    writeFile(workbook, sheetName, { bookType: file }); // 下载
  }
  const dataExport = ({header, data, sheetName='sheet1', option={}} ={}) => {
    const workbook = utils.book_new(); // 新建工作簿
   // var ws = utils.aoa_to_sheet([header]); // 添加标题到工作表
    //utils.sheet_add_json(ws, data, { skipHeader: true, origin: "A2" }); // 添加数据到工作表
    let ws = utils.json_to_sheet(data, {header, skipHeader: true})
   
     let {rowinfo, colinfo} = option
     rowinfo ?  ws["!rows"] = rowinfo : ''
     colinfo ?  ws["!cols"] = colinfo : ''
    
    utils.book_append_sheet(workbook, ws, sheetName); // 把工作表添加到工作簿
    let file = sheetName.split(".").length == 1 ? "xlsx"  : sheetName.split(".")[1];
    let fileName = sheetName.split(".")[0]
    
    writeFile(workbook, `${fileName}.${file}`, { bookType: file }); // 下载
  }
  useImperativeHandle(ref, () => ({
    download: domExprot,
    downloadByData: dataExport,
    printContent: tableref.current,
  }))
 
  const paginationProp = pagination ? Object.assign( {}, {
    hideOnSinglePage: true,
    showTotal: (total) => `共${total}条记录`,
  }, pagination) : false

  const Divbox = styled.div`
    display: flex;
    flex:1;
    flex-direction: column;
    justify-content: space-between;
  `
  const Tablecom = styled(Table)`
    display: flex;
    flex:1;
    flex-direction: column;
    .ant-spin-nested-loading, .ant-spin-container {
      display: flex;
      flex:1;
      flex-direction: column;
      justify-content: space-between;
    }
  `
  return (
    <Divbox>
        <Tablecom  bordered  size="small"  pagination={paginationProp} ref={tableref} { ...otherprops}  />
    </Divbox>
  )
}
export default forwardRef(Index)