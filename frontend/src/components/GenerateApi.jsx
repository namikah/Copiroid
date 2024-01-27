import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useConstantContext } from "../Context/Constant/Index";

const GenerateApi = () => {
  const [{ tableNames, setTableNames }] = useConstantContext();
  const [tableName, setTableName] = useState("");
  const [jsonInput, setJsonInput] = useState(`[
    {
      "name": "string",
      "type": "string"
    }
]`);
  const [response, setResponse] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [newProperties, setNewProperties] = useState([{ name: "", type: "" }]);

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleJsonInputChange = () => {
    try {
      const jsonArray = newProperties.map(({ name, type }) => ({ name, type }));
      setJsonInput(JSON.stringify(jsonArray, null, 2));
    } catch (error) {
      console.error("Invalid JSON input");
    }
  };

  const handleAddProperty = () => {
    setNewProperties((prevProperties) => [
      ...prevProperties,
      { name: "", type: "string" },
    ]);
  };

  const handleRemoveProperty = (index) => {
    setNewProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties.splice(index, 1);
      return updatedProperties;
    });
    handleJsonInputChange();
  };

  const handleInputChange = (index, key, value) => {
    setNewProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties[index][key] = value;
      return updatedProperties;
    });
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
      setResponse({
        url: `${error?.response.status} - ${error?.response.statusText}`,
        status: "",
      });
    }
  };

  useEffect(() => {
    handleJsonInputChange();
  }, [newProperties]);

  return (
    <div
      className="p-3"
      style={{ border: "1px solid black", minHeight: "95vh" }}
    >
      <h2 style={{ color: "red" }}>GENERATE API</h2>
      <p>Table Name:</p>
      <input
        className="w-100"
        type="text"
        value={tableName}
        onChange={handleTableNameChange}
        style={{ height: "50px" }}
      />
      <Tabs
        className="mt-3"
        selectedIndex={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
      >
        <TabList>
          <Tab>Input</Tab>
          <Tab>Json</Tab>
        </TabList>
        <TabPanel className="text-end">
          {newProperties.map((property, index) => (
            <div
              className="mb-1 text-start row justify-content-around align-items-center mw-100"
              style={{ marginLeft: "1px" }}
              key={index}
            >
              <input
                className="col-8"
                style={{ height: "40px" }}
                type="text"
                value={property.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
              />
              <select
                className="col-3 p-1"
                style={{ height: "40px" }}
                value={property.type}
                onChange={(e) =>
                  handleInputChange(index, "type", e.target.value)
                }
              >
                <option value="string">String</option>
                <option value="int">Int</option>
                <option value="bool">Bool</option>
                <option value="object">Object</option>
              </select>
              <FontAwesomeIcon
                onClick={() => handleRemoveProperty(index)}
                icon={faXmark}
                className="col-1 d-block p-0"
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}
          <button
            className="w-100"
            onClick={handleAddProperty}
            style={{ marginBottom: "10px" }}
          >
            +
          </button>
        </TabPanel>
        <TabPanel>
          <p className="mt-3 mb-1">Request:</p>
          <textarea
            className="w-100"
            value={jsonInput}
            onChange={handleJsonInputChange}
            style={{ minHeight: "50vh" }}
          />
        </TabPanel>
      </Tabs>
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
