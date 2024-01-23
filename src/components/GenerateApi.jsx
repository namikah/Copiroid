import axios from "axios";
import React, { useState } from "react";

const GenerateApi = () => {
  const [tableName, setTableName] = useState("");
  const [jsonInput, setJsonInput] = useState(`[
    {
      "name": "string",
      "type": "string"
    }
]`);
  const [response, setResponse] = useState("");

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleGenerateApi = async () => {
    try {
      console.log("TableName:", tableName);
      console.log("Parameters:", jsonInput);

      const response = await axios.post(
        `https://localhost:7093/Api/Create?tableName=${tableName}`,
        jsonInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setResponse(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <p>
        Table Name:
      </p>
        <input
          type="text"
          value={tableName}
          onChange={handleTableNameChange}
          style={{ width: "300px", height: "50px"}}
        />
      <br />
      <p style={{marginTop:"40px"}}>
        Parameters:
      </p>
        <textarea
          value={jsonInput}
          onChange={handleJsonInputChange}
          style={{ width: "300px", height: "200px"}}
        />
      <br />
      <button onClick={handleGenerateApi} style={{marginTop:"20px"}}>Generate API</button>
      <br />
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default GenerateApi;
