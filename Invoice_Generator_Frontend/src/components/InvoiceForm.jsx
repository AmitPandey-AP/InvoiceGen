import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets.js";
import { Trash2 } from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";
const InvoiceForm = () => {
  const { invoiceData, setInvoiceData } = useContext(AppContext);
  // console.log(invoiceData);

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", quantity: "", amount: "", description: "", total: 0 },
      ],
    }));
  };
  const deleteItem = (ind) => {
    const updatedItems = invoiceData.items.filter((_, index) => index != ind);

    setInvoiceData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleChange = (section, field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };
  const handleItemChange = (index, field, value) => {
    const items = [...invoiceData.items];
    items[index][field] = value;
    if (field === "quantity" || field === "amount") {
      items[index].total =
        (items[index].quantity || 0) * (items[index].amount || 0);
    }
    setInvoiceData((prev) => ({ ...prev, items }));
  };

  const calculateTotals = () => {
    const subTotal = invoiceData.items?.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const taxRate = Number(invoiceData.tax || 0);
    const taxAmount = (subTotal * taxRate) / 100;
    const grandTotal = subTotal + taxAmount;
    return { subTotal, taxAmount, grandTotal };
  };
  const { subTotal, taxAmount, grandTotal } = calculateTotals();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  
  useEffect(() => {
    if (!invoiceData.invoiceDetails.number) {
      const randomNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      setInvoiceData((prev) => ({
        ...prev,
        invoiceDetails: { ...prev.invoiceDetails, number: randomNumber },
      }));
    }
  }, []);

  // handle company logo
  return (
    <div className="invioceform container py-4">
      {/* company logo */}
      <div className="mb-4">
        <h5>company logo</h5>
        <div className="d-flex align-items-center gap-3">
          <label htmlFor="image" className="form-label">
            <img
              src={invoiceData.logo ? invoiceData.logo : assets.upload_area}
              alt="upload"
              width={98}
            />
          </label>
          <input
            type="file"
            name="logo"
            id="image"
            hidden
            className="form-control"
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </div>
      </div>
      {/* company info */}
      <div className="mb-4">
        <h5>Your Company </h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="company name"
              value={invoiceData.company?.name}
              onChange={(e) => {
                handleChange("company", "name", e.target.value);
              }}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="company phone"
              onChange={(e) => {
                handleChange("company", "phone", e.target.value);
              }}
              value={invoiceData.company?.phone}
            />
          </div>
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="company address"
              onChange={(e) => {
                handleChange("company", "address", e.target.value);
              }}
              value={invoiceData.company?.address}
            />
          </div>
        </div>
      </div>
      {/* .Bill to */}
      <div className="mb-4">
        <h5>Bill To </h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={invoiceData.billing?.name}
              onChange={(e) => {
                handleChange("billing", "name", e.target.value);
              }}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              value={invoiceData.billing?.phone}
              onChange={(e) => {
                handleChange("billing", "phone", e.target.value);
              }}
            />
          </div>
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={invoiceData.billing?.address}
              onChange={(e) => {
                handleChange("billing", "address", e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      {/* Ship to  */}
      {/* <div className="mb-4"></div> */}

      {/* Invoice info */}
      <div className="mb-4">
        <h5>Invoice Information </h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="invoiceNumber" className="form-label">
              Invoice Number
            </label>
            <input
              type="text"
              className="form-control"
              id="invoiceNumber"
              disabled
              value={invoiceData.invoiceDetails?.number}
              onChange={() => {
                handleChange("invoiceDetails", "number", e.target.value);
              }}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="invoiceDate" className="form-label">
              Invoice Date
            </label>

            <input
              type="date"
              className="form-control"
              id="invoiceDate"
              value={invoiceData.invoice?.date}
              onChange={(e) => {
                handleChange("invoiceDetails", "date", e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {/* Item details */}
      <div className="mb-4">
        <h5>Item Details</h5>
        {invoiceData.items?.map((item, index) => (
          <div key={index} className="card p-3 mb-3">
            <div className="row g-3 mb-2">
              <div className="col-md-3 ">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => {
                    handleItemChange(index, "name", e.target.value);
                  }}
                />
              </div>
              <div className="col-md-3 ">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => {
                    handleItemChange(index, "quantity", e.target.value);
                  }}
                />
              </div>
              <div className="col-md-3 ">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => {
                    handleItemChange(index, "amount", e.target.value);
                  }}
                />
              </div>
              <div className="col-md-3 ">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total"
                  value={item.total}
                  disabled
                />
              </div>
            </div>
            <div className="d-flex gap-2">
              <textarea
                className="form-control"
                placeholder="Description"
                value={item.description}
                onChange={(e) => {
                  handleItemChange(index, "description", e.target.value);
                }}
              ></textarea>
              {invoiceData.items.length > 1 && (
                <button
                  onClick={() => {
                    deleteItem(index);
                  }}
                  className="btn btn-outline-danger"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addItem} className="btn btn-primary" type="button">
          Add Item
        </button>
      </div>
      {/*  Account Details */}
      <div className="mb-4">
        <h5> Bank Account Details </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Account Name"
              value={invoiceData.account?.name}
              onChange={(e) => {
                handleChange("account", "name", e.target.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Account Number"
              value={invoiceData.account?.number}
              onChange={(e) => {
                handleChange("account", "number", e.target.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Branch / IFSC Code"
              value={invoiceData.account?.ifsccode}
              onChange={(e) => {
                handleChange("account", "ifsccode", e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {/*  Totals */}
      <div className="mb-4">
        <h5>Totals</h5>
        <div className="d-flex justify-content-end">
          <div className="w-100 w-md-50">
            <div className="d-flex justify-content-between">
              <span>SubTotal</span>
              <span>₹{subTotal?.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center my-2">
              <label htmlFor="taxInput" className="me-2 ">
                Tax Rate (%)
              </label>
              <input
                type="number"
                id="taxInput"
                className="form-control w-50 text-end"
                placeholder="9"
                value={invoiceData.tax}
                onChange={(e) => {
                  setInvoiceData((prev) => ({
                    ...prev,
                    tax: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="d-flex justify-content-between">
              <span>Tax Amount</span>
              <span>₹{taxAmount?.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold mt-2">
              <span>Grand Total </span>
              <span>₹{grandTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Notes */}
      <div className="mb-4">
        <h5>Notes:</h5>
        <div className="w-100">
          <textarea
            name="notes"
            className="form-control"
            rows={3}
            value={invoiceData.notes}
            onChange={(e) => {
              setInvoiceData((prev) => ({ ...prev, notes: e.target.value }));
            }}
          ></textarea>
        </div>
      </div>
      
    </div>
  );
};

export default InvoiceForm;
