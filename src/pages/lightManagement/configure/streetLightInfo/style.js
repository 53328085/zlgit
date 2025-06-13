import styled from "styled-components";
export const Mainbox = styled.div`
display: flex;
flex:1;
flex-direction: column;
row-gap: 16px;
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
`
export const Frombox = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
column-gap: 128px;

`