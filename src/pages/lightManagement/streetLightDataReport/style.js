import styled from "styled-components";
export const Contentbox = styled.div`
display: grid;
flex: 1;
grid-template-rows: 48px 1fr;
grid-template-columns: 1fr;
row-gap: 16px;
.mainwrap {
display: grid;
grid-template-columns: 296px 1fr;
column-gap: 16px;
flex: 1;
 .outwrap {
    flex:1;
    position: relative;
    .inwrap {
        position: absolute;
        width: 100%;
    }
 }
}
`