import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import db from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Details from "../components/Details";

import AddVendor from "./AddVendor";

import { SetModal } from "../features/modalSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectType } from "../features/modalSlice";

import Modal from "./Modal";
import Table from "../ui/Table/Table";

const Vendors = () => {
  const modalType = useSelector(selectType);
  const [vendors, setVendors] = useState([]);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState("");
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState("");
  const [editForm, setEdit] = useState("");
  const [formId, setFormId] = useState("");

  const dispatch = useDispatch();

  const vendorRef = query(
    collection(db, "VendorData"),
    orderBy("timestamp", "desc")
  );

  useEffect(() => {
    if (search) {
      const res = vendors.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
      setData(res);
    } else {
      setData(vendors);
    }
  }, [search, vendors]);

  useEffect(() => {
    (async () => {
      try {
        onSnapshot(vendorRef, (querySnapshot) => {
          setVendors(
            querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
          setData(
            querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    const handlerESC = (event) => {
      var name = event.key;
      var code = event.code;
      if (code === "Escape") {
        setDetails("");
        setModal("");
      }
    };
    document.addEventListener("keydown", handlerESC);

    return () => {
      document.removeEventListener("keydown", handlerESC);
    };
  }, []);

  const handlerDetails = (id) => {
    switch (modal) {
      case "VendorData":
        setDetails("");
        setModal("");
        break;
      case "":
        setDetails(id);
        setModal("VendorData");
        break;
      default:
        setModal("");
    }
  };

  const handlerDelete = async (id) => {
    dispatch(
      SetModal({
        type: "vendor",
        dbName: "VendorData",
        id: id,
      })
    );
  };

  const handleEdit = (formId) => {
    switch (editForm) {
      case "addvendor":
        setEdit("");
        setFormId("");
        break;
      case "":
        setEdit("addvendor");
        setFormId(formId);
        break;
      default:
        setEdit("");
        setFormId("");
    }
  };

  const columns = [
    { id: "name", label: "Vendor Name" },
    { id: "phone", label: "Phone No." },
    { id: "email", label: "Vendor Email" },
    { id: "address", label: "Vendor Address" },
    {
      id: "id",
      label: "Action",
      Cell: (id) => (
        <ButtonWrapper>
          <button onClick={() => handlerDetails(id)}>
            <VisibilityIcon />
          </button>
          <button onClick={() => handleEdit(id)}>
            <EditIcon />
          </button>
          <button
            style={{ color: "#F44336" }}
            onClick={() => handlerDelete(id)}
          >
            <DeleteOutlinedIcon />
          </button>
        </ButtonWrapper>
      ),
    },
  ];

  return (
    <>
      <Container>
        <SearchContainer>
          <div>
            <h2>Vendor Data Table</h2>
            <p>Overview of all Vendors</p>
          </div>
          <div>
            <Fields>
              <label htmlFor="">Search</label>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Fields>
          </div>
        </SearchContainer>
        <Table data={data} columns={columns} />
      </Container>
      <AddVendor editForm={editForm} handleEdit={handleEdit} formId={formId} />
      {modal && details && (
        <Details
          details={details}
          handlerDetails={handlerDetails}
          modal={modal}
        />
      )}
      {modalType && <Modal />}
    </>
  );
};

const Container = styled.div`
  padding: 20px 10px;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgb(0 0 0 / 10%);
  overflow: hidden;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  > div {
    &:last-child {
      display: flex;
      align-items: center;
    }
  }
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  position: relative;
  margin-right: 15px;
  input {
    width: 100%;
    padding: 10px;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.3);
    &::placeholder {
      color: #000;
    }
  }
  input,
  select {
    height: 35px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }
  label {
    position: absolute;
    background-color: #fff;
    font-size: 13px;
    left: 10px;
    top: -12px;
    padding: 3px;
    color: #666666;
  }
  select,
  option {
    padding-right: 50px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    color: rgba(0, 0, 0, 0.5);
    font-size: 20px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  .MuiSvgIcon-root {
    color: rgba(0, 0, 0, 0.5);
    font-size: 22px;
  }
`;

export default Vendors;
