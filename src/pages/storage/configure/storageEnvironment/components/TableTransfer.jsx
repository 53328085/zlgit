/**
 * TableTransfer 组件用于创建一个带有表格样式的穿梭框
 * 该组件基于 Ant Design 的 Transfer 组件进行封装，使用表格显示数据
 * 
 * @param {Array} leftColumns - 左侧表格的列配置
 * @param {Array} rightColumns - 右侧表格的列配置
 * @param {Object} restProps - 传递给 Transfer 组件的其他属性
 * @returns {JSX.Element} TableTransfer 组件
 */
import { Table, Transfer } from 'antd'
import difference from 'lodash/difference'

export default function TableTransfer ({ leftColumns, rightColumns, ...restProps }) {
  return <Transfer {...restProps}>
    {({
      // 穿梭框方向，'left' 或 'right'
      direction,
      // 过滤后的项列表
      filteredItems,
      // 选择所有项的回调函数
      onItemSelectAll,
      // 选择单项的回调函数
      onItemSelect,
      // 当前选中的项的键值列表
      selectedKeys: listSelectedKeys,
      // 当前列表是否被禁用
      disabled: listDisabled,
    }) => {
      // 根据方向选择对应的列配置
      const columns = direction === 'left' ? leftColumns : rightColumns
      // 表格行选择配置
      const rowSelection = {
        // 获取复选框属性
        getCheckboxProps: (item) => ({
          // 如果列表被禁用或该项被禁用，则复选框被禁用
          disabled: listDisabled || item.disabled,
        }),
        // 全选/取消全选处理
        onSelectAll (selected, selectedRows) {
          // 获取所有选中行的键值
          const treeSelectedKeys = selectedRows
            .map(({ key }) => key)  // 移除对禁用项的过滤
          // 计算差异键值
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys)
          // 调用父组件的全选回调
          onItemSelectAll(diffKeys, selected)
        },
        // 单项选择处理
        onSelect ({ key }, selected) {
          // 调用父组件的单项选择回调
          onItemSelect(key, selected)
        },
        // 当前选中的行键值列表
        selectedRowKeys: listSelectedKeys,
      }
      return (
        <Table
          // 行选择配置
          rowSelection={rowSelection}
          // 列配置
          columns={columns}
          // 数据源
          dataSource={filteredItems}
          // 表格大小
          size="small"
          // 样式配置
          style={{
            // 如果列表被禁用，则禁用鼠标事件
            pointerEvents: listDisabled ? 'none' : undefined,
          }}
          // 行点击事件处理
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              // 如果该项或列表被禁用，则返回
              if (itemDisabled || listDisabled) return
              // 调用父组件的选择回调
              onItemSelect(key, !listSelectedKeys.includes(key))
            },
          })}
        />
      )
    }}
  </Transfer>
}