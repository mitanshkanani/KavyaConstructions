import { useState, forwardRef, useEffect } from "react";
import styled from "styled-components";

const InvoiceTable = ({ materials, company }, ref) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let totalPrice = 0;
    Object.keys(materials)?.forEach(
      (order) => (totalPrice = totalPrice + parseInt(materials[order]))
    );
    setTotal(totalPrice);
  }, [materials]);

  return (
    <Table ref={ref}>
      {Object.keys(materials)?.length ? (
        <table>
          <thead>
            <tr>
              <th style={{ width: "50%" }}>Category</th>
              <th style={{ width: "25%" }}>Site</th>
              <th style={{ width: "25%" }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(materials).map((material) => (
              <tr>
                <td>{material}</td>
                <td>{company}</td>
                <td>{parseFloat(materials[material]).toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td style={{ border: "none" }}></td>
              <td style={{ border: "none" }}>
                <h3>Total</h3>
              </td>
              <td style={{ border: "none" }}>
                <h3>Rs.{parseFloat(total).toLocaleString()}</h3>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <h1>There is no order in this month</h1>
      )}
    </Table>
  );
};

const Table = styled.div`
  table {
    width: 100%;
  }
  th,
  td {
    border-bottom: 1px solid #e6e6e6;
    padding: 10px 0;
    color: #666666;
  }

  th {
    text-align: left;
  }
  h3 {
    color: #333333;
  }
`;

export default forwardRef(InvoiceTable);
