import React from "react";
import styled from "styled-components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import { TablePagination } from "@mui/material";
import { isSuperAdmin } from "../../constants/helpers";

const formatDate = (deliveryTime) => {
  let updatedDate = new Date(deliveryTime?.seconds * 1000);
  updatedDate = updatedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric",
  });
  const dateArray = updatedDate.split("/");
  return dateArray[0];
};

const OperationsTable = ({
  filteredData,
  handlerImg,
  toggleEditDetailsModal,
  handlerDetails,
  handlerDelete,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  count
}) => {
  const isUserSuperAdmin = isSuperAdmin();

  return (
    <div>
      <Table>
        <table>
          <thead>
            <tr>
              <th>Site Name</th>
              <th>Site Supervisor</th>
              <th>Material Recieved</th>
              <th>Vendor</th>
              <th>Quantity</th>
              <th>Total Cost</th>
              <th>Date</th>
              <th>Image</th>
              <th>Video</th>
              <th>Unload Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const totalCost = parseFloat(item?.price) * parseFloat(item?.quantity);
              return (
                <tr key={index.toString()}>
                  <td>{item?.unloadedAt}</td>
                  <td>{item?.unloadedBy}</td>
                  <td>{item?.materialType}</td>
                  <td>{item?.vendorName}</td>
                  <td>{item?.quantity}</td>
                  <td>{Math.round(totalCost * 100) / 100}</td>
                  <td>{formatDate(item?.deliveryTime)}</td>
                  <td>
                    {item?.capturedImage ? (
                      <BgImg onClick={() => handlerImg(item.capturedImage, "image")}>
                        <img src={item?.capturedImage} alt="img1" />
                      </BgImg>
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {item.capturedVideo ? (
                      <BgImg onClick={() => handlerImg(item.capturedVideo, "video")}>
                        <video>
                          <source src={item?.capturedVideo} type="video/mp4" />
                        </video>
                        <Layer>
                          <div>
                            <PlayArrowIcon />
                          </div>
                        </Layer>
                      </BgImg>
                    ) : (
                      "NA"
                    )}
                  </td>
                  <td>
                    {item?.capturedTruckImage ? (
                      <BgImg onClick={() => handlerImg(item.capturedTruckImage, "image")}>
                        <img src={item?.capturedTruckImage} alt="img1" />
                      </BgImg>
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {isUserSuperAdmin && (
                      <button onClick={() => toggleEditDetailsModal(item)}>
                        <EditIcon />
                      </button>
                    )}
                    <button onClick={() => handlerDetails(item.id)}>
                      <VisibilityIcon />
                    </button>
                    {isUserSuperAdmin && (
                      <button style={{ color: "#F44336" }} onClick={() => handlerDelete(item.id)}>
                        <DeleteOutlinedIcon />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default OperationsTable;

const Table = styled.div`
  margin-top: 15px;
  table {
    table-layout: fixed;
    width: 100%;
  }
  th,
  td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    text-align: center;
  }
  th {
    padding-top: 10px;
    padding-bottom: 20px;
    text-align: center;
    color: #000;
    letter-spacing: 0.1px;
    font-style: normal;
    font-weight: 500;
  }
  td {
    padding: 5px 0;
    color: rgba(0, 0, 0, 1);
  }
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    margin-right: 10px;
    color: #909090;
    svg {
      font-size: 18px;
    }
  }
`;

const BgImg = styled.div`
  cursor: pointer;
  position: relative;
  width: 72px;
  height: 72px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: inline-block;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: inline-block;
  }
`;

const Layer = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 100%;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    width: 35px;
    height: 35px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #d3e6f7;
    border: 1px solid #41a3fc;
    svg {
      color: #41a3fc;
    }
  }
`;