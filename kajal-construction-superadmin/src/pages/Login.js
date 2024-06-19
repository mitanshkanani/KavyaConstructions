import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from "react-redux"
import {SetLogin} from "../features/userSlice"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

import Button from '@mui/material/Button';


const emailId = "kajalconstruction@gmail.com"
const password = "kajal@123"

const Login = () => {
    const [formData, setForm] = useState({
        email : "",
        password : "",
        check : false
    })
    const [showPassword, setShowPassword] = useState("password")

    const [check, setcheck] = useState(false)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlerForm = (e) => {
        // console.log(e)
        const {name, value} = e.target;
        setForm((prev) => {
            return {
                ...prev,
                [name] : value,
            }
        })
    }


    // useEffect(()=>{
    //     auth.onAuthStateChanged(async (user) =>{
    //         if(user){
    //             setData(user.email)
    //             navigate('/home')
    //         }
    //     })

    // }, [])

    
    const handlerSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        // if(formData.email === emailId && formData.password === password && check === true){
        //     setData(formData.email)
        // }
        // else {
        //     alert("Please enter valid credentials")
        // }

        signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user, 'user')
            localStorage.setItem('user', JSON.stringify(user.email))
            navigate('/')
            // setData(formData.email)
        })
        .catch((error) => {
            alert("Please enter valid credentials")
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
          });

    }

    // const setData = (data) => {
    //     dispatch(SetLogin({
    //         email : data
    //     }))
    //     navigate('/')
    // }
    
    // console.log(formData)

  return (
    <>
    <Container>
    <Left>
    
    <Header>
    <Logo>
    <img src="/assets/logo.png" alt="" />
    </Logo>
    <h1>Let’s build relationships not <br /> just businesses.</h1>
    <p>— Pankaj Thakkar, CEO & Co-Founder Kajal Constructions</p>
    </Header>

    <BgImg>
    <img src="/assets/bg.png" alt="" />
    </BgImg>
    </Left>


    <Right>
    <BgImg2>
    <img src="/assets/bg.png" alt="" />
    </BgImg2>

    <Form>
    <form onSubmit={handlerSubmit}>
    <h4>Admin Login</h4>
    <div>
        <label htmlFor="email">Email address</label>
        <input type="email" name="email" id="email" placeholder='john@gmail.com' value={formData.email} onChange={handlerForm} required />
    </div>

    <div>
        <label htmlFor="password">Password</label>
        <Input>
        <input name='password' id="password" type={showPassword} placeholder="**********" 
            value={formData.password} onChange={handlerForm} required autoComplete="off"
        />
        {
                    showPassword === "password" ? (
                        <VisibilityIcon onClick={() => setShowPassword("text")} />
                    ) :  (
                        <VisibilityOffIcon onClick={() => setShowPassword("password")} />
                    )
                }
        </Input>
      
    </div>
    <Button
    variant="contained"
    type='submit'
    >
    SIGN IN
    </Button>
    {/* <button type='submit' >SIGN IN</button> */}
    </form>


    </Form>


    </Right>
    </Container>
      
    </>
  )
}

const Input = styled.div`
display: flex;
flex-direction: row !important;
border: 1px solid rgba(0,0,0,0.3);
border-radius: 5px;
overflow: hidden;
> input {
    width: 100%;
    border: none;
    padding: 10px;
    outline: none;
    color: rgba(0, 0, 0, 0.6);
    
}
.MuiSvgIcon-root {
    color: #86869B;
    margin-right: 10px;
    cursor: pointer;
    margin-top: 5px;
}
`



const Container = styled.div`
width: 100%;
height: 100vh;
display: flex;
overflow: hidden;
/* align-items: center; */
`;

const Left = styled.div`
position: relative;
width: 50%;
background: #1976D2;
color: #fff;

`;

const Logo = styled.div`
width: 100%;
max-width: 200px;
height: 120px;
margin-bottom: 50px;
img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: inline-block;
}
`;

const Header = styled.div`
/* margin: 0 auto; */
margin-top: 50px;
margin-left: 100px;
width: 100%;
max-width: 420px;
/* background: red; */

h1 {
    color: white;
    font-size: 45px;
    line-height: 1.3;
}
p {
    color: white;
    font-size: 15px;
    line-height: 2.5;
}
`;

const BgImg = styled.div`
width: 100%;
height: 200px;
position: absolute;
bottom: 0;
/* left: 0;
right: 0; */
/* background-color: red; */

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: inline-block;
    /* width: fit-content; */
}
`;


const Right = styled.div`
position: relative;
width: 50%;

`;


const BgImg2 = styled(BgImg)`
transform: rotate(180deg);
top: 0;
bottom: unset;
position: relative;

`;

const Form = styled.div`
margin: 0 auto;
width: 100%;
max-width: 420px;
margin-top: 50px;

form {
    display: flex;
    flex-direction: column;


    h4 {
        color: rgba(0, 0, 0, 0.87);
        font-size: 25px;
        line-height: 1.5;
    }

    button {
    margin-top: 20px;
    padding: 10px;
    border: none;
    border-radius: 4px;
    outline: none;
    background: #1976D2;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
}

> div {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
> label {
    background-color: #fff;
    font-size: 12px;
    position: absolute;
    top: 3px;
    left: 10px;
    padding: 0 5px;
    color: rgba(0, 0, 0, 0.6);
}

> input {
    padding: 10px;
    margin-bottom: 10px;
    border: none;
    border-radius: 5px;
    outline: none;
    border: 1px solid rgba(0,0,0,0.3);
    color: rgba(0, 0, 0, 0.6);

    &::placeholder {
        color : rgba(0, 0, 0, 0.8);
    }
}
}
}






P {
    display: flex;
    gap: 5px;
    align-items: center;
    align-content: flex-start;
    margin-bottom: 15px;
    label {
        position: relative;
        top: 0;
        left: 0;
        font-size: 12px;
    }


}



`;
const Google = styled.button`
margin-top: 10px;
padding: 10px;
border: none;
border-radius: 3px;
outline: none;
background: #fff;
color: #000;
width: 100%;
box-shadow: 0 0 5px rgba(0,0,0,0.3);
font-size: 14px;
font-weight: 500;
display: flex;
align-items: center;
justify-content: center;
gap: 5px;
`
export default Login
