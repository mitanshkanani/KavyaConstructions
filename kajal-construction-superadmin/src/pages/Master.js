import React, {useState} from 'react'
import styled from 'styled-components'

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import StoreIcon from '@mui/icons-material/Store';

import Sites from '../components/Sites';
import Users from '../components/Users';
import Vendors from '../components/Vendors';
import Materials from '../components/Materials';

import AddSite from '../components/AddSite';
import AddUser from '../components/AddUser';
import AddVendor from '../components/AddVendor';
import Addmaterial from '../components/Addmaterial';

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const Master = () => {
  const [show, setShow] = useState("");
  const [pages, setPages] = useState("sites")


  const submitForm = (id) => {
    if(show === id){
      setShow("")
    }
    else if(show !== id){
      setShow(id)
    }
  }


  // switch(show){
  //   case "":
  //     setShow(id)
  //     break;
  //   case id:
  //     setShow("")
  //     break;
  //   default:
  //     setShow("")


  // }

  console.log(show, "show")


  return (
    <>
    <Navbar/>
        <Container>
        <Header>
      <div>
      <h1>Master</h1>
      <p>Manage Site, Vendor, Materials & Supervisor here...</p>
      </div>

      <Navigate>
      <Btns onClick={() => submitForm("addmaterial")}>
      <PlaylistAddIcon/>
        Add Material
      </Btns>

      <Btns onClick={() => submitForm("addvendor")}>
      <PersonAddIcon />
        Add Vendor
      </Btns>

      

      <Btns onClick={() => submitForm("addsite")}>
      <AddLocationAltIcon/>
        Add Site
      </Btns>

      <Btns onClick={() => setShow("adduser")}>
      <PersonAddIcon />
        Add Supervisor
      </Btns>

    </Navigate>
    
    </Header>
    <Main>
    <MainBtns onClick={() => setPages("sites")} style={{borderBottom : pages === 'sites' ?   '2px solid #1976D2' : null, color :  pages === 'sites' ? '#1976D2' : null}}>
    <AddLocationAltIcon/>
    SITES
    </MainBtns>

    <MainBtns onClick={() => setPages("vendors")} style={{borderBottom : pages === 'vendors' ?   '2px solid #1976D2' : null, color :  pages === 'vendors' ? '#1976D2' : null}}>
    <StoreIcon/>
    VENDORS
    </MainBtns>

    <MainBtns onClick={() => setPages("material")} style={{borderBottom : pages === 'material' ?   '2px solid #1976D2' : null, color :  pages === 'material' ? '#1976D2' : null}}>
    <ViewComfyIcon/>
    MATERIALS
    </MainBtns>

    <MainBtns onClick={() => setPages("users")} style={{borderBottom : pages === 'users' ?   '2px solid #1976D2' : null, color :  pages === 'users' ? '#1976D2' : null}}>
    <PersonAddIcon />
    SUPERVISORS
    </MainBtns>
    </Main>

    {
      pages === 'sites' ? <Sites/> :  pages === 'vendors' ? <Vendors/> :  pages === 'material' ? <Materials/> : pages === 'users' ? <Users/> : <Sites/>
    }



    <AddUser submitForm={setShow} show={show}/>
    <AddSite submitForm={setShow} show={show}/>
    <Addmaterial submitForm={setShow} show={show}/>
    <AddVendor submitForm={setShow} show={show}/>


    {/* <Modal/> */}

    
    </Container>
    </>
  )
}

const Container = styled.div`
position: relative;
/* flex-basis: 100%; */
width: 100%;
padding: 20px 25px;
background-color: #F5F5F5;
/* background-color: red; */
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
`

const Btns = styled.button`
outline: none;
border: none;
background-color: #1A1A1A;
color: #fff;
display: flex;
align-items: center;
padding: 5px 10px;
border-radius: 5px;
gap: 5px;
cursor: pointer;
.MuiSvgIcon-root {
  font-size: 20px;
}
`;






const Main = styled.div`
/* padding: 10px 0; */
margin-top: 30px;
display: flex;
align-items: center;
gap: 15px;
/* background-color: #fff; */
/* box-shadow: 0 0 5px 0 rgb(0 0 0 / 10%); */
`;

const MainBtns = styled.button`
outline: none;
border: none;
background-color: transparent;
/* background-color: red; */
padding: 10px;
color: rgba(0, 0, 0, 0.6);
display: flex;
align-items: center;
gap: 5px;
font-size: 13px;
letter-spacing: 1px;
font-weight: 600;
border-bottom: 2px solid transparent;
transition: all 0.3s ease-in-out;
/* color: #1976D2; */
/* border-bottom: 2px solid #1976D2; */
svg {
  font-size: 20px;

}
`
export default Master