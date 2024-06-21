import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { addDoc, collection, serverTimestamp, getDoc, doc, updateDoc, getDocs } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "../firebase"
import db from '../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Loader from './Loader';

const FormData = {
    name: "",
    SiteLocation: "",
    phoneNumber: "",
}

const bloodgrps = [
    "A+(A Positive)",
    "A-(A Negative)",
    "B+(B Positive)",
    "B-(B Negative)",
    "AB+(AB Positive)",
    "AB-(AB Negative)",
    "O+(O Positive)",
    "O-(O Negative)"
]
const AddUser = ({ submitForm, show, editForm, handlEdit, formId }) => {
    const [materialForm, setMaterial] = useState(FormData)
    const [drag, setDrag] = useState()
    const [imgShared, setImgShared] = useState()
    const [allImg, setAllImg] = useState([])
    const [imgLinkLoc, setLinkLoc] = useState({})
    const [siteLocation, setLocation] = useState([])
    const [showField, setShowFields] = useState(false)
    const [fields, setFeilds] = useState({})
    const [fireImg, setFireImg] = useState('')
    const userRef = collection(db, "LoginPhones")
    const [usersList, setUsersList] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getmaterIalListRef()
    }, [show, formId])

    const materIalListRef = collection(db, "LoginPhones")
    const getmaterIalListRef = async () => {
        try {
            const docRef = await getDocs(materIalListRef)
            const docSnap = await docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setUsersList(docSnap)

        } catch (err) {
            console.log(err)
        }
    }
    console.log(usersList, "usernjedh")
    useEffect(() => {
        getLocations()
    }, [show, formId])
    const locationRef = collection(db, "SiteData")
    const getLocations = async () => {
        try {
            const docRef = await getDocs(locationRef)
            const docSnap = await docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setLocation(docSnap)
        } catch (err) {
            console.log(err)
        }
    }
    const ClearForm = (e) => {
        e.preventDefault();
        setMaterial(FormData)
        setAllImg([])
        setImgShared(null)
        setLinkLoc({})
        setDrag(null)
        setShowFields(false)
        setFeilds({})
        if (show === "adduser") {
            submitForm()
        }
        else {
            handlEdit()
        }
    }
    const getData = async () => {
        try {
            const docRef = await doc(db, "LoginPhones", formId);
            const docSnap = await getDoc(docRef)
            const dataRef = await docSnap.data()
            console.log("getData caleed")
            if (dataRef) {
                setMaterial({
                    name: dataRef.name,
                    SiteLocation: dataRef.SiteLocation,
                    phoneNumber: dataRef.phoneNumber.slice(3),
                    email: dataRef.email,
                    shift: dataRef.shift,
                    address: dataRef.address,
                    dob: dataRef.dob,
                    gender: dataRef.gender,
                    education: dataRef.education,
                    blood: dataRef.blood,
                    document: dataRef.document,
                    emergencyContact: dataRef.emergencyContact,
                })
                setFireImg(dataRef.profileImg)

                // setImgShared(dataRef.profileImg)
                setDrag(dataRef.docImg)
            }
            // console.log(dataRef, "dataRef")
            // setID(dataRef)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        console.log("getData")
        getData()
    }, [formId])
    const handlerForm = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNumber") {
            if (value.length > 10) {
                return
            }
        }
        if (formId) {
            setLinkLoc((prev) => {
                return {
                    ...prev,
                    [name]: value
                }
            })
        }
        if (showField) {
            setFeilds((prev) => {
                return {
                    ...prev,
                    [name]: value
                }
            })
        }
        setMaterial((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }


    const handlerImg = (e) => {
        setFireImg('')
        setImgShared(e.target.files[0])
        setAllImg((prev) => {
            return [...prev, e.target.files[0]]
        })
    }





    const handlerOver = (e) => {
        e.preventDefault();
        // console.log('over')
    }

    const handlerDrop = (e) => {
        e.preventDefault();
        setDrag(e.dataTransfer.files[0])
        setAllImg((prev) => {
            return [
                ...prev,
                e.dataTransfer.files[0]
            ]
        })
    }
    // console.log(drag)

    const handlerExit = () => {
        setMaterial(FormData)
        setAllImg([])
        setImgShared(null)
        setLinkLoc({})
        setDrag(null)
        setShowFields(false)
        setFeilds({})
        if (show === "adduser") {
            submitForm()
        }
        else {
            handlEdit()
        }
    }

    const handlerSubmit = async (e) => {
        // e.preventDefault();
        const pushArr = []
        if (allImg.length > 0) {
            for (const url of allImg) {
                const task = await setData(url)
                    .then((res) => pushArr.push(res))
                    .catch((err) => console.log(err))
            }
        }
        else {
            alert("Please upload image")
            // console.log("Please upload 2 images")
        }

        return pushArr

    }

    const setData = async (url) => {
        let promise = new Promise(function (resolve, reject) {
            const storageRef = ref(storage, `Users/${url.name}`)
            const uploadTask = uploadBytesResumable(storageRef, url)

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log(`upload is ${progress}% done`);
                switch (snapshot.state) {
                    case 'paused':
                        //   console.log('Upload is paused');
                        break;
                    case 'running':
                        //   console.log('Upload is running');
                        break;
                }
            },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':

                            break;
                        case 'storage/canceled':

                            break;

                        case 'storage/unknown':

                            break;
                    }
                    reject(error)
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        // console.log('File available at', downloadURL);
                        resolve(downloadURL)
                    } catch (error) {
                        console.log(error)
                    }
                }
            )


        })
        return promise
    }


    const submitDb = async (e) => {
        setLoading(true)
        e.preventDefault();
        if (formId) {
            let urls
            const docRef = await doc(db, "LoginPhones", formId);
            const docSnap = await getDoc(docRef)
            const dataRef = await docSnap.data()
            if (imgShared) {
                urls = await handlerSubmit()
                console.log(urls, "urls")
            }
            const updatedDatas = {
                ...imgLinkLoc,
                phoneNumber: '+91' + materialForm.phoneNumber,
                profileImg: imgShared ? urls : dataRef.profileImg
            }
            if (dataRef) {
                const updateData = await updateDoc(docRef, updatedDatas).then((res) => {
                    // console.log(res, "res");
                    setLoading(false)
                    toast.success('Successfully Updated Supervisor', {
                        toastId: 'success1',
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }).catch((err) => {
                    console.log(err)
                }
                )

                handlEdit()
                setImgShared(null)
                setLinkLoc({})
                setAllImg([])
                setMaterial(FormData)
                setDrag(null)
                setShowFields(false)
            }

        }
        else {
            const urls = await handlerSubmit()
            console.log(urls, 'urls')
            const checkerForSite = await CheckSite()
            setLoading(false)
            if (checkerForSite) {
                toast.warn('Supervisor Already Exist', {
                    toastId: 'success2',
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            else {
                if (urls.length === 2) {
                    const docRef = await addDoc(userRef, {
                        ...materialForm,
                        phoneNumber: '+91' + materialForm.phoneNumber,
                        profileImg: urls[0],
                        docImg: urls[1],
                        timestamp: serverTimestamp()
                    })
                    setLoading(false)

                    if (docRef.id) {
                        toast.success('Successfully Created Supervisor', {
                            toastId: 'success1',
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                    console.log("Document written with ID: ", docRef.id);
                    submitForm()
                    setImgShared(null)
                    setAllImg([])
                    setDrag(null)
                    setMaterial(FormData)
                    setShowFields(false)
                }
                else if (urls.length === 1) {
                    const docRef = await addDoc(userRef, {
                        ...materialForm,
                        phoneNumber: '+91' + materialForm.phoneNumber,
                        profileImg: urls[0],
                        timestamp: serverTimestamp()
                    })
                    setLoading(false)

                    if (docRef.id) {
                        toast.success('Successfully Created Supervisor', {
                            toastId: 'success1',
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                    console.log("Document written with ID: ", docRef.id);
                    submitForm()
                    setImgShared(null)
                    setAllImg([])
                    setDrag(null)
                    setMaterial(FormData)


                }

            }
        }
    }





    const handlerAddFields = (e) => {
        e.preventDefault()
        setShowFields(!showField)
    }



    const CheckSite = async () => {
        if (materialForm.name) {
            for (let i = 0; i < usersList.length; i++) {
                if (usersList[i]?.name?.toLowerCase() === materialForm?.name.toLowerCase()) {
                    return true
                }
            }

        }
        return false
    }



    console.log(materialForm, "materialForm")
    console.log(siteLocation, "siteLocation")



    return (
        <>
            {
                show === "adduser" || editForm === "adduser" ?
                    (
                        <>
                            <Container>
                            {
                                loading &&
                                <Loader/>
                            }

                                <Box>
                                    <Header>
                                        <div>
                                            <h2>Create Supervisor</h2>
                                            <p>Create a Supervisor below</p>
                                        </div>

                                        <Icon onClick={handlerExit}>
                                            <ClearIcon />
                                        </Icon>
                                    </Header>

                                    <Form>
                                        <form onSubmit={submitDb}>
                                            <SelctPhoto>
                                                <BgImg>
                                                    {
                                                        imgShared ? (
                                                            <img src={typeof imgShared == "string" ? imgShared : URL.createObjectURL(imgShared)} alt="material" />
                                                        ) : fireImg ? (<img src={fireImg} alt="material" />) :
                                                            (
                                                                <img src="/assets/cam1.svg" alt="material" style={{ width: "50px", height: "50px" }} />
                                                            )
                                                    }
                                                </BgImg>
                                                <label htmlFor="images" >Add User Photo</label>
                                                <input type="file" accept='image/png, image/jpeg, image/jpg' id='images' onChange={handlerImg} name="img" />
                                            </SelctPhoto>


                                            <Inputs>
                                                <div>
                                                    <label htmlFor="name">Supervisor Name*</label>
                                                    <input type="text" id="name" name="name" placeholder='Enter name' value={materialForm.name} onChange={handlerForm} required />
                                                </div>
                                            </Inputs>

                                            <Inputs>
                                                <div>
                                                    <label htmlFor="SiteLocation">Supervisor Location</label>

                                                    <FormControl variant="standard" className='selectOtp'>
                                                        <Select
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            value={materialForm.SiteLocation}
                                                            onChange={handlerForm}
                                                            label="SiteLocation"
                                                            name="SiteLocation"
                                                        >
                                                            <MenuItem value="" disabled={true}>
                                                                <em>Select Location</em>
                                                            </MenuItem>
                                                            {
                                                                siteLocation && siteLocation.map((item, index) => {
                                                                    return (
                                                                        <MenuItem value={item.name} key={index}>{item.name}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                <div>
                                                    <label htmlFor="phoneNumber">Phone Number</label>
                                                    <input type="number" id="phoneNumber" name="phoneNumber" maxlength="10" placeholder='' value={materialForm.phoneNumber} onChange={handlerForm} required />
                                                </div>

                                            </Inputs>

                                            <Btn onClick={handlerAddFields} showField={showField}>
                                                {
                                                    showField ? (
                                                        <>
                                                            <RemoveIcon />
                                                            HIDE ADDITIONAL DETAILS
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AddIcon />
                                                            ADD ADDITIONAL DETAILS
                                                        </>

                                                    )
                                                }

                                            </Btn>
                                            {
                                                showField ? (
                                                    <>
                                                        <Inputs>
                                                            <div>
                                                                <label htmlFor="shift">Shift Timings</label>

                                                                <FormControl variant="standard" className='selectOtp'>
                                                                    <Select
                                                                        labelId="demo-simple-select-standard-label"
                                                                        id="demo-simple-select-standard"
                                                                        value={materialForm.shift ? materialForm.shift : ""}
                                                                        onChange={handlerForm}
                                                                        label="shift"
                                                                        name="shift"
                                                                    >
                                                                        <MenuItem value="" disabled={true}>
                                                                            <em>Select Shift</em>
                                                                        </MenuItem>
                                                                        <MenuItem value="12PM - 9PM">12PM - 9PM</MenuItem>
                                                                        <MenuItem value="9AM - 5PM">9AM - 5PM</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </div>

                                                            <div>
                                                                <label htmlFor="email">User Email</label>
                                                                <input type="text" id="email" name="email" placeholder='Enter email' value={materialForm.email} onChange={handlerForm} />
                                                            </div>
                                                        </Inputs>

                                                        <Inputs>
                                                            <div>
                                                                <label htmlFor="address">Street Address</label>
                                                                <input type="text" id="address" name="address" placeholder='' value={materialForm.address} onChange={handlerForm} />
                                                            </div>
                                                        </Inputs>

                                                        <Checks>
                                                            <div>
                                                                <label htmlFor="dob">Date Of Birth</label>
                                                                <input type="date" id="dob" name="dob" placeholder='25/02/2023' value={materialForm.dob} onChange={handlerForm} />
                                                            </div>

                                                            <div>
                                                                <p>Gender</p>
                                                                <CheckList>
                                                                    <input type="radio" id="Male" name="gender" placeholder='Male' value="Male" onChange={handlerForm} />
                                                                    <label htmlFor="Male">Male</label>

                                                                    <input type="radio" id="Female" name="gender" placeholder='Male' value="Female" onChange={handlerForm} />
                                                                    <label htmlFor="Female">Female</label>

                                                                    <input type="radio" id="Others" name="gender" placeholder='Others' value="Others" onChange={handlerForm} />
                                                                    <label htmlFor="Others">Others</label>
                                                                </CheckList>
                                                            </div>
                                                        </Checks>


                                                        <Inputs>
                                                            <div>
                                                                <label htmlFor="education">Educational Qualifications</label>

                                                                <FormControl variant="standard" className='selectOtp'>
                                                                    <Select
                                                                        labelId="demo-simple-select-standard-label"
                                                                        id="demo-simple-select-standard"
                                                                        value={materialForm.education ? materialForm.education : ""}
                                                                        onChange={handlerForm}
                                                                        label="education"
                                                                        name="education"
                                                                    >
                                                                        <MenuItem value="" disabled={true}>
                                                                            <em>Select Qualifications</em>
                                                                        </MenuItem>
                                                                        <MenuItem value="10th">10th</MenuItem>
                                                                        <MenuItem value="12th">12th</MenuItem>
                                                                        <MenuItem value="Diploma">Diploma</MenuItem>
                                                                        <MenuItem value="Graduation">Graduation</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </div>

                                                            <div>
                                                                <label htmlFor="blood">Blood Group(Optional)</label>

                                                                <FormControl variant="standard" className='selectOtp'>
                                                                    <Select
                                                                        labelId="demo-simple-select-standard-label"
                                                                        id="demo-simple-select-standard"
                                                                        value={materialForm.blood ? materialForm.blood : ""}
                                                                        onChange={handlerForm}
                                                                        label="blood"
                                                                        name="blood"
                                                                    >
                                                                        <MenuItem value="" disabled={true}>
                                                                            <em>Select Blood Group</em>
                                                                        </MenuItem>
                                                                        {
                                                                            bloodgrps.map((item, index) => {
                                                                                return (
                                                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                        </Inputs>

                                                        <Inputs>
                                                            <div>
                                                                <label htmlFor="document">Document for verification</label>


                                                                <FormControl variant="standard" className='selectOtp'>
                                                                    <Select
                                                                        labelId="demo-simple-select-standard-label"
                                                                        id="demo-simple-select-standard"
                                                                        value={materialForm.document ? materialForm.document : ""}
                                                                        onChange={handlerForm}
                                                                        label="document"
                                                                        name="document"
                                                                    >
                                                                        <MenuItem value="" disabled={true}>
                                                                            <em>Select Document</em>
                                                                        </MenuItem>
                                                                        <MenuItem value="Aadhar Card">Aadhar Card</MenuItem>
                                                                        <MenuItem value="Pan Card">Pan Card</MenuItem>
                                                                        <MenuItem value="Ration Card">Ration Card</MenuItem>
                                                                        <MenuItem value="Driving Licence">Driving Licence</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </div>

                                                            <Drag
                                                                onDragOver={handlerOver}
                                                                onDrop={handlerDrop}>
                                                                <CloudUploadOutlinedIcon />
                                                                <p>Upload Document</p>
                                                            </Drag>
                                                        </Inputs>
                                                        {
                                                            drag && (
                                                                <img src={typeof drag == "string" ? drag : URL.createObjectURL(drag)} alt="" style={{ width: "150px", height: "150px" }} />
                                                            )
                                                        }

                                                        <Inputs>



                                                            <div>
                                                                <label htmlFor="emergencyContact">Emergency Contact</label>
                                                                <input type="text" id="emergencyContact" name="emergencyContact" placeholder='contact no.' value={materialForm.emergencyContact} onChange={handlerForm} />
                                                            </div>

                                                        </Inputs>
                                                    </>) : null

                                            }



                                            <Btns>
                                                <button type='submit'>
                                                {
                                                formId ? "UPDATE" : " CREATE"
                                            }
                                                </button>
                                                <button onClick={ClearForm}>CANCEL</button>
                                            </Btns>

                                        </form>
                                    </Form>
                                </Box>
                            </Container>
                        </>) : null
            }



        </>
    )
}
// #2F80ED

const Btn = styled.button`
display: flex;
align-items: center;
justify-content: center;
border: none;
outline: none;
padding: 10px 70px;
border: 2px solid;
border-color: ${(props) => (props.showField ? "#999" : "#2F80ED")};
background-color: #fff;
color: ${(props) => (props.showField ? "#999" : "#2F80ED")};
border-radius: 3px;
cursor: pointer;
font-weight: 530;
letter-spacing: 1.5px;
font-weight: 600;
`

const Container = styled.div`
position: fixed;
inset: 0;
background-color: rgba(0,0,0,0.2);
width: 100%;
`;

const Box = styled.div`
background-color: #fff;
border-radius: 5px;
width: 100%;
max-width: 600px;
margin-top: 20px;
height: 95vh;
overflow-y: auto;
margin-left: auto;

&::-webkit-scrollbar {
  width: 10px;
}
&::-webkit-scrollbar-track {
  background: #fff;

}
&::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  background-clip: content-box;
  height: 50vh;
}
&::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.3);
}
`;

const Header = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
z-index: 99;
position: sticky;
top: 0;
background-color: #fff;
padding: 20px;
`

const Icon = styled.div`
cursor: pointer;
padding: 5px;
/* background-color: red; */
`

const Form = styled.div`
padding: 20px;
padding-top: 0;
form {
    display: flex;
    flex-direction: column;
    gap: 30px;
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
`

const SelctPhoto = styled.div`
input {
    display: none;
    text-align: center;
}
label {
    display: block;
    text-align: center;
    color: #1976D2 !important;
    text-decoration: underline;
    cursor: pointer;
}
`

const BgImg = styled.div`
width: 100px;
height: 100px;
border-radius: 50%;
margin: 0 auto;
box-shadow: 0 0 5px rgba(0,0,0,0.2);
margin-bottom: 10px;
display: flex;
align-items: center;
justify-content: center;
background-color: #dedede;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: inline-block;
    object-fit: cover;
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


const Btns = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
z-index: 99;
position: sticky;
bottom: 0;
background-color: #fff;
padding: 10px 0;
button {
    background: #1976D2;
    padding: 10px 70px;
    border: none;
    outline: none;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    font-weight: 530;
    letter-spacing: 1.5px;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
    &:last-child {
        background: #fff;
        color: #000;
        box-shadow: none;
        border: 1px solid #000;
    }
 }
`

const Drag = styled.div`
background-color: rgba(0,0,0,0.1);
width: 100%;
height: 80px;
border-radius: 10px;
border: 2px dashed rgba(0,0,0,0.2);
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
p {
  color: rgba(0,0,0,0.5);
  font-size: 12px;
}
`;

const Checks = styled.div`
display: flex;
justify-content: space-between;
gap: 20px;
/* align-items: center; */
div {
 width: 100%;   
}
input {
  /* width: 100%; */
    padding: 10px;
    border: none;
    outline: none;
    width: 100%;
    border-bottom: 1px solid rgba(0,0,0,0.42);
    /* margin-bottom: 10px; */
}
p {
  /* color: rgba(0,0,0,0.5); */
  margin-bottom: 10px
}
label {
    display: block;
}
`;

const CheckList = styled.div`
display: flex;
align-items: center;
gap: 10px;
`;

export default AddUser