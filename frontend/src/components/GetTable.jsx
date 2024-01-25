import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const GetTable = ({ tableNames }) => {
  const [tableName, setTableName] = useState("");
  const [jsonInput, setJsonInput] = useState([]);
  const [response, setResponse] = useState("");

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://localhost:4567/api/Get/${tableName}`
      );
      setJsonInput(response.data);
      setResponse(`${response.status} - ${response.statusText}`);
    } catch (error) {
      setResponse(`${error.response.status} - ${error.response.statusText}`);
      setJsonInput(error);
    }
  };

  return (
    <div className="p-3" style={{ border: "1px solid black",minHeight:"95vh" }}>
      <h2 style={{ color: "red" }}>SELECT DATA</h2>
      <p>Table Name:</p>
      <select
        className="w-100"
        value={tableName}
        onChange={handleTableNameChange}
        style={{ height: "50px" }}
      >
        <option value="">Select a table</option>
        {tableNames?.map((tableName) => (
          <option key={tableName} value={tableName}>
            {tableName}
          </option>
        ))}
      </select>
      <p className="mt-3 mb-1">Response:</p>
      <pre
      className="text-start"
        onChange={handleJsonInputChange}
        style={{ width: "100%", height: "50vh", overflow:"auto", background:"#3B3B3B",color:"white"}}
      >
        {JSON.stringify(jsonInput, null, 2)}
      </pre>
      <button onClick={getData} style={{ marginTop: "20px" }}>
        Get
      </button>
      {response && (
        <p className="mt-4 mb-0" style={{ color: "red" }}>
          {response}
        </p>
      )}
    </div>
  );
};

export default GetTable;
