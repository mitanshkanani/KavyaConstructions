import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TuneIcon from "@mui/icons-material/Tune";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Operations from "../components/Operations/Operations";
import Analytics from "../components/Analytics";

const Home = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [pages, setPages] = useState("operations");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Container>
        <Header>
          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome,{" "}
              {currentUser === "kajalconstruction@gmail.com"
                ? "Pankaj"
                : "Admin"}
            </p>
          </div>
        </Header>

        <Main>
          <MainBtns
            onClick={() => setPages("operations")}
            style={{
              borderBottom: pages === "operations" ? "2px solid #1976D2" : null,
              color: pages === "operations" ? "#1976D2" : null,
            }}
          >
            <TuneIcon />
            OPERATIONS
          </MainBtns>

          <MainBtns
            onClick={() => setPages("analytics")}
            style={{
              borderBottom: pages === "analytics" ? "2px solid #1976D2" : null,
              color: pages === "analytics" ? "#1976D2" : null,
            }}
          >
            <EqualizerIcon />
            ANALYTICS
          </MainBtns>
        </Main>

        {pages === "operations" ? <Operations /> : <Analytics />}
      </Container>
    </>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  background-color: #f5f5f5;
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

const Main = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MainBtns = styled.button`
  outline: none;
  border: none;
  background-color: transparent;
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
  svg {
    font-size: 20px;
  }
`;

export default Home;
