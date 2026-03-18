/**
 * 表格穿梭框组件
 * 用于在两个表格之间进行数据传输的组件
 * @param {Array} leftColumns - 左侧表格列配置
 * @param {Array} rightColumns - 右侧表格列配置
 * @param {Object} restProps - 其他传递给Transfer组件的属性
 */
import { Table, Transfer } from 'antd'
import difference from 'lodash/difference'

export default function TableTransfer ({ leftColumns, rightColumns, ...restProps }) {
  return <Transfer {...restProps}>
    {/**
     * Transfer组件的渲染函数
     * @param {Object} props - Transfer组件传入的属性
     * @param {string} props.direction - 当前方向 ('left' 或 'right')
     * @param {Array} props.filteredItems - 过滤后的数据项
     * @param {Function} props.onItemSelectAll - 全选/取消全选回调函数
     * @param {Function} props.onItemSelect - 单个项选择回调函数
     * @param {Array} props.selectedKeys - 当前选中的项的键值数组
     * @param {boolean} props.disabled - 是否禁用
     */}
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      // 根据方向选择对应的列配置
      const columns = direction === 'left' ? leftColumns : rightColumns
      // 表格行选择配置
      const rowSelection = {
        // 获取复选框属性
        getCheckboxProps: (item) => ({
          disabled: listDisabled || item.disabled,
        }),
        // 全选/取消全选处理函数
        onSelectAll (selected, selectedRows) {
          // 获取所有选中行的键值
          const treeSelectedKeys = selectedRows
            .map(({ key }) => key)  // 移除对禁用项的过滤
          // 计算差异键值
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys)
          // 调用全选回调函数
          onItemSelectAll(diffKeys, selected)
        },
        // 单个项选择处理函数
        onSelect ({ key }, selected) {
          // 调用单个项选择回调函数
          onItemSelect(key, selected)
        },
        // 当前选中的行键值
        selectedRowKeys: listSelectedKeys,
      }
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          scroll={{
            x:'max-content',
          }}
          style={{
            pointerEvents: listDisabled ? 'none' : undefined,
          }}
          // 行点击事件处理
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return
              onItemSelect(key, !listSelectedKeys.includes(key))
            },
          })}
        />
      )
    }}
  </Transfer>
}