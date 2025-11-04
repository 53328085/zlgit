import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 1fr;
   grid-template-rows: 48px minmax(817px, auto);
   row-gap: 16px;
   color: #303133;
  .contentwrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, 377px);
    gap:16px;
    .innerlayout{
       flex:1;
       display: grid;
       grid-template-rows: 1fr 34px;
        gap: 8px;
       .sublayout {
         grid-template-columns: repeat(2, 1fr);
         grid-template-rows: repeat(2, 122px);
         display: grid;
         gap:8px;
         .sub{
          background-color: #E5ECF5;
          padding: 14px;
          overflow: hidden;
         }
        .sub.list{
          padding: 10px 14px;
          .ant-list-item-no-flex{
            display: flex;
            font-size: 13px;
            padding: 0;
          }
        }
        .sub.text {
           display: flex;
           flex-direction: column;
           .title{
            display: flex;
            justify-content: space-between;
            height: 20px;
            align-items: center;
           }
           .num{
             font-size: 34px;
             color:#1E50E6;
             display: flex;
             align-items: center;
             justify-content: center;
             flex:1;
           }

        } 
        .sub.chart{
          padding: 0;
        }
       }
       .line{
        background: #E5ECF5;
        display: flex;
        align-items: center;
        padding:  0px 10px;
       }
        
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