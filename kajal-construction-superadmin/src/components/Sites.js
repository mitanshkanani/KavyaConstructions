import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import db from "../firebase"
import {collection, onSnapshot, deleteDoc, doc, getDocs, query, orderBy, limit, startAt, startAfter, endAt, endBefore} from "firebase/firestore"

import Details from '../components/Details';

import AddSite from './AddSite';

import {SetModal} from "../features/modalSlice"
import {useDispatch} from "react-redux"
import { useSelector } from 'react-redux';
import {selectType} from "../features/modalSlice"

import Modal from './Modal';


const Sites = () => {
const modalType = useSelector(selectType)
console.log(modalType, 'modalType')
const [sites, setSites] = useState([]);
const [modal, setModal] = useState('');
const [formData, setFrom] = useState('')
const [details, setDetails] = useState('')
const [sort, setSort] = useState('')

const [editForm, setEdit] = useState('')
const [formId, setFormId] = useState('')
const [arrList, setArrList] = useState(0)

const dispatch = useDispatch()



const siteRef = query(collection(db, "SiteData") , orderBy('timestamp', "desc"))
  const getData = async() => {
    try{
      const docRef = await onSnapshot(siteRef, (querySnapshot) => {
        setSites(querySnapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))) 
      })

    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getData()
    // console.log('called')
  }, [])

  useEffect(() => {
    const handlerESC = (event) => {
        var name = event.key;
        var code = event.code;
        if(code === "Escape"){
          setDetails('')
          setModal('') 
        }
    }
    document.addEventListener('keydown', handlerESC);

    return () => {
        document.removeEventListener('keydown', handlerESC);
      }
}, [])

           


const [currentPage, setCurrentPage] = useState(1);
const [postsPerPage, setPostsPerPage] = useState(5);



const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const Posts = sites.slice(indexOfFirstPost, indexOfLastPost);




  const handlerForm = async (e) => {
    // console.log(e.target.value)
    setFrom(e.target.value)
  }



  const handlerDelete = async (id) => {
    dispatch(
      SetModal({
        type : "site",
        dbName : "SiteData",
        id : id
      })
    )


    // const docRef =  doc(db, "SiteData", id);
    // try {
    //   const deleteRef = await deleteDoc(docRef)
    //   // console.log(deleteRef, 'deleted')

    // } catch (error) {
    //   // console.log(error)
    // }

  }


  const prev = (arrLen) => {
    if(currentPage > 1){
      setCurrentPage(currentPage - 1)
      setArrList((prev) => prev - 5)
    }
  }
  
  
  const next = (arrLen) => {
    if(currentPage < Math.ceil(sites.length / postsPerPage)){
      setCurrentPage(currentPage + 1)
      setArrList((prev) => prev + 5)
    }

  }


 
  

  const handlerDetails = (id) => {
    switch(modal) {
      case 'SiteData':
        setDetails('')
        setModal('') 
        break;
      case '':
        setDetails(id)
        setModal('SiteData')
        break;
      default:
        setModal('')
    }
  }


  const handlerSort = (e) => {
    // console.log(e.target.value)
    setSort(e.target.value)
    const sort = e.target.value
    if(sort === 'all'){
      getData()
    }
    else if(sort !== ''){
      const sorted = sites.sort((a, b) => {
        return a[sort].toLowerCase() < b[sort].toLowerCase() ? -1 : 1
      })
      // console.log(sorted, 'sorted')
      setSites(sorted)
    }
  }


  const handlEdit = (formId) => {
    // setEdit("addsite")
    switch(editForm){
      case 'addsite':
        setEdit('')
        setFormId('')
        break;
      case '':
        setFormId(formId)
        setEdit('addsite')
        break;
      default:
        setEdit('')
        setFormId('')
    }
  }



  // console.log(sites, 'sites') 
  return (
   <>
     <SitePage>
    <SearchField>
    <div>
        <h2>Site Data Table</h2>
        <p>Overview of Sites</p>
    </div>
    <div>

    <Fields>
      <label htmlFor="">Search</label>
      <input type="text" placeholder='Search...' value={formData} onChange={handlerForm}/>
    </Fields>

    <Fields>
      <label htmlFor="">Sort by</label>
      <select name='' id='' onChange={handlerSort} value={sort}>
      <option value="" disabled>Select Field</option>
        <option value='name'>Site Name</option>
        <option value="description">Site Location</option>
        <option value='all'>All</option>
      </select>
    </Fields>


    </div>
    </SearchField>

    <Table>
    <table>
      <thead>
        <tr>
        <th>Sr. No.</th>
        <th>Site Image</th>
          <th>Site Name</th>
          <th>Site Location</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {
          Posts.filter((item) => 
          formData == null || formData == "" ? item : item.name?.toLowerCase().includes(formData.toLowerCase())
          ).map((item, index) => {
            return (
              <tr key={index}>
                <td>{arrList +  index + 1}</td>
                <td>
                <BgImg>
                  <img src={item.imgShared} alt="" />
                </BgImg>
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
          <button onClick={() => handlerDetails(item.id)}>
          <VisibilityIcon/>
          </button>
          <button onClick={() => handlEdit(item.id)}>
            <EditIcon/>
          </button>
            <button style={{color : "#F44336"}} onClick={() => handlerDelete(item.id)}>
            <DeleteOutlinedIcon/>
            </button>
          </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
    </Table>

    <Pagination>
      <SelectPage>
        Rows per page: {Posts.length}
        {/* <ArrowDropDownIcon/> */}
      </SelectPage>

      <PageMove>
        <p>{indexOfFirstPost + 1} - {indexOfLastPost} of {sites.length}</p>

        <button onClick={() => prev(Posts.length)}>
        <NavigateBeforeIcon/>
        </button>
        <button onClick={() => next(Posts.length)}>
        <NavigateNextIcon/>
        </button>
      </PageMove>
    </Pagination>
    </SitePage>

    <AddSite editForm={editForm} handlEdit={handlEdit} formId={formId}/>
    <Details details={details} handlerDetails={handlerDetails} modal={modal}/>

    {
      modalType &&  <Modal/>
    }

   </>
  )
}





const SitePage = styled.div`
padding: 20px 10px;
background-color: #fff;
/* margin-top: 20px; */
box-shadow: 0 0 5px 0 rgb(0 0 0 / 10%);
overflow: hidden;
`;

const SearchField = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
gap: 10px;

> div {
    &:last-child {
        display: flex;
    align-items: center;
    }
}
`;

const Fields = styled.div`
display: flex;
flex-direction: column;
width: 200px;
/* max-width: 450px; */
position: relative;
margin-right: 15px;
input {
width: 100%;
  padding: 10px; 
  outline: none;
  border: 1px solid rgba(0,0,0,0.3);
  &::placeholder { 
    color: #000;
  }
}
input, select {
  height: 35px;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 5px;
}
label {
  position: absolute;
  background-color: #fff;
  font-size: 13px;
  left: 10px;
  top: -12px;
  padding: 3px;
  color: #666666;
}
select, option {
  padding-right: 50px;
}



`;


const Table = styled.div`
margin-top: 20px;
table {

  table-layout: fixed;
    width: 100%;
}
th, td {
  border-bottom: 1px solid rgba(0,0,0,0.15);
  padding: 10px 0;
  text-align: center;  
}
th {
  text-align: center;
  color: #000;
}
td {
  color: rgba(0,0,0,1);
}
button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    margin-right: 10px;
    color: #909090;
    svg {
        font-size: 18px;
        /* color: #909090; */
    }
}
`;


const Pagination = styled.div`
display: flex;
align-items: center;
justify-content: flex-end;
gap: 30px;
margin-top: 5px;
`;

const SelectPage = styled.div`
display: flex;
align-items: center;
justify-content: center;

.MuiSvgIcon-root {
  color: rgba(0,0,0,0.5);
  font-size: 30px;
}
`;

const PageMove = styled.div`
display: flex;
align-items: center;
gap: 5px;
/* background-color: red; */


button {
display: flex;
align-items: center;
justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  color: rgba(0,0,0,0.5);
  font-size: 20px;
  /* background-color: red; */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  &:hover {
    background-color: rgba(0,0,0,0.1);
  }

}
.MuiSvgIcon-root {
  color: rgba(0,0,0,0.5);
  font-size: 22px;
}
`;



const BgImg = styled.div`
margin: 0 auto;
position: relative;
width: 50px;
height: 50px;
overflow: hidden;
border-radius: 50%;

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: inline-block;
}
`;

export default Sites
