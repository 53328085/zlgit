import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   grid-template-columns: 210px 1fr;
   grid-template-rows: 1fr;
   column-gap: 16px;
   .left {

   }
   .right {
     display: grid;
     grid-template-rows: 65px 1fr;
     row-gap: 16px;
     .up {
        height: 65px;
        padding: 16px;
     } 
   }
}
`