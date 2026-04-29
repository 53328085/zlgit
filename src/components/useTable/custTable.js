import styled, { css } from "styled-components"
import { Table } from 'antd'
const sty = css`
.ant-empty-normal .ant-empty-image {
  display: none;
}

`
const Tablecom = styled(Table)`
&& {
display: flex;
flex: 1;
flex-direction: column;
.ant-table-title {
  border: none;
  font-size: ${props => props.tfs || '16px'};
  color:${props => props.theme.isdark ? 'dark' : "#515151"} ;
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
        padding: ${props => props.pd || '4px 4px'} ;
        background-color: ${props => props.theme.isdark ? 'dark' : "#E6ECF5"};//${props => props.istheme ? props.theme.primaryColor : props.hbg};
        color: ${props => props.theme.isdark ? "dark" : "#303133"} ; //${props => props.hbc || ((props.istheme || props.hbg) ? '#fff' : '#515151')};
        font-weight: 600;
        text-align: center;
      }
    }
    .ant-table-tbody {
     tr:nth-child(odd) {
       background-color: ${props => props.theme.isdark ? 'dark' : (props.oddbg || "#F2F7FF")} 
     }
      .ant-table-row{
        .ant-table-cell {
          padding: ${props => props.pd || '4px 4px'} ;
        }
      }
      .ant-table-placeholder{
        .ant-table-cell{
          padding: 0px;
          .ant-empty.ant-empty-normal{
            margin: 0;
          }
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

${props => props.laptop ? sty : null}
}
`
export default Tablecom