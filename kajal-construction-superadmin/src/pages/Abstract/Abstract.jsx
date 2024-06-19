import React from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import { isSuperAdmin } from "../../constants/helpers";

function Abstract() {
  const isUserSuperAdmin = isSuperAdmin();

  return (
    <>
      <Navbar />
      <Container>
        <HeaderWrapper>
          <h1>Abstract</h1>
        </HeaderWrapper>
        <SubContainer>
          {isUserSuperAdmin ? (
            <iframe
              style={{ height: "calc(100vh - 120px)" }}
              title="Excel Viewer"
              width="100%"
              frameBorder="0"
            ></iframe>
          ) : (
            <h3>You do not have access rights</h3>
          )}
        </SubContainer>
      </Container>
    </>
  );
}

export default Abstract;

const Container = styled.div`
  position: relative;
  width: 100%;
  background-color: #f5f5f5;
  padding: 20px 25px;
`;

const HeaderWrapper = styled.div`
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

const SubContainer = styled.div`
  margin: 30px 0px;
  background-color: #ffff;
`;
