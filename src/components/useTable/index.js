import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState, useCallback, memo, useMemo } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { message, Pagination } from 'antd'
import { useSelector } from "react-redux";
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { utils, writeFile } from 'xlsx'
import { nanoid } from '@reduxjs/toolkit'
import Tablecom from './custTable'
import {

  adaptation
} from "@redux/systemconfig.js";
const Divbox = styled.div`
display: flex;
flex: ${props => props.flex || 1};
flex-direction: column;
justify-content: space-between;
`
/* const Tablecom = styled(Table)`
&& {
display: flex;
flex: 1;
flex-direction: column;
.ant-table-title {
  border: none;
  font-size: ${props => props.tfs || '16px'};
  color: #515151;
  padding-bottom: 16px;
}
.ant-table-tbody {
  .ant-table-row {
    .ant-table-cell {
      text-align: center;
    }
  }

}
.ant-table.ant-table-small {
  .ant-table-container{
    .ant-table-thead{
      .ant-table-cell {
        padding: 4px 4px;
      }
    }
    .ant-table-tbody {
      .ant-table-row{
        .ant-table-cell {
          padding: 4px 4px;
        }
      }
    }
  }
}
.ant-spin-nested-loading, .ant-spin-container {
  display: flex;
  flex:1;
  flex-direction: column;
  justify-content: space-between;
}
 
}
` */

// 生成表格模板 



function Index(props, ref) {
  const { pagination, paginationShow, sheetName = "sheet.xlsx", tempName = '', onExport = () => { }, tempcolums, tempdata, scroll = {}, style = {}, ...otherprops } = props
  
  const ecolumns = otherprops.columns?.filter(col => !col.hasOwnProperty('export'))
  const tableref = useRef()
  let { laptop } = useSelector(adaptation)
  const allref = useRef()
  const [lists, setLists] = useState()
  const [total, setTotal] = useState(0)
  const tempref = useRef();
  const { t } = useTranslation("comm")

  const TableTemp = memo(() => {

    return createPortal(
      <Tablecom bordered size="small" locale={{ emptyText: undefined, }} dataSource={tempdata} columns={tempcolums} rowKey={otherprops.rowKey} ref={tempref} style={{ position: "absolute", left: "-55000px" }} />,
      document.getElementById("root")
    )

  }, [tempcolums, tempdata])


  const downTemp = useCallback(() => {  // 下载模板
    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿      
    let table = tempref.current;
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    let file = tempName.split(".").length == 1 ? "xlsx" : tempName.split(".")[1];

    let fileName = tempName.split(".")[0]
    writeFile(workbook, `${fileName}.${file}`, { bookType: file }); // 下载

  }, [ecolumns])




  const Allupdate = memo(({ lists, total }) => {

    return createPortal(
      <Tablecom bordered size="small" dataSource={lists} pagination={{ current: 1, pageSize: total }} columns={ecolumns} rowKey={otherprops.rowKey} ref={allref} style={{ position: "absolute", left: "-50000px" }} />,
      document.getElementById("root")
    )

  })

  const downloadAll = async () => {
    try {
      let { list, total } = await onExport()
      console.log(list)
      flushSync(() => {
        setLists(list)
        setTotal(total)
      })

      download()
    } catch (error) {
      console.log(error)
      message.warning('导出出错！')

    }


  }

  const download = useCallback(() => {
    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿      
    let table = allref.current;
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    let file = sheetName.split(".").length == 1 ? "xlsx" : sheetName.split(".")[1];

    let fileName = sheetName.split(".")[0]
    writeFile(workbook, `${fileName}.${file}`, { bookType: file }); // 下载

  }, [lists, total])

  const domExprot = () => { // 通过table DOM 导出  


    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿      
    let table = tableref.current;
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    let file = sheetName.split(".").length == 1 ? "xlsx" : sheetName.split(".")[1];
    let fileName = sheetName.split(".")[0]
    writeFile(workbook, `${fileName}.${file}`, { bookType: file }); // 下载
  }
  const dataExport = ({ header, data, skipHeader = true, sheetName = 'sheet1', option = {} } = {}) => {

    const workbook = utils.book_new(); // 新建工作簿
    // var ws = utils.aoa_to_sheet([header]); // 添加标题到工作表
    //utils.sheet_add_json(ws, data, { skipHeader: true, origin: "A2" }); // 添加数据到工作表
    let ws = utils.json_to_sheet(data, { header, skipHeader })

    let { rowinfo, colinfo } = option
    rowinfo ? ws["!rows"] = rowinfo : ''
    colinfo ? ws["!cols"] = colinfo : ''

    utils.book_append_sheet(workbook, ws, sheetName); // 把工作表添加到工作簿
    let file = sheetName.split(".").length == 1 ? "xlsx" : sheetName.split(".")[1];
    let fileName = sheetName.split(".")[0]

    writeFile(workbook, `${fileName}.${file}`, { bookType: file }); // 下载
  }
  useImperativeHandle(ref, () => ({
    download: domExprot,
    downloadByData: dataExport,
    printContent: tableref.current,
    downloadAll, // 下载全部数据
    downTemp,
  }))

  const paginationProp = pagination ? Object.assign({}, {
    //  hideOnSinglePage: true,
    showTotal: (total) => t("totalpages", { count: total }),
  }, pagination) : false

  const paginationPropShowSelect = pagination ? Object.assign({}, {
    //  hideOnSinglePage: true,
    showTotal: (total) => t("totalpages", { count: total }),
    pageSizeOptions: ["10", "15", "20"],
    showSizeChanger: true
  }, pagination) : false
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  return (
    <Divbox flex={props.flex} style={{ ...style }}>
      <Tablecom bordered size="small" pagination={paginationShow ? paginationPropShowSelect : paginationProp} ref={tableref} rowKey={nanoid()}  {...otherprops} scroll={{
        scrollToFirstRowOnChange: true,
        ...scroll,
      }} laptop={laptop} />
      {Array.isArray(lists) && <Allupdate lists={lists} total={total} />}
      {props.istemp && <TableTemp />}
    </Divbox>
  )
}

export default forwardRef(Index)