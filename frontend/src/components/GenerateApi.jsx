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
  const [response, setResponse] = useState({});

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
        `https://localhost:4567/Api/Create?tableName=${tableName}`,
        jsonInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setResponse({
        url: `${response.status} - ${response.statusText}`,
        status: data,
      });
    } catch (error) {
      setResponse({
        url: `${error?.response.status} - ${error?.response.statusText}`,
        status: "",
      });
    }
  };

  return (
    <div className="p-3" style={{ border: "1px solid black",minHeight:"95vh" }}>
      <h2 style={{ color: "red" }}>GENERATE API</h2>
      <p>Table Name:</p>
      <input
        className="w-100"
        type="text"
        value={tableName}
        onChange={handleTableNameChange}
        style={{ height: "50px" }}
      />
      <p className="mt-3 mb-1">Request:</p>
      <textarea
        className="w-100"
        value={jsonInput}
        onChange={handleJsonInputChange}
        style={{ minHeight: "50vh" }}
      />
      <button onClick={handleGenerateApi} style={{ marginTop: "20px" }}>
        Create
      </button>
      {response && (
        <>
          <p className="mt-4 mb-0" style={{ color: "red" }}>
            {response?.url}
          </p>
          <p>{response?.status}</p>
        </>
      )}
    </div>
  );
};

export default GenerateApi;
