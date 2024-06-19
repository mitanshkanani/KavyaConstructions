import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ClearIcon from "@mui/icons-material/Clear";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import db from "../firebase";

const Details = ({ modal, details, handlerDetails }) => {
  const [dataId, setID] = useState({});
  const getData = async () => {
    try {
      const docRef = await doc(db, modal, details);
      const docSnap = await getDoc(docRef);
      const dataRef = await docSnap.data();
      setID(dataRef);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [details]);

  const handlerExit = () => {
    handlerDetails();
    setID({});
  };

  return (
    <>
      {modal === "SiteData" ? (
        <>
          <Container>
            <Box>
              <Header>
                <div>
                  <h2>JWR-Hazardous</h2>
                  <p>Site Data OverView</p>
                </div>
                <Icon onClick={handlerExit}>
                  <ClearIcon />
                </Icon>
              </Header>

              <Imgs>
                <div>
                  <img src={dataId?.imgShared} alt="" />
                </div>
              </Imgs>

              <GeneralDetails>
                <h2>General Site Details</h2>
                <div>
                  <Left>
                    <p>
                      Site Name:- <span>{dataId?.name}</span>{" "}
                    </p>
                    <p>
                      Site Location:- <span>{dataId?.description}</span>{" "}
                    </p>
                    <p>
                      Pincode :- <span>{dataId?.pincode}</span>
                    </p>
                  </Left>
                  <Right>
                    <p>
                      Start Date:- <span>{dataId?.startDate}</span>{" "}
                    </p>
                    <p>
                      End Date:- <span>{dataId?.endDate}</span>{" "}
                    </p>
                  </Right>
                </div>
              </GeneralDetails>

              <GeneralDetails>
                <div>
                  <Left>
                    <p>
                      Project Budget:- <span>{dataId?.budget}</span>{" "}
                    </p>
                  </Left>

                  <Right>
                    <p>
                      Permits Required:- <span>{dataId?.permits}</span>{" "}
                    </p>
                  </Right>
                </div>
              </GeneralDetails>
            </Box>
          </Container>
        </>
      ) : modal === "VendorData" ? (
        <>
          <Container>
            <Box>
              <Header>
                <div>
                  <h2>Vendor Details</h2>
                  <p>Vendor Data OverView</p>
                </div>
                <Icon onClick={handlerExit}>
                  <ClearIcon />
                </Icon>
              </Header>

              <GeneralDetails>
                <div>
                  <Left>
                    <p>
                      Vendor Name:- <span>{dataId?.name}</span>
                    </p>

                    <p>
                      Phone Number:- <span>{dataId?.phone}</span>
                    </p>

                    <p>
                      GST Reg. No.:- <span>{dataId?.gst}</span>
                    </p>
                  </Left>
                  <Right>
                    <p>
                      Email:- <span>{dataId?.email}</span>
                    </p>
                    <p>
                      Address:- <span>{dataId?.address}</span>
                    </p>
                  </Right>
                </div>
              </GeneralDetails>

              <GeneralDetails>
                <h2>Payment Details</h2>
                <div>
                  <Left>
                    <p>
                      Payment Method:- <span>{dataId?.paymentMode}</span>
                    </p>
                    <p>
                      Payment Due date:- <span>{dataId?.dueDate}</span>
                    </p>
                  </Left>
                  <Right>
                    <p>
                      Payment Schedule:- <span>{dataId?.paySchedule}</span>
                    </p>
                    <p>
                      Late Payment Fees:- <span>{dataId?.latePay}</span>
                    </p>
                  </Right>
                </div>
              </GeneralDetails>
            </Box>
          </Container>
        </>
      ) : modal === "LoginPhones" ? (
        <>
          <Container>
            <Box>
              <Header>
                <div>
                  <h2>Supervisor Data</h2>
                  <p>Supervisor Data OverView</p>
                </div>
                <Icon onClick={handlerExit}>
                  <ClearIcon />
                </Icon>
              </Header>
              <Imgs>
                <div>
                  <img src={dataId?.profileImg} alt="" />
                </div>
              </Imgs>
              <GeneralDetails>
                <div>
                  <Left>
                    <p>
                      User name:- <span>{dataId?.name}</span>
                    </p>
                    <p>
                      Location : <span>{dataId?.SiteLocation}</span>
                    </p>
                    <p>
                      Phone no.:- <span>{dataId?.phoneNumber}</span>
                    </p>
                    <p>
                      Shift Timing:- <span>{dataId?.shift}</span>
                    </p>
                    <p>
                      Email:- <span>{dataId?.email}</span>
                    </p>
                    <p>
                      Addres:- <span>{dataId?.address}</span>
                    </p>
                    <p>
                      Date Of Birth:- <span>{dataId?.dob}</span>
                    </p>
                    <p>
                      Gender:- <span>{dataId?.gender}</span>
                    </p>
                  </Left>
                  <Right>
                    <p>
                      Education Qualifications:-{" "}
                      <span>{dataId?.education}</span>
                    </p>
                    <p>
                      Blood Group:- <span>{dataId?.blood}</span>
                    </p>
                    <p>
                      Document:- <span>{dataId?.document}</span>
                    </p>
                    <p>
                      Emergency Contact:-{" "}
                      <span>{dataId?.emergencyContact}</span>
                    </p>
                  </Right>
                </div>
              </GeneralDetails>
            </Box>
          </Container>
        </>
      ) : null}
    </>
  );
};

const Material = styled.div`
  > div {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    p {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
    }
    span {
      color: #808080;
    }
  }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Box = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 650px;
  padding: 30px;
  /* height: 100%; */
  max-height: 700px;
  overflow-y: auto;
  /* border-radius: 5px; */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Icon = styled.div`
  cursor: pointer;
  padding: 5px;
`;

const Imgs = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  margin-top: 30px;
  padding-bottom: 30px;
  /* border-bottom: 1px solid  #CCCCCC; */
  > div {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      display: inline-block;
    }

    &:nth-child(2) {
      margin-left: 100px;
    }
  }
`;

const Description = styled.div`
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  /* margin: 10px 0; */
`;

const GeneralDetails = styled.div`
  margin: 10px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #cccccc;
  h2 {
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
  }

  > div {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
`;

const MaterialDetails = styled.div`
  h2 {
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
  }
  margin: 10px 0;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: 60px;
  row-gap: 30px;
  border-bottom: 1px solid #cccccc;
`;

const PaymentDetails = styled.div`
  /* display: flex;
align-items: center; */
  border-bottom: 1px solid #737272;
  padding-bottom: 15px;
  h2 {
    font-size: 24px;
  }

  > div {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
  }
`;

const Left = styled.div`
  position: relative;
  width: 50%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  p {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
  }
  span {
    color: #808080;
  }
`;

const Right = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  p {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
  }
  span {
    color: #808080;
  }
`;

const Vehicals = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #737272;
  h2 {
    font-size: 24px;
  }
  > div {
    display: flex;
    justify-content: space-between;
  }
`;

const Driver = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #737272;
  h2 {
    font-size: 24px;
  }
  > div {
    display: flex;
    justify-content: space-between;
  }
`;
export default Details;
