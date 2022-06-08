import styled from 'styled-components';

export const Section = styled.section`
background: #f6f6f6a3;
font-family: Roboto;
padding: 25px 40px;
@media only screen and (min-width: 992px) {
    padding: 60px 35px;

    div {
        display:flex;
        flex-direction: row;
        align-items:center;
    }
    }
`;
export const Title = styled.h3`
  color: #063f5e;
`;
export const SubTitle = styled.p`
  color: gray;
`;