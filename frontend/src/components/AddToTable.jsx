import axios from "axios";
import React, { useCallback, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useConstantContext } from "../Context/Constant/Index";

const AddToTable = () => {
  const [tableName, setTableName] = useState("");
  const [jsonInput, setJsonInput] = useState({});
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

  const handleGenerateApi = async () => {
    try {

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

  const handleTextAreaChange = (e) => {
    const textAreaValue = e.target.value;
    try {
      const parsedJson = JSON.parse(textAreaValue);
      setJsonInput(parsedJson);
    } catch (error) {
      console.error("Invalid JSON in textarea");
    }
  };

  return (
    <div
      className="p-3"
      style={{ border: "1px solid black", minHeight: "95vh" }}
    >
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
      <Tabs
      className="mt-3"
        selectedIndex={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
      >
        <TabList>
          <Tab>Input</Tab>
          <Tab>Json</Tab>
        </TabList>
        <TabPanel>
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
        </TabPanel>
        <TabPanel>
          <p className="mt-3 mb-1">Request:</p>
          <textarea
            className="w-100"
            value={JSON.stringify(jsonInput, null, 2)}
            onChange={handleTextAreaChange}
            style={{ minHeight: "50vh" }}
          />
        </TabPanel>
      </Tabs>
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
      )}
    </div>
  );
};

export default AddToTable;
