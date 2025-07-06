import { createContext, useState } from "react";
export const AppContext = createContext();

export const initialInvoiceData = {
  title: "New Invoice",
  billing: { name: "", phone: "", address: "" },
  invoiceDetails: { number: "", date: "" },
  account: { name: "", number: "", ifsccode: "" },
  company: { name: "", phone: "", address: "" },
  tax: 0,
  notes: "",
  items: [{ name: "", quantity: "", amount: "", description: "", total: 0 }],
  logo: "",
};

export const AppContextProvider = ({ children }) => {
  const [invoiceTitle, setInvoiceTitle] = useState("New Invoice");
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);

  const baseUrl = "http://localhost:8080/api";

  const contextValue = {
    invoiceTitle,
    setInvoiceTitle,
    invoiceData,
    setInvoiceData,
    initialInvoiceData,
    baseUrl,
  };
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
