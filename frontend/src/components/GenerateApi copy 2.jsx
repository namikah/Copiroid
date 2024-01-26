import axios from "axios";
import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const GenerateApi = () => {
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
      { name: "", type: "" }
    ]);
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
    } catch (error) {
      setResponse({
        url: `${error?.response.status} - ${error?.response.statusText}`,
        status: "",
      });
    }
  };

  useEffect(() => {
    handleJsonInputChange(); // Update the textarea whenever newProperties changes
  }, [newProperties]);

  return (
    <div className="p-3" style={{ border: "1px solid black", minHeight: "95vh" }}>
      <h2 style={{ color: "red" }}>GENERATE API</h2>
      <p>Table Name:</p>
      <input
        className="w-100"
        type="text"
        value={tableName}
        onChange={handleTableNameChange}
        style={{ height: "50px" }}
      />
      <Tabs selectedIndex={selectedTab} onSelect={index => setSelectedTab(index)}>
        <TabList>
          <Tab>Input Tab</Tab>
          <Tab>Textarea Tab</Tab>
        </TabList>
        <TabPanel>
          <p>New Property:</p>
          {newProperties.map((property, index) => (
            <div className="mb-3" key={index}>
              <label>Name:</label>
              <input
                type="text"
                value={property.name}
                onChange={(e) => handleInputChange(index, "name", e.target.value)}
              />
              <label>Type:</label>
              <input
                type="text"
                value={property.type}
                onChange={(e) => handleInputChange(index, "type", e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddProperty} style={{ marginBottom: "10px" }}>
            Add Property
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
