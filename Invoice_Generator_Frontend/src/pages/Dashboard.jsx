import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { getAllInvoices } from "../service/InvoiceService";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";
import { formatDate } from "../utils/formatInvoiceData.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const { baseUrl, setInvoiceData, setInvoiceTitle, initialInvoiceData } =
    useContext(AppContext);
  const { getToken } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = await getToken();
        const response = await getAllInvoices(baseUrl, token);
        // console.log(response);
        setInvoices(response.data);
      } catch (error) {
        // console.log(error)
        toast.error("Failed to Load the invoices");
      }
    };
    fetchInvoices();
  }, [baseUrl]);

  const handleViewClick = (invoice) => {
    setInvoiceData(invoice);
    setInvoiceTitle(invoice.title || "New Invoice");
    navigate("/preview");
  };
  const handleCreateNew = () => {
    setInvoiceData(initialInvoiceData);
    setInvoiceTitle("New Invoice");
    navigate("/generate");
  };
  return (
    // <div className="container-fluid">
    //   <div className="row">
    //     {/* Sidebar */}
    //     <nav className="col-md-2 d-none d-md-block bg-dark sidebar text-white vh-100">
    //       <div className="position-sticky pt-3">
    //         <h4 className="text-center py-3">InvoiceGen</h4>
    //         <ul className="nav flex-column px-3">
    //           <li className="nav-item mb-2">
    //             <a className="nav-link text-white" href="#">
    //               Dashboard
    //             </a>
    //           </li>
    //           <li className="nav-item mb-2">
    //             <a className="nav-link text-white" href="#">
    //               Invoices
    //             </a>
    //           </li>
    //           <li className="nav-item mb-2">
    //             <a className="nav-link text-white" href="#">
    //               Clients
    //             </a>
    //           </li>
    //           <li className="nav-item mb-2">
    //             <a className="nav-link text-white" href="#">
    //               Settings
    //             </a>
    //           </li>
    //         </ul>
    //       </div>
    //     </nav>

    //     {/* Main Content */}
    //     <main className="col-md-10 ms-sm-auto px-md-4 py-4">
    //       {/* Topbar */}
    //       <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
    //         <h1 className="h2">Dashboard</h1>
    //         <button className="btn btn-primary">+ New Invoice</button>
    //       </div>

    //       {/* Stats Cards */}
    //       <div className="row mb-4">
    //         <div className="col-md-4 mb-3">
    //           <div className="card shadow-sm">
    //             <div className="card-body">
    //               <h5 className="card-title">Total Invoices</h5>
    //               <p className="card-text fs-4">45</p>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="col-md-4 mb-3">
    //           <div className="card shadow-sm">
    //             <div className="card-body">
    //               <h5 className="card-title">Pending Payments</h5>
    //               <p className="card-text fs-4">₹23,000</p>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="col-md-4 mb-3">
    //           <div className="card shadow-sm">
    //             <div className="card-body">
    //               <h5 className="card-title">Paid Invoices</h5>
    //               <p className="card-text fs-4">₹1,15,000</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Table */}
    //       <div className="card shadow-sm">
    //         <div className="card-body">
    //           <h5 className="card-title">Recent Invoices</h5>
    //           <table className="table table-striped">
    //             <thead>
    //               <tr>
    //                 <th>Invoice #</th>
    //                 <th>Client</th>
    //                 <th>Date</th>
    //                 <th>Status</th>
    //                 <th>Amount</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               <tr>
    //                 <td>#00123</td>
    //                 <td>ABC Corp</td>
    //                 <td>2025-06-22</td>
    //                 <td>
    //                   <span className="badge bg-success">Paid</span>
    //                 </td>
    //                 <td>₹12,000</td>
    //               </tr>
    //               <tr>
    //                 <td>#00124</td>
    //                 <td>XYZ Ltd</td>
    //                 <td>2025-06-20</td>
    //                 <td>
    //                   <span className="badge bg-warning text-dark">
    //                     Pending
    //                   </span>
    //                 </td>
    //                 <td>₹7,500</td>
    //               </tr>
    //               <tr>
    //                 <td>#00125</td>
    //                 <td>Acme Co.</td>
    //                 <td>2025-06-18</td>
    //                 <td>
    //                   <span className="badge bg-danger">Overdue</span>
    //                 </td>
    //                 <td>₹3,000</td>
    //               </tr>
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     </main>
    //   </div>
    // </div>
    <div className="container py-5">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
        {/* Create New Invioce Card */}
        <div className="col">
          <div
            className="card h-100 d-flex justify-content-center align-items-center border border-2 border-light shadow-sm cursor-pointer"
            style={{ minHeight: "270px" }}
            onClick={handleCreateNew}
          >
            <Plus size={48} />
            <p className="mt-3 fw-medium">Create New Invoice</p>
          </div>
        </div>
        {/* Render The existing invoices */}
        {invoices?.map((invoice, idx) => (
          <div className="col" key={idx}>
            <div
              className="card h-100 shadow-sm cursor-pointer"
              style={{ minHeight: "270px" }}
              onClick={() => {
                handleViewClick(invoice);
              }}
            >
              {invoice.thumbnailUrl && (
                <img
                  src={invoice.thumbnailUrl}
                  alt="thumbnail"
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h6 className="card-title mb-1">{invoice.title}</h6>
                <small className="text-muted">
                  Last Updated Date: {formatDate(invoice.createdAt)}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
