import React, { useState, useEffect } from "react";
import axios from "axios";
import { useConstantContext } from "../Context/Constant/Index";

const UpdateTableName = () => {
  const [oldTableName, setOldTableName] = useState("");
  const [newTableName, setNewTableName] = useState("");
  const [response, setResponse] = useState("");
  const [{ tableNames, setTableNames }] = useConstantContext([]);

  useEffect(() => {
    if (tableNames.length > 0) {
      setOldTableName(tableNames[0]);
    }
  }, [tableNames]);

  const handleOldTableNameChange = (e) => {
    setOldTableName(e.target.value);
  };

  const handleNewTableNameChange = (e) => {
    setNewTableName(e.target.value);
  };

  const handleUpdateTableName = async () => {
    if (newTableName === "" || oldTableName === "") {
      return setResponse("tableName value null");
    }

    try {
      const response = await axios.post(
        `https://localhost:4567/api/updateTableName?oldTableName=${oldTableName}&newTableName=${newTableName}`
      );
      setResponse(response.data.message);
      //start refreshTableNames
      try {
        const response = await axios.get(
          "https://localhost:4567/api/GetAllTableNames"
        );
        setTableNames(response.data);
      } catch (error) {
        console.error("Error fetching table names:", error);
      }
      //end refreshTableNames
    } catch (error) {
      setResponse(error?.response?.data);
    }
  };

  return (
    <div
      className="p-3"
      style={{ border: "1px solid black", minHeight: "95vh" }}
    >
      <h2 style={{ color: "red" }}>UPDATE TABLE NAME</h2>
      <p className="m-0">Old Table Name:</p>
      <select
        className="w-100 mb-2"
        value={oldTableName}
        onChange={handleOldTableNameChange}
        style={{ height: "50px" }}
      >
        {tableNames.map((tableName) => (
          <option key={tableName} value={tableName}>
            {tableName}
          </option>
        ))}
      </select>
      <p className="m-0">New Table Name:</p>
      <input
        className="w-100"
        type="text"
        value={newTableName}
        onChange={handleNewTableNameChange}
        style={{ height: "50px" }}
      />
      <button onClick={handleUpdateTableName} style={{ marginTop: "20px" }}>
        Update Table Name
      </button>
      {response && (
        <p className="mt-4 mb-0" style={{ color: "red" }}>
          {response}
        </p>
      )}
    </div>
  );
};

export default UpdateTableName;
