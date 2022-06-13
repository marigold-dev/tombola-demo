
 import styled from 'styled-components';

 export const Tombola = styled.section`
 background: #fecc52;
 display:flex;
 flex-direction:column;
 padding: 10px;
 justify-content:center;
 align-items:center;

 height: calc(100vh - 136px);

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
 .off {
     animation: none;
     filter: grayscale(100%);
 }
@media only screen and (min-width: 992px) {
    img {
     height:230px;
     width:230px;
 }
}

button{
    margin: 8px;
    background: #cc0100;
}
 `
 ;
 export const TombolaOff = styled(Tombola)`
 background: #cfcfcf;
 `;
 export const Buttons = styled.div`
 display:flex;
 flex-direction:row;
`;