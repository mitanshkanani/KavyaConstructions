import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import styled from "styled-components";
import { addFormData } from "../Backend/addDataToFirebase";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import {
  getMaterials,
  getSites,
  getSupervisors,
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

const initialData = {
  capturedImage: "",
  capturedVideo: "",
  capturedTruckImage: "",
  unloadedAt: "",
  unloadedBy: "", //p
  unloadedById: "",
  deliveryTime: new Date(),
  checklistQuestions: [], //r
  materialType: "",
  price: "",
  phoneNumber: "",
  rejectedQuantity: "",
  challanNumber: "",
  vendorName: "",
  quantity: "",
  driverName: "",
  measurement: "",
  truckNumber: "",
};

const AddFormModal = ({ open, toggleModal }) => {
  const [supervisors, setSupervisors] = React.useState([]);
  const [vendors, setVendors] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);
  const [sites, setSites] = React.useState([]);
  const [formData, setFormData] = React.useState(initialData);

  React.useEffect(() => {
    (async () => {
      const res = await getSupervisors();
      setSupervisors(res);
    })();
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

    if (name === "unloadedById") {
      const supervisorDetails = supervisors.find(({ id }) => id === value);
      const data = {
        unloadedBy: supervisorDetails?.name,
        unloadedById: supervisorDetails?.id,
        phoneNumber: supervisorDetails?.phone,
      };
      setFormData((prev) => ({ ...prev, ...data }));
      return;
    }

    if (name === "deliveryTime") {
      setFormData((prev) => ({ ...prev, [name]: e?.target?.valueAsDate }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={open} onClose={() => toggleModal()}>
      <Box sx={style}>
        <AddForm
          handleChange={handleChange}
          formData={formData}
          toggleModal={toggleModal}
          supervisors={supervisors}
          vendors={vendors}
          materials={materials}
          sites={sites}
        />
      </Box>
    </Modal>
  );
};

const AddForm = ({
  handleChange,
  formData,
  toggleModal,
  supervisors,
  vendors,
  materials,
  sites,
}) => {
  const handleAddData = async (e) => {
    e.preventDefault();
    const { status } = await addFormData(formData);
    if (status === 200) {
      toast.success("Successfully added Entry", {
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
      toggleModal();
    }
  };

  return (
    <div>
      <HeaderContainer>
        <h2>Add New Entry</h2>
        <IconButton onClick={() => toggleModal()}>
          <ClearIcon />
        </IconButton>
      </HeaderContainer>
      <form onSubmit={handleAddData}>
        <Container>
          <Wrapper>
            <label>Site Supervisor: </label>
            <select
              name="unloadedById"
              value={formData?.unloadedById}
              onChange={handleChange}
            >
              <option value={""}></option>
              {supervisors?.map(({ name, id }) => (
                <option value={id}>{name}</option>
              ))}
            </select>
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
            <label>Delivery Date: </label>
            <input
              type="date"
              name="deliveryTime"
              value={formData?.deliveryTime?.toISOString().slice(0, 10)}
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

export default AddFormModal;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  margin: 10px 0px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  label {
    margin-right: 10px;
    width: 140px;
    display: block;
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
