import React from 'react'
import styled from 'styled-components'
import {Link} from "react-router-dom"




const Notfound = () => {
  return (
    <>
    <Container>
    <Box>
    <h1>404</h1>
    <h2>OOPS! PAGE NOT FOUND</h2>
    <p>Sorry, but the page you are looking for does not exist, have been removed, name changed or is temporarily unavailable.</p>

    <button>
    <Link to="/">Go to Home</Link>
    </button>
    </Box>
    </Container>
      
    </>
  )
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
width: 100%;
background: linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4);
`
const Box = styled.div`
padding: 20px;
background-color: #fff;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0,0,0,0.15);
width: 100%;
max-width: 500px;
text-align: center;
/* font-weight: bold; */
h1 {
    /* line-height: 2; */
    text-align: center;
    font-size: 150px;
    background: linear-gradient(to right, #4e54c8, #8f94fb);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
     background-clip: text;
}
h2 {
    font-size: 30px;
    font-weight: 900;
    line-height: 1.3;
}
button {
    background: linear-gradient(to right, #4e54c8, #8f94fb);
    color: #fff;
    border: none;
    outline: none;
    padding: 10px 20px;
    border-radius: 5px;
    margin-top: 20px;
    cursor: pointer;
    transition: all 0.5s ease;
    a {
        color: #fff;
        text-decoration: none;
    }
}
`

export default Notfound