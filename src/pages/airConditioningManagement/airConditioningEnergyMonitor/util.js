import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const ExportData = async (tableData, columns, chartInstances) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // 1. 添加表头
  const headerRow = worksheet.addRow(columns.map((col) => col.title));
  headerRow.font = { bold: true };

  // 2. 添加表格数据行并插入图表
  tableData.forEach((dataItem, rowIndex) => {
    const rowData = columns.map((col) => {
      // 如果是图表列，先留空，后面插入图片
      if (col.timecol) return "";
      return dataItem[col.dataIndex];
    });
    const row = worksheet.addRow(rowData);

    // 3. 找到图表列的位置
    const chartColumnIndex = columns.findIndex(
      (col) => col.dataIndex == "timecol"
    );

    if (chartColumnIndex !== -1 && chartInstances[rowIndex]) {
      const chart = chartInstances[rowIndex];

      // 获取图表为base64图像
      try {
        const chartDataURL = chart.getDataURL({
          type: "png",
          pixelRatio: 2,
          backgroundColor: "#fff",
        });
        const base64Data = chartDataURL.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const imageId = workbook.addImage({
          buffer: buffer,
          extension: "png",
        });
        console.log(chartColumnIndex, rowIndex + 1);
        // 计算图像插入位置（在当前行的图表列）
        worksheet.addImage(imageId, {
          tl: {
            col: chartColumnIndex, // 使用找到的图表列索引
            row: rowIndex + 1, // +1因为表头占一行
          },
          ext: {
            width: 600, // 调整为适合单元格的宽度
            height: 60, // 调整为适合单元格的高度
          },
          editAs: "oneCell", // 图片固定在一个单元格内
        });

        //调整行高以容纳图片;
        worksheet.getRow(rowIndex + 2).height = 60;

        // 调整列宽以容纳图片
        worksheet.getColumn(chartColumnIndex + 1).width = 83;
      } catch (error) {
        console.error(`导出第${rowIndex + 1}行图表失败:`, error);
      }
    }
  });

  // 4. 导出Excel文件
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "TableWithCharts.xlsx");
};
