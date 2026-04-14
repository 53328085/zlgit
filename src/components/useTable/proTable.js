import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState, useCallback, memo, useMemo } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { message, Input, Button, Space } from 'antd'
import { SearchOutlined } from "@ant-design/icons"
import {useLocation} from "react-router-dom"
import { useSelector } from "react-redux";
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { utils, writeFile } from 'xlsx'
import { nanoid } from '@reduxjs/toolkit'
import Tablecom from './index'
import ProTablecom,{TableContainer,Settingicon} from './proTablesty'
import setting from './icon/setting.png'
import {isObject} from "@com/usehandler"
import {

  adaptation
} from "@redux/systemconfig.js";
 
 
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
 

 


function Index(props, ref) {
  const { pagination, paginationShow, sheetName = "sheet.xlsx", tempName = '', onExport = () => { }, tempcolums, tempdata, scroll = {},columnsState={}, style = {}, ...otherprops } = props

  const ecolumns = otherprops.columns?.filter(col => !col.hasOwnProperty('export'))
  const tableref = useRef()
  let { laptop } = useSelector(adaptation)
  const allref = useRef()
  const [lists, setLists] = useState()
  const [total, setTotal] = useState(0)
  const [showtb, setShowtb] = useState(false) // 表格全部导出后，移除表格
  const tempref = useRef();
  const { t } = useTranslation("comm")
  const location = useLocation()



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
      <Tablecom bordered size="small" tableLayout="auto" className={`all_${props.tableClassName}`}  dataSource={lists} pagination={{ current: 1, pageSize: total }} columns={ecolumns} rowKey={row=>Object.values(row).join()} tableRef={allref} style={{ position: "absolute", left: "-50000px" }} />,
      document.getElementById("root")
    )

  })

  const downloadAll = async () => {
    try {
      let { data, total } = await onExport()
      console.log(data)
      flushSync(() => {
        setShowtb(true)
        setLists(data)
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
    let table = document.querySelector(`.all_${props.tableClassName}`) ;
    if(!table)return
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

  const domExprot = (className) => { // 通过table DOM 导出  
    try {
   

    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿   
    
    let table =  document.querySelector(`.ant-table-wrapper.${className}`);
    console.log("table",table)
    if (table) {
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
    } catch (error) {
      console.log(error);
    }
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
    download: (className)=> domExprot(className),
    downloadByData: (params) => dataExport(params),
    printContent: tableref.current,
    downloadAll, // 下载全部数据
    downTemp,
  }))

 
  return (
    <TableContainer flex={props.flex} style={{ ...style }}>
      <ProTablecom bordered defaultSize="small"  
        tableClassName={props.tableClassName }
        rowKey={row=>Object.values(row).join()} 
                    
                      tableAlertRender={false}
                      options={{
                         fullScreen: true,
                          reload: false,
                          density: false,
                          setting: {
                            settingIcon: <Settingicon><img src={setting} className='img' /></Settingicon> ,
                            listsHeight:400,
                            
                          },
                        }
                      }
                      scroll={{
                        scrollToFirstRowOnChange: true,
                        x: "max-content",
                        y: 500,
                        ...scroll,
                     
                      }
                      }
                      {...otherprops}
                      laptop={laptop} />
      {Array.isArray(lists) && showtb && <Allupdate lists={lists} total={total} />}
   
    </TableContainer>
  )
}

export default forwardRef(Index)