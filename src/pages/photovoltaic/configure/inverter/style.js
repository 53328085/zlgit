import styled, { css } from "styled-components";

export const Mainbox = styled.div`
 display: flex;
flex:1;
flex-direction: column;
row-gap: 16px;
      .search {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
`;


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
      .deviceInfo{
        background-color: rgba(246, 246, 246, 0.557);
        border: 1px solid #d7d7d7;
        border-radius: 5px;
        padding: 12px 16px;
        margin-top:16px;
        display: grid;
        grid-template-columns: 430px 1fr;
        justify-content: flex-start;
        align-items: center;
        
      .searchDevice {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .info{
      margin-top:16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      }
      }
    .ant-form-inline {
      padding:12px 16px;
    }
      .ant-form-item{
      margin-right:55px;
      }
    
      .inverter_title{
      color:${props => props.theme.primaryColor};
      font-size: 16px;
      margin-bottom: 16px;
      }
 .inwrap {
   display: grid;
  //  grid-template-columns: 200px 1fr 90px 1fr ;
  grid-template-columns:  1fr 90px 1fr ;
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