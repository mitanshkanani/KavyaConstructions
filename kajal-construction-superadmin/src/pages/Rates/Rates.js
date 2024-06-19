import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddRate from "../../components/Rates/AddRate";
import RateTable from "../../components/Rates/RateTable";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import db from "../../firebase";
import RateFilter from "./RateFilter";
import { isSuperAdmin } from "../../constants/helpers";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-toastify";

function Rates() {
  const [formData, setFormData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showRateModal, setShowModal] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const [deleteDetailsId, setDeleteDetails] = useState(null);

  const isUserSuperAdmin = isSuperAdmin();

  const getData = () => {
    const formRef = query(
      collection(db, "Rates"),
      orderBy("updatedDate", "desc")
    );

    try {
      onSnapshot(formRef, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setFormData(data);
        setFilteredData(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const openEditDetailsModal = (details = {}) => {
    setEditDetails(details);
    setShowModal(true);
  };

  const handleClose = () => {
    setEditDetails(null);
    setShowModal(false);
  };

  const handlerDelete = (id) => {
    setDeleteDetails(id);
  };

  const onCloseDelete = () => {
    setDeleteDetails(null);
  };

  const onFinalDelete = async () => {
    if (!deleteDetailsId) {
      alert("There is some error");
      return;
    }
    try {
      const docRef = doc(db, "Rates", deleteDetailsId);
      await deleteDoc(docRef);
      toast.success("Successfully Deleted Rate Entry");
    } catch (error) {
      toast.error("There is some error");
    } finally {
      setDeleteDetails(null);
    }
  };

  return (
    <>
      {showRateModal && (
        <AddRate
          show={showRateModal}
          editDetails={editDetails}
          handleClose={handleClose}
        />
      )}
      <Navbar />
      <Container>
        <HeaderWrapper>
          <h1>Rates</h1>
          {isUserSuperAdmin && (
            <Button onClick={() => setShowModal(true)}>
              <PlaylistAddIcon />
              Add Rate
            </Button>
          )}
        </HeaderWrapper>
        <TableWrapper>
          <RateFilter tableData={formData} setFilteredData={setFilteredData} />
          <RateTable
            data={filteredData}
            openEditDetailsModal={openEditDetailsModal}
            handlerDelete={handlerDelete}
          />
        </TableWrapper>
      </Container>
      <DeleteModal
        isOpen={!!deleteDetailsId}
        title="Entry"
        onClose={onCloseDelete}
        onDelete={onFinalDelete}
      />
    </>
  );
}

export default Rates;

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
const Button = styled.button`
  outline: none;
  border: none;
  background-color: #1a1a1a;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 5px;
  gap: 5px;
  cursor: pointer;
  .MuiSvgIcon-root {
    font-size: 20px;
  }
`;

const TableWrapper = styled.div`
  margin: 30px 0px;
  background-color: #ffff;
`;
