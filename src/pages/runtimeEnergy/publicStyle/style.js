import styled from 'styled-components'
import {Transfer} from 'antd'
export const Contentbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1fr;
  column-gap: 16px;
  flex: 1;
  background: transparent;
  .opt {
    display: flex;
    justify-content: flex-end;
    column-gap: 16px;
    padding-bottom: 16px;
  }
  .search {
   display: flex;
   justify-content: flex-end;
   padding-bottom: 8px;
  }
  .rightwrap {
    display: flex;
    flex-direction: column;
  }
  .tbwrap {
      flex: 1; 
      display: flex;
       padding: 20px;
       background: #fff;
    }
`
export const Chartwrap = styled.div`
  .chart {
    height: 430px;
    display: flex;
  }
  .foot{
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 8px;
  }

`
export const Checkboxwrap=styled.div`
&&{
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  .options {
    .ant-checkbox-group {
   display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    row-gap: 32px;
    .ant-checkbox-wrapper {
      display: flex;
      align-items: center;
    }
    }
 
  }
  .btn {
     display: flex;
     justify-content: flex-end;
     align-items: center;
     column-gap: 16px;
  }
}
`
export const CTransfer=styled(Transfer)` 
 &&{
     .ant-transfer-operation {
        align-items: center;
        gap:14px;
        .ant-btn-icon-only.ant-btn-sm{
            width: 42px;
            height:36px;
        }
     }
     .ant-transfer-list{
        width:232px;
        height: 302px;
     }
 }
`