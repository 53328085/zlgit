import { Table, Transfer } from 'antd'
import difference from 'lodash/difference'

export default function TableTransfer ({ leftColumns, rightColumns, ...restProps }) {
  return <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns
      const rowSelection = {
        getCheckboxProps: (item) => ({
          disabled: listDisabled || item.disabled,
        }),
        onSelectAll (selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .map(({ key }) => key)  // 移除对禁用项的过滤
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys)
          onItemSelectAll(diffKeys, selected)
        },
        onSelect ({ key }, selected) {
          onItemSelect(key, selected)
        },
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
