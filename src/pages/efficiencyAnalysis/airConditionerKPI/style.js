import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: flex;
  flex-direction: column;
   row-gap: 16px;
   color: #303133;
  .contentwrap {
      flex:1;
    .innerlayout{
       flex:1;
       display: grid;
       grid-template-rows: repeat(2,200px 34px) ;
        gap: 8px;
       .sublayout {
         grid-template-columns: repeat(4, minmax(406px, 1fr));
         grid-template-rows: 1fr;
         display: grid;
         gap:8px;
         .sub{
          background-color: #E5ECF5;
          padding: 14px;
          overflow: hidden;
         }
        .sub.list{
          padding: 10px 0px;
          .ant-list-item-no-flex{
            display: flex;
            font-size: 13px;
            padding: 10px 14px;
            &:nth-of-type(2n) {
              background: rgba(80,200,255,0.08);
            }
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