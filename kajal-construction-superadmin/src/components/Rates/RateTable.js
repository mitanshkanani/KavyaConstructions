import React from "react";
import styled from "styled-components";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { TablePagination } from "@mui/material";
import { isSuperAdmin } from "../../constants/helpers";

const RateTable = ({ data = [], openEditDetailsModal, handlerDelete }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const isUserSuperAdmin = isSuperAdmin();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <Table>
        <table>
          <thead>
            <tr style={{ width: "100%" }}>
              <th>Item Name</th>
              <th style={{ width: "8%" }}>UOM</th>
              <th style={{ width: "10%" }}>Rate</th>
              <th style={{ width: "10%" }}>Vendor Name</th>
              <th style={{ width: "10%" }}>Contact Number</th>
              <th style={{ width: "25%" }}>Address</th>
              <th >GST Number</th>
              {isUserSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item?.itemName}</td>
                    <td>{item?.uom}</td>
                    <td>{item?.rate}</td>
                    <td>{item?.vendorName}</td>
                    <td>{item?.contactNumber}</td>
                    <td>{item?.address}</td>
                    <td>{item?.gstNumber}</td>
                    {isUserSuperAdmin && (
                      <td>
                        <button onClick={() => openEditDetailsModal(item)}>
                          <EditIcon />
                        </button>
                        <button
                          style={{ color: "#F44336" }}
                          onClick={() => handlerDelete(item.id)}
                        >
                          <DeleteOutlinedIcon />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default RateTable;

const Table = styled.div`
  margin-top: 15px;
  padding-top: 10px;
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
