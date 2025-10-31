import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 1fr;
   grid-template-rows: 48px minmax(817px, 1fr);
   row-gap: 16px;
  .contentwrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, minmax(377px, 1fr));
    .innerlayout{
       flex:1;
       display: grid;
       grid-template-rows: 1fr 20px;
       .sublayout {
         grid-template-columns: repeat(2, 1fr);
         grid-template-rows: repeat(2, 1fr);
       }
       gap: 16px;
    }
  }
 
}
`
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #303133;
  font-size: 15px;
`;