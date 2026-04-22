import styled from 'styled-components'
 

export const Treebox = styled.div`
       display: grid;
       grid-template-rows: ${(props) => props.showline == "false" ? '32px 32px 1fr' : '32px 32px 32px 556px'};
       row-gap: 16px;
       flex: 1;
       height: 100%;
       .ant-tree{
       //  overflow-y: auto; 
       }
`