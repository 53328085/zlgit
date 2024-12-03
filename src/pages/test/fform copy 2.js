import { Button, Modal, Space, Input } from 'antd';
import styled,{keyframes} from 'styled-components';
import React, { createContext, useEffect, useRef, useState } from 'react';
import {useSearchParams, useLocation, useNavigate} from 'react-router-dom'
import {Carbon} from '@api/api'
import   {utils, writeFile, read, readFile } from 'xlsx'
import BScroll from 'better-scroll'
const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(800px);
  }
`
const Flexbox = styled.div`
&& {
  display: flex;
  width: 800px; 
  flex-direction: column;
  column-gap: 16px;
  .sheet {
    flex: 1;
    td {
      padding: 2px 4px;
      border: 1px solid #dedede;
      text-align: center;
      span {
        display: inline-block;
        width: max-content;
      }
    }
  }
// animation:  ${scroll} 3s infinite;
  .item {
    width: 200px;
    height: 50px;
    display: flex;
    align-content: center;
    background-color: brown;

  }
  .cell {
    padding: 2px 4px;
    border: 1px solid #dedede;
    text-align: center;
    span {
      display: inline-block;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    width: 200px;
    .s {
      height: 100px;
    }
  }
}
`
const App = () => {
  const ref = useRef()
  function getCellStyle(cellStyle) {
    var styleAttr = '';
    if (cellStyle?.font) {
      var font = cellStyle.font;
      if (font.bold) styleAttr += 'font-weight:bold;';
      if (font.italic) styleAttr += 'font-style:italic;';
      if (font.underline) styleAttr += 'text-decoration:underline;';
      if (font.strike) styleAttr += 'text-decoration:line-through;';
      if (font.color) styleAttr += 'color:' + font.color.rgb + ';';
      if (font.name) styleAttr += 'font-family:' + font.name + ';';
    }
    if (cellStyle?.alignment) {
      var alignment = cellStyle.alignment;
      if (alignment.horizontal) styleAttr += 'text-align:' + alignment.horizontal + ';';
      if (alignment.vertical) styleAttr += 'vertical-align:' + alignment.vertical + ';';
    }
    if (cellStyle?.fill) {
      var fill = cellStyle.fill;
      if (fill.patternType === 'solid' && fill.fgColor) {
        styleAttr += 'background-color:' + fill.fgColor.rgb + ';';
      }
    }
    return styleAttr;
  }

  function getMergeAttributes(sheet, row, col) {
    try {
      var mergeCells = sheet['!merges'] || [];
      console.log(mergeCells)
      for (var i = 0; i < mergeCells.length; i++) {
         
        var mergeRange = utils.decode_range(mergeCells[i]);
        if (row >= mergeRange.s.r && row <= mergeRange.e.r && col >= mergeRange.s.c && col <= mergeRange.e.c) {
          return 'rowspan="' + (mergeRange.e.r - mergeRange.s.r + 1) + '" colspan="' + (mergeRange.e.c - mergeRange.s.c + 1) + '"';
        }
      }
      return '';
    } catch (error) {
      return ''
      console.log(error)
    }
  
  }

  function getCellComment(cell) {
    if (cell && cell.c) {
      var comment = cell.c[0].t;
      return comment;
    }
    return '';
  }
  const getdata =async() => {
    try {
      let params = {
        year: 2024,
        month: 9,
        enterpriseId: 1,
       }
      let res = await  Carbon.DownloadTemplate(params)
      
      if(res) {
      //  const wb =   read(res);
      //  const wsname = wb.SheetNames[0];
      //  const ws = wb.Sheets[wsname];
      
        var workbook =read(new Uint8Array(res), { type: 'array' });
         workbook.Props.Title="正泰物联"
         workbook.Custprops["编辑"]="zhuzhenglin"
       
         console.log(workbook)
     //   writeFile(workbook, '测试.xlsx', {Props:{Author: '朱正林'}})
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
         
        console.log(utils.sheet_to_json(sheet))
        console.log(sheet)
      
        let data =  utils.sheet_to_html(sheet, {id: "zh", editable: true, header: true, footer: true})
        
        ref.current.innerHTML = data
      }
    

    } catch (error) {
      console.log(error)
    }
     

  }
  const tbref = useRef()
  const tbref2 = useRef()
  const fread = () => {
    const xls = utils.table_to_book(tbref.current)
     const tb = utils.book_new()
    /*  const ws = utils.table_to_sheet(tbref.current)
     utils.book_append_sheet(tb, ws)
     const ws2 = utils.table_to_sheet(tbref2.current)
     utils.book_append_sheet(tb, ws2)   */
     let wsdata = [["年龄","体重"],[45, 75],[42,60]]
     let ws = utils.aoa_to_sheet(wsdata)
     
     ws["!margins"]={left:0.7, right:0.7, top:0.75,bottom:0.75,header:1.3,footer:1.3}
     utils.book_append_sheet(tb, ws, '个人')
     
     let rang = tb.Sheets[tb.SheetNames[0]] 
     console.log(tb)
     //utils.sheet_add_aoa(tb.Sheets[tb.SheetNames[0]], [[16]])
    
     let html = utils.sheet_to_html(tb.Sheets[tb.SheetNames[0]]);
     ref.current.innerHTML = html;
  }
  return (
    <Flexbox>
       <Space><Button onClick={getdata}>显示</Button>
        <Button onClick={fread}>解析</Button></Space> 
      <div className='sheet' ref={ref}></div>  
        <table ref={tbref}>
            <th>
              <td>姓名</td>
            </th>
            <tr>
              <td>朱思文</td>
            </tr>
        </table>
        <table ref={tbref2}>
          <thead>
            <th>
              <td>dd</td>
            </th>
          </thead>
          <tbody>
            <tr>
              <td>12</td>
            </tr>
          </tbody>
        </table>
    </Flexbox>
  )
};
export default App;