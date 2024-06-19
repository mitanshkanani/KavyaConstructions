import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ClearIcon from '@mui/icons-material/Clear';
import db from '../firebase'
import { storage } from '../firebase';
import { addDoc, collection, serverTimestamp, getDoc, doc, updateDoc, getDocs } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';

import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Loader from './Loader';


const Addmaterial = ({ show, submitForm, editForm, handlEdit, formId }) => {
    const [materialForm, setMaterial] = useState({
        materialName: "",
        materialUnit: "",
    })

    const [imgShared, setImgShared] = useState(null)
    const [fireImg, setFireImg] = useState('')
    const [DataList, setList] = useState([])
    const [checkItem, setCheckItem] = useState('')

    const imgRef = useRef('')
    
    const [materialList, setMaterialList] = useState([])
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        getLocations()
    }, [show, formId])

    const locationRef = collection(db, "MaterialData")
    const getLocations = async () => {
        try {
            const docRef = await getDocs(locationRef)
            const docSnap = await docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setMaterialList(docSnap)

        } catch (err) {
            console.log(err)
        }
    }

    // console.log(materialList, "materiafdcmnjh")



    useEffect(() => {
        getData()
    }, [formId])

    const getData = async () => {
        try {
            const docRef = await doc(db, "MaterialData", formId);
            const docSnap = await getDoc(docRef)
            const dataRef = await docSnap.data()
            if (dataRef) {
                setMaterial({
                    materialName: dataRef.materialName,
                    materialUnit: dataRef.materialUnit,
                })

                // setImgShared(dataRef.materialimg)
                setFireImg(dataRef.materialImage)
                // DataList(dataRef.DataList)
                setList(dataRef.qualityCheckList)

            }
            // console.log(dataRef, "dataRef")

        } catch (error) {
            console.log(error)
        }
    }




    const handlerForm = (e) => {
        const { name, value } = e.target;
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
    }

    const materialRef = collection(db, "MaterialData");


    const handlerSubmit = async (e) => {

        var urls = '';
        if (imgShared) {
            urls = await setData(imgShared)
                .then((res) => urls = res)
                .catch((err) => console.log(err))
        }
        else {
            alert("Please Upload Image")
            urls = ''
        }
        return urls
    }

    const setData = async (uri) => {
        let myPromise = new Promise(function (myResolve, myReject) {
            const storageRef = ref(storage, `Materials/${uri.name}`)
            const uploadTask = uploadBytesResumable(storageRef, uri)
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
                    console.log(error)
                    myReject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        // console.log('File available at', downloadURL);
                        myResolve(downloadURL)
                    } catch (error) {
                        console.log(error)
                    }
                })


        }
        )
        return myPromise


    }


    const submitDb = async (e) => {
        setLoading(true)
        e.preventDefault();
        if (formId) {
            var urls
            const docRef = await doc(db, "MaterialData", formId);
            const docSnap = await getDoc(docRef)
            const dataRef = await docSnap.data()
            if (imgShared) {
                urls = await handlerSubmit()
                // console.log(urls, "urls")
            }
            const updatedData = {
                ...materialForm,
                materialImage: imgShared ? urls : dataRef.materialImage,
                qualityCheckList: DataList,
            }
            if (dataRef) {
                const updateData = await updateDoc(docRef, updatedData).then((res) => {
                    // console.log(res, "res")
                    setLoading(false)
                    toast.success('Successfully Updated Material', {
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
                }).catch((err) => {
                    console.log(err)
                }
                )
                setList([])

                handlEdit()
                setImgShared(null)
                setMaterial({
                    materialName: "",
                    materialUnit: ""
                })
            }

        }

        else {
            const urls = await handlerSubmit()
            // console.log(urls, "urls")
            const checkerForSite = await CheckSite()
            setLoading(false)
            if (checkerForSite) {
                toast.warn('Material Already Exist', {
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
                if (urls) {
                    const docRef = await addDoc(materialRef, {
                        materialName: materialForm.materialName,
                        materialUnit: materialForm.materialUnit,
                        createdAt: serverTimestamp(),
                        materialImage: urls,
                        qualityCheckList: DataList,
                    }
                    )
                    setLoading(false)

                    if (docRef.id) {
                        toast.success('Successfully Created Material', {
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
                    setList([])
                    submitForm()
                    setImgShared(null)
                    setMaterial({
                        materialName: "",
                        materialUnit: ""
                    })
                }
            }
        }

    }

    const CheckSite = async () => {
        if (materialForm.materialName) {
            for (let i = 0; i < materialList.length; i++) {
                if (materialList[i]?.materialName.toLowerCase() === materialForm?.materialName.toLowerCase()) {
                    return true
                }
            }

        }
        return false
    }


    const ClearForm = (e) => {
        e.preventDefault();
        setMaterial({
            materialName: "",
            materialUnit: ""
        })
        setImgShared(null)
        setList([])


        if (show == "addmaterial") {
            submitForm()
        }
        else {
            handlEdit()
        }

    }


    const handlerExit = () => {
        setMaterial({
            materialName: "",
            materialUnit: ""
        })
        setImgShared(null)
        setList([])

        if (show == "addmaterial") {
            submitForm()
        }
        else {
            handlEdit()
        }
    }


    const handlerCheck = (e) => {
        e.preventDefault()

        if (checkItem) {
            setList((prev) => {
                return [...prev, checkItem]
            })
            setCheckItem("")
        }

    }

    const handlerDeleteList = (e, ListId) => {
        e.preventDefault()
        // console.log(ListId)
        setList((prev) => {
            return prev.filter((item, index) => index !== ListId)
        })
    }

    // console.log(DataList, "DataList")
    console.log(formId, "formId")

    return (
        <>
            {
                show === "addmaterial" || editForm === "addmaterial" ?
                    (<>
                        <Container ref={imgRef}>
                        {
                            loading && 
                            <Loader />
                        }
                            <Box>
                                <Header>
                                    <div>
                                        <h2>Create Material</h2>
                                        <p>Create a new Material</p>
                                    </div>

                                    <Icon onClick={() => handlerExit()}>
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
                                                    ) :
                                                        fireImg ? (<img src={fireImg} alt="material" />) :
                                                            (
                                                                <img src="/assets/cam1.svg" alt="material" style={{ width: "50px", height: "50px" }} />
                                                            )
                                                }

                                            </BgImg>
                                            <label htmlFor="images" >Upload a Photo</label>
                                            <input type="file" accept='image/png, image/jpeg, image/jpg' id='images' onChange={handlerImg} name="img" />
                                        </SelctPhoto>

                                        <Inputs>
                                            <div>
                                                <label htmlFor="materialName">Name of the Material</label>
                                                <input type="text" id="materialName" name="materialName" value={materialForm.materialName} onChange={handlerForm} required />
                                            </div>

                                            <div>
                                                <label htmlFor="materialUnit">Unit of Measurement(UOM)</label>
                                                <FormControl variant="standard" className='selectOtp'>
                                                    <Select
                                                        labelId="demo-simple-select-standard-label"
                                                        id="demo-simple-select-standard"
                                                        value={materialForm.materialUnit}
                                                        onChange={handlerForm}
                                                        label="materialUnit"
                                                        name="materialUnit"
                                                    >
                                                        <MenuItem value="" disabled={true}>
                                                            <em>Select Unit of Measurement</em>
                                                        </MenuItem>
                                                        <MenuItem value="bags">bags</MenuItem>
                                                        <MenuItem value="cft">cft</MenuItem>
                                                        <MenuItem value="numbers">numbers</MenuItem>
                                                        <MenuItem value="Kg">Kg</MenuItem>
                                                        <MenuItem value="box">box</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </Inputs>


                                        <div>
                                            <h2>Add Checklist</h2>
                                            <p>Specify checklist below</p>
                                        </div>
                                        {
                                            DataList && DataList.length > 0 &&

                                            <ListData>
                                                {
                                                    DataList?.map((item, index) => {
                                                        return (
                                                            <>
                                                                <p>Checklist {index + 1}</p>
                                                                <ItemList>
                                                                    {item}
                                                                    <div>
                                                                        <button>
                                                                            <DeleteOutlinedIcon style={{ color: "#F44336" }} onClick={(e) => handlerDeleteList(e, index)} />
                                                                        </button>
                                                                    </div>
                                                                </ItemList>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </ListData>
                                        }

                                        <Inputs>
                                            <div>
                                                <label htmlFor="check">Add Check-List</label>
                                                <input type="text" name="check" id="check" placeholder='Enter list' value={checkItem} onChange={(e) => setCheckItem(e.target.value)} />
                                            </div>
                                        </Inputs>

                                        {/* <EditIcon style={{color: "#909090"}}/> */}



                                        <AddBtn onClick={handlerCheck}>
                                            <AddIcon />
                                            ADD CHECKLIST
                                        </AddBtn>



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
                        </Container> </>) : null




            }



        </>
    )
}


const ListData = styled.div`

`;

const ItemList = styled.div`
margin: 5px 0;
background: rgba(0,0,0,0.15);
padding: 8px 8px;
color: #666666;
border-radius: 3px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 10px;

> div {
    display: flex;
    align-items: center;
    gap: 10px;

    button {
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;

    }
}

`;


const AddBtn = styled.button`
cursor: pointer;
padding: 10px 0;
border: none;
outline: none;
background-color: #fff;
display: flex;
align-items: center;
color: #1976D2;
justify-content: center;
border: 1px solid #1976D2;
width: 200px;
margin: 0 auto;
font-weight: 600;
/* background-color: red; */
`;

const BoxMaterial = styled.div`
background-color: #fff;
width: 100%;
max-width: 680px;
padding: 20px;
border-radius: 5px;
/* margin : 0 auto;
margin-top: 20px; */

`

const Options = styled.div`
display: flex;
flex-wrap: wrap;
align-items: center;
gap: 10px;
`;

const Material = styled.div`
background: #F9FAFC;
border: 1px solid #6A7C8F;
border-radius: 5px;
width: 200px;
height: 150px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 10px;
cursor: pointer;
svg {
    font-size: 50px;
     color: #808080;
}
h5 {
    color: #808080;
}
p {
    text-align: center;
    color: #666666;
    font-size: 12px;
    font-weight: 300;
}
`;


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
margin-left: auto;
height: 95vh;
overflow: hidden;
overflow-y: scroll;
position: relative;
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
position: sticky;
top: 0px;
z-index: 99;
padding: 20px;
background-color: #fff;
/* background-color: red; */
`

const Icon = styled.div`
cursor: pointer;
padding: 5px;
/* background-color: red; */
`

const Form = styled.div`
position: relative;
/* height: 100%; */
/* margin-top: 20px; */
padding: 20px;
form {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* justify-content: space-between; */




    input {
        &::placeholder {
            color : #000;
            font-size: 15px;
            font-weight: 500;
        }
    }
}
label {
        /* color: rgba(0,0,0,0.6); */
        font-size: 15px;
        font-weight: 500;
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
    color: #1976D2 ;
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
/* border: 1px solid #000; */
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
    object-fit: conver;
}
`;

const Inputs = styled.div`
margin-top: 30px;
display: flex;
align-items: center;
/* align-items: flex-start; */
width: 100%;
gap: 20px;
div {
    flex-basis: 100%;
    &:last-child {
        margin-bottom: 2px;
    }
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
option {
    padding: 10px 0;
}


`;


const Btns = styled.div`
margin: 20px 0;
display: flex;
align-items: center;
justify-content: space-between;
z-index: 99;
position: sticky;
bottom: 0;
background-color: #fff;
padding: 10px 0;
/* background-color: red; */
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
        border: 1px solid #000;
        box-shadow: none;
    }
 }

`

export default Addmaterial
