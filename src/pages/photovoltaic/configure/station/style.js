import styled, { css } from "styled-components";
import { Drawer, Input } from 'antd'

export const Mainbox = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 48px 1fr;
  row-gap: 16px;
  flex: 1;
`;

const sty = css` 
      grid-template-columns: 1fr auto 1fr;
        column-gap: 16px;
        grid-template-rows:  1fr; 
        .selected{
          row-gap:16px;
        }
`


export const Bindwrap = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  .switch {
    height: 58px;
    border: 1px solid #dedede;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    .switchform {
      flex:1;
      display: flex;
      .layout {
        flex:1;
        display:grid;
        grid-template-columns: auto repeat(3, 1fr);
        column-gap: 16px;
        .val {
          color:#868686
        }
      }
    }
  }
    .top{
     .ant-form-inline {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    }
    }
    .center{
    .ant-form-item-control-input-content{
      color: #868686;
    }
    .ant-form-inline {
      background-color: rgba(246, 246, 246, 0.557);    
      border: 1px solid #d7d7d7;
      border-radius: 5px;
      padding:12px 16px;
    }
      .ant-form-item{
      margin-right:55px;
      }
    }
      .inverter_title{
      color:${props => props.theme.primaryColor};
      font-size: 16px;
      }
 .inwrap {
   display: grid;
   grid-template-columns: 200px 1fr 90px 1fr ;
   column-gap: 16px;
   grid-template-rows: 520px;
   .tbwrap {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    border: 1px solid #dedede;
    padding: 8px;
   }
   .handler {
     display: flex;
     flex-direction: column;
     justify-content: center;
     row-gap: 32px;
    
   }
  }

`