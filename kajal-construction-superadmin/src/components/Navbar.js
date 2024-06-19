import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { isSuperAdmin } from "../constants/helpers";

const navData = [
  {
    id: 1,
    title: "Dashboard",
    path: "/",
    icon: <AutoAwesomeMosaicIcon />,
  },
  {
    id: 2,
    title: "Master",
    path: "/master",
    icon: <PersonIcon />,
  },
  {
    id: 3,
    title: "Rate",
    path: "/rates",
    icon: <AutoAwesomeMosaicIcon />,
  },
  {
    id: 4,
    title: "Abstract",
    path: "/abstract",
    icon: <PersonIcon />,
  },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUserSuperAdmin = isSuperAdmin();

  const handleLogout = () => {
    signOut(auth)
      .then((res) => {
        console.log(res, "res");
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  return (
    <>
      <Container>
        <Logo>
          <img src="/assets/kajal-logo.jpeg" alt="logo" />
        </Logo>
        <Nav>
          <NavList>
            {navData.map((item) => {
              return (
                <NavItem key={item.id}>
                  <Link
                    to={item.path}
                    className={
                      location.pathname === item.path ? "active" : null
                    }
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </NavItem>
              );
            })}
          </NavList>
        </Nav>

        <Profile>
          <h3>{isUserSuperAdmin ? "Pankaj Thakkar" : "Admin"}</h3>
          <p>kajalconstruction@gmail.com</p>

          <Settings>
            <button>
              <Link to="/settings">
                <SettingsIcon />
              </Link>
            </button>

            <button onClick={handleLogout}>
              <LogoutIcon />
            </button>
          </Settings>
        </Profile>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 20%;
  background-color: #fff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d9d7d7;
`;

const Logo = styled.div`
  width: 150px;
  height: 80px;
  text-align: center;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: inline-block;
  }
`;

const Nav = styled.nav`
  display: flex;
  margin-top: 25px;
  justify-content: center;
`;

const NavList = styled.ul`
  list-style: none;
  text-align: center;
`;

const NavItem = styled.li`
  padding: 10px 0;
  width: 200px;
  text-align: center;
  a {
    text-decoration: none;
    text-align: center;
    color: #808080;
    border-radius: 10px;
    padding: 15px 30px;
    text-align: center;
    display: flex;
    align-items: center;
    font-size: 15px;
    transition: all 0.3s ease-in-out;
  }
  .MuiSvgIcon-root {
    margin-right: 10px;
    font-size: 18px;
  }

  img,
  svg {
    color: #808080;
  }
`;

const Profile = styled.div`
  width: 100%;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  margin-bottom: 0;
  justify-content: flex-end;

  h3 {
    color: #1a1a1a;
    font-size: 22px;
  }
  p {
    color: #808080;
    margin: 5px;
    font-size: 15px;
  }
`;

const Settings = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  a {
    color: #1a1a1a;
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;

    transition: all 0.3s ease-in-out;
  }
`;

export default Navbar;
