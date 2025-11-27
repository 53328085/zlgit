import {TreeSelect, Select} from 'antd'
import styled from 'styled-components'

export const CtreeSelect =styled(TreeSelect)`
  && {
    .ant-select-selection-overflow {
        height: 28px;
        overflow: auto;
    }
  }
  
`
export const CSelect =styled(Select)`
  && {
    .ant-select-selection-overflow {
        height: 28px;
        overflow: auto;
        max-width: 400px;
    }
  }
  
`