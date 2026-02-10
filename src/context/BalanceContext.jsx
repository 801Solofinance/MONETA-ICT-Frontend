import { createContext, useContext, useState } from "react";

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);

  const deposit = (amount) => {
    setBalance((prev) => prev + Number(amount));
  };

  const withdraw = (amount) => {
    setBalance((prev) => prev - Number(amount));
  };

  return (
    <BalanceContext.Provider value={{ balance, deposit, withdraw }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);
