import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 210px 1fr;
   grid-template-rows: 1fr;
   column-gap: 16px;
   .left {
     background-color: #fff;
     height: 817px;
     .title{
        color: #515151;
        font-weight: bold;
     }
     overflow: auto;
   }
   .right {
     display: grid;
     grid-template-rows: 65px 1fr;
     row-gap: 16px;
     .up {
        height: 65px;
        padding: 16px;
        background-color: #fff;
     } 
   }
}
`
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;