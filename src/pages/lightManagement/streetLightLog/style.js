import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: flex;
   flex-direction: column;
   row-gap: 16px;
   .up {
     height: 56px;
     padding: 0 16px;
     display: flex;
     align-items: center;
     background-color: #fff;
     .ant-form-inline .ant-form-item-with-help {
       margin-bottom: 0px;

     }
   }
   .down {
    flex:1;
    display: flex;
    .outTbwrap {
      position: relative;
      flex:1;
      .intbwrap {
      position: absolute;
      width: 100%;
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
export const Detail = styled.div`
&& {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  .contrl {
    display: flex;
    justify-content: flex-end;
  }
}
`