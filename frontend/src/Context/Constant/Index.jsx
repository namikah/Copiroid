import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const ConstantContext = createContext([]);

function ConstantProvider({ children }) {
  const [tableNames, setTableNames] = useState([]);

  return (
    <ConstantContext.Provider
      value={[
        {
            tableNames,
            setTableNames
        },
      ]}
    >
      {children}
    </ConstantContext.Provider>
  );
}

const useConstantContext = () => {
  const context = useContext(ConstantContext);
  if (!context) {
    throw new Error("useConstantContext must be used within a ConstantProvider");
  }
  return context;
};

export { useConstantContext, ConstantProvider };