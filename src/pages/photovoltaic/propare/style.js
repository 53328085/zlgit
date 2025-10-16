import styled, { css } from 'styled-components';
const sty = css`
    grid-template-columns: 265px 1fr;
`
export const Ctitle = styled.div`
     display: flex;
     justify-content: space-between;
     height: 40px;
     align-items: center;
 
`
export const Mainbox = styled.div`
flex: 1;
display: grid;
grid-template-columns: 265px minmax(1397px,1fr);
column-gap: 16px;
 align-items: stretch;
.outwrap {
     flex:1;
     position: relative;
 .inwrap{
    width: 100%;
    position: absolute;
 }
   
}
${props => props.laptop ? sty : null}
`