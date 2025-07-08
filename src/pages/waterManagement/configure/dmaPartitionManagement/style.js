import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 210px minmax(1462px, 1fr);
   grid-template-rows: 1fr;
   column-gap: 16px;
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
     grid-template-rows: 48px 1fr;
     grid-template-columns: 1fr;
     row-gap: 16px;
     .search {
       background-color: #fff;
       display: flex;
       align-items: center;
       padding: 0 16px;
     }
   }
}
`
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Newcontent = styled.div`
  flex:1;
  display: grid;
  grid-template-rows: 48px minmax(800px, 1fr);
  row-gap: 16px;
  color:#515151;

  .title {
      padding-left: 16px;
      border-left: 4px solid ${props => props.theme.primaryColor};
      flex:1
    }
   .head {
     padding-bottom: 8px;
     border-bottom: 1px dotted #d7d7d7;
     margin-bottom: 16px;
  }
  .up {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: #fff;
    
  }
  .content {
    flex:1;
    display: flex;
    .record {
      display: flex;
      flex-direction: column;
      flex: 1;
      .opt {
        display: flex;
        justify-content: flex-end;
        column-gap: 16px;
      }
    }
  }
`
 
