import React,  {useState, useEffect} from 'react'
import styled from 'styled-components'
import ClearIcon from '@mui/icons-material/Clear';
import {addDoc, collection, serverTimestamp, getDoc, doc, updateDoc , getDocs} from "firebase/firestore"
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage"
import {storage} from "../firebase"
import db from '../firebase';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './Loader';


const FormData = {
    name : "",
    description : "",
    pincode : "",
    contact : "",
    startDate : "",
    endDate : "",
    budget : "",
    permits : "",
    
}






const AddSite = ({submitForm, show, editForm, handlEdit, formId}) => {
const [materialForm, setMaterial] = useState(FormData)
const [imgShared, setImgShared] = useState(null)
const [fireImg, setFireImg] = useState('')
const [siteLocation, setSiteLocation] = useState([])
const [loading, setLoading] = useState(false)


useEffect(() => {
    getLocations()
}, [show, formId])

const locationRef = collection(db, "SiteData")
const getLocations = async() => {
    try{ 
        const docRef = await getDocs(locationRef)
        const docSnap = await docRef.docs.map(doc => ({id:doc.id,  ...doc.data()}))
        setSiteLocation(docSnap)
  
      } catch(err) {
        console.log(err)
      }
}

console.log(siteLocation, "siteLocation")





  const getData = async() => {
    try {
        const docRef = await doc(db, "SiteData", formId);
        const docSnap = await getDoc(docRef)
        const dataRef = await docSnap.data()
        if(dataRef){
            setMaterial({
                name : dataRef.name,
                description : dataRef.description,
                pincode : dataRef.pincode,
                contact : dataRef.contact,
                startDate : dataRef.startDate,
                endDate : dataRef.endDate,
                budget : dataRef.budget,
                permits : dataRef.permits,
            
        
            })
            setFireImg(dataRef.imgShared)

        }
        // console.log(dataRef, "dataRef")
        // setID(dataRef)
    } catch (error) {
        console.log(error)
    }
}

useEffect(() => {
    getData()
}, [formId])





const handlerForm = (e) => {
    const {name, value} = e.target;
    setMaterial((prev) => {
        return {
            ...prev,
            [name]:  value
        }
    })
}


const handlerImg = (e) => {
    setFireImg('')
    setImgShared(e.target.files[0])
}



const siteRef = collection(db, "SiteData")

const handlerSubmit = async(e) => {
    var urls = '';

    if(imgShared) {
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


const setData = async(uri) => {
    let myPromise =  new Promise(function (myResolve, myReject){
        const storageRef = ref(storage, `Sites/${uri.name}`)
        const uploadTask = uploadBytesResumable(storageRef, uri)
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`upload is ${progress}% done`);
            switch (snapshot.state) {
                case 'paused':
                //   console.log('Upload is paused');
                  break;
                case 'running':
                //   console.log('Upload is running');
                  break;
              }
         } ,
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
    e.preventDefault()
    // console.log(addFields, "addFields")
    // console.log(materialForm, "materialForm")


    if(formId) {
        var urls
        const docRef = await doc(db, "SiteData", formId);
        const docSnap = await getDoc(docRef)
        const dataRef = await docSnap.data()
        if(imgShared){
             urls = await handlerSubmit()
            console.log(urls, "urls")
        }
        const updatedData = {
            ...materialForm,
            clientphone : '+91' + materialForm.clientphone,
            imgShared : imgShared ? urls : dataRef.imgShared
        }

        if(dataRef) {
            const updateData = await updateDoc(docRef, updatedData).then((res) => {
                // console.log(res, "res")
                setLoading(false)
                toast.success('Successfully Updated Site', {
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

            handlEdit()
            setImgShared(null)
            setMaterial(FormData)
        }

    }
    

    else {
    const urls = await handlerSubmit()
    console.log(urls, "urls")


    const checkerForSite  = await CheckSite()
    setLoading(false)
    if(checkerForSite){
        toast.warn('Site Already Exist', {
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
    if(urls){
        const docRef = await addDoc(siteRef, {
            name : materialForm.name,
            description : materialForm.description,
            pincode : materialForm.pincode,
            contact : materialForm.contact,
            startDate : materialForm.startDate,
            endDate : materialForm.endDate,
            budget : materialForm.budget,
            permits : materialForm.permits,
            timestamp : serverTimestamp(),
            imgShared : urls,
        }
        )

        if(docRef.id) {
            toast.success('Successfully Created Site', {
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
        // console.log("Document written with ID: ", docRef.id);
        // setShow("")
        submitForm()
        setImgShared(null)
        setMaterial(FormData)
    }
}
}


}


const CheckSite = async () => {
    if(materialForm.name){
        for(let i = 0; i < siteLocation.length; i++){
            if(siteLocation[i].name.toLowerCase() === materialForm.name.toLowerCase()){
                return true
            }
        }

     }
     return false
}


const ClearForm = (e) => {
    e.preventDefault();
    setMaterial(FormData)
    setImgShared(null)

    if(show == "addsite") {
        submitForm()
    }
    else {
        handlEdit()
    }

}


    const handlerExit = () => {
        setMaterial(FormData)
        setImgShared(null)

        if(show == "addsite") {
            submitForm()
        }
        else {
            handlEdit()
        }
    }

    console.log(show, "show")
    console.log(materialForm, "materialForm")

  
  return (
    <>
    {
        show === "addsite" || editForm === "addsite" ?
    (
        <>
    <Container>
    {
        loading && 
        <Loader />
    }
    <Box>
    <Header>
        <div>
        <h2>Add Site</h2>
        <p>Create a site below</p>
        </div>

        <Icon onClick={handlerExit}>
        <ClearIcon/>
        </Icon>
    </Header>

    <Form>
    <form onSubmit={submitDb}>

    <SelectSite>
        <SelctPhoto>
        <BgImg>
            {
                imgShared  ? (
                    <img src={typeof imgShared == "string" ? imgShared : URL.createObjectURL(imgShared)} alt="material" />
                ) : 
                fireImg ? (<img src={fireImg} alt="material" />) :
                (
                    <img src="/assets/cam1.svg" alt="material" style={{width : "50px" , height : "50px" }}/>
                )
            }
        </BgImg>
            <label htmlFor="images" >Add Site Photo</label>
            <input type="file"  id='images' accept='image/png, image/jpeg, image/jpg' onChange={handlerImg}/>
        </SelctPhoto>
        </SelectSite>


        <Inputs>
        <div>
            <label htmlFor="name">Site Name</label>
            <input type="text" id="name" name="name" placeholder='Enter Site Name' value={materialForm.name}  onChange={handlerForm} required/>
        </div>

        <div>
            <label htmlFor="description">Site Location</label>
            <input type="text" id="description" name="description" placeholder='Enter Site Location' value={materialForm.description}  onChange={handlerForm} required/>
        </div>

        </Inputs>

        <Inputs>
        <div>
        <label htmlFor="pincode">Site Pincode</label>
        <input type="number" id="pincode" name="pincode" placeholder='Enter Pincode' value={materialForm.pincode}  onChange={handlerForm} required/>
        </div>

        <div>
        <label htmlFor="contact">Site Contact</label>
        <input type="number" id="contact" name="contact" placeholder='' value={materialForm.contact}  onChange={handlerForm} required/>
        </div>
        </Inputs>

        
        <Inputs>
        <div>
            <label htmlFor="startDate">Start Date (optional)</label>
            <input type="date" name="startDate" id="startDate" value={materialForm.startDate}  onChange={handlerForm} />
        </div>

        <div>
            <label htmlFor="endDate">End Date (optional)</label>
            <input type="date" name="endDate" id="endDate" value={materialForm.endDate}  onChange={handlerForm} />
        </div>
        </Inputs>

        <Inputs>
        <div>
            <label htmlFor="budget">Project Budget (optional)</label>
            <input type="text" name="budget" id="budget" placeholder='Budget' value={materialForm.budget}  onChange={handlerForm} />
        </div>

        <div>
            <label htmlFor="permits">Permits Required(if any)</label>
            <input type="text" name="permits" id="permits" placeholder='Permits' value={materialForm.permits}  onChange={handlerForm} />
        </div>
        </Inputs>



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
    </>
    ) : null
    }

    
    </>
  )
}

const BtnDelete = styled.button`
background-color: #fff;
border: none;
outline: none;
cursor: pointer;
color: #f00;
font-size: 20px;

&:hover {
    color: #f00;
}

`;

const SelectSite = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-top: 20px;
padding: 0 25px;
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
/* margin: 0 auto; */
margin-left: auto;
height: 95vh;
margin-top: 20px;
overflow-y: auto;
/* max-height: 700px; */
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
top: 0;
background-color: #fff;
z-index: 99;
padding: 20px;
`

const Icon = styled.div`
cursor: pointer;
padding: 5px;
/* background-color: red; */
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


const Form = styled.div`
padding: 20px;
padding-top: 0;
form {
    display: flex;
    flex-direction: column;
    gap: 30px;



    input {
        &::placeholder {
            color : #000;
            font-size: 15px;
            font-weight: 500;
        }
    }
}
label {
        color: rgba(0,0,0,0.6);
        font-size: 15px;
        font-weight: 500;
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

input {
  /* width: 100%; */
    padding: 10px;
    border: none;
    outline: none;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    /* margin-bottom: 10px; */
}
p {
  /* color: rgba(0,0,0,0.5); */
  margin-bottom: 10px
}
`;

const CheckList = styled.div`
display: flex;
align-items: center;
gap: 10px;

`;

const Btn = styled.button`
display: flex;
align-items: center;
justify-content: center;
border: none;
outline: none;
padding: 10px 70px;
border: 2px solid #2F80ED;
background-color: #fff;
color: #2F80ED;
border-radius: 3px;
cursor: pointer;
font-weight: 530;
letter-spacing: 1.5px;
font-weight: 600;
/* background: #1976D2; */
/* box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12); */

`



export default AddSite