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
  height: 48px;
  border: 1px solid rgba(204,204,204,1);
  border-radius: 8px;
  background-color: #fff;
}
`
export const Frombox = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
column-gap: 128px;

`
export const Title= styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`