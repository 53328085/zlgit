import styled, { css } from "styled-components"
import { ProTable  } from '@ant-design/pro-components';
const sty = css`
.ant-empty-normal .ant-empty-image {
  display: none;
}

`
 export default  styled(ProTable)`
&& {
display: flex;
flex: 1;
flex-direction: column;
.ant-pro-card .ant-pro-card-body {
  padding-inline: 0;

}
.ant-pro-table-list-toolbar-container {
  padding-block: 0px 16px;
  .ant-pro-table-list-toolbar-left{
    padding-inline: 3px 0px;
    border-left: 3px solid ${props => props.theme.primaryColor}
  }
}
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
        background-color: ${props => props.theme.isdark ? 'dark' : "#ecf5ff"};//${props => props.istheme ? props.theme.primaryColor : props.hbg};
        color: ${props => props.theme.isdark ? "dark" : "#515151"} ; //${props => props.hbc || ((props.istheme || props.hbg) ? '#fff' : '#515151')};
      }
    }
    .ant-table-tbody {
     tr:nth-child(odd) {
       background-color: ${props => props.theme.isdark ? 'dark' : (props.oddbg || "#fff")} 
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
 export const TableContainer =styled.div` 
 &&{
    display: flex;
    flex: ${props => props.flex || 1};
    flex-direction: column;
    justify-content: space-between;
    .outwrap {
      position: relative;
      flex:1;
      .inwarp{
        position: absolute;
        width: 100%;
      }
    }

 }

`
export const Settingicon = styled.div` 
&&{
   width: 18px;
   display: flex;
   align-items: center;
   .img {
     max-width: 100%;
   }
}
`