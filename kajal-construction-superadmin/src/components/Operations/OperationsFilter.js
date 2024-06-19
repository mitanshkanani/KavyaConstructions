import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const OperationsFilter = ({ tableData = [], setFilteredData }) => {
  const [searchText, setSearchText] = useState("");
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setFilteredData(filteredAndSortedData());
  }, [tableData]);

  useEffect(() => {
    const getOptions = (...filterNames) => {
      const options = tableData?.map((data) => {
        return filterNames?.map((filterName) => data?.[filterName]);
      });
      const filteredOptions = [...new Set([].concat(...options))];
      setAutocompleteOptions(filteredOptions);
      return;
    };

    if (sortOption === "siteName") {
      getOptions("unloadedAt");
    } else if (sortOption === "material") {
      getOptions("materialType");
    } else if (sortOption === "siteSupervisor") {
      getOptions("unloadedBy");
    } else if (sortOption === "vendorName") {
      getOptions("vendorName");
    } else {
      getOptions("unloadedAt", "materialType", "unloadedBy", "vendorName");
    }
  }, [sortOption, tableData]);

  const resetFilter = () => {
    setSearchText("");
    setSortOption("default");
    setStartDate(null);
    setEndDate(null);
    setFilteredData(tableData);
  };

  const filteredAndSortedData = () => {
    return tableData
      .filter((item) => {
        return (
          item.unloadedAt.toLowerCase().includes(searchText.toLowerCase()) ||
          item.materialType.toLowerCase().includes(searchText.toLowerCase()) ||
          item.unloadedBy.toLowerCase().includes(searchText.toLowerCase()) ||
          item.vendorName.toLowerCase().includes(searchText.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortOption === "siteName") {
          return a.unloadedAt.localeCompare(b.unloadedAt);
        } else if (sortOption === "material") {
          return a.materialType.localeCompare(b.materialType);
        } else if (sortOption === "siteSupervisor") {
          return a.unloadedBy.localeCompare(b.unloadedBy);
        } else if (sortOption === "vendorName") {
          return a.vendorName.localeCompare(b.vendorName);
        }
        return 0;
      })
      .filter((item) => {
        const deliveryTime = item.deliveryTime.toDate();
        return (
          (!startDate || deliveryTime >= startDate) &&
          (!endDate || deliveryTime <= addDay(endDate))
        );
      });
  };

  const handleFilter = () => {
    setFilteredData(filteredAndSortedData());
  };

  return (
    <FilterContainer>
      <FormControl style={{ width: "20%" }}>
        <InputLabel id="Sorting">Sort By</InputLabel>
        <Select
          id="sort"
          label="Sort By"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="default">All </MenuItem>
          <MenuItem value="siteName">Site Name</MenuItem>
          <MenuItem value="material">Material </MenuItem>
          <MenuItem value="siteSupervisor">Site Supervisor</MenuItem>
          <MenuItem value="vendorName">Vendor </MenuItem>
        </Select>
      </FormControl>
      <Autocomplete
        options={autocompleteOptions}
        disableClearable
        freeSolo
        style={{ width: "20%" }}
        value={searchText}
        onChange={(_, newValue) => setSearchText(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search..."
            variant="outlined"
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(date) => setStartDate(date?.$d)}
        />

        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(date) => setEndDate(date?.$d)}
        />
      </LocalizationProvider>

      <Button variant="contained" color="secondary" onClick={resetFilter}>
        Reset
      </Button>
      <Button variant="contained" onClick={handleFilter}>
        Filter
      </Button>
    </FilterContainer>
  );
};

export default OperationsFilter;

const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
`;

function addDay(inputDate) {
  let date = new Date(inputDate);
  date.setDate(date.getDate() + 1);
  return date;
}
