import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const ExportData = async ({ tableData, columns, chartInstances, tableRef }) => {
    // 1. 创建工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    // 2. 添加表格数据
    const antTableData = tableRef.current?.props?.dataSource || [];
    const antTableColumns = tableRef.current?.props?.columns || [];
    // 添加表头
    const headerRow = worksheet.addRow(antTableColumns.map(col => col.title));
    headerRow.font = { bold: true };
    // 添加表格数据行
    antTableData.forEach(dataItem => {
        const rowData = antTableColumns.map(col => dataItem[col.dataIndex]);
        worksheet.addRow(rowData);
    });

    // 3. 添加图表图像
    for (let i = 0; i < chartInstances.length; i++) {
        const chart = chartInstances[i];
        // 获取图表为 base64 图像
        const chartDataURL = chart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });

        // 将 base64 转换为 buffer
        const base64Data = chartDataURL.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // 在工作表中添加图像
        const imageId = workbook.addImage({
            buffer: buffer,
            extension: 'png',
        });

        // 计算图像插入位置（在表格下方）
        const imageRow = antTableData.length + 3 + (i * 15);
        worksheet.addImage(imageId, {
            tl: { col: 1, row: imageRow },
            ext: { width: 500, height: 300 }
        });
    }
    // 4. 导出 Excel 文件
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'TableWithCharts.xlsx');
}