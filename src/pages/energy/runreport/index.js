import React, { useState, useEffect } from "react";
import style from "./style.module.less";
import Runreportleft from "./runreportLeft";
import Runreportright from "./runreportRight";
import { energyDesigner, QueryRunReport } from "@api/api.js";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
import { useRequest } from "ahooks";
import { message } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import printJS from 'print-js'
export default function Index() {
  const { RunReport } = QueryRunReport;
  const [messageApi] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };
  const [reportInfo, setReportInfo] = useState(false);
  const [electricityDate, setElectricityDate] = useState(true);
  const projectId = useSelector(selectProjectId);
  const [dataInfo, setDataInfo] = useState({});
  // Child2中的组件事件的回调更改Child1中的数据
  const getReport = (data) => {
    let {type, areaId, date} = data
    setReportInfo(data.rightInfo);
    return RunReport({projectId, type, areaId, date}).then(
      (res) => {
        let { success, data } = res;
        if (success && data) {
          console.log(data);
          setDataInfo(data);
        } else {
          messageContent("error", res.errMsg);
          setReportInfo(false);
        }
      }
    );
  };
  const useElectricityDate = (val) => {
    setElectricityDate(val);
  };
  //导出报告
  const reportExport = () => {
    console.log("点击完了");
    //先生成图片再导出
    html2canvas(document.getElementById("rightInfo"), {
      // 导出pdf清晰度
      allowTaint: true,
      taintTest: false,
      scale: "2", //设置放大倍数
      height: document.getElementById("rightInfo").scrollHeight,
      windowHeight: document.getElementById("rightInfo").scrollHeight,
      // dpi: '192',
      background: "#fff",
      // 开启跨域配置
      useCORS: true, //支持图片跨域
    }).then((canvas) => {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;
      // 一页pdf显示html页面生成的canvas高度;
      let pageHeight = (contentWidth / 592.28) * 841.89;
      // 未生成pdf的html页面高度
      let leftHeight = contentHeight;
      // pdf页面偏移
      let position = 0;
      // html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
      let imgWidth = 595.28;
      let imgHeight = (592.28 / contentWidth) * contentHeight;

      let pageData = canvas.toDataURL("image/jpeg", 1);
      let pdf = new jsPDF("", "pt", "a4");

      // 有两个高度需要区分，一个是html页面的实际高度leftHeight，和生成pdf的页面高度(841.89)pageHeight
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          //原来高度是841.89，因为页面之间有20的padding,还有多余的7是因为页面比A4的高多了一点
          position -= 841.89;
          // 避免添加空白页
          if (leftHeight > 841.89) {
            pdf.addPage();
          }
        }
      }
      pdf.save("能源管理分析报告.pdf");
    });
  };
  //打印报告
  const reportPrint = () => {
    let printDom = document.getElementById("rightInfo");
    html2canvas(printDom, {
      height: printDom.scrollHeight,
      windowHeight: printDom.scrollHeight,
      allowTaint: true,
      scale: "3", //设置放大倍数
      // dpi: "192",
      background: "#fff",
      // 开启跨域配置
      useCORS: true, //支持图片跨域
    }).then((canvas) => {
      let pageData = canvas.toDataURL("image/jpeg", 1.0);
      printJS({
        printable: pageData,
        type: "image",
        style: `@media print { @page {size: auto; margin: 0; } body{margin:0 5px}}`// 去除页眉页脚
      });
    });
  };
  return (
    <div className={style.box}>
      <div className={style.boxLeft}>
        <Runreportleft
          reportInfoGive={getReport}
          electricityDateGive={useElectricityDate}
          reportExportGive={reportExport}
          reportPrintGive={reportPrint}
        ></Runreportleft>
      </div>
      <div className={style.boxRight}>
        <Runreportright
          getReportInfo={reportInfo}
          getElectricityDate={electricityDate}
          dataInfoAll={dataInfo}
        ></Runreportright>
      </div>
    </div>
  );
}
