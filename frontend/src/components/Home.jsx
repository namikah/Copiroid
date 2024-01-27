import React, { useCallback, useEffect } from "react";
import GenerateApi from "./GenerateApi";
import AddToTable from "./AddToTable";
import GetTable from "./GetTable";
import RemoveData from "./RemoveTable";
import UpdateTableName from "./UpdateTableName";
import { useConstantContext } from "../Context/Constant/Index";
import axios from "axios";
import UpdateData from "./UpdateData";

const Home = () => {
  const [{ tableNames, setTableNames }] = useConstantContext();

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
          <div className="col-4 mt-2">
            <GenerateApi />
          </div>
          <div className="col-4 mt-2">
            <AddToTable />
          </div>
          <div className="col-4 mt-2">
            <GetTable />
          </div>
          <div className="col-4 mt-2">
            <RemoveData />
          </div>
          <div className="col-4 mt-2">
            <UpdateTableName />
          </div>
          <div className="col-4 mt-2">
            <UpdateData />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
