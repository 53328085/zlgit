import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 288px minmax(1382px, 1fr);
   grid-template-rows: minmax(817px, 1fr);
   column-gap: 16px;
   .listItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex:1;
   }
   .left {
     background-color: #fff;
     height: 817px;
     padding: 6px 4px;
     display: flex;
     flex-direction: column;
     row-gap: 8px;
     .title{
        color: #515151;
        font-weight: bold;
     }
     overflow: auto;
   }
   .right {
     display: grid; 
     grid-template-rows: 286px 1fr 38px;
     flex:1;
     row-gap: 16px;
     .ant-form-item {
       margin-bottom: 16px;
     }
     .formbox {
      background-color: #fff;
      padding: 16px;
      .innerwrap {
        padding: 16px;
        
        background: rgba(229,236,245,0.5);
        .list {
          padding:  14px;
          height: 82px;
          overflow: auto;
          border: 1px solid #DCDFE6;
        }
      }
     }
     .outtbwrap{
       flex:1;
       position: relative;
       .inerwrap{
        position: absolute;
        width: 100%;
       }

     }
    .bottom {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
   }
}
`
 
export const Groupwrap = styled.div`
   && {
    width: 278px;
    height: 312px;
    overflow: auto;
     .ant-checkbox-group {
      display: flex;
      flex-direction: column;
      row-gap: 16px;
    }
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
 .inwrap {
   display: grid;
   grid-template-columns:   1fr 90px 1fr ;
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