/**
 * 格式化数字类型的数据
 * @param {number} data - 需要格式化的数据
 * @param {boolean} useThousandsSeparator - 是否格式化千分位
 * @param {number} precision - 数据精度（小数位数）
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(data, useThousandsSeparator, precision) {
    // 检查数据是否为有效数字
    if (typeof data !== 'number' || isNaN(data)) {
        return '';
    }
    // 处理精度
    let formattedNumber = data.toFixed(precision);
    // 处理千分位
    if (useThousandsSeparator) {
        const parts = formattedNumber.split('.');
        // 整数部分添加千分位
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formattedNumber = parts.join('.');
    }
    return formattedNumber;
}

/**
 * 格式化增长降低数据
 * @param {number} data - 需要格式化的数据
 * @returns {string} 格式化后的HTML字符串
 */
export function formatGrowth(data) {
    // 将数据转换为数字
    const numData = typeof data === 'string' ? parseFloat(data) : data;
    // 检查数据是否为有效数字
    if (typeof numData !== 'number' || isNaN(numData)) {
        return '';
    }

    const formattedValue = formatNumber(Math.abs(numData), false, 2);

    if (numData >= 0) {
        // 增长，显示红色，格式化成 +value%
        return `<span style="color: red;">+${formattedValue}%</span>`;
    } else {
        // 降低，显示绿色，格式化成 value%
        return `<span style="color: green;">-${formattedValue}%</span>`;
    }
}


export function getTableColumns() {
    return [
        {
            title: '用能单元',
            dataIndex: 'areaName',
            key: 'areaName',
        },
        {
            title: '能耗(tce)',
            dataIndex: 'a',
            key: 'a',
        },
        {
            title: '产量(吨)',
            dataIndex: 'b',
            key: 'b',
        },
        {
            title: '单位产品能耗(tce/吨)',
            dataIndex: 'c',
            key: 'c',
        },
        {
            title: '环比变化',
            dataIndex: 'd',
            key: 'd',
            render: (text, record) => <div dangerouslySetInnerHTML={{ __html: formatGrowth(formatNumber(text, false, 2)) }}></div>,
        },
    ]
}