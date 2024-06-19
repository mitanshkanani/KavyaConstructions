import React from 'react'
import styled from 'styled-components'



const Box = ({title, lgth, icon}) => {
  return (
    <>
        <Container>
        <BgImg>
        <img src={icon} alt="icon" />
        </BgImg>
        <div>
          <p>{title}</p>
          <h4>{lgth?.length}</h4>
        </div>
        </Container>
    </>
  )
}

const Container = styled.div`
position: relative;
background-color: #fff;
border-radius: 5px;
padding: 15px;
overflow: hidden;
display: flex;
/* align-items: center; */
box-shadow: 8px 8px 20px rgba(163, 163, 163, 0.25);

> div {
  p {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
    font-size: 16px;
  }
  h4 {
    color: rgba(0, 0, 0, 0.87);
    font-weight: 600;
    font-size: 30px;
  }
}
`;



const BgImg = styled.div`
width: 60px;
height: 60px;
margin-right: 20px;
/* border-radius: 50%; */

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
`;

export default Box