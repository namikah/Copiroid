import React, { useCallback, useEffect, useState } from "react";
import GenerateApi from "./GenerateApi";
import DragDropExample from "./DragDropExample";
import AddToTable from "./AddToTable";
import GetTable from "./GetTable";
import axios from "axios";

const Home = () => {
  const [tableNames, setTableNames] = useState([]);

    const getAllTableNames = useCallback(() => {
        axios
          .get("https://localhost:4567/api/GetAllTableNames")
          .then((response) => {
            setTableNames(response.data);
          })
          .catch((error) => {
            console.error("Error fetching table names:", error);
          });
      });

      useEffect(() => {
        getAllTableNames();
      }, []);

  return (
    <section id="home-section">
      <div className="container">
        <div className="row">
          <div className="col-4">
            <GenerateApi />
          </div>
          <div className="col-4">
            <AddToTable tableNames={tableNames}/>
          </div>
          <div className="col-4">
            <GetTable tableNames={tableNames}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
