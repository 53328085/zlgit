import styled from "styled-components"
import power from './imgs/power.png'
export const Mainbox =styled.div`
  && {

    flex: 1;
    display:grid;
    grid-template-columns: 287px 1fr;
    grid-template-rows: 1fr;
    gap:16px;
    .treecom {

    }
    .right {
        display: grid;
       grid-template-rows: 232px 1fr;
       gap:16px;
       .top { 
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(229px, 1fr));
        column-gap: 9px;
       }
    }
  }

`
export const Power= styled.div`
&& {
    width: 229px;
    height: 232px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DDDFE6;
    .powerUp {
        display: flex;
        flex-direction: column;
        padding: 8px;
        .title {
            height: 28px;
            background-image: url(${power});
            background-repeat: no-repeat;
            background-position: left;
        }
         
    }
   
}
  
`