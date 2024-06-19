import React from "react";
import * as XLSX from "xlsx";
import pick from "lodash.pick";
import { saveAs } from "file-saver";
import { entriesLogCsvConfig as config } from "../constants/constants";
import { Button } from "@mui/material";

const ExcelExport = ({ entriesData = [] }) => {
  const FILE = {
    TYPE: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8",
    EXTENSION: ".xlsx",
  };

  const exportToXls = () => {
    const exportModel = [];
    const headers = [];
    config?.forEach((column) => {
      if (!column.hidden) {
        exportModel.push(column.key);
        headers.push(column.label);
      }
    });

    const formatDate = (deliveryTime) => {
      if (typeof deliveryTime === "string") return deliveryTime;
      let updatedDate = new Date(deliveryTime?.seconds * 1000);
      updatedDate = updatedDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
      });
      const dateArray = updatedDate.split("/");
      return dateArray[0];
    };

    const data = entriesData.map((c) => {
      const { deliveryTime, measurement, phoneNumber } = c;
      if (deliveryTime) {
        c.deliveryTime = formatDate(c.deliveryTime);
      }
      if (measurement) {
        c.measurement = measurement?.toString();
      }
      if (phoneNumber) {
        c.phoneNumber = phoneNumber?.toString();
      }
      c.total = +(parseFloat(c?.price) * parseFloat(c?.quantity)).toFixed(2);

      const pickedData = pick(c, exportModel);
      return pickedData;
    });

    const filteredData = formatData(data);

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = {
      Sheets: {
        data: worksheet,
      },
      SheetNames: ["data"],
    };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcel(excelBuffer, "entries");

    function saveAsExcel(buffer, filename) {
      const data = new Blob([buffer], { type: FILE.EXTENSION });
      saveAs(data, filename + FILE.EXTENSION);
    }
  };

  const formatData = (data) => {
    const transformedData = data.map((item) => {
      const transformedItem = {};
      config.forEach((mapping) => {
        const { key, label } = mapping;
        transformedItem[label] = item[key];
      });
      return transformedItem;
    });
    return transformedData;
  };

  return (
    <div>
      <Button variant="contained" onClick={exportToXls}>
        Export to Excel
      </Button>
    </div>
  );
};

export default ExcelExport;
