import { createContext, useEffect, useState } from "react";
import "./App.css";
import Home from "./components/Home";
import { ConstantProvider } from "./Context/Constant/Index";

const TableNameContext = createContext();

function App() {
  return (
    <ConstantProvider>
      <Home />
    </ConstantProvider>
  );
}

export default App;
