import axios from "axios";
import React, { useEffect, useState } from "react";

const GetTable = () => {
  const [tableName, setTableName] = useState("");
  const [tableNames, setTableNames] = useState([]);
  const [jsonInput, setJsonInput] = useState([]);
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
      setTableNames([]);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7093/api/Get/${tableName}`
      );
      setJsonInput(response.data);
      setResponse(`${response.status} - ${response.statusText}`)
    } catch (error) {
      setResponse(`${error.response.status} - ${error.response.statusText}`)
      setJsonInput(error)
    }
  };

  useEffect(() => {
    getAllTableNames();
  }, [getAllTableNames]);

  return (
    <div className = "p-3" style={{ border: "1px solid black" }}>
      <h2 style={{ color: "red" }}>SELECT DATA</h2>
      <p>Table Name:</p>
      <select
      className="w-100"
        value={tableName}
        onChange={handleTableNameChange}
        style={{ height: "50px" }}
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
        value={JSON.stringify(jsonInput, null, 2)}
        onChange={handleJsonInputChange}
        style={{ width: "100%", minHeight: "50vh" }}
      />
      <button onClick={getData} style={{ marginTop: "20px" }}>
        Get
      </button>
      {response && <p className="mt-4 mb-0">{response}</p>}
    </div>
  );
};

export default GetTable;
