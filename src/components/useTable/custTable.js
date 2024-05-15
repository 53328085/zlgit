import styled from "styled-components"
import {Table} from 'antd'
const Tablecom = styled(Table)`
&& {
display: flex;
flex: 1;
flex-direction: column;
.ant-table-title {
  border: none;
  font-size: ${props => props.tfs || '16px'};
  color: #515151;
  padding-bottom: 16px;
}
.ant-table-tbody {
  .ant-table-row {
    .ant-table-cell {
      text-align: center;
    }
  }

}
.ant-table.ant-table-small {
  .ant-table-container{
    .ant-table-thead{
      .ant-table-cell {
        padding: 4px 4px;
        background-color: ${props => props.istheme ? props.theme.primaryColor : props.hbg};
        color: ${props => props.hbc || ((props.istheme || props.hbg) ? '#fff' : '#515151')};
      }
    }
    .ant-table-tbody {
      .ant-table-row{
        .ant-table-cell {
          padding: 4px 4px;
        }
      }
    }
  }
}
.ant-spin-nested-loading, .ant-spin-container {
  display: flex;
  flex:1;
  flex-direction: column;
  justify-content: space-between;
}
 
}
`
export default Tablecom