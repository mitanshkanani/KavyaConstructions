import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ClearIcon from "@mui/icons-material/Clear";
import db from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const FormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  gst: "",
  pincode: "",

  paymentMode: "",
  paySchedule: "",
  dueDate: "",
  latePay: "",
};

const AddVendor = ({ submitForm, show, editForm, handleEdit, formId }) => {
  const [materialForm, setMaterial] = useState(FormData);
  const [imgLinkLoc, setLinkLoc] = useState({});
  const [vendorList, setVendorlist] = useState([]);

  useEffect(() => {
    getLocations();
  }, [show, formId]);

  const locationRef = collection(db, "VendorData");
  const getLocations = async () => {
    try {
      const docRef = await getDocs(locationRef);
      const docSnap = await docRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVendorlist(docSnap);
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    try {
      const docRef = await doc(db, "VendorData", formId);
      const docSnap = await getDoc(docRef);
      const dataRef = await docSnap.data();
      if (dataRef) {
        setMaterial({
          name: dataRef.name,
          email: dataRef.email,
          phone: dataRef.phone.slice(3),
          address: dataRef.address,
          gst: dataRef.gst,
          pincode: dataRef.pincode,
          paymentMode: dataRef.paymentMode,
          paySchedule: dataRef.paySchedule,
          dueDate: dataRef.dueDate,
          latePay: dataRef.latePay,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [formId]);

  const handlerForm = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (value.length > 10) {
        return;
      }
    }

    setMaterial((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const vendorRef = collection(db, "VendorData");

  const handlerSubmit = async (e) => {
    e.preventDefault();

    if (formId) {
      const docRef = await doc(db, "VendorData", formId);
      const docSnap = await getDoc(docRef);
      const dataRef = await docSnap.data();
      const updateVendor = {
        ...materialForm,
        phone: "+91" + materialForm.phone,
      };
      if (dataRef) {
        const updateData = await updateDoc(docRef, updateVendor)
          .then((res) => {
            toast.success("Successfully Updated Vendor", {
              toastId: "success1",
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          })
          .catch((err) => {
            console.log(err);
          });

        handleEdit();
        setMaterial(FormData);
        setLinkLoc({});
      }
    } else {
      const checkerForSite = await CheckSite();
      if (checkerForSite) {
        toast.warn("Vendor Already Exist", {
          toastId: "success2",
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        try {
          const docRef = await addDoc(vendorRef, {
            name: materialForm.name,
            email: materialForm.email,
            phone: "+91" + materialForm.phone,
            address: materialForm.address,
            gst: materialForm.gst,
            pincode: materialForm.pincode,

            paymentMode: materialForm.paymentMode,
            paySchedule: materialForm.paySchedule,
            dueDate: materialForm.dueDate,
            latePay: materialForm.latePay,
            timestamp: serverTimestamp(),
          });
          if (docRef.id) {
            toast.success("Successfully Created Vendor", {
              toastId: "success1",
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
          setMaterial(FormData);
          submitForm("");
          setLinkLoc({});
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handlerExit = () => {
    setMaterial(FormData);
    setLinkLoc({});
    if (show === "addvendor") {
      submitForm();
    } else {
      handleEdit();
    }
  };

  const ClearForm = (e) => {
    e.preventDefault();
    setMaterial(FormData);
    setLinkLoc({});
    if (show === "addvendor") {
      submitForm();
    } else {
      handleEdit();
    }
  };

  const CheckSite = async () => {
    if (materialForm.name) {
      for (let i = 0; i < vendorList.length; i++) {
        if (
          vendorList[i].name.toLowerCase() === materialForm.name.toLowerCase()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <>
      {show === "addvendor" || editForm === "addvendor" ? (
        <>
          <Container>
            <Box>
              <Header>
                <div>
                  <h2>Create Vendor</h2>
                  <p>Create a vendor below</p>
                </div>

                <Icon onClick={handlerExit}>
                  <ClearIcon />
                </Icon>
              </Header>

              <Form>
                <form onSubmit={handlerSubmit}>
                  <Inputs>
                    <div>
                      <label htmlFor="name">Vendor Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter vendor name"
                        value={materialForm.name}
                        onChange={handlerForm}
                        required
                      />
                    </div>
                  </Inputs>

                  <Inputs>
                    <div>
                      <label htmlFor="email">Email</label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder=""
                        value={materialForm.email}
                        onChange={handlerForm}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="number"
                        id="phone"
                        name="phone"
                        placeholder=""
                        value={materialForm.phone}
                        maxLength="10"
                        onChange={handlerForm}
                        required
                      />
                    </div>
                  </Inputs>

                  {/* select location */}
                  <Inputs>
                    <div>
                      <label htmlFor="address">Vendor Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Enter Vendor’s address"
                        value={materialForm.address}
                        onChange={handlerForm}
                      />
                    </div>

                    <div>
                      <label htmlFor="gst">GST Registration No.</label>
                      <input
                        type="text"
                        id="gst"
                        name="gst"
                        placeholder=""
                        value={materialForm.gst}
                        onChange={handlerForm}
                      />
                    </div>
                  </Inputs>

                  <Inputs>
                    <div>
                      <label htmlFor="pincode">Pincode</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        placeholder="Enter pincode"
                        value={materialForm.pincode}
                        onChange={handlerForm}
                      />
                    </div>
                  </Inputs>

                  <div>
                    <h2>Payment Terms</h2>
                    <p>Specify payment schedule below</p>
                  </div>

                  <Inputs>
                    <div>
                      <label htmlFor="paymentMode">
                        Payment Method (optional)
                      </label>
                      <FormControl variant="standard" className="selectOtp">
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={materialForm.paymentMode}
                          onChange={handlerForm}
                          label="paymentMode"
                          name="paymentMode"
                        >
                          <MenuItem value="" disabled={true}>
                            <em disabled={true}>Select Payment Method</em>
                          </MenuItem>
                          <MenuItem value="Bank Transfer">
                            Bank Transfer
                          </MenuItem>
                          <MenuItem value="Online Payment">
                            Online Payment
                          </MenuItem>
                          <MenuItem value="Check">Check</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div>
                      <label htmlFor="paySchedule">
                        Payment Schedule (optional)
                      </label>
                      <FormControl variant="standard" className="selectOtp">
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={materialForm.paySchedule}
                          onChange={handlerForm}
                          label="paySchedule"
                          name="paySchedule"
                        >
                          <MenuItem value="" disabled={true}>
                            <em disabled={true}>Select Payment Schedule</em>
                          </MenuItem>
                          <MenuItem value="Advance payment">
                            Advance payment
                          </MenuItem>
                          <MenuItem value="Cash against delivery(CAD)">
                            Cash against delivery(CAD)
                          </MenuItem>
                          <MenuItem value="50% Advance, Balance payment after delivery">
                            50% Advance, Balance payment after delivery
                          </MenuItem>
                          <MenuItem value="30 days payment after delivery">
                            30 days payment after delivery
                          </MenuItem>
                          <MenuItem value="Partial Payment">
                            Partial Payment
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Inputs>

                  <Inputs>
                    <div>
                      <label htmlFor="dueDate">
                        Payment due date (optional)
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        onChange={handlerForm}
                        value={materialForm.dueDate}
                      />
                    </div>

                    <div>
                      <label htmlFor="latePay">Late Payment Fees</label>
                      <input
                        type="text"
                        id="latePay"
                        name="latePay"
                        placeholder=""
                        value={materialForm.latePay}
                        onChange={handlerForm}
                      />
                    </div>
                  </Inputs>

                  <Btns>
                    <button type="submit">
                      {formId ? "UPDATE" : " CREATE"}
                    </button>
                    <button onClick={ClearForm}>CANCEL</button>
                  </Btns>
                </form>
              </Form>
            </Box>
          </Container>
        </>
      ) : null}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
`;

const Box = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  /* margin: 0 auto; */
  margin-top: 20px;
  height: 95vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Icon = styled.div`
  cursor: pointer;
  padding: 5px;
  /* background-color: red; */
`;

const Form = styled.div`
  margin-top: 20px;
  form {
    display: flex;
    flex-direction: column;
    gap: 30px;

    label {
      color: rgba(0, 0, 0, 0.6);
      font-size: 15px;
      font-weight: 500;
    }

    input {
      &::placeholder {
        color: #000;
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
`;

const SelctPhoto = styled.div`
  input {
    display: none;
    text-align: center;
  }
  label {
    display: block;
    text-align: center;
  }
`;

const BgImg = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  border: 1px solid #000;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: inline-block;
    object-fit: cover;
  }
`;

const Inputs = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 20px;
  div {
    flex-basis: 100%;
  }
  input {
    width: 100%;
    padding: 10px;
    border: none;
    outline: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    margin-bottom: 10px;
  }

  select {
    border: none;
    outline: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
  }
`;

const Btns = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99;
  position: sticky;
  bottom: -10px;
  background-color: #fff;
  padding: 10px 0;

  button {
    background: #1976d2;
    padding: 10px 70px;
    border: none;
    outline: none;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    font-weight: 530;
    letter-spacing: 1.5px;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);

    &:last-child {
      background: #fff;
      color: #000;
      box-shadow: none;
      border: 1px solid #000;
    }
  }
`;

const Drag = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 80px;
  border-radius: 10px;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
  }
`;

const Checks = styled.div`
  display: flex;

  input {
    /* width: 100%; */
    padding: 10px;
    border: none;
    outline: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    /* margin-bottom: 10px; */
  }
  p {
    /* color: rgba(0,0,0,0.5); */
    margin-bottom: 10px;
  }
`;

const CheckList = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default AddVendor;
