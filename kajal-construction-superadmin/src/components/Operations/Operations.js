import React, { useState, useEffect } from "react";
import styled from "styled-components";
import db from "../../firebase";
import { collection, limit, onSnapshot, orderBy, query, startAfter, getDocs, startAt } from "firebase/firestore";
import ClearIcon from "@mui/icons-material/Clear";
import Viewmore from "../Viewmore";

import { SetModal } from "../../features/modalSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectType } from "../../features/modalSlice";

import Modal from "../Modal";
import EditFormModal from "../EditFormModal";
import ExcelExport from "../ExcelExport";
import OperationsTable from "./OperationsTable";
import OperationsFilter from "./OperationsFilter";
import AddFormModal from "../AddFormModal";
import { Button } from "@mui/material";
import { isSuperAdmin } from "../../constants/helpers";

const Operations = () => {
  const modalType = useSelector(selectType);

  const isUserSuperAdmin = isSuperAdmin();

  // console.log(modalType, "modalType");
  const [operation, setOperation] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modal, setModal] = useState("close");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [details, setDetails] = useState("");

  const [zoom, setZoom] = useState("");
  const [mediaDataType, setMediaDataType] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [lastVisible, setLastVisible] = useState(null);
  const [pageCache, setPageCache] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const dispatch = useDispatch();

  const getData = async (isNextPage) => {
    const snapshot = await getDocs(collection(db, "FormData"));
    setTotalDocuments(snapshot?.size)
    let formRef;
    if (isNextPage && lastVisible) {
      formRef = query(
        collection(db, "FormData"),
        orderBy("deliveryTime", "desc"),
        startAfter(lastVisible),
        limit(rowsPerPage)
      );
    } else if (!isNextPage && page > 1) {
      formRef = query(
        collection(db, "FormData"),
        orderBy("deliveryTime", "desc"),
        limit(rowsPerPage),
        startAt(pageCache[page - 1])
      );
    } else {
      formRef = query(
        collection(db, "FormData"),
        orderBy("deliveryTime", "desc"),
        limit(rowsPerPage)
      );
    }

    try {
      await onSnapshot(formRef, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(data)
        setOperation(data);
        setFilteredData(data);
        if (!querySnapshot.empty) {
          const p = pageCache;
          p[page + 1] = querySnapshot.docs[0];
          setPageCache(p);
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData(false);
  }, [rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    console.log("Hi", newPage, page)
    if (newPage > page) {
      getData(true);
    } else {
      getData(false);
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setLastVisible(null);
    getData(false);
  };

  useEffect(() => {
    const handlerESC = (event) => {
      var code = event.code;
      if (code === "Escape") {
        setModal("close");
        setDetails("");
      }
    };
    document.addEventListener("keydown", handlerESC);

    return () => {
      document.removeEventListener("keydown", handlerESC);
    };
  }, []);

  const handlerDetails = (id) => {
    switch (modal) {
      case "open":
        setDetails("");
        setModal("close");
        break;
      case "close":
        setDetails(id);
        setModal("open");
        break;
      default:
        setModal("close");
    }
  };

  const toggleEditDetailsModal = (details = false) => {
    setEditDetails(details);
    setOpenEditModal((prev) => !prev);
  };

  const toggleAddDetailsModal = () => {
    setOpenAddModal((prev) => !prev);
  };

  const handlerDelete = async (id) => {
    dispatch(
      SetModal({
        type: "operation",
        dbName: "FormData",
        id: id,
      })
    );
  };

  const handlerImg = (imgName, mediaType) => {
    setZoom(imgName);
    setMediaDataType(mediaType);
  };

  const handlerZoomOut = () => {
    setZoom("");
    setMediaDataType("");
  };

  return (
    <>
      {openAddModal ? (
        <AddFormModal open={openAddModal} toggleModal={toggleAddDetailsModal} />
      ) : null}
      <EditFormModal
        open={openEditModal}
        toggleModal={toggleEditDetailsModal}
        editDetails={editDetails}
      />
      <SitePage>
        <TitleContainer>
          <div>
            <h2>Operations</h2>
            <p>Overview of operations</p>
          </div>
          <div style={{ gap: 10 }}>
            <ExcelExport entriesData={filteredData} />
            {isUserSuperAdmin && (
              <Button variant="contained" onClick={toggleAddDetailsModal}>
                Add New Entry
              </Button>
            )}
          </div>
        </TitleContainer>
        <OperationsFilter
          tableData={operation}
          setFilteredData={setFilteredData}
        />
        <OperationsTable
          filteredData={filteredData}
          handlerImg={handlerImg}
          toggleEditDetailsModal={toggleEditDetailsModal}
          handlerDetails={handlerDetails}
          handlerDelete={handlerDelete}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          count={totalDocuments}
        />
      </SitePage>
      {modal === "open" ? (
        <Viewmore
          details={details}
          handlerDetails={handlerDetails}
          modal={modal}
        />
      ) : null}
      {modalType && <Modal />}
      {zoom && (
        <ZoomContainer>
          <Zoom>
            <ZoomHeader>
              <Icon onClick={handlerZoomOut}>
                <ClearIcon />
              </Icon>
            </ZoomHeader>

            <ZoomImg>
              {mediaDataType === "image" ? (
                <img src={zoom} alt="" />
              ) : (
                <video height={500} muted controls>
                  <source height={500} src={zoom} type="video/mp4" alt="dsvc" />
                </video>
              )}
            </ZoomImg>
          </Zoom>
        </ZoomContainer>
      )}
    </>
  );
};

const SitePage = styled.div`
  padding: 10px 10px;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgb(0 0 0 / 10%);
  overflow: hidden;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12);
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;

  > div {
    &:last-child {
      display: flex;
      align-items: center;
    }
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

const Icon = styled.div`
  cursor: pointer;
  padding: 5px;
`;

export default Operations;