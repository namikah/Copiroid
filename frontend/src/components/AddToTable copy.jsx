import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const AddToTable = ({ tableNames }) => {
  const [tableName, setTableName] = useState("");
  const [jsonInput, setJsonInput] = useState({});
  const [response, setResponse] = useState("");

  const handleTableNameChange = useCallback((e) => {
    const tableName = e.target.value;
    setTableName(tableName);

    axios
      .get(`https://localhost:4567/Api/GetProperties/${tableName}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        var object = {};
        response?.data?.properties?.map((item,index) => {
          const { name, type } = item;

          if (name !== "Id" && type !== "INTEGER PRIMARY KEY") {
            object[name] = type;
          }

        });

        setJsonInput(object);
        console.log(object);
      });
  });

  const handleJsonInputChange = (e) => {
    setJsonInput(JSON.parse(e.target.value));
  };

  const handleGenerateApi = async () => {
    try {
      console.log("TableName:", tableName);
      console.log("Parameters:", jsonInput);

      const response = await axios.post(
        `https://localhost:4567/Api/Add?tableName=${tableName}`,
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
      <h2 style={{ color: "red" }}>ADD DATA</h2>
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
      <p className="mt-3 mb-1">Request:</p>
      <textarea
        className="w-100"
        value={JSON.stringify(jsonInput, null, 2)}
        onChange={handleJsonInputChange}
        style={{ minHeight: "50vh" }}
      />
      <button onClick={handleGenerateApi} style={{ marginTop: "20px" }}>
        Add
      </button>
      {response && (
        <>
          <p className="mt-4 mb-0" style={{ color: "red" }}>
            {response?.url}
          </p>
          <p>{response?.status}</p>
        </>
      )}{" "}
    </div>
  );
};

export default AddToTable;
