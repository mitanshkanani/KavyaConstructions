import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Navbar from '../components/Navbar';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

import { auth } from '../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

import { Link } from "react-router-dom"



// add regX for password validation and email validation create function for validation and call it in submit button and also in onchange event of input field  and also add error message for validation  

const loweCase = new RegExp("(?=.*[a-z])");
const upperCase = new RegExp('(?=.*[A-Z])');
const number = new RegExp('(?=.*[0-9])');
const specialChar = new RegExp('(?=.*[!@#$%^&*])');
const length = new RegExp("^(?=.{8,})");

const allAtri = [loweCase, upperCase, number, specialChar, length]
// console.log(allAtri)

const decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/

const Settings = () => {

    const [formData, setForm] = useState(auth)
    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                setForm(user)
            }
        })

    }, [])

    const navigate = useNavigate()

    // console.log(formData, "formdata")
    const [showPassword, setShowPassword] = useState("password")
    const [newPassword, setNewPassword] = useState({
        password: "",
        confirmPassword: ""
    })


    // pass kajal@123

    const handlerChnageLogin = async (e) => {
        e.preventDefault()
        const { password, confirmPassword } = newPassword

        if (password === confirmPassword) {
            if (password.match(decimal)) {
                const setPass = await setNewUserPassword(formData, newPassword.password)
                if (setPass === false) {
                    try {
                        console.log("false blocked")
                        const user = auth.currentUser
                        const userId = EmailAuthProvider.credential(formData.email, prompt("Enter your old password"))
                        const credential = await reauthenticateWithCredential(user, userId)
                        const response = await updatePassword(user, newPassword.password)
                        if (response) {
                            alert("Password changed successfully")
                            setNewPassword({
                                password: "",
                                confirmPassword: ""
                            })
                        }
                        console.log(credential, "response")

                    } catch (error) {
                        console.log(error)
                        alert("Please enter valid credentials");
                    }
                }
            }
            else {
                alert("Password must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character")
            }
        }
        else {
            alert("Password does not match")
        }

    }


    const setNewUserPassword = async (userauth, currentPass) => {
        try {
            const response = await updatePassword(userauth, currentPass)
            alert("Password changed successfully")
            setNewPassword({
                password: "",
                confirmPassword: ""
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }


    }


    const handlerpassword = (e) => {
        const { name, value } = e.target;


        // if(value.match(decimal)){
        //         console.log("matched")
        // }
        // else {
        //     alert("Password must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character")
        // }

        setNewPassword((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const handlerExit = (e) => {
        e.preventDefault()
        navigate("/")
    }


    return (
        <>
            <Navbar />
            <Container>
                <Header>
                    <div>
                        <h1>Settings</h1>
                        <p>Manage Master Profile...</p>
                    </div>

                    <Navigate>
                        <Bell>
                            <Circle>
                                <p>2</p>
                            </Circle>
                            <NotificationsActiveIcon />
                        </Bell>
                    </Navigate>
                </Header>



                <Form>
                    <form onSubmit={handlerChnageLogin}>
                        <Inputs>
                            <div>
                                <label htmlFor="name">Admin Name</label>
                                <input type="text" id='name' name='name' placeholder='Pankaj Thakkar' disabled={true} />
                            </div>
                            <div>
                                <label htmlFor="name">Admin Email Address</label>
                                <input type="email" id='name' name='name' placeholder='kajalconstruction@gmail.com' disabled={true} />
                            </div>
                        </Inputs>

                        <Inputs>
                            <div>
                                <label htmlFor="password">New Password<span>*</span></label>


                                <Input>
                                    <input name='password' id="password" type={showPassword} placeholder="**********" required value={newPassword.password} onChange={handlerpassword}

                                    />
                                    {
                                        showPassword === "password" ? (
                                            <VisibilityIcon onClick={() => setShowPassword("text")} />
                                        ) : (
                                            <VisibilityOffIcon onClick={() => setShowPassword("password")} />
                                        )
                                    }
                                </Input>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword">Confirm New Password<span>*</span></label>
                                <Input>
                                    <input name='confirmPassword' id="confirmPassword" type={showPassword} placeholder="**********" required value={newPassword.confirmPassword} onChange={handlerpassword}

                                    />
                                    {
                                        showPassword === "password" ? (
                                            <VisibilityIcon onClick={() => setShowPassword("text")} />
                                        ) : (
                                            <VisibilityOffIcon onClick={() => setShowPassword("password")} />
                                        )
                                    }
                                </Input>

                            </div>
                        </Inputs>

                        <Btns>
                            <button onClick={handlerExit}>
                                BACK
                            </button>

                            <button type='submit'>
                                RESET PASSWORD
                            </button>
                        </Btns>
                    </form>
                </Form>
            </Container>
        </>
    )
}


const Container = styled.div`
position: relative;
flex-basis: 100%;
background-color: #F5F5F5;
padding: 20px 25px;
`;

const Header = styled.div`
display: flex;
align-items: center;
justify-content: space-between;

h1 {
  color: #000;
}
p {
  color: #666666;
}
`;

const Navigate = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
gap: 10px;
`;

const Bell = styled.div`
position: relative;
background-color: #fff;
padding: 5px;
border-radius: 3px;
cursor: pointer;
box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);

.MuiSvgIcon-root {
  /* color: #B3B3B3; */
  font-size: 20px;
}

`;

const Circle = styled.div`
color: #fff;
position: absolute;
border-radius: 50%;
width: 15px;
height: 15px;
display: flex;
align-items: center;
justify-content: center;
top: 0%;
right: 0%;
background: #2F80ED;
p {
  color: #fff;
  font-size: 10px;
  /* padding: 5px; */
}

svg {
  background: #333333;
}
`;


const Profile = styled.div`
margin-top: 30px;
p {
    color: #2F80ED;
    font-weight: 400;
font-size: 14px;
}
`;

const BgImg = styled.div`
width: 110px;
height: 110px;
border-radius: 50%;

img {
    width: 100%;
    height: 100%;
    border-radius: 50%;

}
`;


const Form = styled.div`
margin-top: 50px;
form {
    display: flex;
    flex-direction: column;
    gap: 30px;


    span {
        color: red;
    }
    label {
        color: rgba(0,0,0,0.6);
        font-size: 15px;
        font-weight: 500;
    }
    input {
        &::placeholder {
            color : #000;
            font-size: 15px;
            font-weight: 500;
        }
    }
}
`;

const Inputs = styled.div`
display: flex;
align-items: center;
width: 100%;
gap: 20px;

div {
    flex-basis: 100%;

}
input {
    width: 100%;
    padding: 10px;
    border: none;
    outline: none;
    border-bottom: 1px solid rgba(0,0,0,0.42);
    margin-bottom: 10px;
    margin-top: 5px;
    /* background-color: transparent; */
}
select {
    border: none;
    outline: none;
    border-bottom: 1px solid rgba(0,0,0,0.42);
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
}
`;

const Input = styled.div`
display: flex;
overflow: hidden;
/* flex-direction: row !important; */
/* border-radius: 5px; */
overflow: hidden;

> input {
    width: 100%;
    border: none;
    padding: 10px;
    outline: none;
    color: rgba(0, 0, 0, 0.6);
    border-bottom: 1px solid rgba(0,0,0,0.42);
    
}
.MuiSvgIcon-root {
    color: #86869B;
    cursor: pointer;
    background-color: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.42);
    height: 100%;
    padding: 7px 0;
    font-size: 28px;
}
`;

const Btns = styled.div`
margin-top: 20vh;

display: flex;
align-items: center;
justify-content: space-between;

a {
    color: rgba(0, 0, 0, 0.87);
    text-decoration: none;
    text-transform: uppercase;
}
button {
    color: rgba(0, 0, 0, 0.87);
    padding: 10px 20px;
    width: 200px;
    border-radius: 3px;
    outline: none;
    border: 1px solid #000;
    cursor: pointer;
    &:last-child {
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
        color: #fff;
        border: none;
        background: #F44336;
    }
}

`;

export default Settings
