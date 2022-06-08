
 import styled from 'styled-components';

 export const Tombola = styled.section`
 background: #fecc52;
 display:flex;
 flex-direction:column;
 padding: 40px;
 justify-content:center;
 align-items:center;

 @keyframes play {
    from { transform: none; }
    50% { transform: scale(1.2); }
    to { transform: none; }
}

 img {
     height:180px;
     width:180px;
     animation: play .5s infinite;
 }
@media only screen and (min-width: 992px) {
    img {
     height:230px;
     width:230px;
 }
}

button {
    margin: 20px;
    background: #cc0100;
}
 `
 ;