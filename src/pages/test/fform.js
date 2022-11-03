/**
 * @author zhenglin zhu
 * @description: 
 * 导出
    XLSX.utils.sheet_to_csv 生成CSV文件
    XLSX.utils.sheet_to_txt 生成UTF16的格式化文本
    XLSX.utils.sheet_to_html 生成HTML
    XLSX.utils.sheet_to_json 生成一个对象数组
    XLSX.utils.sheet_to_formulae 生成一张公示列表
    导入
    aoa_to_sheet 把JS数据数组的数组为工作表。
    json_to_sheet 把JS对象数组转换为工作表。
    table_to_sheet 把DOM TABLE元素转换为工作表。
    sheet_add_aoa 把JS数据数组的数组添加到已存在的工作表中。
    sheet_add_json 把JS对象数组添加到已存在的工作表中。

 * @date 2022-11-03 14:08
 */

import React, {useEffect, useRef} from 'react'
import {read, utils, writeFile, write} from 'xlsx'
import {Button} from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

export default function fform() {
  const ref = useRef()
  useEffect(() => {
 // const book = utils.table_to_book(document.getElementById("tb"))
  //writeFile(book, 'out.xlsx')
  //console.log(book)
  })
  const download = () => {
    console.log(11)
    let workbook = utils.book_new(); //创建工作薄
    let sheet = utils.table_to_sheet(document.getElementById('tb')) // dom创建工作表
     sheet['B4']= {t: 'n', f: "SUM(B2:B3)", z: "0.00"}
     /* sheet['B4'].l= {
      Target: "http://www.163.com",
      Tooltip: "网易"
     } */
     sheet['B4'].c = [
      {a: 'zjxszl', t: '这是我写的注释'}
     ]
     sheet['B4'].c.hidden = true
     sheet['!cols'] = [
      {
       wpx: 100
      },
      {
        wpx: 120
      },
      {
       wpx: 160
      }
    ]
    sheet['!rows'] = [
      {
       hpx: 40
      },
      {
        hpx: 50
      },
      {
        hpx: 60
      }
    ]
    utils.book_append_sheet(workbook, sheet, "home") // 把工资表插入工作薄
    let sheet2 = utils.table_to_sheet(document.getElementById('tb2'))
    utils.book_append_sheet(workbook, sheet2, "meiya")
    let first_sheet_name = workbook.SheetNames[0] // 获取工作薄 第一张工作表的名称
    let firts_sheet_body = workbook.Sheets[first_sheet_name] // 获取工作表的内容
    const sheetData = [
      ['A', 'B', 'C', 'D'],
      [1, 2, 3]
    ]
    const ws = utils.aoa_to_sheet(sheetData) // 数据生成工作表
    utils.book_append_sheet(workbook, ws, '数据生成的工作表')
    let contenter = document.getElementById("containner")
    //contenter.innerHTML = JSON.stringify(utils.sheet_to_formulae(sheet2), null, 2)
    let cell = {c: 1, r:1}
   
    firts_sheet_body["!margins"]={left:2.7, right:0.7, top:0.75,bottom:0.75,header:0.3,footer:0.3}
   
    contenter.innerHTML = JSON.stringify(firts_sheet_body['!margins'], null, 2)
     if (!workbook.Props) workbook.Props = {}
     workbook.Props.Title = "家庭成长计划"
     workbook.Workbook = {}
     workbook.Workbook.Names = [
      {Sheet: 0, Name: 'zl'},
      {Sheet: 1, Name: 'zhu'}
     ]
     workbook.Workbook.Views = [{
      RTL: false
     }]
     console.dir(workbook)
     writeFile(workbook, 'dd.csv', {bookType: 'csv'})
  }
  let br = new Date()
  return (
    <div>
      <Button onClick={() => download()}>download</Button>
    
      <table id="tb">
        <thead>
         <tr>
           <th>姓名</th>
           <th><b>年龄</b></th>
           <th><span style={{color: "#ff7313"}}>出生年月日（生日）</span></th>
         </tr>
         </thead>
         <tbody>
          <tr>
            <td>斯文</td>
            <td>7</td>
            <td>2020-09-09</td>
          </tr>
          <tr>
            <td>爱丽</td>
            <td >3</td>
            <td>2009-09-09</td>
          </tr>
          <tr>
            <td>未知</td>
            <td ></td>
            <td>2012-09-09</td>
          </tr>
         </tbody>
      </table>
      <table id="tb2">
        <thead>
         <tr>
           <th>姓名</th>
           <th>年龄</th>

         </tr>
         </thead>
         <tbody>
          <tr>
            <td>美雅</td>
            <td>33</td>
          </tr>
         </tbody>
      </table>
      <div id="containner"></div>
    </div>
  )
}
