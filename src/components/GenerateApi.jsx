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
      setResponse(`${response.status} - ${response.statusText}`)
    } catch (error) {
      setResponse(`${error.response.status} - ${error.response.statusText}`)
    }
  };

  return (
    <div className="p-3" style={{border:"1px solid black"}}>
        <h2 style={{color:"red"}}>
        GENERATE API
        </h2>
      <p>
        Table Name:
      </p>
        <input
        className="w-100"
          type="text"
          value={tableName}
          onChange={handleTableNameChange}
          style={{ height: "50px"}}
        />
      <p style={{marginTop:"40px"}}>
        Parameters:
      </p>
        <textarea
        className="w-100"
          value={jsonInput}
          onChange={handleJsonInputChange}
          style={{minHeight: "50vh"}}
        />
      <button onClick={handleGenerateApi} style={{marginTop:"20px"}}>Create</button>
      {response && <p className="mt-4 mb-0">{response}</p>}
    </div>
  );
};

export default GenerateApi;
