import styled from "styled-components";

export const Transbox  =styled.div`
  &&{
    flex:1;
    display: grid;
    grid-template-columns: 160px 1fr;
    grid-template-rows: 1fr;
    column-gap: 16px;
    .imgbox {
     overflow: hidden;
     .img {
        max-width: 100%;
     }
    }
    .list{
      font-size: 13px;
      color: rgba(96, 98, 102, 1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item {
        position: relative;
        padding-left: 16px;
        display: flex;
        column-gap: 8px;
        &&::before{
          position: absolute;
          content: " ";
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(30, 80, 230, 1);
          top: 50%;
          transform: scaleY(-3px);
        }
    
      .value{
        color: rgba(48, 49, 51, 1);
        font-weight: bold;
      }
    }
    }
  }


`
export const MainDiv =styled.div`
background-color: #fff;
flex: 1;
padding: 16px;
display: grid;
grid-template-rows: 220px 1fr;
row-gap: 16px;
.trancss{
  display: grid;
  grid-template-columns: 472px 1fr;
  column-gap: 16px;
  .ant-table-thead .ant-table-cell{
    padding: 3px;
  }
  .ant-table-tbody .ant-table-placeholder .ant-table-cell{
    padding: 3px
  }
  .ant-empty-normal{
    margin: 0;
  }
  .ant-empty{
    .ant-empty-image{
      height: 20px;
    }
    .ant-empty-description{
      font-size: 10px;
    }
    
  }
}
.datastyle{
  flex: 1;
  display: flex;
  flex-direction: column;
  .filters{
    display: flex;
    justify-content: space-between;
    background-color: #f9f9f9;
    height: 63px;
    padding:0 12px;
    .title{
      display: flex;
      align-items: center;
    }
  }
  .filterdate{
    display: flex;
    align-items: center;
    width: 650px;
    justify-content: space-between;
  }
}
`
export const Loadwrapper = styled.div`
  flex:1;
  display: grid;
   grid-template-rows:1fr;
   grid-template-columns: 440px 1fr;
   column-gap: 48px;
   .leftwrap {
     display: flex;
     flex-direction: column;
     .chart {
       flex: 1;
       display: flex;
     }
     .bottom {
      height: 98px;
     } 
   }
   .rightwrap{
     display: flex;
     flex-direction: column;
   }
`