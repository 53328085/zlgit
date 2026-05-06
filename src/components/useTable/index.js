import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState, useCallback, memo, useMemo } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { message, Input, Button, Space } from 'antd'
import { SearchOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { utils, writeFile } from 'xlsx'
import { nanoid } from '@reduxjs/toolkit'
import Tablecom from './custTable'
import {

  adaptation
} from "@redux/systemconfig.js";
import { isObject } from 'lodash';
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
// 通过数据导出表格，没有表格实例
  export const dataExport = (params) => {   
   
    const { header, data, skipHeader = true, sheetName = 'sheet1', option = {} } = isObject(params) ? params : {}

    const workbook = utils.book_new(); // 新建工作簿
    // var ws = utils.aoa_to_sheet([header]); // 添加标题到工作表
    //utils.sheet_add_json(ws, data, { skipHeader: true, origin: "A2" }); // 添加数据到工作表
    let ws = utils.json_to_sheet(data, option)

    let { rowinfo, colinfo } = option
    rowinfo ? ws["!rows"] = rowinfo : ''
    colinfo ? ws["!cols"] = colinfo : ''

    utils.book_append_sheet(workbook, ws, sheetName); // 把工作表添加到工作簿
    let file = sheetName.split(".").length == 1 ? "xlsx" : sheetName.split(".")[1];
    let fileName = sheetName.split(".")[0]

    writeFile(workbook, `${fileName}.${file}`, { bookType: file }); // 下载
  }
// 生成表格模板 

// 表格搜索函数

export const getColumnSearchProps = (dataIndex, desc) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Input
        placeholder={`请输入${desc}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm()}
        style={{
          marginBottom: 8,
          display: 'block',
        }}

      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
        >
          刷选
        </Button>
        <Button
          onClick={() => { clearFilters?.(); confirm() }}
          size="small"
        >
          清空
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            close();
          }}
        >
          关闭
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined
      style={{
        color: filtered ? '#1890ff' : undefined,
      }}
    />
  ),
  onFilter: (value, record) =>
    record[dataIndex]?.toString().toLowerCase().includes(value?.toLowerCase()),
});


function Index(props, ref) {
  const { pagination, paginationShow, sheetName = "sheet.xlsx", tempName = '', onExport = () => { }, tempcolums, tempdata, scroll = {}, style = {}, ...otherprops } = props

  const ecolumns = otherprops.columns?.filter(col => !col.hasOwnProperty('export'))
  const tableref = useRef()
  let { laptop } = useSelector(adaptation)
  const allref = useRef()
  const [lists, setLists] = useState()
  const [total, setTotal] = useState(0)
  const [showtb, setShowtb] = useState(false) // 表格全部导出后，移除表格
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
    let table = tempref.current.nativeElement;
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
      flushSync(() => {
        setShowtb(true)
        setLists(list)
        setTotal(total)
      })

      download()
    } catch (error) {
      console.log(error)
      setShowtb(false)
      message.warning('导出出错！')

    }


  }

  const download = useCallback(() => {
    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿      
    let table = allref.current.nativeElement;
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿

    const worksheet = workbook.Sheets['Sheet1']
    const range = utils.decode_range(worksheet['!ref']);
    worksheet['!autofilter'] = {
      ref: utils.encode_range({
        s: { r: 0, c: 0 },  // 开始位置: 第1行，第1列
        e: { r: range.e.r, c: range.e.c } // 结束位置: 最后一行，最后一列
      })
    };

    let file = sheetName.split(".").length == 1 ? "xlsx" : sheetName.split(".")[1];

    let fileName = sheetName.split(".")[0]
    writeFile(workbook, `${fileName}.${file}`, { bookType: file }); // 下载
    setShowtb(false)
  }, [lists, total, sheetName])

  const domExprot = () => { // 通过table DOM 导出  


    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿      
    let table = tableref.current?.nativeElement;
    console.log("table", table)
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿

    const worksheet = workbook.Sheets['Sheet1']
    const range = utils.decode_range(worksheet['!ref']);
    worksheet['!autofilter'] = {
      ref: utils.encode_range({
        s: { r: 0, c: 0 },  // 开始位置: 第1行，第1列
        e: { r: range.e.r, c: range.e.c } // 结束位置: 最后一行，最后一列
      })
    };

    let file = sheetName.split(".").length == 1 ? "xlsx" : sheetName.split(".")[1];
    let fileName = sheetName.split(".")[0]
    writeFile(workbook, `${fileName}.${file}`, { bookType: file }); // 下载
  }
  const dataExport = (params) => {  // 根据数据创建表格，可以选择要导出的列
    console.log("params", params)
    const { header, data, skipHeader = true, sheetName = 'sheet1', option = {} } = isObject(params) ? params : {}

    const workbook = utils.book_new(); // 新建工作簿
    // var ws = utils.aoa_to_sheet([header]); // 添加标题到工作表
    //utils.sheet_add_json(ws, data, { skipHeader: true, origin: "A2" }); // 添加数据到工作表
    let ws = utils.json_to_sheet(data, option)

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
    downloadByData: (params) => dataExport(params),
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
      {Array.isArray(lists) && showtb && <Allupdate lists={lists} total={total} />}
      {props.istemp && <TableTemp />}
    </Divbox>
  )
}

export default forwardRef(Index)