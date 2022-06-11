import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  background: #cc0100;
  padding: 3px;
  height: 80px;
  padding: 25px 40px;
  color: white;
  font-family: Roboto;
  @media only screen and (min-width: 992px) {
    padding: 60px;
}

  button {
    background: #cc0100;
    border: 1px solid white;
    max-width: 150px;
    @media only screen and (min-width: 992px) {
      max-width: 300px;
    }
    :hover {
      background:#cc0100;
      border: 1px solid white;
    }
  }
`;