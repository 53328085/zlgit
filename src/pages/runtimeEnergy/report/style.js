import styled from 'styled-components'
export const Contentbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1fr;
  column-gap: 16px;
  flex: 1;
  .opt {
    display: flex;
    justify-content: flex-end;
    column-gap: 16px;
    padding-bottom: 16px;
  }
  .search {
   display: flex;
   justify-content: flex-end;
   padding-bottom: 8px;
  }
`
export const Chartwrap = styled.div`
  .chart {
    height: 430px;
    display: flex;
  }
  .foot{
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 8px;
  }

`