import styled from "styled-components";
export const Contentbox = styled.div`
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
`