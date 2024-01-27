import axios from "axios";
import React, { useState } from "react";
import { useConstantContext } from "../Context/Constant/Index";

const RemoveData = () => {
  const [tableName, setTableName] = useState("");
  const [response, setResponse] = useState("");
  const [{ tableNames,setTableNames }] = useConstantContext([]);

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const removeData = async () => {
    try {
      const response = await axios.post(
        `https://localhost:4567/api/RemoveTable?tableName=${tableName}`
      );
      setResponse(`${response.status} - ${response.statusText}`);
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
      setResponse(`${error.response.status} - ${error.response.statusText}`);
    }
  };

  return (
    <div className="p-3" style={{ border: "1px solid black", minHeight: "95vh" }}>
      <h2 style={{ color: "red" }}>REMOVE TABLE</h2>
      <p className="m-0">Table Name:</p>
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
      <button onClick={removeData} style={{ marginTop: "20px" }}>
        Remove Data
      </button>
      {response && (
        <p className="mt-4 mb-0" style={{ color: "red" }}>
          {response}
        </p>
      )}
    </div>
  );
};

export default RemoveData;
