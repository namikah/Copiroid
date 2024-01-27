import axios from "axios";
import React, { useCallback, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useConstantContext } from "../Context/Constant/Index";

const UpdateData = () => {
  const [tableName, setTableName] = useState("");
  const [jsonInput, setJsonInput] = useState({});
  const [updateId, setUpdateId] = useState(""); // New state for update ID
  const [response, setResponse] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [{ tableNames }] = useConstantContext([]);

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
        const fields = response?.data?.properties?.filter((item) => {
          return item.name !== "Id" && item.type !== "INTEGER PRIMARY KEY";
        });

        setFormFields(fields);
        fields.forEach((item) => {
          object[item.name] = "";
        });

        setJsonInput(object);
      });
  }, []);

  const handleInputChange = (fieldName, value) => {
    setJsonInput((prevJsonInput) => ({
      ...prevJsonInput,
      [fieldName]: value,
    }));
  };

  const handleUpdateIdChange = (e) => {
    setUpdateId(e.target.value);
  };

  const handleUpdateData = async () => {
    try {
      const response = await axios.post(
        `https://localhost:4567/Api/UpdateData?tableName=${tableName}&dataId=${updateId}`,
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
      console.log(error);
      setResponse(`${error?.response.status}-${error?.response.statusText}`);
    }
  };

  return (
    <div
      className="p-3"
      style={{ border: "1px solid black", minHeight: "95vh" }}
    >
      <h2 style={{ color: "red" }}>UPDATE DATA</h2>
      <p>Select Table for Update:</p>
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
      <div className="mb-3 text-start mt-3">
        <label className="d-block">ID for Update:</label>
        <input
          className="w-100"
          type="text"
          value={updateId}
          onChange={handleUpdateIdChange}
        />
      </div>
      {formFields.map((field) => (
        <div key={field.name} className="mb-3 text-start mt-3">
          <label className="d-block">{field.name}:</label>
          <input
            className="w-100"
            type="text"
            value={jsonInput[field.name]}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleUpdateData} style={{ marginTop: "20px" }}>
        Update
      </button>
      {response && (
        <p className="mt-4 mb-0" style={{ color: "red" }}>
          {response}
        </p>
      )}
    </div>
  );
};

export default UpdateData;
