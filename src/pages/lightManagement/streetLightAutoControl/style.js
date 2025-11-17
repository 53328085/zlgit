import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 288px 1fr;
   grid-template-rows: minmax(817px, 1fr);
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
     display: flex; 
     .desc {
      border-radius: 5px;
      border-bottom-right-radius: 0px;
       border-bottom-left-radius: 0px;
       border:1px solid rgba(215,215,215,1);
       display: flex;
       flex-direction: column;
       flex:1;
       margin-bottom: 16px;
       .item {
         .title {
           display: flex;
           align-items: center;
           height: 34px;
           background-color: rgba(236, 245, 255, 1);
           color:#515151;
           padding-left: 8px;
         }
         .content {
           color:#333;
           display: flex;
           flex-direction: column;
           padding: 16px;
           ol {
            padding-left: 16px;
            margin-bottom: 0px;
           }
         }
       }
       
     } 
   }
}
`
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;