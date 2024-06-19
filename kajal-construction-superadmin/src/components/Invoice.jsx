import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import GetAppIcon from "@mui/icons-material/GetApp";
import {
  getFormData,
  getSiteLocation,
  getVendors,
} from "../Backend/getDataFromFirebase";
import InvoiceTableRef from "./InvoiceTable";
import ReactToPrint from "react-to-print";

export const Invoice = () => {
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formData, setFormData] = useState([]);
  const [materials, setMaterials] = useState({});
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("Suraj Eneterprises");

  const componentRef = useRef();

  useEffect(() => {
    const handleSiteLocation = async () => {
      const res = await getSiteLocation();
      setCompany(res);
    };
    handleSiteLocation();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getVendors();
      setVendors(res);
    })();
  }, []);

  useEffect(() => {
    const handleFormData = async () => {
      if ((selectedCompany || selectedVendor) && startDate && endDate) {
        const res = await getFormData(
          startDate,
          endDate,
          selectedCompany,
          selectedVendor
        );
        const materialObj = {};
        res?.forEach(
          (material) =>
            (materialObj[material?.materialType] =
              (materialObj[material?.materialType]
                ? materialObj[material?.materialType]
                : 0) +
              parseFloat(material?.price || 0) *
                parseFloat(material?.quantity || 0))
        );
        setMaterials(materialObj);
        setFormData(res);
      }
    };
    handleFormData();
  }, [startDate, endDate, selectedCompany, selectedVendor]);

  const getPageMargins = () => {
    return `@page { margin: ${20} ${20} ${20} ${20} !important; }`;
  };

  return (
    <InvoiceSection>
      <HeaderContainer>
        <h4>Vendors</h4>
        <FieldContainer>
          <div>Start Date : </div>
          <input
            type="date"
            placeholder="startDate"
            value={startDate?.toISOString()?.split("T")?.[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </FieldContainer>
        <FieldContainer>
          <div>End Date : </div>
          <input
            type="date"
            placeholder="endDate"
            value={endDate?.toISOString()?.split("T")?.[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </FieldContainer>
        <FieldContainer>
          <div>Vendor : </div>
          <select
            style={{ width: 150 }}
            id="vendorName"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value={""}></option>
            {vendors?.map(({ name }) => (
              <option value={name}>{name}</option>
            ))}
          </select>
        </FieldContainer>
        <FieldContainer>
          <div>Site Location : </div>
          <select
            id={selectedCompany}
            value={selectedCompany}
            onChange={(event) => {
              setSelectedCompany(event?.target?.value);
            }}
          >
            <option value={""}></option>
            {company.map((option, index) => {
              return <option key={index}>{option}</option>;
            })}
          </select>
        </FieldContainer>
        <ReactToPrint
          trigger={() => (
            <button disabled={!formData?.length}>
              <GetAppIcon />
              Export
            </button>
          )}
          content={() => componentRef.current}
          copyStyles={true}
          pageStyle={getPageMargins}
        ></ReactToPrint>
      </HeaderContainer>
      <InvoiceTableRef
        ref={componentRef}
        materials={materials}
        company={selectedCompany}
      />
    </InvoiceSection>
  );
};

const InvoiceSection = styled.div`
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 15px;
`;
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c9c9c9;
  h4 {
    font-size: 20px;
    flex-grow: 1;
  }
  select,
  input {
    background-color: #fff;
    border: 1px solid #bdbdbd;
    outline: none;
    padding: 5px 10px;
    border-radius: 3px;
  }
  button {
    background-color: #000;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 3px 5px;
    gap: 5px;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 400;

    .MuiSvgIcon-root {
      font-size: 18px;
    }
  }
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
