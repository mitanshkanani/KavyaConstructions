import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ClearIcon from "@mui/icons-material/Clear";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import db from "../firebase";

const Viewmore = ({ modal, handlerDetails, details }) => {
  const [zoom, setZoom] = useState("");

  const [dataId, setID] = useState({});
  const getData = async () => {
    try {
      const docRef = await doc(db, "FormData", details);
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

  useEffect(() => {
    const handlerESC = (event) => {
      var name = event.key;
      var code = event.code;
      if (code === "Escape") {
        setZoom("");
      }
    };
    document.addEventListener("keydown", handlerESC);

    return () => {
      document.removeEventListener("keydown", handlerESC);
    };
  }, []);

  const handlerExit = () => {
    handlerDetails();
    // setID({})
    // setZoom('')
  };

  const handlerImg = (imgName) => {
    setZoom(imgName);
    console.log("clicked");
  };

  const handlerZoomOut = () => {
    setZoom("");
  };

  // console.log(dataId, "dataId");
  return (
    <>
      {modal === "open" && (
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

            <Files>
              {dataId?.capturedImage ? (
                <BgImg onClick={() => handlerImg(dataId.capturedImage)}>
                  <img src={dataId?.capturedImage} alt="img1" />
                </BgImg>
              ) : (
                "No Image"
              )}

              <BgVid>
                {dataId.capturedVideo && (
                  <video muted controls>
                    <source
                      src={dataId.capturedVideo}
                      type="video/mp4"
                      alt="dsvc"
                    />
                  </video>
                )}
              </BgVid>

              {dataId?.capturedTruckImage ? (
                <BgImg onClick={() => handlerImg(dataId.capturedTruckImage)}>
                  <img src={dataId?.capturedTruckImage} alt="img1" />
                </BgImg>
              ) : (
                "No Image"
              )}
            </Files>

            <Details>
              <h2>General Site Details</h2>
              <div>
                <Left>
                  <p>
                    Site Name:- <span>{dataId.unloadedAt}</span>
                  </p>
                  <p>
                    Quantity:- <span>{dataId.quantity}</span>
                  </p>

                  <p>
                    Vendor:- <span>{dataId.vendorName}</span>
                  </p>
                  <p>
                    TotalAmount(Rs.):-{" "}
                    <span>
                      {Math.round(
                        parseFloat(dataId?.price) * parseFloat(dataId?.quantity)
                      )}
                    </span>
                  </p>
                  <p>
                    Unloaded at?:- <span>{dataId.unloadedAt}</span>
                  </p>
                </Left>
                <Right>
                  <p>
                    Material Category:- <span>{dataId.materialType}</span>
                  </p>
                  <p>
                    Quality:- <span>{dataId.quality}</span>
                  </p>
                  <p>
                    Unloaded by:- <span>{dataId.unloadedBy}</span>
                  </p>
                  <p>
                    Challan Number:- <span>{dataId?.challanNumber}</span>
                  </p>
                  <p>
                    Measurement:- <span>{dataId?.measurement}</span>
                  </p>
                </Right>
              </div>
            </Details>

            <Details>
              <h2>Truck Details</h2>
              <div>
                <Left>
                  <p>
                    Truck Number:- <span>{dataId.truckNumber}</span>
                  </p>
                  <p>
                    Driver Name :- <span>{dataId.driverName}</span>
                  </p>
                </Left>
                <Right>
                  {/* <p>Delivery Time:- <span>{new Date(dataId.deliveryTime)}</span></p>
        <p>Delivery Date:- <span>{new Date(dataId.deliveryTime)}</span></p> */}
                </Right>
              </div>
            </Details>

            <Details>
              <h2>Accepted Checklist of Cement Material</h2>
              <div>
                <Left>
                  {dataId?.checklistQuestions?.map((item, index) => (
                    <h4 key={index} style={{ color: "rgba(0,0,0,0.5)" }}>
                      {item.question}{" "}
                      <span
                        style={{ color: "rgba(0,0,0,1)", fontWeight: "bold" }}
                      >
                        {item.answer}
                      </span>
                    </h4>
                  ))}
                </Left>
              </div>
            </Details>

            <Remarks>
              <h2>Remarks</h2>
              <p>
                Materials were in good condition, but some of stuff were
                missing.
              </p>
            </Remarks>
          </Box>
        </Container>
      )}

      {zoom && (
        <ZoomContainer>
          <Zoom>
            <ZoomHeader>
              <Icon onClick={handlerZoomOut}>
                <ClearIcon />
              </Icon>
            </ZoomHeader>

            <ZoomImg>
              <img src={zoom} alt="" />
            </ZoomImg>
          </Zoom>
        </ZoomContainer>
      )}
    </>
  );
};

const Remarks = styled.div`
  padding: 20px 0;
  padding-bottom: 0;
  p {
    color: #808080;
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
  max-width: 700px;
  padding: 20px;
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

const Files = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 20px; */
  margin: 10px 0;
`;

const BgImg = styled.div`
  width: 100%;
  max-width: 150px;
  height: 150px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;

  img {
    cursor: pointer;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    display: inline-block;
  }
`;

const BgVid = styled.div`
  width: 100%;
  max-width: 250px;
  height: 150px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
  overflow: hidden;
  /* border-radius: 5px; */

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* display: inline-block; */
  }
`;

const Details = styled.div`
  /* margin-top: 20px; */
  padding: 30px 0;
  /* background-color: red; */
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  h2 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #333333;
  }
  > div {
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
  }
`;

const Left = styled.div`
  /* padding-top: 10px; */
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
    font-weight: 500;
  }
`;

const Right = styled.div`
  /* padding-top: 10px; */
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
    font-weight: 500;
  }
`;

const Sign = styled.div`
  padding: 30px 0;
  padding-bottom: 0;
  h2 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #333333;
  }
`;

const Signature = styled.div`
  width: 100%;
  max-width: 300px;
  height: 150px;
  border-radius: 5px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 5px;
    display: inline-block;
  }
`;

const ZoomContainer = styled.div`
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

const Zoom = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 550px;
  /* height: 400px; */
  position: fixed;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const ZoomHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ZoomImg = styled.div`
  width: 100%;
  height: 500px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: inline-block;
  }
`;
export default Viewmore;
