import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 288px minmax(1382px, 1fr);
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
     flex-direction: column;
     flex:1;
     row-gap: 16px;
     .outtbwrap{
       flex:1;
       position: relative;
       .inerwrap{
        position: absolute;
        width: 100%;
       }

     }
     
   }
}
`
