import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import db from "../firebase"
import {collection, onSnapshot, orderBy, query} from "firebase/firestore"

import Addmaterial from './Addmaterial';


import {SetModal} from "../features/modalSlice"
import {useDispatch} from "react-redux"
import { useSelector } from 'react-redux';
import {selectType} from "../features/modalSlice"

import Modal from './Modal';

import { useTable } from 'react-table'



const Sites = () => {
const modalType = useSelector(selectType)
console.log(modalType, 'modalType')
const [Materials, setMaterilas] = useState([]);
const [modal, setModal] = useState('close');
const [formData, setFrom] = useState('')
const [sort, setSort] = useState('')

const dispatch = useDispatch()
const [arrList, setArrList] = useState(0)
const [editForm, setEdit] = useState('')
const [formId, setFormId] = useState('')


const siteRef = query(collection(db, "MaterialData") , orderBy('createdAt', "desc"))
  const getData = async() => {
    try{
      const docRef = await onSnapshot(siteRef, (querySnapshot) => {
        console.log(querySnapshot.docs)
        setMaterilas(querySnapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))) 
      })

    } catch(err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getData()
    console.log('called')
  }, [])




  //table

  const data = React.useMemo(
    () => [
      {
        col1: 'Hello',
        col2: 'World',
      },
      {
        col1: 'react-table',
        col2: 'rocks',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
    ],
    []
  )
const columns = React.useMemo(
  () => [
    {
      Header: 'Photo OF Material',
      accessor: 'materialimg', // accessor is the "key" in the data
    },
    {
      Header: 'Material',
      accessor: 'materialname',
    },
    {
      Header: 'Unit of Measurement',
      accessor: 'unit',
    },
  ],
  []
)


const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
} = useTable({ columns, data })


const [currentPage, setCurrentPage] = useState(1);
const [postsPerPage, setPostsPerPage] = useState(5);

// 3
//0 
//0, 3
//6 = 3 = (3, 6)
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const Posts = Materials.slice(indexOfFirstPost, indexOfLastPost);



  const prev = (arrLen) => {
    if(currentPage > 1){
      setCurrentPage(currentPage - 1)
      setArrList((prev) => prev - 5)
    }
  }
  
  
  const next = (arrLen) => {
    if(currentPage < Math.ceil(Materials.length / postsPerPage)){
      setCurrentPage(currentPage + 1)
      setArrList((prev) => prev + 5)
    }

  }


  

  const handlerForm = (e) => {
   console.log(e.target.value)
   setFrom(e.target.value)
  }


  const handlerSort = (e) => {
    console.log(e.target.value)
    setSort(e.target.value)
    const sort = e.target.value
    if(sort === 'all'){
      getData()
    }
    else if(sort !== ''){
      const sorted = Materials.sort((a, b) => {
        return a[sort].toLowerCase() < b[sort].toLowerCase() ? -1 : 1
      })
      console.log(sorted, 'sorted')
      setMaterilas(sorted)
    }
  }


  const handlEdit = (formId) => {
    // setEdit("addsite")
    switch(editForm){
      case 'addmaterial':
        setEdit('')
        setFormId('')
        break;
      case '':
        setFormId(formId)
        setEdit('addmaterial')
        break;
      default:
        setEdit('')
        setFormId('')
    }
  }


  const handlerDelete = async (id) => {
    dispatch(
      SetModal({
        type : "material",
        dbName : "MaterialData",
        id : id
      })
    )


  }



  console.log(Materials) 
  return (
   <>
     <SitePage>
    <SearchField>
    <div>
        <h2>Material Data Table</h2>
        <p>Overview of all Materials</p>
    </div>
    <div>

    <Fields>
      <label htmlFor="">Search</label>
      <input type="text" placeholder='Search...' value={formData} onChange={handlerForm}/>
    </Fields>

    <Fields>
      <label htmlFor="">Sort by</label>
      <select name='' id=''  onChange={handlerSort} value={sort}>
      <option value='' disabled>Select Field</option>
        <option value='materialName'>Material</option>
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
        <th>Photo of Material</th>
          <th>Material Name</th>
          <th>Unit of Measurement</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {
          Posts.filter((item) => 
            formData == null || formData == "" ? item : item.materialName?.toLowerCase().includes(formData.toLowerCase())
          ).map((item, index) => {
            return (
              <tr key={index}>
                <td>{arrList + index + 1}</td>
                <td>
                <BgImg>
            <img src={item?.materialImage} alt="img1" />
            </BgImg>
                </td>
                <td>{item?.materialName}</td>
                <td>{item?.materialUnit}</td>
                <td>
                  
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
      <p>{indexOfFirstPost + 1} - {indexOfLastPost} of {Materials.length}</p>
        <button onClick={() => prev(Posts.length)}>
        <NavigateBeforeIcon/>
        </button>
        <button onClick={() => next(Posts.length)}>
        <NavigateNextIcon/>
        </button>
      </PageMove>
    </Pagination>
    </SitePage>

     
    <Addmaterial editForm={editForm} handlEdit={handlEdit} formId={formId}/>

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
  /* border-collapse: collapse; */
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

position: relative;
width: 72px;
height: 72px;
overflow: hidden;
border-radius: 4px;
margin: 0 auto;
box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: inline-block;
}
`;

export default Sites
