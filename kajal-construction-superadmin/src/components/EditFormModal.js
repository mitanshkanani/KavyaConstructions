import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { updateFormData } from "../Backend/updateOperations";
import styled from "styled-components";
import {
  getMaterials,
  getSites,
  getVendors,
} from "../Backend/getDataFromFirebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const EditFormModal = ({ open, toggleModal, editDetails }) => {
  const [formData, setFormData] = React.useState({});
  const [vendors, setVendors] = React.useState([]);
  const [sites, setSites] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);

  React.useEffect(() => {
    setFormData(editDetails);
  }, [editDetails]);

  React.useEffect(() => {
    (async () => {
      const res = await getVendors();
      setVendors(res);
    })();
    (async () => {
      const res = await getMaterials();
      setMaterials(res);
    })();
    (async () => {
      const res = await getSites();
      setSites(res);
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return open ? (
    <Modal open={open} onClose={() => toggleModal()}>
      <Box sx={style}>
        <EditForm
          handleChange={handleChange}
          formData={formData}
          toggleModal={toggleModal}
          vendors={vendors}
          sites={sites}
          materials={materials}
        />
      </Box>
    </Modal>
  ) : null;
};

const EditForm = ({
  handleChange,
  formData,
  toggleModal,
  vendors,
  sites,
  materials,
}) => {
  const handleEditData = async (e) => {
    e.preventDefault();
    const { status } = await updateFormData(formData);
    if (status === 200) toggleModal();
  };

  return (
    <div>
      <h2>Edit</h2>
      <form onSubmit={handleEditData}>
        <Container>
          <Wrapper>
            <label>Site Supervisor: </label>
            <input
              type="text"
              name="unloadedBy"
              value={formData?.unloadedBy}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <label>Site Name: </label>
            <select
              name="unloadedAt"
              value={formData?.unloadedAt}
              onChange={handleChange}
            >
              <option value={""}></option>
              {sites?.map(({ name }) => (
                <option value={name}>{name}</option>
              ))}
            </select>
          </Wrapper>
          <Wrapper>
            <label>Vendor: </label>
            <select
              name="vendorName"
              value={formData?.vendorName}
              onChange={handleChange}
            >
              <option value={""}></option>
              {vendors?.map(({ name }) => (
                <option value={name}>{name}</option>
              ))}
            </select>
          </Wrapper>
          <Wrapper>
            <label>Material Received: </label>
            <select
              name="materialType"
              value={formData?.materialType}
              onChange={handleChange}
            >
              <option value={""}></option>
              {materials?.map(({ materialName }) => (
                <option value={materialName}>{materialName}</option>
              ))}
            </select>
          </Wrapper>
          <Wrapper>
            <label>Challan Number: </label>
            <input
              type="text"
              name="challanNumber"
              value={formData?.challanNumber}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <label>Driver Name: </label>
            <input
              type="text"
              name="driverName"
              value={formData?.driverName}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <label>Measurement: </label>
            <input
              type="text"
              name="measurement"
              value={formData?.measurement}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <label>Price: </label>
            <input
              type="text"
              name="price"
              value={formData?.price}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <label>Quantity: </label>
            <input
              type="text"
              name="quantity"
              value={formData?.quantity}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <label>Rejected Quantity: </label>
            <input
              type="text"
              name="rejectedQuantity"
              value={formData?.rejectedQuantity}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <label>Truck Number: </label>
            <input
              type="text"
              name="truckNumber"
              value={formData?.truckNumber}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <label>Phone Number: </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData?.phoneNumber}
              onChange={handleChange}
            />
          </Wrapper>
        </Container>
        <div style={{ textAlign: "end" }}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFormModal;

const Container = styled.div`
  margin: 10px 0px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Wrapper = styled.div`
  label {
    margin-right: 10px;
  }
  input {
    height: 30px;
    width: 50%;
    padding: 0px 5px;
  }
  select {
    height: 30px;
    width: 50%;
    padding: 0px 5px;
  }
`;
