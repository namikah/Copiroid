import React, { useState } from "react";
import GenerateApi from "./GenerateApi";
import DragDropExample from "./DragDropExample";

const Home = () => {
  return (
    <>
      <GenerateApi />
      <DragDropExample/>
    </>
  );
};

export default Home;
