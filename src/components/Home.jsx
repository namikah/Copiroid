import React, { useState } from "react";
import GenerateApi from "./GenerateApi";
import DragDropExample from "./DragDropExample";
import AddToTable from "./AddToTable";
import GetTable from "./GetTable";

const Home = () => {
  return (
    <section id="home-section">
      <div className="container">
        <div className="row">
          <div className="col-4">
            <GenerateApi />
          </div>
          <div className="col-4">
            <AddToTable />
          </div>
          <div className="col-4">
            <GetTable />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
