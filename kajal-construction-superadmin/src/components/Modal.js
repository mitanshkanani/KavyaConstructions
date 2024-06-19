import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector } from 'react-redux';
import {selectType, selectID, selectDbName} from "../features/modalSlice"
import {SetModal} from "../features/modalSlice"
import {useDispatch} from "react-redux"


import db from "../firebase"
import {collection, onSnapshot, deleteDoc, doc, getDocs, query, orderBy, limit, startAt, startAfter, endAt, endBefore, getDoc} from "firebase/firestore"



const Modal = () => {
    const dispatch = useDispatch()
    const modal = useSelector(selectType)
    const modalId = useSelector(selectID)
    const DbName = useSelector(selectDbName)
    const [users, setUsers] = useState([]);
    // console.log(modal, 'modallllllllll', modalId)

  


//   const userRef = query(collection(db, "UserData") , orderBy('timestamp', "desc"))

//   const getData = async() => {
//     const userRef = collection(db, 'UserData');
//     try{
//         const userQuery = await getDocs(userRef);
//         setUsers(userQuery.docs.map(doc => ({id:doc.id, ...doc.data()}))) 
//     } catch(err) {
//       console.log(err)
//     }
//   }


//   useEffect(() => {
//     getData()
//   }, [modalId])

  const [dataId, setID] = useState([])
  const [currentSiteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(true)



  const getSiteData = async() => {
    // setLoading(true)
    const userRef = collection(db, 'LoginPhones');
    const arr = []
      try {
        const userQuery = await getDocs(userRef);
        userQuery.forEach((doc) => {
            arr.push(doc.data())
        })
          const docRef = await doc(db, DbName, modalId);
          const docSnap = await getDoc(docRef)
          const dataRef = await docSnap.data()
          // console.log(arr, 'arr')
          setSiteName(dataRef.name)
          
          const data = arr.filter((item) => {
            return item?.SiteLocation?.toLowerCase().includes(dataRef?.name.toLowerCase())
        })
        console.log(data, 'data')
        setUsers(data)

      } catch (error) {
          console.log(error)
      }
      setLoading(false)
  }


  // const getLoc = async(dbvalue, arr) => {
  //   const userRef = collection(db, 'UserData');
  //   const arrPush = []
  //   const data = arr.filter((item) => {
  //             return item.location?.toLowerCase().includes(dbvalue.toLowerCase())
  //   })
  //   try {
  //       const userQuery = await getDocs(userRef);
  //       userQuery.forEach((doc) => {
  //           arr.push(doc.data())
  //       })
  //       const data = arr.filter((item) => {
  //           return item.location?.toLowerCase().includes(dbvalue.toLowerCase())
  //       })
  //       console.log(data, 'data')
      
  //   } catch (error) {
  //       console.log(error)
  //   }
  //   return data
  // }

  useEffect(() => {
      getSiteData()
  }, [modalId, modal])


    const clearModal = () => {
        dispatch(
            SetModal({
                type : '',
                id : ''
            })
        )
        console.log('clicked')
    }


    const DeletDoc = async(id, databseID) => {
    const docRef =  doc(db, databseID, id);
    try {
      const deleteRef = await deleteDoc(docRef)
      console.log(deleteRef, 'deleted')
      clearModal()

    } catch (error) {
      console.log(error)
    }
    }


    console.log(currentSiteName, 'dataId')
    console.log(users, 'users')

    // const data = users.filter((item) => {
    //     return item.location?.toLowerCase().includes(currentSiteName?.toLowerCase())
    // })
    // console.log(data, 'data')



  return (
    <>
    {
      !loading &&
    
   <Container>
    <Box>
        <ZoomHeader>
        <Icon onClick={clearModal}>
        <ClearIcon/>
        </Icon>
        </ZoomHeader>

        <h1>Are you sure you want to <br /> <span>delete</span> this {modal}?</h1>
        {
            users.length > 0 ? (
                <p>Please reassign or remove all supervisors from this site before deleting it to activate the delete button.</p>
            ) : (
                <p>Your {modal} data will be deleted completely.</p>
            )
        }
       
        {/* disabled={data === null ? true : false} */}

        <Btns>
        {
            modal === 'site' ? 
            (<Btn onClick={() => DeletDoc(modalId, DbName)} disabled={users.length !== 0 ? true : false} 
            style={{backgroundColor : users.length !== 0  ? "grey" : "#F44336"}}>Yes ! Delete it</Btn> ) : (
                <Btn onClick={() => DeletDoc(modalId, DbName)} >Yes ! Delete it</Btn>
            ) 
        }
            
            <Btn onClick={clearModal}>Cancel</Btn>
        </Btns>
    </Box>
    </Container>
    }
    </>
  )
}



const Container = styled.div`
position: fixed;
inset: 0;
-webkit-backdrop-filter: blur(1px);
backdrop-filter: blur(1px);
width: 100%;
display: flex;
align-items: center;
justify-content: center;
z-index: 999;
`;


const Box = styled.div`
background-color: #fff;
width: 100%;
max-width: 400px;
position: fixed;
padding: 20px;
box-shadow: 0 0 10px rgba(0,0,0,0.25);

h1 {
    font-size: 24px;
    color: #000000;
    text-align: center;

    span {
    color: #F44336;
}
}

p {
    font-size: 16px;
    color: #666666;
    text-align: center;
    margin: 5px 0;
}
`;


const ZoomHeader = styled.div`
display: flex;
align-items: center;
justify-content: flex-end;
`;

const Icon = styled.div`
cursor: pointer;
padding: 5px;
`;

const Btns = styled.div`
margin-top: 20px;
display: flex;
align-items: center;
justify-content: center;
gap: 20px;
`;

const Btn = styled.button`
padding: 10px;
border: none;
outline: none;
background-color: #F44336;
color: #fff;
border-radius: 5px;
cursor: pointer;
box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
width: 140px;

&:last-child {
    background-color: #fff;
    border: 1px solid #000;
    box-shadow: none;
    color: #000;
}
`;

export default Modal
