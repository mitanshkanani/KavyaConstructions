import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../components/Box";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import db from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Invoice } from "./Invoice";

const options = [2023, 2022, 2021, 2020];

const Analytics = () => {
  const [vendorList, setVendorList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const vendorRef = collection(db, "VendorData");
      const userRef = collection(db, "LoginPhones");
      const siteRef = collection(db, "SiteData");
      const materialRef = collection(db, "MaterialData");

      try {
        const vendorQuery = await getDocs(vendorRef);
        const userQuery = await getDocs(userRef);
        const siteQuery = await getDocs(siteRef);
        const materialQuery = await getDocs(materialRef);
        setMaterialList(
          materialQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setSiteList(
          siteQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setUserList(
          userQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setVendorList(
          vendorQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  // console.log(vendorList, "vendorList");
  // console.log(materialList, "materialList");

  return (
    <>
      <TotalSection>
        <Box
          title="Total Sites"
          lgth={siteList}
          icon="/assets/site-analytics.svg"
        />
        <Box
          title="Total Vendors"
          lgth={vendorList}
          icon="/assets/vendor-analytics.svg"
        />
        <Box
          title="Total Materials"
          lgth={materialList}
          icon="/assets/material-analytics.svg"
        />
        <Box
          title="Total Users"
          lgth={userList}
          icon="/assets/user-analytics.svg"
        />
      </TotalSection>

      <ProfitSection>
        {/* <Revenue>
          <h4>REVENUE</h4>
          <CurrentData>
            <div>
              <p>Current Revenue</p>
              <Data>
                <h3>$6,300.10</h3>
                <Rate>
                  <SouthEastIcon />
                  <h5>24%</h5>
                </Rate>
              </Data>
            </div>
            <select name="" id="">
              {options.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </select>
          </CurrentData>
          <Chart>
            <img src="/assets/bar.png" alt="" />
          </Chart>
        </Revenue> */}
        <Invoice />
      </ProfitSection>
    </>
  );
};

const TotalSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 40px;
`;

const ProfitSection = styled.div`
  display: grid;
  /* grid-template-columns: repeat(2, minmax(0, 1fr)); */
  gap: 20px;
  margin-top: 20px;
`;

const Revenue = styled.div`
  /* border: 1px solid #A3A3A3; */
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 15px;
  height: 350px;
  h4 {
    color: #909090;
    font-size: 20px;
  }
`;

const CurrentData = styled.div`
  padding: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    color: #000;
    font-size: 25px;
  }

  select {
    background-color: #fff;
    border: 1px solid #909090;
    outline: none;
    padding: 5px 10px;
    border-radius: 3px;
  }
`;

const Data = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const Rate = styled.div`
  background-color: #ffbaba;
  padding: 5px 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  color: #f44336;
  font-size: 600;
  h5 {
    font-size: 15px;
    font-weight: 600;
  }
`;

const Chart = styled.div`
  width: 100%;
  height: 200px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: inline-block;
  }
`;

export default Analytics;
