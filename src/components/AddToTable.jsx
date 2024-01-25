import axios from "axios";
import React, { useEffect, useState } from "react";

const AddToTable = () => {
  const [tableName, setTableName] = useState("");
  const [tableNames, setTableNames] = useState([]);
  const [jsonInput, setJsonInput] = useState(`{
    "param_1": "string",
    "param_2": "string"
  }`);
  const [response, setResponse] = useState("");

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const getAllTableNames = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7093/api/GetAllTableNames"
      );
      setTableNames(response.data);
    } catch (error) {
      console.error("Error fetching table names:", error);
    }
  };

  const handleGenerateApi = async () => {
    try {
      console.log("TableName:", tableName);
      console.log("Parameters:", jsonInput);

      const response = await axios.post(
        `https://localhost:7093/Api/Add?tableName=${tableName}`,
        jsonInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setResponse(`${response.status} - ${response.statusText}`)
    } catch (error) {
      setResponse(`${error.response.status} - ${error.response.statusText}`)
    }
  };

  useEffect(() => {
    getAllTableNames();
  }, [getAllTableNames]);

  return (
    <div className="p-3" style={{ border: "1px solid black" }}>
      <h2 style={{ color: "red" }}>ADD TO TABLE</h2>
      <p>Table Name:</p>
      <select
      className="w-100"
        value={tableName}
        onChange={handleTableNameChange}
        style={{height: "50px" }}
      >
        <option value="">Select a table</option>
        {tableNames.map((tableName) => (
          <option key={tableName} value={tableName}>
            {tableName}
          </option>
        ))}
      </select>
      <p style={{ marginTop: "40px" }}>Parameters:</p>
      <textarea
      className="w-100"
        value={jsonInput}
        onChange={handleJsonInputChange}
        style={{ minHeight: "50vh" }}
      />
      <button onClick={handleGenerateApi} style={{ marginTop: "20px" }}>
        Add
      </button>
      {response && <p className="mt-4 mb-0">{response}</p>}
    </div>
  );
};

export default AddToTable;
