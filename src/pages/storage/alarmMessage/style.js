import styled from "styled-components";
export const  Mainbox = styled.div`
    && {
      display: grid;
      grid-template-rows: 64px 1fr;
      row-gap: 16px;
      flex: 1;
      .items {
         display: grid;
         grid-template-columns: repeat(4, 320px);
         grid-template-rows: 64px;
         column-gap: 16px;
        .item {
          width: 320px;
          height: 64px;
          background-color: rgba(255, 255, 255, 1); 
          border: 1px solid rgba(215, 215, 215, 1); 
          border-radius: 4px; 
          box-shadow: none;
          padding:  8px 12px;
          display: grid;
          grid-template-columns: 48px 1fr;
          align-items: center;
          justify-items: center;
          column-gap: 22px;
          .info { 
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;;
          } 
        }
        
      }
      .content {
        display: grid;
        grid-template-rows: 32px  1fr;
        row-gap: 16px; 
        flex: 1;
        color:#515151;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

        }
      }
       
       }

`