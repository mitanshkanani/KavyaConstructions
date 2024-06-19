import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ClearIcon from "@mui/icons-material/Clear";
import { addRateData } from "../../Backend/addDataToFirebase";
import { updateRateData } from "../../Backend/updateOperations";
import { getVendors } from "../../Backend/getDataFromFirebase";

const initialData = {
  itemName: "",
  uom: "",
  rate: "",
  vendorName: "",
  contactNumber: "",
  address: "",
  gstNumber: "",
  gst: "",
  description: "",
  location: "",
  updatedDate: "",
};

const AddRate = ({ show, editDetails, handleClose }) => {
  const [formData, setFormData] = useState(initialData);
  const [vendors, setVendors] = React.useState([]);

  useEffect(() => {
    if (editDetails) setFormData(editDetails);
  }, [editDetails]);

  React.useEffect(() => {
    (async () => {
      const res = await getVendors();
      setVendors(res);
    })();
  }, []);

  const handlerForm = (e) => {
    const { name, value } = e.target;

    if (name === "vendorName") {
      const vendorData = vendors.find(({ name }) => name === value);
      setFormData((prev) => ({
        ...prev,
        vendorName: vendorData?.name || "",
        contactNumber: vendorData?.phone || "",
        address: vendorData?.address || "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlerSubmit = async (e) => {
    const payloadData = {
      ...formData,
      updatedDate: new Date(),
    };

    e.preventDefault();
    if (!formData?.id) {
      const { status } = await addRateData(payloadData);
      if (status === 200) handleClose();
    } else {
      const { status } = await updateRateData(payloadData);
      if (status === 200) handleClose();
    }
  };

  return show ? (
    <Container>
      <Box>
        <Header>
          <h2>{!formData?.id ? "Add" : "Update"} Rate</h2>
          <Icon onClick={handleClose}>
            <ClearIcon />
          </Icon>
        </Header>
        <Form>
          <form onSubmit={handlerSubmit}>
            <Inputs>
              <div>
                <label htmlFor="itemName">Item Name *</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  placeholder="Enter item name"
                  value={formData.itemName}
                  onChange={handlerForm}
                  required
                />
              </div>
              <div>
                <label htmlFor="uom">UOM *</label>
                <input
                  type="text"
                  id="uom"
                  name="uom"
                  placeholder="Enter Unit of Measurement"
                  value={formData.uom}
                  onChange={handlerForm}
                  required
                />
              </div>
            </Inputs>
            <Inputs>
              <div>
                <label htmlFor="rate">Rate *</label>
                <input
                  type="text"
                  id="rate"
                  name="rate"
                  placeholder="Enter Rate"
                  value={formData.rate}
                  onChange={handlerForm}
                  required
                />
              </div>
              <div>
                <label htmlFor="vendorName">Vendor Name *</label>
                <select
                  id="vendorName"
                  name="vendorName"
                  value={formData?.vendorName}
                  onChange={handlerForm}
                  placeholder="Enter Vendor Number"
                  required
                >
                  <option value={""}></option>
                  {vendors?.map(({ id, name }) => (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </Inputs>
            <Inputs>
              <div>
                <label htmlFor="gstNumber">GST Number</label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  placeholder="Enter GST Number"
                  value={formData.gstNumber}
                  onChange={handlerForm}
                />
              </div>
            </Inputs>
            <Inputs>
              <div>
                <label htmlFor="gst">GST %</label>
                <input
                  type="text"
                  id="gst"
                  name="gst"
                  placeholder="Enter GST %"
                  value={formData.gst}
                  onChange={handlerForm}
                />
              </div>
            </Inputs>
            <Inputs>
              <div>
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter Description %"
                  value={formData.description}
                  onChange={handlerForm}
                />
              </div>
            </Inputs>
            <Inputs>
              <div>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter Location %"
                  value={formData.location}
                  onChange={handlerForm}
                />
              </div>
            </Inputs>
            <ButtonContainer>
              <button type="submit">
                {!formData?.id ? "CREATE" : "UPDATE"}
              </button>
              <button onClick={handleClose}>CANCEL</button>
            </ButtonContainer>
          </form>
        </Form>
      </Box>
    </Container>
  ) : null;
};

const Container = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  z-index: 999;
`;

const Box = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
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
`;

const Form = styled.div`
  margin-top: 20px;
  form {
    display: flex;
    flex-direction: column;
    gap: 30px;

    label {
      font-size: 18px;
      font-weight: 500;
    }

    input {
      &::placeholder {
        color: rgba(0, 0, 0, 0.6);
        font-size: 15px;
        font-weight: 500;
      }
    }
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

const ButtonContainer = styled.div`
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

export default AddRate;
