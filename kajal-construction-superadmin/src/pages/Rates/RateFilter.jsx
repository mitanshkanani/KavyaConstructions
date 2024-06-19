import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const RateFilter = ({ tableData = [], setFilteredData }) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setFilteredData(filteredAndSortedData(searchText));
  }, [tableData]);

  const filteredAndSortedData = (searchText) => {
    return tableData.filter((item) => {
      return (
        item?.itemName?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        item?.vendorName?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        item?.address?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
    });
  };

  const onSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    setFilteredData(filteredAndSortedData(text));
  };

  return (
    <FilterContainer>
      <TextField
        label="Search..."
        size="small"
        fullWidth
        variant="outlined"
        value={searchText}
        onChange={onSearch}
      />
    </FilterContainer>
  );
};

export default RateFilter;

const FilterContainer = styled.div`
  padding: 20px 20px 0px;
  width: 400px;
`;
